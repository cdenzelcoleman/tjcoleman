#!/usr/bin/env python3
"""
Test script to debug video upload functionality
"""

import os
import sys
import django
import requests

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tjcoleman.settings')
django.setup()

from django.contrib.auth.models import User
from videos.models import Video

def test_upload():
    print("=== Video Upload Test ===\n")
    
    # Check admin user
    try:
        admin = User.objects.get(username='admin')
        print(f"✅ Admin user found: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Is Staff: {admin.is_staff}")
        print(f"   Is Active: {admin.is_active}")
    except User.DoesNotExist:
        print("❌ Admin user not found!")
        return
    
    # Test login via API
    print("\n--- Testing Admin Login API ---")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    session = requests.Session()
    
    # Get CSRF token first
    try:
        csrf_response = session.get('http://localhost:8000/api/csrf/')
        print(f"✅ CSRF token obtained: {csrf_response.status_code}")
    except Exception as e:
        print(f"❌ Failed to get CSRF token: {e}")
        return
    
    # Login
    try:
        login_response = session.post('http://localhost:8000/api/admin/login/', json=login_data)
        print(f"Login response: {login_response.status_code}")
        print(f"Login data: {login_response.json()}")
        
        if login_response.status_code == 200:
            print("✅ Login successful")
        else:
            print(f"❌ Login failed: {login_response.json()}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test admin status
    try:
        status_response = session.get('http://localhost:8000/api/admin/status/')
        print(f"Admin status: {status_response.json()}")
    except Exception as e:
        print(f"❌ Status check error: {e}")
    
    # Check existing videos
    print("\n--- Current Videos ---")
    videos = Video.objects.all()
    print(f"Total videos in database: {videos.count()}")
    for video in videos:
        print(f"  - {video.title} (ID: {video.id}) by {video.uploader.username}")

if __name__ == "__main__":
    test_upload()