from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime
from .models import (
    PumpMake, PumpModel, PumpSize, PartNumber, PartName, MaterialOfConstruction, 
    ReverseEngineeringSubmission, ReverseEngineeringDocument, EnergyOptimizationSubmission,
    InventoryDatabase
)
from .serializers import (
    PumpMakeSerializer, PumpModelSerializer, PumpSizeSerializer,
    PartNumberSerializer, PartNameSerializer, MaterialOfConstructionSerializer,
    PumpSparesFilterSerializer, ReverseEngineeringSubmissionSerializer, ReverseEngineeringDocumentSerializer,
    EnergyOptimizationSubmissionSerializer, InventoryDatabaseSerializer, InventoryFilterSerializer
)


class PumpMakeListView(generics.ListAPIView):
    """Get all pump makes"""
    queryset = PumpMake.objects.all()
    serializer_class = PumpMakeSerializer


class PumpModelListView(generics.ListAPIView):
    """Get all pump models"""
    queryset = PumpModel.objects.all()
    serializer_class = PumpModelSerializer


class PumpSizeListView(generics.ListAPIView):
    """Get all pump sizes"""
    queryset = PumpSize.objects.all()
    serializer_class = PumpSizeSerializer


class PartNumberListView(generics.ListAPIView):
    """Get all part numbers"""
    queryset = PartNumber.objects.all()
    serializer_class = PartNumberSerializer


class PartNameListView(generics.ListAPIView):
    """Get all part names"""
    queryset = PartName.objects.all()
    serializer_class = PartNameSerializer


class MaterialOfConstructionListView(generics.ListAPIView):
    """Get all materials of construction"""
    queryset = MaterialOfConstruction.objects.all()
    serializer_class = MaterialOfConstructionSerializer


@api_view(['GET'])
def get_filtered_options(request):
    """
    Get filtered options based on current selections.
    This endpoint returns available options for each filter based on current selections.
    """
    pump_make_id = request.GET.get('pump_make')
    pump_model_id = request.GET.get('pump_model')
    pump_size_id = request.GET.get('pump_size')
    part_number_id = request.GET.get('part_number')
    part_name_id = request.GET.get('part_name')
    
    def get_options_for_field(exclude_field=None):
        """Get filtered options excluding a specific field to show all available options for that field"""
        materials_qs = MaterialOfConstruction.objects.select_related(
            'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name'
        )
        
        if pump_make_id and exclude_field != 'pump_make':
            materials_qs = materials_qs.filter(pump_make_id=pump_make_id)
        if pump_model_id and exclude_field != 'pump_model':
            materials_qs = materials_qs.filter(pump_model_id=pump_model_id)
        if pump_size_id and exclude_field != 'pump_size':
            materials_qs = materials_qs.filter(pump_size_id=pump_size_id)
        if part_number_id and exclude_field != 'part_number':
            materials_qs = materials_qs.filter(part_number_id=part_number_id)
        if part_name_id and exclude_field != 'part_name':
            materials_qs = materials_qs.filter(part_name_id=part_name_id)
        
        return materials_qs
    
    pump_makes = set()
    pump_models = set()
    pump_sizes = set()
    part_numbers = set()
    part_names = set()
    
    for material in get_options_for_field('pump_make'):
        pump_makes.add((material.pump_make.id, material.pump_make.name))
    
    for material in get_options_for_field('pump_model'):
        pump_models.add((material.pump_model.id, material.pump_model.name))
    
    for material in get_options_for_field('pump_size'):
        pump_sizes.add((material.pump_size.id, material.pump_size.size))
    
    for material in get_options_for_field('part_number'):
        part_numbers.add((material.part_number.id, material.part_number.part_no))
    
    for material in get_options_for_field('part_name'):
        part_names.add((material.part_name.id, material.part_name.name))
    
    return Response({
        'pump_makes': [{'id': id, 'name': name} for id, name in sorted(pump_makes, key=lambda x: x[1])],
        'pump_models': [{'id': id, 'name': name} for id, name in sorted(pump_models, key=lambda x: x[1])],
        'pump_sizes': [{'id': id, 'size': size} for id, size in sorted(pump_sizes, key=lambda x: x[1])],
        'part_numbers': [{'id': id, 'part_no': part_no} for id, part_no in sorted(part_numbers, key=lambda x: x[1])],
        'part_names': [{'id': id, 'name': name} for id, name in sorted(part_names, key=lambda x: x[1])],
    })


