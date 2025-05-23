from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Video, Like, Comment, Share, Subscription
from .serializers import VideoSerializer, CommentSerializer, ShareSerializer, SubscriptionSerializer

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.filter(is_public=True)
    serializer_class = VideoSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        video = serializer.save(uploader=self.request.user)
        # Send notification to subscribers
        self.notify_subscribers(video)
    
    def notify_subscribers(self, video):
        subscribers = Subscription.objects.filter(is_active=True)
        if subscribers.exists():
            try:
                recipient_list = [sub.email for sub in subscribers]
                send_mail(
                    subject=f'New Video: {video.title}',
                    message=f'A new video "{video.title}" has been uploaded! Check it out on VideoHub.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send notification emails: {e}")
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        video = self.get_object()
        like, created = Like.objects.get_or_create(
            user=request.user,
            video=video
        )
        
        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        
        return Response({'status': 'liked'})
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        video = self.get_object()
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, video=video)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        video = self.get_object()
        platform = request.data.get('platform')
        
        if platform not in dict(Share.PLATFORM_CHOICES):
            return Response(
                {'error': 'Invalid platform'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        share = Share.objects.create(
            user=request.user,
            video=video,
            platform=platform
        )
        
        serializer = ShareSerializer(share)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        video = self.get_object()
        video.views += 1
        video.save()
        return Response({'views': video.views})
    
    @action(detail=False)
    def feed(self, request):
        videos = Video.objects.filter(is_public=True).order_by('-created_at')
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)
