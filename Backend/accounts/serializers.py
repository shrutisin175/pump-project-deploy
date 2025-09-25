from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'full_name', 'official_email', 'personal_email', 'official_phone',
            'personal_phone', 'company_name', 'location', 'department',
            'gst_number', 'pin_code', 'company_address', 'password', 'confirmPassword'
        ]
        extra_kwargs = {
            'full_name': {'required': False},
            'personal_email': {'required': False},
            'official_phone': {'required': False},
            'personal_phone': {'required': False},
            'company_name': {'required': False},
            'location': {'required': False},
            'department': {'required': False},
            'gst_number': {'required': False},
            'pin_code': {'required': False},
            'company_address': {'required': False},
        }

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        user_data = {
            'full_name': validated_data.get('full_name'),
            'official_email': validated_data.get('official_email'),
            'personal_email': validated_data.get('personal_email'),
            'official_phone': validated_data.get('official_phone'),
            'personal_phone': validated_data.get('personal_phone'),
            'company_name': validated_data.get('company_name'),
            'location': validated_data.get('location'),
            'department': validated_data.get('department'),
            'gst_number': validated_data.get('gst_number'),
            'pin_code': validated_data.get('pin_code'),
            'company_address': validated_data.get('company_address'),
            'password': validated_data.get('password'),
        }
        user = CustomUser.objects.create_user(**user_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'user_unique_code', 'full_name', 'official_email', 'personal_email', 'official_phone',
            'personal_phone', 'company_name', 'location', 'department',
            'gst_number', 'pin_code', 'company_address'
        ]
        read_only_fields = ['id', 'user_unique_code', 'official_email']
        extra_kwargs = {
            'full_name': {'required': False},
            'personal_email': {'required': False},
            'official_phone': {'required': False},
            'personal_phone': {'required': False},
            'company_name': {'required': False},
            'location': {'required': False},
            'department': {'required': False},
            'gst_number': {'required': False},
            'pin_code': {'required': False},
            'company_address': {'required': False},
        }
