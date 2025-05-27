from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import re

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ('user', 'email')
    
    def __str__(self):
        return f"{self.email} subscription"

class Video(models.Model):
    VIDEO_TYPES = [
        ('short', 'Short Form'),
        ('long', 'Long Form'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    video_type = models.CharField(max_length=10, choices=VIDEO_TYPES, default='short')
    duration = models.DurationField(blank=True, null=True)
    views = models.PositiveIntegerField(default=0)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ('user', 'video')
    
    def __str__(self):
        return f"{self.user.username} likes {self.video.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.text[:50]}..."

class BlogPost(models.Model):
    CONTENT_TYPES = [
        ('text', 'Text Only'),
        ('youtube', 'YouTube Video'),
        ('instagram', 'Instagram Video'),
        ('substack', 'Substack Link'),
        ('mixed', 'Text + Video'),
    ]
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES, default='text')
    video_url = models.URLField(blank=True, null=True, help_text="YouTube, Instagram, or Substack URL")
    video_embed_id = models.CharField(max_length=255, blank=True, null=True)
    featured_image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.CharField(max_length=100, default='general')
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    is_published = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if self.video_url:
            self.video_embed_id = self.extract_video_id()
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
    
    def extract_video_id(self):
        """Extract video ID from YouTube or Instagram URLs"""
        if not self.video_url:
            return None
            
        # YouTube patterns
        youtube_patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)',
            r'youtube\.com/embed/([a-zA-Z0-9_-]+)',
        ]
        
        # Instagram patterns
        instagram_patterns = [
            r'instagram\.com/(?:p|reel)/([a-zA-Z0-9_-]+)',
        ]
        
        # Substack patterns
        substack_patterns = [
            r'([a-zA-Z0-9_-]+)\.substack\.com/p/([a-zA-Z0-9_-]+)',
            r'substack\.com/([^/]+)/p/([a-zA-Z0-9_-]+)',
        ]
        
        for pattern in youtube_patterns:
            match = re.search(pattern, self.video_url)
            if match:
                return f"youtube_{match.group(1)}"
                
        for pattern in instagram_patterns:
            match = re.search(pattern, self.video_url)
            if match:
                return f"instagram_{match.group(1)}"
                
        for pattern in substack_patterns:
            match = re.search(pattern, self.video_url)
            if match:
                return f"substack_{match.group(1)}_{match.group(2)}"
                
        return None
    
    def get_embed_html(self):
        """Generate embed HTML for videos"""
        if not self.video_embed_id:
            return None
            
        if self.video_embed_id.startswith('youtube_'):
            video_id = self.video_embed_id.replace('youtube_', '')
            return f'<iframe width="100%" height="315" src="https://www.youtube.com/embed/{video_id}?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>'
        elif self.video_embed_id.startswith('instagram_'):
            video_id = self.video_embed_id.replace('instagram_', '')
            return f'<iframe src="https://www.instagram.com/p/{video_id}/embed" width="100%" height="400" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'
        elif self.video_embed_id.startswith('substack_'):
            # For Substack, we'll return a link button instead of embed
            return f'<div class="substack-link"><a href="{self.video_url}" target="_blank" rel="noopener noreferrer" class="substack-button">Read on Substack</a></div>'
            
        return None
    
    def __str__(self):
        return self.title

class EmailSubscriber(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.email

class BlogComment(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='blog_comments')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    content = models.TextField(max_length=1000)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name}: {self.content[:50]}..."

class Share(models.Model):
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('twitter', 'Twitter'),
        ('copy_link', 'Copy Link'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='shares')
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user.username} shared {self.video.title} to {self.platform}"
