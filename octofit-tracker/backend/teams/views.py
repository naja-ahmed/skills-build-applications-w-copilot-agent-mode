from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer, TeamCreateSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet for managing teams"""
    queryset = Team.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return TeamCreateSerializer
        return TeamSerializer

    def perform_create(self, serializer):
        """Set the creator as captain and add them as a member"""
        team = serializer.save(captain=self.request.user)
        team.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a team"""
        team = self.get_object()
        team.members.add(request.user)
        serializer = TeamSerializer(team)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave a team"""
        team = self.get_object()
        if team.captain == request.user:
            return Response(
                {'error': 'Captain cannot leave the team'},
                status=status.HTTP_400_BAD_REQUEST
            )
        team.members.remove(request.user)
        serializer = TeamSerializer(team)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_teams(self, request):
        """Get teams the user is a member of"""
        teams = Team.objects.filter(members=request.user)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
