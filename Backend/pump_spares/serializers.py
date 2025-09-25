from rest_framework import serializers
from .models import (
    PumpMake, PumpModel, PumpSize, PartNumber, PartName, MaterialOfConstruction, 
    ReverseEngineeringSubmission, ReverseEngineeringDocument, EnergyOptimizationSubmission,
    InventoryDatabase
)


class PumpMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpMake
        fields = ['id', 'name']


class PumpModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpModel
        fields = ['id', 'name']


class PumpSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpSize
        fields = ['id', 'size']


class PartNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartNumber
        fields = ['id', 'part_no']


class PartNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartName
        fields = ['id', 'name']


class MaterialOfConstructionSerializer(serializers.ModelSerializer):
    pump_make_name = serializers.CharField(source='pump_make.name', read_only=True)
    pump_model_name = serializers.CharField(source='pump_model.name', read_only=True)
    pump_size_value = serializers.CharField(source='pump_size.size', read_only=True)
    part_number_value = serializers.CharField(source='part_number.part_no', read_only=True)
    part_name_value = serializers.CharField(source='part_name.name', read_only=True)
    
    class Meta:
        model = MaterialOfConstruction
        fields = [
            'id', 'moc', 'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name',
            'pump_make_name', 'pump_model_name', 'pump_size_value', 'part_number_value', 'part_name_value',
            'qty_available', 'unit_price', 'drawing', 'ref_part_list'
        ]


class PumpSparesFilterSerializer(serializers.Serializer):
    pump_make = serializers.IntegerField(required=False)
    pump_model = serializers.IntegerField(required=False)
    pump_size = serializers.IntegerField(required=False)
    part_number = serializers.IntegerField(required=False)
    part_name = serializers.IntegerField(required=False)
    moc = serializers.IntegerField(required=False)


class ReverseEngineeringDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReverseEngineeringDocument
        fields = ['id', 'label', 'document', 'created_at']


class ReverseEngineeringSubmissionSerializer(serializers.ModelSerializer):
    additional_documents = ReverseEngineeringDocumentSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.official_email', read_only=True)
    
    class Meta:
        model = ReverseEngineeringSubmission
        fields = [
            'id', 'customer_name', 'email', 'phone', 'make', 'model',
            'flow', 'head', 'bkw', 'efficiency', 'pump_curve', 'cs_drawing',
            'user', 'user_email', 'additional_documents', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']


class InventoryDatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryDatabase
        fields = [
            'id', 'part_name', 'part_no', 'drawing', 'ref_location', 'moc',
            'availability', 'uom', 'unit_price', 'drawing_vendor',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class InventoryFilterSerializer(serializers.Serializer):
    search = serializers.CharField(required=False, help_text="Search in part name, part number, or MOC")
    part_no = serializers.CharField(required=False)
    moc = serializers.CharField(required=False)
    min_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    availability_min = serializers.IntegerField(required=False)


class EnergyOptimizationSubmissionSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.official_email', read_only=True)
    
    class Meta:
        model = EnergyOptimizationSubmission
        fields = [
            'id', 'project_type', 'da_tank_height', 'boiler_drum_height',
            'da_tank_pressure', 'boiler_drum_pressure', 'feed_water_temp',
            'specific_gravity', 'actual_flow_24hrs', 'actual_flow_required',
            'flow_qnp', 'head_hnp', 'bkw_bkwnp', 'efficiency',
            'qhnp_file', 'qhact_file', 'qhmod_file',
            'user', 'user_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
