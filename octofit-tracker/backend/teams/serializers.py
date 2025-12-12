from rest_framework import serializers
from .models import Team
from users.serializers import UserSerializer


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model with ObjectId handling"""
    id = serializers.SerializerMethodField()
    captain = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.ReadOnlyField()
    total_points = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = [
            'id', 'name', 'description', 'captain', 'members', 
            'member_count', 'total_points', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if hasattr(obj, '_id') else None


class TeamCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating teams"""
    class Meta:
        model = Team
        fields = ['name', 'description']
