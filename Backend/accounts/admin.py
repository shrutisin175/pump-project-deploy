from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

admin.site.unregister(Group)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user_unique_code', 'full_name', 'official_email', 'company_name', 'location', 'department', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'location', 'department')
    search_fields = ('user_unique_code', 'full_name', 'official_email', 'company_name', 'location')
    ordering = ('-id',)
    
    fieldsets = (
        ('User Identity', {
            'fields': ('user_unique_code',)
        }),
        ('Personal Information', {
            'fields': ('full_name', 'official_email', 'personal_email', 'official_phone', 'personal_phone')
        }),
        ('Company Information', {
            'fields': ('company_name', 'location', 'department', 'gst_number', 'pin_code', 'company_address')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Important dates', {
            'fields': ('last_login',)
        }),
    )
    
    readonly_fields = ('user_unique_code', 'last_login')
