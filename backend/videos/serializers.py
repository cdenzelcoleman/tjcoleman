from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Like, Comment, Share, Subscription, BlogPost, EmailSubscriber, BlogComment

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

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments_count = serializers.SerializerMethodField()
    embed_html = serializers.SerializerMethodField()
    blog_comments = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'content_type', 'video_url', 
            'featured_image', 'author', 'category', 'tags', 'is_published',
            'views', 'created_at', 'updated_at', 'published_at',
            'comments_count', 'embed_html', 'blog_comments'
        ]
    
    def get_comments_count(self, obj):
        return obj.blog_comments.filter(is_approved=True).count()
    
    def get_embed_html(self, obj):
        return obj.get_embed_html()
    
    def get_blog_comments(self, obj):
        approved_comments = obj.blog_comments.filter(is_approved=True)
        return BlogCommentSerializer(approved_comments, many=True).data

class EmailSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSubscriber
        fields = ['id', 'email', 'name', 'is_active', 'created_at']

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['id', 'name', 'content', 'created_at']