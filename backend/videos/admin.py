from django.contrib import admin
from .models import Video, BlogPost, Comment, Like, Share, EmailSubscriber, BlogComment, Subscription

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'author', 'category', 'is_published', 'created_at')
    list_filter = ('content_type', 'category', 'is_published', 'created_at')
    search_fields = ('title', 'content', 'tags')
    fields = ('title', 'content_type', 'video_url', 'content', 'category', 'tags', 'is_published', 'author')
    readonly_fields = ('created_at', 'updated_at', 'views')

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'video_type', 'uploader', 'views', 'is_public', 'created_at')
    list_filter = ('video_type', 'is_public', 'created_at')
    search_fields = ('title', 'description')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'video', 'text', 'created_at')
    list_filter = ('created_at',)

@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'blog_post', 'content', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    actions = ['approve_comments']
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} comments were successfully approved.')
    approve_comments.short_description = "Approve selected comments"

@admin.register(EmailSubscriber)
class EmailSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')

admin.site.register(Like)
admin.site.register(Share)
admin.site.register(Subscription)
