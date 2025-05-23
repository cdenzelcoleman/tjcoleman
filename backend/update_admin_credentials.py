#!/usr/bin/env python3
"""
Simple script to update admin credentials for VideoHub
Usage: python update_admin_credentials.py
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

def update_admin_credentials():
    print("=== VideoHub Admin Credentials Update ===\n")
    
    # Get current admin
    current_username = input("Current admin username (default: admin): ").strip() or "admin"
    
    try:
        user = User.objects.get(username=current_username)
        print(f"✅ Found admin user: {user.username}")
    except User.DoesNotExist:
        print(f"❌ User '{current_username}' not found!")
        return
    
    # Get new credentials
    print("\n--- Enter new credentials (leave blank to keep current) ---")
    
    new_username = input(f"New username (current: {user.username}): ").strip()
    if new_username:
        # Check if username already exists
        if User.objects.filter(username=new_username).exclude(id=user.id).exists():
            print(f"❌ Username '{new_username}' already exists!")
            return
        user.username = new_username
        print(f"✅ Username will be updated to: {new_username}")
    
    new_password = input("New password: ").strip()
    if new_password:
        user.set_password(new_password)
        print("✅ Password will be updated")
    
    new_email = input(f"New email (current: {user.email}): ").strip()
    if new_email:
        user.email = new_email
        print(f"✅ Email will be updated to: {new_email}")
    
    # Confirm changes
    if new_username or new_password or new_email:
        confirm = input("\nSave changes? (y/N): ").strip().lower()
        if confirm == 'y':
            # Ensure user remains admin
            user.is_staff = True
            user.is_superuser = True
            user.save()
            print(f"\n🎉 Admin credentials updated successfully!")
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print("Password: [UPDATED]")
        else:
            print("❌ Changes cancelled")
    else:
        print("ℹ️  No changes made")

if __name__ == "__main__":
    try:
        update_admin_credentials()
    except KeyboardInterrupt:
        print("\n❌ Operation cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")