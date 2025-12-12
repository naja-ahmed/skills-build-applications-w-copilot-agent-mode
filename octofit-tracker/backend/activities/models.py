from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models


class Activity(models.Model):
    """Activity log for tracking user exercises"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(
        max_length=50,
        choices=[
            ('running', 'Running'),
            ('cycling', 'Cycling'),
            ('swimming', 'Swimming'),
            ('walking', 'Walking'),
            ('gym', 'Gym'),
            ('yoga', 'Yoga'),
            ('other', 'Other'),
        ]
    )
    duration = models.IntegerField(help_text='Duration in minutes')
    distance = models.FloatField(null=True, blank=True, help_text='Distance in kilometers')
    calories = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"
