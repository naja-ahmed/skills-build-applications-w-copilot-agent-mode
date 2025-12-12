"""octofit_tracker URL Configuration"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.views import UserViewSet, UserProfileViewSet
from activities.views import ActivityViewSet
from teams.views import TeamViewSet
from leaderboards.views import LeaderboardViewSet

# Get Codespace environment variable
codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

# API Root view
@api_view(['GET'])
def api_root(request):
    """API root endpoint showing available endpoints"""
    return Response({
        'message': 'Welcome to OctoFit Tracker API',
        'base_url': base_url,
        'endpoints': {
            'users': f'{base_url}/api/users/',
            'profiles': f'{base_url}/api/profiles/',
            'activities': f'{base_url}/api/activities/',
            'teams': f'{base_url}/api/teams/',
            'leaderboards': f'{base_url}/api/leaderboards/',
            'auth': {
                'login': f'{base_url}/api/auth/login/',
                'logout': f'{base_url}/api/auth/logout/',
                'register': f'{base_url}/api/auth/registration/',
            },
            'admin': f'{base_url}/admin/',
        }
    })

# Create router and register viewsets
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'leaderboards', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]
