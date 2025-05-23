#!/usr/bin/env python3
"""
Create a simple test video for upload testing
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tjcoleman.settings')
django.setup()

from django.contrib.auth.models import User
from videos.models import Video
from django.core.files.uploadedfile import SimpleUploadedFile

def create_test_video():
    print("=== Creating Test Video ===\n")
    
    # Get admin user
    admin = User.objects.get(username='admin')
    
    # Create a minimal test "video" (really just a text file for testing)
    test_content = b"This is a test video file content"
    
    # Create video object
    video = Video.objects.create(
        title="Test Video",
        description="This is a test video for debugging",
        video_type="short",
        uploader=admin,
        is_public=True
    )
    
    # Save the test file
    video.video_file.save(
        'test_video.mp4',
        SimpleUploadedFile("test_video.mp4", test_content, content_type="video/mp4"),
        save=True
    )
    
    print(f"✅ Test video created successfully!")
    print(f"   ID: {video.id}")
    print(f"   Title: {video.title}")
    print(f"   File: {video.video_file.url}")
    print(f"   Uploader: {video.uploader.username}")

if __name__ == "__main__":
    create_test_video()