from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class PumpMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class PumpModel(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class PumpSize(models.Model):
    size = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.size
    
    class Meta:
        ordering = ['size']


class PartNumber(models.Model):
    part_no = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.part_no
    
    class Meta:
        ordering = ['part_no']


class PartName(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class MaterialOfConstruction(models.Model):
    pump_make = models.ForeignKey(PumpMake, on_delete=models.CASCADE, related_name='materials')
    pump_model = models.ForeignKey(PumpModel, on_delete=models.CASCADE, related_name='materials')
    pump_size = models.ForeignKey(PumpSize, on_delete=models.CASCADE, related_name='materials')
    part_number = models.ForeignKey(PartNumber, on_delete=models.CASCADE, related_name='materials')
    part_name = models.ForeignKey(PartName, on_delete=models.CASCADE, related_name='materials')
    
    moc = models.CharField(max_length=100, verbose_name="Material of Construction")
    qty_available = models.PositiveIntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    drawing = models.CharField(max_length=255, blank=True, null=True)
    ref_part_list = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.pump_make.name} {self.pump_model.name} {self.pump_size.size} {self.part_number.part_no} {self.part_name.name} - {self.moc}"
    
    class Meta:
        ordering = ['pump_make__name', 'pump_model__name', 'pump_size__size', 'part_number__part_no', 'part_name__name', 'moc']
        unique_together = ['pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name', 'moc']
        verbose_name = "Material of Construction"
        verbose_name_plural = "Materials of Construction"


class ReverseEngineeringSubmission(models.Model):
    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    make = models.CharField(max_length=255, null=True, blank=True)
    model = models.CharField(max_length=255, null=True, blank=True)
    flow = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Flow in m³/hr")
    head = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Head in meters")
    bkw = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="BKW in KWH")
    efficiency = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Efficiency in %")
    
    pump_curve = models.FileField(upload_to='reverse_engineering/pump_curves/', null=True, blank=True)
    cs_drawing = models.FileField(upload_to='reverse_engineering/cs_drawings/', null=True, blank=True)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Reverse Engineering Submission"
        verbose_name_plural = "Reverse Engineering Submissions"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.customer_name} - {self.make} {self.model}"


class ReverseEngineeringDocument(models.Model):
    reverse_engineering_submission = models.ForeignKey(ReverseEngineeringSubmission, on_delete=models.CASCADE, related_name='additional_documents')
    label = models.CharField(max_length=255)
    document = models.FileField(upload_to='reverse_engineering/additional_docs/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Reverse Engineering Additional Document"
        verbose_name_plural = "Reverse Engineering Additional Documents"
    
    def __str__(self):
        return f"{self.reverse_engineering_submission.customer_name} - {self.label}"


class EnergyOptimizationSubmission(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('1R + 1S', '1R + 1S - 1 Running & 1 StandBy'),
        ('2R + 2S', '2R + 2S - 2 Running & 2 StandBy'),
        ('MR + MS', 'MR + MS - Multiple Running & Multiple StandBy'),
    ]
    
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    
    da_tank_height = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, 
                                        help_text="DA Tank Height from Pump Center line (h1) in meters")
    boiler_drum_height = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                           help_text="Boiler Drum Height from Pump Center line (h2) in meters")
    da_tank_pressure = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                         help_text="DA Tank Pressure (P1) in Kg/cm²")
    boiler_drum_pressure = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                             help_text="Boiler Drum Pressure (P2) in Kg/cm²")
    feed_water_temp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        help_text="Feed Water Temperature (t) in °C")
    specific_gravity = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True,
                                         help_text="Specific Gravity at t (SG)")
    # Actual Requirements
    actual_flow_24hrs = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                          help_text="Total mass Flow Recorded (M24) in TPH")
    actual_flow_required = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                             help_text="Actual Flow (Qact) in m³/hr")
    actual_speed_n2 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        help_text="Actual running RPM (N2) in RPM")
    actual_discharge_pressure = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                                  help_text="Actual discharge Pressure (Pd) in Kg/cm²")
    actual_suction_pressure = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                                 help_text="Actual Suction Pressure (Ps) in Kg/cm²")
    actual_power_consumption = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                                  help_text="Actual Power Consumption (BKW1) in KWH")
    
    # Name Plate Reading
    flow_qnp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                 help_text="Flow (Qnp) in m³/hr")
    head_hnp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                 help_text="Head (Hnp) in meters")
    bkw_bkwnp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                  help_text="BKW (BKWnp) in KWH")
    efficiency = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                   help_text="Efficiency (ηnp) in %")
    speed_n1 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                 help_text="RPM (N1) in RPM")
    
    # File Uploads
    qhnp_file = models.FileField(upload_to='energy_optimization/qhnp/', null=True, blank=True,
                               help_text="Upload QHnp of one pump")
    qhact_file = models.FileField(upload_to='energy_optimization/qhact/', null=True, blank=True,
                                help_text="QHact Document")
    qhmod_file = models.FileField(upload_to='energy_optimization/qhmod/', null=True, blank=True,
                                help_text="QHmod Document")
    desp_input_file = models.FileField(upload_to='energy_optimization/desp/', null=True, blank=True,
                                     help_text="DESP-User Input.xlsx")
    flowchart_file = models.FileField(upload_to='energy_optimization/flowchart/', null=True, blank=True,
                                     help_text="FlowChart.pdf")
    
    # Calculated Results (will be populated after analysis)
    calculated_efficiency_before = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                                      help_text="Calculated Efficiency Before Optimization (%)")
    calculated_efficiency_after = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                                     help_text="Calculated Efficiency After Optimization (%)")
    power_saving_kwh = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                         help_text="Power Saving (KWH)")
    cost_saving_per_day = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                             help_text="Cost Saving Per Day")
    co2_reduction_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                         help_text="CO2 Reduction (kg)")
    trees_saved = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                    help_text="Number of Trees Saved")
    payback_period_days = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                            help_text="Payback Period (days)")
    
    # Analysis Status
    analysis_completed = models.BooleanField(default=False)
    plots_generated = models.BooleanField(default=False)
    proposal_generated = models.BooleanField(default=False)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Energy Optimization Submission"
        verbose_name_plural = "Energy Optimization Submissions"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Energy Optimization - {self.project_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class InventoryDatabase(models.Model):
    """
    Minimalistic Inventory Database for Pump Spares
    """
    part_name = models.CharField(max_length=200, help_text="Name/description of the part")
    part_no = models.CharField(max_length=50, help_text="Part number")
    drawing = models.CharField(max_length=255, blank=True, null=True, help_text="Drawing reference")
    ref_location = models.CharField(max_length=255, blank=True, null=True, help_text="Reference location")
    moc = models.CharField(max_length=100, help_text="Material of Construction")
    availability = models.PositiveIntegerField(default=0, help_text="Quantity available")
    uom = models.CharField(max_length=20, default='nos', help_text="Unit of measurement")
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Unit price")
    drawing_vendor = models.CharField(max_length=255, blank=True, null=True, help_text="Drawing vendor reference")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Inventory Item"
        verbose_name_plural = "Inventory Database"
        ordering = ['part_no']
    
    def __str__(self):
        return f"{self.part_no} - {self.part_name}"
