from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, BlogPostViewSet, admin_login, admin_logout, check_admin_status, get_csrf_token, debug_session, subscribe_email, unsubscribe_email

def home(request):
    return JsonResponse({
        'message': 'ClaimingEase API is running!',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'videos': '/api/videos/',
            'blog-posts': '/api/blog-posts/',
        }
    })

def favicon(request):
    return HttpResponse(status=204)

router = DefaultRouter()
router.register(r'videos', VideoViewSet)
router.register(r'blog-posts', BlogPostViewSet, basename='blogpost')

urlpatterns = [
    path('', home, name='home'),
    path('favicon.ico', favicon, name='favicon'),
    path('api/', include(router.urls)),
    path('api/admin/login/', admin_login, name='admin_login'),
    path('api/admin/logout/', admin_logout, name='admin_logout'),
    path('api/admin/status/', check_admin_status, name='admin_status'),
    path('api/csrf/', get_csrf_token, name='csrf_token'),
    path('api/debug/', debug_session, name='debug_session'),
    path('api/subscribe/', subscribe_email, name='subscribe_email'),
    path('api/unsubscribe/', unsubscribe_email, name='unsubscribe_email'),
]