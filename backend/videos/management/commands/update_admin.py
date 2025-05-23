from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Update admin username and password'

    def add_arguments(self, parser):
        parser.add_argument('--old-username', type=str, help='Current username')
        parser.add_argument('--new-username', type=str, help='New username')
        parser.add_argument('--new-password', type=str, help='New password')
        parser.add_argument('--email', type=str, help='New email (optional)')

    def handle(self, *args, **options):
        old_username = options.get('old_username', 'admin')
        new_username = options.get('new_username')
        new_password = options.get('new_password')
        new_email = options.get('email')

        try:
            user = User.objects.get(username=old_username)
            
            if new_username:
                # Check if new username already exists
                if User.objects.filter(username=new_username).exclude(id=user.id).exists():
                    self.stdout.write(
                        self.style.ERROR(f'Username "{new_username}" already exists!')
                    )
                    return
                
                user.username = new_username
                self.stdout.write(
                    self.style.SUCCESS(f'Username updated from "{old_username}" to "{new_username}"')
                )
            
            if new_password:
                user.set_password(new_password)
                self.stdout.write(
                    self.style.SUCCESS('Password updated successfully')
                )
            
            if new_email:
                user.email = new_email
                self.stdout.write(
                    self.style.SUCCESS(f'Email updated to "{new_email}"')
                )
            
            # Ensure user is staff and superuser
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(f'Admin user "{user.username}" updated successfully!')
            )
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User "{old_username}" not found!')
            )