#!/usr/bin/env python3
"""
Test like and comment functionality
"""

import requests
import json

def test_features():
    print("=== Testing Like and Comment Features ===\n")
    
    session = requests.Session()
    
    # Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    print(f"✅ CSRF token: {csrf_response.status_code}")
    
    # Test anonymous like
    print("\n--- Testing Anonymous Like ---")
    try:
        like_response = session.post('http://localhost:8000/api/videos/1/like/')
        print(f"Like response: {like_response.status_code}")
        print(f"Like data: {like_response.json()}")
    except Exception as e:
        print(f"❌ Like error: {e}")
    
    # Test anonymous comment
    print("\n--- Testing Anonymous Comment ---")
    try:
        comment_data = {
            'text': 'This is a test comment!',
            'username': 'TestUser'
        }
        comment_response = session.post('http://localhost:8000/api/videos/1/comment/', json=comment_data)
        print(f"Comment response: {comment_response.status_code}")
        print(f"Comment data: {comment_response.json()}")
    except Exception as e:
        print(f"❌ Comment error: {e}")
    
    # Test getting video with updated data
    print("\n--- Testing Video Feed ---")
    try:
        feed_response = session.get('http://localhost:8000/api/videos/feed/')
        print(f"Feed response: {feed_response.status_code}")
        videos = feed_response.json()
        if videos:
            video = videos[0]
            print(f"Video: {video['title']}")
            print(f"  Likes: {video['likes_count']}")
            print(f"  Comments: {video['comments_count']}")
            print(f"  Is Liked: {video['is_liked']}")
            print(f"  Comments: {len(video['comments'])}")
    except Exception as e:
        print(f"❌ Feed error: {e}")

if __name__ == "__main__":
    test_features()