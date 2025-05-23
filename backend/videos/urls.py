from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, admin_login, admin_logout, check_admin_status

router = DefaultRouter()
router.register(r'videos', VideoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/admin/login/', admin_login, name='admin_login'),
    path('api/admin/logout/', admin_logout, name='admin_logout'),
    path('api/admin/status/', check_admin_status, name='admin_status'),
]