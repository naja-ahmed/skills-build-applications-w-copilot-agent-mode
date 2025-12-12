from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet for managing activities"""
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter activities for the authenticated user"""
        return Activity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user when creating"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get activity statistics for the user"""
        activities = self.get_queryset()
        stats = activities.aggregate(
            total_activities=Sum('id'),
            total_duration=Sum('duration'),
            total_distance=Sum('distance'),
            total_calories=Sum('calories')
        )
        return Response(stats)
