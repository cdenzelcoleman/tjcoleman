from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .models import Video, Like, Comment, Share, Subscription, BlogPost, EmailSubscriber, BlogComment
from .serializers import VideoSerializer, CommentSerializer, ShareSerializer, SubscriptionSerializer, BlogPostSerializer, EmailSubscriberSerializer, BlogCommentSerializer

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
        print(f"Creating video - User: {self.request.user}, Is Admin: {self.request.user.is_staff}")
        print(f"Request data: {self.request.data}")
        video = serializer.save(uploader=self.request.user)
        print(f"Video created: {video.id} - {video.title}")
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
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def like(self, request, pk=None):
        video = self.get_object()
        
        # For anonymous users, use session-based likes
        if not request.user.is_authenticated:
            session_likes = request.session.get('liked_videos', [])
            video_id = video.id
            
            if video_id in session_likes:
                # Unlike
                session_likes.remove(video_id)
                request.session['liked_videos'] = session_likes
                return Response({'status': 'unliked', 'likes_count': video.likes.count()})
            else:
                # Like
                session_likes.append(video_id)
                request.session['liked_videos'] = session_likes
                request.session.modified = True
                return Response({'status': 'liked', 'likes_count': video.likes.count()})
        
        # For authenticated users, use database likes
        like, created = Like.objects.get_or_create(
            user=request.user,
            video=video
        )
        
        if not created:
            like.delete()
            return Response({'status': 'unliked', 'likes_count': video.likes.count()})
        
        return Response({'status': 'liked', 'likes_count': video.likes.count()})
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def comment(self, request, pk=None):
        video = self.get_object()
        
        # For anonymous users, create a temporary user
        if not request.user.is_authenticated:
            username = request.data.get('username', 'Anonymous')
            # Create or get anonymous user
            user, created = User.objects.get_or_create(
                username=f'anon_{username}_{video.id}_{len(video.comments.all())}',
                defaults={
                    'first_name': username,
                    'is_active': False  # Mark as inactive since it's anonymous
                }
            )
        else:
            user = request.user
        
        # Create comment
        comment_data = {
            'text': request.data.get('text', '')
        }
        serializer = CommentSerializer(data=comment_data)
        
        if serializer.is_valid():
            comment = serializer.save(user=user, video=video)
            # Return comment with user info
            response_data = CommentSerializer(comment).data
            return Response(response_data, status=status.HTTP_201_CREATED)
        
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
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def subscribe(self, request, pk=None):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create anonymous user for subscription if not authenticated
        user = request.user if request.user.is_authenticated else None
        if not user:
            # Create or get anonymous user
            user, created = User.objects.get_or_create(
                username=f'anonymous_{email}',
                defaults={'email': email}
            )
        
        subscription, created = Subscription.objects.get_or_create(
            user=user,
            email=email,
            defaults={'is_active': True}
        )
        
        if not created and not subscription.is_active:
            subscription.is_active = True
            subscription.save()
        
        message = 'Subscribed successfully!' if created else 'Already subscribed!'
        return Response({'message': message})

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Login attempt - Username: {username}")
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    print(f"Authentication result - User: {user}, Is Staff: {user.is_staff if user else 'N/A'}")
    
    if user and user.is_staff:
        login(request, user)
        print(f"Login successful for {user.username}")
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        })
    
    print(f"Login failed - User exists: {user is not None}, Is staff: {user.is_staff if user else False}")
    return Response({'error': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'})

@api_view(['GET'])
@permission_classes([AllowAny])
def check_admin_status(request):
    if request.user.is_authenticated and request.user.is_staff:
        return Response({
            'is_admin': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'is_staff': request.user.is_staff,
                'is_superuser': request.user.is_superuser
            }
        })
    return Response({'is_admin': False})

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})

class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    
    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return BlogPost.objects.filter(is_published=True).order_by('-published_at')
        return BlogPost.objects.all()
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        blog_post = serializer.save(author=self.request.user)
        if blog_post.is_published:
            self.notify_subscribers_blog(blog_post)
    
    def perform_update(self, serializer):
        old_instance = self.get_object()
        blog_post = serializer.save()
        # If just published, notify subscribers
        if blog_post.is_published and not old_instance.is_published:
            self.notify_subscribers_blog(blog_post)
    
    def notify_subscribers_blog(self, blog_post):
        subscribers = EmailSubscriber.objects.filter(is_active=True)
        if subscribers.exists():
            try:
                recipient_list = [sub.email for sub in subscribers]
                send_mail(
                    subject=f'New Post: {blog_post.title}',
                    message=f'A new blog post "{blog_post.title}" has been published! Check it out on Good Stories.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send blog notification emails: {e}")
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        blog_post = self.get_object()
        blog_post.views += 1
        blog_post.save()
        return Response({'views': blog_post.views})
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_comment(self, request, pk=None):
        blog_post = self.get_object()
        
        serializer = BlogCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(blog_post=blog_post)
            return Response(BlogCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_email(request):
    email = request.data.get('email')
    name = request.data.get('name', '')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    subscriber, created = EmailSubscriber.objects.get_or_create(
        email=email,
        defaults={'name': name, 'is_active': True}
    )
    
    if not created and not subscriber.is_active:
        subscriber.is_active = True
        subscriber.save()
    
    message = 'Subscribed successfully!' if created else 'Already subscribed!'
    return Response({'message': message})

@api_view(['POST'])
@permission_classes([AllowAny])
def unsubscribe_email(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subscriber = EmailSubscriber.objects.get(email=email)
        subscriber.is_active = False
        subscriber.save()
        return Response({'message': 'Unsubscribed successfully'})
    except EmailSubscriber.DoesNotExist:
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_session(request):
    return Response({
        'user': str(request.user),
        'is_authenticated': request.user.is_authenticated,
        'is_staff': request.user.is_staff if request.user.is_authenticated else False,
        'session_key': request.session.session_key,
        'cookies': dict(request.COOKIES),
    })
