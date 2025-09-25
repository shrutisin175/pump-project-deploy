"""
SRC Curve Calculation API
Handles calculation of k1, k2 and SRC curves for pump analysis
"""

import json
import math
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import pandas as pd
import numpy as np
from decimal import Decimal


@csrf_exempt
@require_http_methods(["POST"])
def calculate_src_curves(request):
    """
    Calculate SRC curves based on input parameters
    
    Expected parameters:
    - shValue: Shutoff head value
    - qnp: Nominal flow
    - hnp: Nominal head  
    - qact: Actual flow
    - hact: Actual head
    - qhFile: Optional Q-H curve file
    """
    try:
        # Extract parameters from request
        sh_value = float(request.POST.get('shValue', 0))
        qnp = float(request.POST.get('qnp', 0))
        hnp = float(request.POST.get('hnp', 0))
        qact = float(request.POST.get('qact', 0))
        hact = float(request.POST.get('hact', 0))
        
        # Validate required parameters
        if not all([sh_value, qnp, hnp, qact, hact]):
            return JsonResponse({
                'error': 'Missing required parameters: shValue, qnp, hnp, qact, hact'
            }, status=400)
        
        # Calculate k1 = (Hnp - SH) / Qnp²
        if qnp == 0:
            return JsonResponse({'error': 'Qnp cannot be zero'}, status=400)
        
        k1 = (hnp - sh_value) / (qnp * qnp)
        
        # Calculate k2 = (Hact - SH) / Qact²  
        if qact == 0:
            return JsonResponse({'error': 'Qact cannot be zero'}, status=400)
        
        k2 = (hact - sh_value) / (qact * qact)
        
        # Generate SRC curve data points
        # Create flow range from 0 to max(Qnp, Qact) * 1.2
        max_flow = max(qnp, qact) * 1.2
        flow_points = np.linspace(0, max_flow, 20)
        
        # Calculate Theoretical SRC curve: SRC = SH + k1 * Qi²
        theoretical_src = []
        for qi in flow_points:
            src_value = sh_value + k1 * (qi * qi)
            theoretical_src.append({
                'q': float(qi),
                'src': float(src_value)
            })
        
        # Calculate Actual SRC curve: SRC = SH + k2 * Qi²
        actual_src = []
        for qi in flow_points:
            src_value = sh_value + k2 * (qi * qi)
            actual_src.append({
                'q': float(qi),
                'src': float(src_value)
            })
        
        # Process Q-H curve file if provided
        qh_curve_data = None
        if 'qhFile' in request.FILES:
            try:
                qh_file = request.FILES['qhFile']
                qh_curve_data = process_qh_file(qh_file)
            except Exception as e:
                print(f"Error processing Q-H file: {e}")
                # Continue without file data
        
        # Prepare response
        response_data = {
            'success': True,
            'qnp': qnp,
            'hnp': hnp,
            'k1': float(k1),
            'k2': float(k2),
            'theoreticalSRC': theoretical_src,
            'actualSRC': actual_src,
            'flowPoints': [float(q) for q in flow_points],
            'qhCurveData': qh_curve_data,
            'operatingPoint': {
                'qact': qact,
                'hact': hact
            }
        }
        
        return JsonResponse(response_data)
        
    except ValueError as e:
        return JsonResponse({
            'error': f'Invalid parameter values: {str(e)}'
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'error': f'Calculation error: {str(e)}'
        }, status=500)


def process_qh_file(file):
    """
    Process uploaded Q-H curve file to extract curve data
    """
    try:
        # Read Excel file
        if file.name.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        elif file.name.endswith('.csv'):
            df = pd.read_csv(file)
        else:
            raise ValueError("Unsupported file format")
        
        # Assume first two columns are Q and H
        if len(df.columns) < 2:
            raise ValueError("File must have at least 2 columns (Q and H)")
        
        q_values = df.iloc[:, 0].values  # First column
        h_values = df.iloc[:, 1].values  # Second column
        
        # Convert to list of dictionaries
        curve_data = []
        for q, h in zip(q_values, h_values):
            if not pd.isna(q) and not pd.isna(h):
                curve_data.append({
                    'q': float(q),
                    'h': float(h)
                })
        
        return curve_data
        
    except Exception as e:
        print(f"Error processing Q-H file: {e}")
        return None


def calculate_src_at_flow(sh_value, k_value, flow):
    """
    Calculate SRC value at specific flow rate
    SRC = SH + k * Q²
    """
    return sh_value + k_value * (flow * flow)


def generate_src_curve_points(sh_value, k_value, flow_range):
    """
    Generate SRC curve points for given flow range
    """
    src_points = []
    for flow in flow_range:
        src_value = calculate_src_at_flow(sh_value, k_value, flow)
        src_points.append({
            'q': float(flow),
            'src': float(src_value)
        })
    
    return src_points





