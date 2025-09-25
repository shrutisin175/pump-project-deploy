"""
Q-H Curve Processing Service
Handles Excel file uploads and generates System Resistance Curves (SRC)
Based on the provided Tkinter code logic
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Optional
import io
import base64
from django.core.files.uploadedfile import UploadedFile


class QHCurveProcessor:
    """
    Processes Q-H curve data from Excel files and generates System Resistance Curves
    """
    
    def __init__(self):
        """Initialize the processor"""
        self.gravity = 9.81  # m/s²
        self.water_density = 1000  # kg/m³
    
    def process_qh_curve(self, excel_file: UploadedFile, process_params: Dict) -> Dict:
        """
        Process Q-H curve from Excel file and generate SRC
        
        Args:
            excel_file: Uploaded Excel file containing Q-H data
            process_params: Dictionary containing process parameters
            
        Returns:
            Dictionary containing processed data and plot
        """
        try:
            # Read Excel file
            df = pd.read_excel(excel_file)
            
            if df.shape[1] < 2:
                return {"error": "Excel must have at least 2 columns (Q and H)"}
            
            # Extract Q and H data
            Q = df.iloc[:, 0].dropna().tolist()
            H = df.iloc[:, 1].dropna().tolist()
            
            if len(Q) != len(H):
                return {"error": "Mismatch between Q and H data length"}
            
            # Calculate process parameters
            h1 = float(process_params.get('da_tank_height', 0))  # DA tank height (m)
            h2 = float(process_params.get('boiler_drum_height', 0))  # Boiler drum height (m)
            P1 = float(process_params.get('da_tank_pressure', 0))  # DA tank pressure (Kg/cm²)
            P2 = float(process_params.get('boiler_drum_pressure', 0))  # Boiler drum pressure (Kg/cm²)
            SG = float(process_params.get('specific_gravity', 1.0))  # Specific gravity
            Qnp = float(process_params.get('flow_qnp', 0))  # Nameplate flow (m³/hr)
            Hnp = float(process_params.get('head_hnp', 0))  # Nameplate head (m)
            
            # Calculate Static Head
            static_head = (h2 - h1) + ((P2 - P1) * 10 / SG)
            
            # Calculate k1 factor for SRC
            k1 = (Hnp - static_head) / (Qnp ** 2) if Qnp > 0 else 0
            
            # Generate SRC curve points
            Qi = np.arange(0, Qnp + 1, 5)
            SRC = static_head + k1 * (Qi ** 2)
            
            # Generate plot
            plot_data = self._generate_qh_src_plot(Q, H, Qi.tolist(), SRC.tolist())
            
            return {
                'success': True,
                'pump_curve': {
                    'Q': Q,
                    'H': H
                },
                'src_curve': {
                    'Q': Qi.tolist(),
                    'H': SRC.tolist()
                },
                'parameters': {
                    'static_head': static_head,
                    'k1_factor': k1,
                    'h1': h1,
                    'h2': h2,
                    'P1': P1,
                    'P2': P2,
                    'SG': SG,
                    'Qnp': Qnp,
                    'Hnp': Hnp
                },
                'plot': plot_data
            }
            
        except Exception as e:
            return {"error": f"Processing failed: {str(e)}"}
    
    def _generate_qh_src_plot(self, Q: List[float], H: List[float], 
                             Qi: List[float], SRC: List[float]) -> str:
        """
        Generate Q-H vs SRC plot and return as base64 string
        
        Args:
            Q: Pump curve flow points
            H: Pump curve head points
            Qi: SRC flow points
            SRC: SRC head points
            
        Returns:
            Base64 encoded plot image
        """
        try:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            # Plot pump curve
            ax.plot(Q, H, marker="o", linestyle="-", color="blue", 
                   linewidth=2, markersize=6, label="Pump Q-H Curve")
            
            # Plot SRC curve
            ax.plot(Qi, SRC, marker="s", linestyle="--", color="red", 
                   linewidth=2, markersize=6, label="System Resistance Curve (SRC)")
            
            # Find intersection point
            intersection = self._find_intersection(Q, H, Qi, SRC)
            if intersection:
                ax.plot(intersection['Q'], intersection['H'], 'go', 
                       markersize=10, label=f"Operating Point (Q={intersection['Q']:.1f}, H={intersection['H']:.1f})")
            
            ax.set_title("Pump Curve vs System Resistance Curve", fontsize=14, fontweight='bold')
            ax.set_xlabel("Flow (Q) [m³/hr]", fontsize=12)
            ax.set_ylabel("Head (H) [m]", fontsize=12)
            ax.grid(True, alpha=0.3)
            ax.legend(fontsize=11)
            
            # Convert to base64
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close(fig)
            
            return image_base64
            
        except Exception as e:
            print(f"Error generating plot: {str(e)}")
            return ""
    
    def _find_intersection(self, Q: List[float], H: List[float], 
                          Qi: List[float], SRC: List[float]) -> Optional[Dict]:
        """
        Find intersection point between pump curve and SRC
        
        Args:
            Q: Pump curve flow points
            H: Pump curve head points
            Qi: SRC flow points
            SRC: SRC head points
            
        Returns:
            Dictionary with intersection point or None
        """
        try:
            # Interpolate both curves to find intersection
            Q_interp = np.linspace(min(min(Q), min(Qi)), max(max(Q), max(Qi)), 1000)
            
            # Interpolate pump curve
            H_pump_interp = np.interp(Q_interp, Q, H)
            
            # Interpolate SRC curve
            H_src_interp = np.interp(Q_interp, Qi, SRC)
            
            # Find intersection
            diff = np.abs(H_pump_interp - H_src_interp)
            min_diff_idx = np.argmin(diff)
            
            if diff[min_diff_idx] < 1.0:  # Within 1m tolerance
                return {
                    'Q': float(Q_interp[min_diff_idx]),
                    'H': float(H_pump_interp[min_diff_idx])
                }
            
            return None
            
        except Exception as e:
            print(f"Error finding intersection: {str(e)}")
            return None
    
    def generate_multiple_src_curves(self, process_params: Dict) -> Dict:
        """
        Generate multiple SRC curves for different scenarios
        
        Args:
            process_params: Process parameters
            
        Returns:
            Dictionary containing multiple SRC curves
        """
        try:
            h1 = float(process_params.get('da_tank_height', 0))
            h2 = float(process_params.get('boiler_drum_height', 0))
            P1 = float(process_params.get('da_tank_pressure', 0))
            P2 = float(process_params.get('boiler_drum_pressure', 0))
            SG = float(process_params.get('specific_gravity', 1.0))
            Qnp = float(process_params.get('flow_qnp', 0))
            Hnp = float(process_params.get('head_hnp', 0))
            
            # Base static head
            static_head = (h2 - h1) + ((P2 - P1) * 10 / SG)
            
            # Generate flow points
            Qi = np.arange(0, Qnp * 1.2, 5)
            
            # SRC1: Base system resistance
            k1 = (Hnp - static_head) / (Qnp ** 2) if Qnp > 0 else 0
            SRC1 = static_head + k1 * (Qi ** 2)
            
            # SRC2: Higher system resistance (valve throttling)
            k2 = k1 * 1.2
            SRC2 = static_head + k2 * (Qi ** 2)
            
            # SRC3: Lower system resistance (optimized system)
            k3 = k1 * 0.8
            SRC3 = static_head + k3 * (Qi ** 2)
            
            return {
                'success': True,
                'flow_points': Qi.tolist(),
                'src1': SRC1.tolist(),
                'src2': SRC2.tolist(),
                'src3': SRC3.tolist(),
                'parameters': {
                    'static_head': static_head,
                    'k1': k1,
                    'k2': k2,
                    'k3': k3
                }
            }
            
        except Exception as e:
            return {"error": f"Failed to generate SRC curves: {str(e)}"}


def process_qh_curve_file(excel_file: UploadedFile, process_params: Dict) -> Dict:
    """
    Main function to process Q-H curve file
    
    Args:
        excel_file: Uploaded Excel file
        process_params: Process parameters
        
    Returns:
        Processed data and plots
    """
    processor = QHCurveProcessor()
    return processor.process_qh_curve(excel_file, process_params)


def generate_src_curves(process_params: Dict) -> Dict:
    """
    Generate System Resistance Curves for different scenarios
    
    Args:
        process_params: Process parameters
        
    Returns:
        SRC curves data
    """
    processor = QHCurveProcessor()
    return processor.generate_multiple_src_curves(process_params)
