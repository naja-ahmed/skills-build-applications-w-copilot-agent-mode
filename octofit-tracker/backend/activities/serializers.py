from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model with ObjectId handling"""
    id = serializers.SerializerMethodField()
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Activity
        fields = [
            'id', 'user', 'user_username', 'activity_type', 'duration', 
            'distance', 'calories', 'notes', 'date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id) if hasattr(obj, '_id') else None
