from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Like, Comment, Share, Subscription

class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'display_name']
    
    def get_display_name(self, obj):
        # For anonymous users, show their first_name, otherwise username
        if obj.first_name and not obj.is_active:
            return obj.first_name
        return obj.username

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at']

class VideoSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'description', 'video_file', 'thumbnail',
            'video_type', 'duration', 'views', 'uploader', 'created_at',
            'updated_at', 'is_public', 'likes_count', 'comments_count',
            'is_liked', 'comments'
        ]
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request:
            if request.user.is_authenticated:
                return obj.likes.filter(user=request.user).exists()
            else:
                # Check session-based likes for anonymous users
                session_likes = request.session.get('liked_videos', [])
                return obj.id in session_likes
        return False

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'video', 'created_at']

class ShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Share
        fields = ['id', 'user', 'video', 'platform', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'email', 'is_active', 'created_at']