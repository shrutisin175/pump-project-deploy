from django.contrib import admin
from .models import (
    PumpMake, PumpModel, PumpSize, PartNumber, PartName, MaterialOfConstruction, 
    ReverseEngineeringSubmission, ReverseEngineeringDocument, EnergyOptimizationSubmission,
    InventoryDatabase
)

@admin.register(PumpMake)
class PumpMakeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(PumpModel)
class PumpModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(PumpSize)
class PumpSizeAdmin(admin.ModelAdmin):
    list_display = ['size', 'created_at']
    search_fields = ['size']
    ordering = ['size']


@admin.register(PartNumber)
class PartNumberAdmin(admin.ModelAdmin):
    list_display = ['part_no', 'created_at']
    search_fields = ['part_no']
    ordering = ['part_no']


@admin.register(PartName)
class PartNameAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(MaterialOfConstruction)
class MaterialOfConstructionAdmin(admin.ModelAdmin):
    list_display = ['moc', 'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name', 'qty_available', 'unit_price', 'updated_at']
    list_filter = ['pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name', 'qty_available', 'created_at']
    search_fields = ['moc', 'pump_make__name', 'pump_model__name', 'pump_size__size', 'part_number__part_no', 'part_name__name']
    ordering = ['pump_make__name', 'pump_model__name', 'pump_size__size', 'part_number__part_no', 'part_name__name', 'moc']
    list_editable = ['qty_available', 'unit_price']
    
    fieldsets = (
        ('Part Information', {
            'fields': ('pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name')
        }),
        ('Material Details', {
            'fields': ('moc', 'qty_available', 'unit_price', 'drawing', 'ref_part_list')
        }),
    )


class ReverseEngineeringDocumentInline(admin.TabularInline):
    model = ReverseEngineeringDocument
    extra = 0
    readonly_fields = ['created_at']
    fields = ['label', 'document', 'created_at']


@admin.register(ReverseEngineeringSubmission)
class ReverseEngineeringSubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'email', 'make', 'model', 'flow', 'head', 'bkw', 'efficiency', 'user', 'created_at']
    list_filter = ['make', 'model', 'created_at', 'user']
    search_fields = ['customer_name', 'email', 'phone', 'make', 'model']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'email', 'phone', 'user')
        }),
        ('Pump Specifications', {
            'fields': ('make', 'model', 'flow', 'head', 'bkw', 'efficiency')
        }),
        ('Documents', {
            'fields': ('pump_curve', 'cs_drawing')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ReverseEngineeringDocumentInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').prefetch_related('additional_documents')


@admin.register(ReverseEngineeringDocument)
class ReverseEngineeringDocumentAdmin(admin.ModelAdmin):
    list_display = ['reverse_engineering_submission', 'label', 'document', 'created_at']
    list_filter = ['created_at']
    search_fields = ['reverse_engineering_submission__customer_name', 'reverse_engineering_submission__email', 'label']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('reverse_engineering_submission')


@admin.register(EnergyOptimizationSubmission)
class EnergyOptimizationSubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'project_type', 'da_tank_height', 'boiler_drum_height', 'flow_qnp', 'head_hnp', 'efficiency', 'user', 'created_at']
    list_filter = ['project_type', 'created_at', 'user']
    search_fields = ['project_type', 'user__official_email', 'user__full_name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('project_type', 'user')
        }),
        ('Process Parameters', {
            'fields': ('da_tank_height', 'boiler_drum_height', 'da_tank_pressure', 'boiler_drum_pressure', 
                      'feed_water_temp', 'specific_gravity', 'actual_flow_24hrs', 'actual_flow_required')
        }),
        ('Name Plate Reading', {
            'fields': ('flow_qnp', 'head_hnp', 'bkw_bkwnp', 'efficiency')
        }),
        ('File Uploads', {
            'fields': ('qhnp_file', 'qhact_file', 'qhmod_file')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(InventoryDatabase)
class InventoryDatabaseAdmin(admin.ModelAdmin):
    list_display = ['part_no', 'part_name', 'moc', 'availability', 'unit_price']
    search_fields = ['part_name', 'part_no', 'moc']
    ordering = ['part_no']
