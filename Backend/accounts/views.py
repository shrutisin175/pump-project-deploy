from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer
from .models import CustomUser

def send_welcome_message(user):
    subject = "Welcome to Our Platform!"
    message = f"""
    Dear {user.full_name or user.official_email},

    Welcome to our platform! Your account has been created successfully.

    Your unique code is: {user.user_unique_code}

    Thank you for joining us!
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.official_email],
            fail_silently=False,
        )
        return f"Welcome email sent to {user.official_email}"
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return f"Welcome {user.full_name or user.official_email}! Your account has been created successfully. Your unique code is: {user.user_unique_code}"

def send_otp_email(user, otp):
    subject = "Login OTP - Verification Required"
    message = f"""
    Dear {user.full_name or user.official_email},

    Your login OTP is: {otp}

    This OTP is valid for 5 minutes only.
    Please do not share this OTP with anyone.

    If you did not request this login, please ignore this email.
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.official_email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {str(e)}")
        return False

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            welcome_message = send_welcome_message(user)
            return Response({
                "message": "User registered successfully.",
                "welcome_message": welcome_message,
                "user": UserSerializer(user).data
            }, status=201)
        return Response(serializer.errors, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        otp = request.data.get('otp')
        
        if not email or not password:
            return Response({
                "error": "Email and password are required."
            }, status=400)
        
        user = authenticate(request, username=email, password=password)
        
        if not user:
            return Response({
                "error": "Invalid email or password."
            }, status=401)
        
        if not otp:
            otp_code = user.generate_otp()
            if send_otp_email(user, otp_code):
                return Response({
                    "message": "OTP has been sent to your registered email address. Please check your email and enter the OTP to complete login.",
                    "otp_required": True
                }, status=200)
            else:
                return Response({
                    "error": "Failed to send OTP. Please check your email configuration or try again later.",
                    "otp_required": True
                }, status=500)
        
        if user.verify_otp(otp):
            return Response({
                "message": "Login successful.",
                "user": UserSerializer(user).data
            }, status=200)
        else:
            return Response({
                "error": "Invalid or expired OTP."
            }, status=401)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        return Response({
            "message": "Logout successful."
        }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class UserProfileView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                "error": "Email and password are required."
            }, status=400)
        
        user = authenticate(request, username=email, password=password)
        
        if user:
            return Response(UserSerializer(user).data, status=200)
        else:
            return Response({
                "error": "Invalid credentials."
            }, status=401)
    
    def put(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                "error": "Email and password are required for authentication."
            }, status=400)
        
        user = authenticate(request, username=email, password=password)
        
        if user:
            update_data = {k: v for k, v in request.data.items() if k not in ['email', 'password']}
            
            serializer = UserSerializer(user, data=update_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response({
                "error": "Validation failed",
                "details": serializer.errors
            }, status=400)
        else:
            return Response({
                "error": "Invalid credentials."
            }, status=401)

@method_decorator(csrf_exempt, name='dispatch')
class ContactFormView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone', '')
        message = request.data.get('message')
        
        if not name or not email or not message:
            return Response({
                "error": "Name, email, and message are required."
            }, status=400)
        
        company_subject = f"New Contact Form Submission from {name}"
        company_message = f"""
        You have received a new contact form submission:

        Name: {name}
        Email: {email}
        Phone: {phone if phone else 'Not provided'}
        
        Message:
        {message}

        Please respond to the customer at: {email}
        """
        
        customer_subject = "Thank you for contacting Shaft & Seal"
        customer_message = f"""
        Dear {name},

        Thank you for contacting us! We have received your message and will get back to you soon.

        Your message:
        {message}

        We typically respond within 24 hours during business days.

        Best regards,
        Shaft & Seal Team
        """
        
        try:
            send_mail(
                subject=customer_subject,
                message=customer_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return Response({
                "message": "Your message has been sent successfully! We'll get back to you soon.",
                "success": True
            }, status=200)
            
        except Exception as e:
            print(f"Failed to send contact form email: {str(e)}")
            return Response({
                "error": "Failed to send message. Please try again later.",
                "success": False
            }, status=500)

def send_password_reset_email(user, reset_token):
    subject = "Password Reset Request - Shaft & Seal"
    message = f"""
    Dear {user.full_name or user.official_email},

    You have requested to reset your password for your Shaft & Seal account.

    Your password reset token is: {reset_token}

    This token is valid for 1 hour only.
    Please use this token to reset your password.

    If you did not request this password reset, please ignore this email.

    Best regards,
    Shaft & Seal Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.official_email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send password reset email: {str(e)}")
        return False

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({
                "error": "Email is required."
            }, status=400)
        
        try:
            user = CustomUser.objects.get(official_email=email)
            reset_token = user.generate_reset_token()
            
            if send_password_reset_email(user, reset_token):
                return Response({
                    "message": "Password reset instructions have been sent to your email.",
                    "success": True
                }, status=200)
            else:
                return Response({
                    "error": "Failed to send reset email. Please try again later.",
                    "success": False
                }, status=500)
                
        except CustomUser.DoesNotExist:
            return Response({
                "message": "If an account with this email exists, password reset instructions have been sent.",
                "success": True
            }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not email or not token or not new_password:
            return Response({
                "error": "Email, token, and new password are required."
            }, status=400)
        
        try:
            user = CustomUser.objects.get(official_email=email)
            
            if user.is_reset_token_valid(token):
                user.reset_password(new_password)
                return Response({
                    "message": "Password has been reset successfully. You can now login with your new password.",
                    "success": True
                }, status=200)
            else:
                return Response({
                    "error": "Invalid or expired reset token.",
                    "success": False
                }, status=400)
                
        except CustomUser.DoesNotExist:
            return Response({
                "error": "Invalid reset request.",
                "success": False
            }, status=400)