@api_view(['GET'])
def get_materials_for_part(request):
    """
    Get all materials of construction for a specific part combination.
    Requires pump_make, pump_model, pump_size, part_number, and part_name parameters.
    """
    pump_make_id = request.GET.get('pump_make')
    pump_model_id = request.GET.get('pump_model')
    pump_size_id = request.GET.get('pump_size')
    part_number_id = request.GET.get('part_number')
    part_name_id = request.GET.get('part_name')
    
    if not all([pump_make_id, pump_model_id, pump_size_id, part_number_id, part_name_id]):
        return Response({
            'error': 'All parameters are required: pump_make, pump_model, pump_size, part_number, part_name'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    materials = MaterialOfConstruction.objects.filter(
        pump_make_id=pump_make_id,
        pump_model_id=pump_model_id,
        pump_size_id=pump_size_id,
        part_number_id=part_number_id,
        part_name_id=part_name_id
    ).select_related(
        'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name'
    )
    
    if not materials.exists():
        return Response({
            'error': 'No materials found for the specified part combination'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MaterialOfConstructionSerializer(materials, many=True)
    
    first_material = materials.first()
    part_specs = {
        'pump_make': first_material.pump_make.name,
        'pump_model': first_material.pump_model.name,
        'pump_size': first_material.pump_size.size,
        'part_number': first_material.part_number.part_no,
        'part_name': first_material.part_name.name,
    }
    
    return Response({
        'part_specifications': part_specs,
        'materials': serializer.data
    })


@api_view(['GET'])
def get_material_by_id(request, material_id):
    """Get a specific material by ID for cart/quote functionality"""
    try:
        material = MaterialOfConstruction.objects.select_related(
            'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name'
        ).get(id=material_id)
        serializer = MaterialOfConstructionSerializer(material)
        return Response(serializer.data)
    except MaterialOfConstruction.DoesNotExist:
        return Response({
            'error': 'Material not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def submit_pump_details(request):
    """Submit pump details form with file uploads"""
    try:
        data = {
            'customer_name': request.data.get('customerName'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'make': request.data.get('make'),
            'model': request.data.get('model'),
            'flow': request.data.get('flow'),
            'head': request.data.get('head'),
            'bkw': request.data.get('bkw'),
            'efficiency': request.data.get('efficiency'),
            'pump_curve': request.FILES.get('pumpCurve'),
            'cs_drawing': request.FILES.get('csDrawing'),
        }
        
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            email = request.data.get('userEmail')
            password = request.data.get('userPassword')
            if email and password:
                user = authenticate(request, username=email, password=password)
        
        if user:
            data['user'] = user.id
        
        serializer = ReverseEngineeringSubmissionSerializer(data=data)
        if serializer.is_valid():
            submission = serializer.save()
            
            additional_docs = []
            for key in request.data.keys():
                if key.startswith('additionalDoc_'):
                    index = key.split('_')[1]
                    file = request.FILES.get(key)
                    label = request.data.get(f'additionalDocLabel_{index}', '')
                    
                    if file and label:
                        doc = ReverseEngineeringDocument.objects.create(
                            reverse_engineering_submission=submission,
                            label=label,
                            document=file
                        )
                        additional_docs.append(doc)
            
            response_serializer = ReverseEngineeringSubmissionSerializer(submission)
            
            # Send email notification to company
            try:
                send_pump_submission_email(submission, additional_docs)
            except Exception as email_error:
                print(f"Email sending failed: {email_error}")
                # Don't fail the submission if email fails
            
            return Response({
                'success': True,
                'message': 'Pump details submitted successfully!',
                'submission': response_serializer.data,
                'additional_documents_count': len(additional_docs)
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error submitting pump details: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
def submit_energy_optimization(request):
    """Submit energy optimization form with file uploads"""
    try:
        data = {
            'project_type': request.data.get('projectType'),
            'da_tank_height': request.data.get('daTankHeight'),
            'boiler_drum_height': request.data.get('boilerDrumHeight'),
            'da_tank_pressure': request.data.get('daTankPressure'),
            'boiler_drum_pressure': request.data.get('boilerDrumPressure'),
            'feed_water_temp': request.data.get('feedWaterTemp'),
            'specific_gravity': request.data.get('specificGravity'),
            'actual_flow_24hrs': request.data.get('actualFlow24hrs'),
            'actual_flow_required': request.data.get('actualFlowRequired'),
            'actual_speed_n2': request.data.get('actualSpeedN2'),
            'actual_discharge_pressure': request.data.get('actualDischargePressure'),
            'actual_suction_pressure': request.data.get('actualSuctionPressure'),
            'actual_power_consumption': request.data.get('actualPowerConsumption'),
            'flow_qnp': request.data.get('flowQnp'),
            'head_hnp': request.data.get('headHnp'),
            'bkw_bkwnp': request.data.get('bkwBkwnp'),
            'efficiency': request.data.get('efficiency'),
            'speed_n1': request.data.get('speedN1'),
            'qhnp_file': request.FILES.get('qhnpFile'),
            'qhact_file': request.FILES.get('qhactFile'),
            'qhmod_file': request.FILES.get('qhmodFile'),
            'desp_input_file': request.FILES.get('despInputFile'),
            'flowchart_file': request.FILES.get('flowchartFile'),
        }
        
        # Handle user authentication
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            email = request.data.get('userEmail')
            password = request.data.get('userPassword')
            if email and password:
                user = authenticate(request, username=email, password=password)
        
        if user:
            data['user'] = user.id
        
        serializer = EnergyOptimizationSubmissionSerializer(data=data)
        if serializer.is_valid():
            submission = serializer.save()
            
            # Perform energy optimization calculations
            try:
                from .energy_calculations import calculate_energy_optimization
                from .plot_generator import generate_energy_optimization_plots
                from .proposal_generator import generate_energy_optimization_proposal
                from .qh_curve_processor import process_qh_curve_file
                
                # Convert submission data to calculation format
                calc_data = {
                    'project_type': submission.project_type,
                    'da_tank_height': float(submission.da_tank_height or 0),
                    'boiler_drum_height': float(submission.boiler_drum_height or 0),
                    'da_tank_pressure': float(submission.da_tank_pressure or 0),
                    'boiler_drum_pressure': float(submission.boiler_drum_pressure or 0),
                    'feed_water_temp': float(submission.feed_water_temp or 0),
                    'specific_gravity': float(submission.specific_gravity or 1.0),
                    'actual_flow_24hrs': float(submission.actual_flow_24hrs or 0),
                    'actual_flow_required': float(submission.actual_flow_required or 0),
                    'actual_speed_n2': float(submission.actual_speed_n2 or 0),
                    'actual_discharge_pressure': float(submission.actual_discharge_pressure or 0),
                    'actual_suction_pressure': float(submission.actual_suction_pressure or 0),
                    'actual_power_consumption': float(submission.actual_power_consumption or 0),
                    'flow_qnp': float(submission.flow_qnp or 0),
                    'head_hnp': float(submission.head_hnp or 0),
                    'bkw_bkwnp': float(submission.bkw_bkwnp or 0),
                    'efficiency': float(submission.efficiency or 0),
                    'speed_n1': float(submission.speed_n1 or 0),
                }
                
                # Process Q-H curve file if uploaded
                qh_curve_data = None
                if submission.qhnp_file:
                    try:
                        qh_curve_data = process_qh_curve_file(submission.qhnp_file, calc_data)
                        print(f"Q-H curve processed successfully: {qh_curve_data.get('success', False)}")
                    except Exception as qh_error:
                        print(f"Q-H curve processing failed: {str(qh_error)}")
                        qh_curve_data = {"error": f"Q-H curve processing failed: {str(qh_error)}"}
                else:
                    print("No Q-H curve file uploaded, using calculated curves only")
                
                # Perform calculations
                print(f"Starting energy optimization calculations...")
                calculation_results = calculate_energy_optimization(calc_data)
                print(f"Calculations completed: {bool(calculation_results)}")
                
                # Add Q-H curve data to results if available
                if qh_curve_data and qh_curve_data.get('success'):
                    calculation_results['qh_curve_data'] = qh_curve_data
                
                # Generate plots
                print(f"Generating plots...")
                plots = generate_energy_optimization_plots(calculation_results)
                print(f"Plots generated: {bool(plots)}")
                
                # Generate proposal
                print(f"Generating proposal...")
                proposal = generate_energy_optimization_proposal(calc_data, calculation_results)
                print(f"Proposal generated: {bool(proposal)}")
                
                # Update submission with calculated results
                submission.calculated_efficiency_before = calculation_results.get('efficiency_before', 0)
                submission.calculated_efficiency_after = calculation_results.get('efficiency_after', 0)
                submission.power_saving_kwh = calculation_results.get('power_saving', 0)
                submission.cost_saving_per_day = calculation_results.get('daily_cost_saving', 0)
                submission.co2_reduction_kg = calculation_results.get('annual_co2_reduction', 0)
                submission.trees_saved = calculation_results.get('annual_trees_saved', 0)
                submission.payback_period_days = calculation_results.get('payback_period_days', 0)
                submission.analysis_completed = True
                submission.plots_generated = True
                submission.proposal_generated = True
                submission.save()
                
                # Prepare response data
                response_data = {
                    'submission': EnergyOptimizationSubmissionSerializer(submission).data,
                    'calculations': calculation_results,
                    'plots': plots,
                    'proposal': proposal,
                    'message': 'Energy optimization analysis completed successfully'
                }
                
                print(f"Response data prepared:")
                print(f"  - Submission: {bool(response_data['submission'])}")
                print(f"  - Calculations: {bool(response_data['calculations'])}")
                print(f"  - Plots: {bool(response_data['plots'])}")
                print(f"  - Proposal: {bool(response_data['proposal'])}")
                
            except Exception as calc_error:
                import traceback
                calc_error_details = traceback.format_exc()
                print(f"Error in calculations: {str(calc_error)}")
                print(f"Calculation error details: {calc_error_details}")
                response_data = {
                    'submission': EnergyOptimizationSubmissionSerializer(submission).data,
                    'error': f'Analysis completed but calculations failed: {str(calc_error)}',
                    'message': 'Form submitted successfully, but analysis needs manual review',
                    'error_details': calc_error_details
                }
            
            return Response({
                'success': True,
                'message': response_data.get('message', 'Energy optimization project submitted successfully!'),
                'data': response_data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Full error details: {error_details}")
        return Response({
            'success': False,
            'error': f'Error submitting energy optimization project: {str(e)}',
            'details': error_details
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_energy_optimization_submissions(request):
    """Get all energy optimization submissions for the authenticated user"""
    if not request.user.is_authenticated:
        return Response({
            'error': 'Authentication required'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    submissions = EnergyOptimizationSubmission.objects.filter(user=request.user).order_by('-created_at')
    serializer = EnergyOptimizationSubmissionSerializer(submissions, many=True)
    
    return Response({
        'success': True,
        'submissions': serializer.data
    })


@api_view(['GET'])
def test_energy_optimization(request):
    """Test endpoint for energy optimization"""
    return Response({
        'success': True,
        'message': 'Energy optimization API is working!',
        'timestamp': datetime.now().isoformat()
    })


@api_view(['POST'])
def process_qh_curve(request):
    """Process Q-H curve file and generate SRC"""
    try:
        if 'file' not in request.FILES:
            return Response({
                'success': False,
                'error': 'No file uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['file']
        process_params = {
            'da_tank_height': float(request.data.get('da_tank_height', 0)),
            'boiler_drum_height': float(request.data.get('boiler_drum_height', 0)),
            'da_tank_pressure': float(request.data.get('da_tank_pressure', 0)),
            'boiler_drum_pressure': float(request.data.get('boiler_drum_pressure', 0)),
            'specific_gravity': float(request.data.get('specific_gravity', 1.0)),
            'flow_qnp': float(request.data.get('flow_qnp', 0)),
            'head_hnp': float(request.data.get('head_hnp', 0)),
        }
        
        from .qh_curve_processor import process_qh_curve_file
        result = process_qh_curve_file(file, process_params)
        
        return Response({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error processing Q-H curve: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def generate_receipt(request):
    """Generate and download receipt for selected material - Requires authentication"""
    from .receipt_generator import create_receipt_response
    
    if not request.user.is_authenticated:
        email = request.data.get('email')
        password = request.data.get('password')
                
        if email and password:
            user = authenticate(request, username=email, password=password)
            if user:
                request.user = user
            else:
                return Response({
                    'error': 'Invalid credentials. Please log in again.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'error': 'Authentication required. Please log in again.'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        material_id = request.data.get('material_id')
        
        if not material_id:
            return Response({
                'error': 'Material ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        material = MaterialOfConstruction.objects.select_related(
            'pump_make', 'pump_model', 'pump_size', 'part_number', 'part_name'
        ).get(id=material_id)
        
        serializer = MaterialOfConstructionSerializer(material)
        material_data = serializer.data
        
        user_info = {}
        if request.user.is_authenticated:
            user_info = {
                'user_unique_code': request.user.user_unique_code,
                'full_name': request.user.full_name or '',
                'company_name': request.user.company_name or '',
                'company_address': request.user.company_address or '',
                'official_email': request.user.official_email,
                'gst_number': request.user.gst_number or '',
                'location': request.user.location or ''
            }
        
        return create_receipt_response(material_data, user_info)
        
    except MaterialOfConstruction.DoesNotExist:
        return Response({
            'error': 'Material not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error generating receipt: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InventoryDatabaseListCreateView(generics.ListCreateAPIView):
    """List all inventory items or create a new one"""
    queryset = InventoryDatabase.objects.all()
    serializer_class = InventoryDatabaseSerializer
    
    def get_queryset(self):
        queryset = InventoryDatabase.objects.all()
        
        search = self.request.query_params.get('search', None)
        part_no = self.request.query_params.get('part_no', None)
        moc = self.request.query_params.get('moc', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        availability_min = self.request.query_params.get('availability_min', None)
        
        if search:
            queryset = queryset.filter(
                Q(part_name__icontains=search) |
                Q(part_no__icontains=search) |
                Q(moc__icontains=search) |
                Q(drawing__icontains=search)
            )
        
        if part_no:
            queryset = queryset.filter(part_no__icontains=part_no)
        
        if moc:
            queryset = queryset.filter(moc__icontains=moc)
        
        if min_price:
            queryset = queryset.filter(unit_price__gte=min_price)
        
        if max_price:
            queryset = queryset.filter(unit_price__lte=max_price)
        
        if availability_min:
            queryset = queryset.filter(availability__gte=availability_min)
        
        return queryset.order_by('part_no')


class InventoryDatabaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific inventory item"""
    queryset = InventoryDatabase.objects.all()
    serializer_class = InventoryDatabaseSerializer


@api_view(['GET'])
def get_inventory_item_by_id(request, item_id):
    """Get a specific inventory item by ID"""
    try:
        item = InventoryDatabase.objects.get(id=item_id)
        serializer = InventoryDatabaseSerializer(item)
        return Response(serializer.data)
    except InventoryDatabase.DoesNotExist:
        return Response({
            'error': 'Inventory item not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def search_inventory(request):
    """Search inventory items with various filters"""
    try:
        search_term = request.GET.get('search', '')
        part_no = request.GET.get('part_no', '')
        moc = request.GET.get('moc', '')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        availability_min = request.GET.get('availability_min')
        
        queryset = InventoryDatabase.objects.all()
        
        if search_term:
            queryset = queryset.filter(
                Q(part_name__icontains=search_term) |
                Q(part_no__icontains=search_term) |
                Q(moc__icontains=search_term) |
                Q(drawing__icontains=search_term) |
                Q(drawing_vendor__icontains=search_term)
            )
        
        if part_no:
            queryset = queryset.filter(part_no__icontains=part_no)
        
        if moc:
            queryset = queryset.filter(moc__icontains=moc)
        
        if min_price:
            try:
                queryset = queryset.filter(unit_price__gte=float(min_price))
            except ValueError:
                pass
        
        if max_price:
            try:
                queryset = queryset.filter(unit_price__lte=float(max_price))
            except ValueError:
                pass
        
        if availability_min:
            try:
                queryset = queryset.filter(availability__gte=int(availability_min))
            except ValueError:
                pass
        
        queryset = queryset.order_by('part_no')
        
        serializer = InventoryDatabaseSerializer(queryset, many=True)
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'results': serializer.data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error searching inventory: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def bulk_create_inventory(request):
    """Bulk create inventory items from a list"""
    try:
        items_data = request.data.get('items', [])
        
        if not items_data:
            return Response({
                'error': 'No items provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        created_items = []
        errors = []
        
        for index, item_data in enumerate(items_data):
            serializer = InventoryDatabaseSerializer(data=item_data)
            if serializer.is_valid():
                created_item = serializer.save()
                created_items.append(created_item)
            else:
                errors.append({
                    'index': index,
                    'data': item_data,
                    'errors': serializer.errors
                })
        
        response_data = {
            'success': True,
            'created_count': len(created_items),
            'error_count': len(errors),
            'created_items': InventoryDatabaseSerializer(created_items, many=True).data
        }
        
        if errors:
            response_data['errors'] = errors
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error creating inventory items: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_inventory_stats(request):
    """Get inventory statistics"""
    try:
        total_items = InventoryDatabase.objects.count()
        total_value = sum(item.unit_price * item.availability for item in InventoryDatabase.objects.all())
        low_stock_items = InventoryDatabase.objects.filter(availability__lte=5).count()
        out_of_stock_items = InventoryDatabase.objects.filter(availability=0).count()
        
        return Response({
            'success': True,
            'stats': {
                'total_items': total_items,
                'total_value': float(total_value),
                'low_stock_items': low_stock_items,
                'out_of_stock_items': out_of_stock_items
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error getting inventory stats: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def generate_inventory_receipt(request):
    """Generate and download receipt for inventory cart items"""
    from .inventory_receipt_generator import create_inventory_receipt_response
    from django.contrib.auth import authenticate
    
    try:
        cart_items = request.data.get('cart_items', [])
        customer_info = request.data.get('customer_info', {})
        
        if not cart_items:
            return Response({
                'error': 'Cart items are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            email = request.data.get('email')
            password = request.data.get('password')
            if email and password:
                user = authenticate(request, username=email, password=password)
        
        if user and user.is_authenticated:
            customer_info.update({
                'name': user.full_name or user.username,
                'email': user.email,
                'company': getattr(user, 'company_name', ''),
                'address': getattr(user, 'company_address', ''),
                'gst_number': getattr(user, 'gst_number', ''),
                'location': getattr(user, 'location', '')
            })
        
        validated_cart_items = []
        for item in cart_items:
            try:
                if 'id' in item:
                    inventory_item = InventoryDatabase.objects.get(id=item['id'])
                    validated_item = {
                        'partName': inventory_item.part_name,
                        'partNo': inventory_item.part_no,
                        'moc': inventory_item.moc,
                        'unitPrice': float(inventory_item.unit_price),
                        'quantity': int(item.get('quantity', 1)),
                        'uom': inventory_item.uom,
                        'drawing': inventory_item.drawing or 'N/A',
                        'availability': inventory_item.availability
                    }
                else:
                    validated_item = {
                        'partName': item.get('partName', ''),
                        'partNo': item.get('partNo', ''),
                        'moc': item.get('moc', ''),
                        'unitPrice': float(item.get('unitPrice', 0)),
                        'quantity': int(item.get('quantity', 1)),
                        'uom': item.get('uom', 'nos'),
                        'drawing': item.get('drawing', 'N/A'),
                        'availability': item.get('availability', 0)
                    }
                
                validated_cart_items.append(validated_item)
                
            except InventoryDatabase.DoesNotExist:
                return Response({
                    'error': f'Inventory item with ID {item.get("id")} not found'
                }, status=status.HTTP_404_NOT_FOUND)
            except (ValueError, TypeError) as e:
                return Response({
                    'error': f'Invalid data for item: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return create_inventory_receipt_response(validated_cart_items, customer_info)
        
    except Exception as e:
        return Response({
            'error': f'Error generating inventory receipt: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def send_pump_submission_email(submission, additional_docs):
    """Send email notification to company about new pump submission"""
    
    # Company email address
    company_email = 'shrutisin175@gmail.com'
    
    # Email subject
    subject = f'New Pump Submission #{submission.id} - {submission.customer_name}'
    
    # Create HTML email content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #007bff;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }}
            .content {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 0 0 5px 5px;
            }}
            .section {{
                margin-bottom: 20px;
                background-color: white;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }}
            .section-title {{
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
                font-size: 16px;
            }}
            .info-row {{
                display: flex;
                margin-bottom: 8px;
            }}
            .info-label {{
                font-weight: bold;
                width: 120px;
                color: #495057;
            }}
            .info-value {{
                color: #6c757d;
            }}
            .documents {{
                list-style: none;
                padding: 0;
            }}
            .documents li {{
                padding: 5px 0;
                border-bottom: 1px solid #e9ecef;
            }}
            .documents li:before {{
                content: "✓ ";
                color: #28a745;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                color: #6c757d;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h2>New Pump Submission Received</h2>
            <p>Submission ID: #{submission.id}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">Customer Information</div>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{submission.customer_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{submission.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{submission.phone}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Pump Specifications</div>
                <div class="info-row">
                    <span class="info-label">Make:</span>
                    <span class="info-value">{submission.make or 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Model:</span>
                    <span class="info-value">{submission.model or 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Flow:</span>
                    <span class="info-value">{submission.flow or 'Not specified'} m³/hr</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Head:</span>
                    <span class="info-value">{submission.head or 'Not specified'} meters</span>
                </div>
                <div class="info-row">
                    <span class="info-label">BKW:</span>
                    <span class="info-value">{submission.bkw or 'Not specified'} KWH</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Efficiency:</span>
                    <span class="info-value">{submission.efficiency or 'Not specified'}%</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Uploaded Documents</div>
                <ul class="documents">
                    <li>Pump Curve: {'Yes' if submission.pump_curve else 'No'}</li>
                    <li>C/S Drawing with Part List: {'Yes' if submission.cs_drawing else 'No'}</li>
                    {''.join([f'<li>{doc.label}</li>' for doc in additional_docs])}
                </ul>
            </div>
            
            <div class="section">
                <div class="section-title">Submission Details</div>
                <div class="info-row">
                    <span class="info-label">Submitted:</span>
                    <span class="info-value">{submission.created_at.strftime('%Y-%m-%d %H:%M:%S')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">User:</span>
                    <span class="info-value">{submission.user.full_name if submission.user else 'Guest User'}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Shaft & Seal Reverse Engineering Portal</p>
            <p>Please review the submission and contact the customer for next steps.</p>
        </div>
    </body>
    </html>
    """
    
    # Create plain text version
    text_content = f"""
    New Pump Submission Received
    
    Submission ID: #{submission.id}
    Customer: {submission.customer_name}
    Email: {submission.email}
    Phone: {submission.phone}
    
    Pump Specifications:
    - Make: {submission.make or 'Not specified'}
    - Model: {submission.model or 'Not specified'}
    - Flow: {submission.flow or 'Not specified'} m³/hr
    - Head: {submission.head or 'Not specified'} meters
    - BKW: {submission.bkw or 'Not specified'} KWH
    - Efficiency: {submission.efficiency or 'Not specified'}%
    
    Documents Uploaded:
    - Pump Curve: {'Yes' if submission.pump_curve else 'No'}
    - C/S Drawing: {'Yes' if submission.cs_drawing else 'No'}
    {chr(10).join([f'- {doc.label}' for doc in additional_docs])}
    
    Submitted: {submission.created_at.strftime('%Y-%m-%d %H:%M:%S')}
    User: {submission.user.full_name if submission.user else 'Guest User'}
    
    ---
    This is an automated notification from Shaft & Seal Reverse Engineering Portal
    """
    
    # Send email
    try:
        print(f"Attempting to send email for submission #{submission.id}")
        print(f"From: {settings.DEFAULT_FROM_EMAIL}")
        print(f"To: {company_email}")
        print(f"Subject: {subject}")
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[company_email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        result = msg.send()
        print(f"Email send result: {result}")
        print(f"Email sent successfully for submission #{submission.id}")
        
    except Exception as e:
        print(f"Failed to send email for submission #{submission.id}: {str(e)}")
        print(f"Email error type: {type(e)}")
        import traceback
        traceback.print_exc()
        # Don't raise the error to avoid breaking the submission


@api_view(['GET', 'POST'])
def test_email(request):
    """Test email functionality"""
    try:
        from django.core.mail import send_mail
        
        subject = 'Test Email from Shaft & Seal'
        message = 'This is a test email to verify email configuration.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = ['shrutisin175@gmail.com']
        
        print(f"Sending test email from {from_email} to {recipient_list}")
        
        result = send_mail(subject, message, from_email, recipient_list)
        
        return Response({
            'success': True,
            'message': f'Test email sent successfully. Result: {result}',
            'from': from_email,
            'to': recipient_list
        })
        
    except Exception as e:
        print(f"Test email failed: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'success': False,
            'error': f'Test email failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Import SRC calculation function
from .src_calculations import calculate_src_curves as calculate_src_curves_api

@api_view(['POST'])
@csrf_exempt
def calculate_src_curves(request):
    """
    API endpoint to calculate SRC curves
    """
    return calculate_src_curves_api(request)