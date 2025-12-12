from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models


class Team(models.Model):
    """Team model for group fitness challenges"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    captain = models.ForeignKey(User, on_delete=models.CASCADE, related_name='captained_teams')
    members = models.ManyToManyField(User, related_name='teams', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teams'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.members.count()

    @property
    def total_points(self):
        """Calculate total points from all member activities"""
        from activities.models import Activity
        member_activities = Activity.objects.filter(user__in=self.members.all())
        return sum(activity.calories or 0 for activity in member_activities)
