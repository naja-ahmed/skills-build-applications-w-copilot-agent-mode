from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models


class LeaderboardEntry(models.Model):
    """Leaderboard entries for tracking user rankings"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    period = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('all_time', 'All Time'),
        ]
    )
    total_activities = models.IntegerField(default=0)
    total_duration = models.IntegerField(default=0, help_text='Total duration in minutes')
    total_distance = models.FloatField(default=0.0, help_text='Total distance in kilometers')
    total_calories = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    period_start = models.DateField()
    period_end = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaderboard_entries'
        ordering = ['-total_calories', '-total_duration']
        unique_together = ['user', 'period', 'period_start', 'period_end']
        verbose_name_plural = 'Leaderboard Entries'

    def __str__(self):
        return f"{self.user.username} - {self.period} ({self.period_start} to {self.period_end})"
