from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum
from datetime import date, timedelta
from .models import LeaderboardEntry
from .serializers import LeaderboardEntrySerializer
from activities.models import Activity


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing leaderboards"""
    queryset = LeaderboardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Get weekly leaderboard"""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        entries = LeaderboardEntry.objects.filter(
            period='weekly',
            period_start=week_start
        ).order_by('-total_calories', '-total_duration')
        
        # Assign ranks
        for rank, entry in enumerate(entries, start=1):
            entry.rank = rank
            entry.save()
        
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def monthly(self, request):
        """Get monthly leaderboard"""
        today = date.today()
        month_start = today.replace(day=1)
        entries = LeaderboardEntry.objects.filter(
            period='monthly',
            period_start=month_start
        ).order_by('-total_calories', '-total_duration')
        
        # Assign ranks
        for rank, entry in enumerate(entries, start=1):
            entry.rank = rank
            entry.save()
        
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)
