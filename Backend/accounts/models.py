from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, official_email, full_name=None, password=None, **extra_fields):
        if not official_email:
            raise ValueError("Email is required")
        email = self.normalize_email(official_email)
        user = self.model(official_email=email, full_name=full_name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_password('defaultPassword123')
        user.save()
        return user

    def create_superuser(self, official_email, full_name=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(official_email, full_name, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_unique_code = models.CharField(max_length=17, unique=True, editable=False, null=True, blank=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    official_email = models.EmailField(unique=True)
    personal_email = models.EmailField(blank=True, null=True)
    official_phone = models.CharField(max_length=20, blank=True, null=True)
    personal_phone = models.CharField(max_length=20, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    gst_number = models.CharField(max_length=15)
    pin_code = models.CharField(max_length=10, blank=True, null=True)
    company_address = models.TextField(blank=True, null=True)
    
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    reset_token_created_at = models.DateTimeField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'official_email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def generate_otp(self):
        self.otp_code = f"{random.randint(100000, 999999)}"
        self.otp_created_at = timezone.now()
        self.otp_verified = False
        self.save()
        return self.otp_code
    
    def verify_otp(self, otp):
        if not self.otp_code or not self.otp_created_at:
            return False
        
        if timezone.now() > self.otp_created_at + timedelta(minutes=5):
            return False
        
        if self.otp_code == otp:
            self.otp_verified = True
            self.save()
            return True
        
        return False
    
    def is_otp_valid(self):
        if not self.otp_code or not self.otp_created_at:
            return False
        return timezone.now() <= self.otp_created_at + timedelta(minutes=5)
    
    def generate_reset_token(self):
        import uuid
        self.reset_token = str(uuid.uuid4())
        self.reset_token_created_at = timezone.now()
        self.save()
        return self.reset_token
    
    def is_reset_token_valid(self, token):
        if not self.reset_token or not self.reset_token_created_at:
            return False
        
        if timezone.now() > self.reset_token_created_at + timedelta(hours=1):
            return False
        
        return self.reset_token == token
    
    def reset_password(self, new_password):
        self.set_password(new_password)
        self.reset_token = None
        self.reset_token_created_at = None
        self.save()

    def save(self, *args, **kwargs):
        if not self.user_unique_code:
            # Use a simple approach to avoid circular dependencies
            import uuid
            self.user_unique_code = f"{self.gst_number}{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.official_email
