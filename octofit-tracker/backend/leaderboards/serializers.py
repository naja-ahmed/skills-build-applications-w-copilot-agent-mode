from rest_framework import serializers
from .models import LeaderboardEntry
from users.serializers import UserSerializer


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    """Serializer for LeaderboardEntry model with ObjectId handling"""
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = LeaderboardEntry
        fields = [
            'id', 'user', 'username', 'period', 'total_activities', 
            'total_duration', 'total_distance', 'total_calories', 'rank',
            'period_start', 'period_end', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if hasattr(obj, '_id') else None
