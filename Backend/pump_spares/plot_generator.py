"""
Plot Generation Service for Energy Optimization
Generates all 10 required plots using matplotlib and returns base64 encoded images
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Rectangle
import numpy as np
import base64
import io
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import json


class EnergyOptimizationPlotGenerator:
    """
    Generates all plots for energy optimization analysis
    """
    
    def __init__(self):
        """Initialize plot generator with styling"""
        plt.style.use('default')
        self.colors = {
            'primary': '#1f77b4',
            'secondary': '#ff7f0e',
            'success': '#2ca02c',
            'danger': '#d62728',
            'warning': '#ff7f0e',
            'info': '#17a2b8',
            'light': '#f8f9fa',
            'dark': '#343a40'
        }
        
    def generate_all_plots(self, calculation_results: Dict) -> Dict:
        """
        Generate all 10 plots and return as base64 encoded images
        
        Args:
            calculation_results: Results from energy optimization calculations
            
        Returns:
            Dictionary containing base64 encoded plot images
        """
        plots = {}
        
        try:
            # Plot 1: Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)
            plots['plot1'] = self._generate_plot1(calculation_results.get('plot1_data', {}))
            
            # Plot 2: Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)
            plots['plot2'] = self._generate_plot2(calculation_results.get('plot2_data', {}))
            
            # Plot 3: Qreq–Hreq Curve with SRC (modified/replacement pump Curve)
            plots['plot3'] = self._generate_plot3(calculation_results.get('plot3_data', {}))
            
            # Plot 4: Efficiency (Eff1 vs Eff2)
            plots['plot4'] = self._generate_plot4(calculation_results.get('plot4_data', {}))
            
            # Plot 5: BKW1, BKW2, and Saving vs Time (days)
            plots['plot5'] = self._generate_plot5(calculation_results.get('plot5_data', {}))
            
            # Plot 6: Power Consumption (Before, After) and Saving vs Time (days)
            plots['plot6'] = self._generate_plot6(calculation_results.get('plot6_data', {}))
            
            # Plot 7: Cost of Pump Running (Before, After) vs Time (days)
            plots['plot7'] = self._generate_plot7(calculation_results.get('plot7_data', {}))
            
            # Plot 8: Money Saved vs Time (days) with Investment Cost Curve
            plots['plot8'] = self._generate_plot8(calculation_results.get('plot8_data', {}))
            
            # Plot 9: Number of Trees Saved vs Time (days)
            plots['plot9'] = self._generate_plot9(calculation_results.get('plot9_data', {}))
            
            # Plot 10: CO₂ Reduction (kg) vs Time (days)
            plots['plot10'] = self._generate_plot10(calculation_results.get('plot10_data', {}))
            
        except Exception as e:
            print(f"Error generating plots: {str(e)}")
            plots['error'] = str(e)
        
        return plots
    
    def _plot_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = io.BytesIO()
        fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close(fig)
        return image_base64
    
    def _generate_plot1(self, data: Dict) -> str:
        """Generate Plot 1: Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)"""
        try:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            q_points = data.get('q_points', [])
            h_points = data.get('h_points', [])
            rated_point = data.get('rated_point', {})
            
            # Main pump curve
            ax.plot(q_points, h_points, 'b-', linewidth=2, label='Pump Curve (N1=N2)')
            
            # Rated point
            if rated_point:
                ax.plot(rated_point['q'], rated_point['h'], 'ro', markersize=8, label='Rated Point')
            
            # System resistance curves (SRC1 & SRC2)
            if q_points:
                max_q = max(q_points)
                q_src = np.linspace(0, max_q, 50)
                # SRC1: H = k * Q^2 (typical system curve)
                k1 = rated_point['h'] / (rated_point['q']**2) if rated_point.get('q', 0) > 0 else 0.1
                h_src1 = k1 * q_src**2
                ax.plot(q_src, h_src1, 'g--', linewidth=2, label='SRC1')
                
                # SRC2: Different system resistance
                k2 = k1 * 1.2
                h_src2 = k2 * q_src**2
                ax.plot(q_src, h_src2, 'r--', linewidth=2, label='SRC2')
            
            ax.set_xlabel('Flow Rate (m³/hr)', fontsize=12)
            ax.set_ylabel('Head (m)', fontsize=12)
            ax.set_title('Plot 1: Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)', fontsize=14, fontweight='bold')
            ax.grid(True, alpha=0.3)
            ax.legend()
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 1: {str(e)}")
            return ""
    
    def _generate_plot2(self, data: Dict) -> str:
        """Generate Plot 2: Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)"""
        try:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            q_points_n1 = data.get('q_points_n1', [])
            h_points_n1 = data.get('h_points_n1', [])
            q_points_n2 = data.get('q_points_n2', [])
            h_points_n2 = data.get('h_points_n2', [])
            
            # Original speed curve
            ax.plot(q_points_n1, h_points_n1, 'b-', linewidth=2, label='Pump Curve (N1)')
            
            # Different speed curve
            ax.plot(q_points_n2, h_points_n2, 'r-', linewidth=2, label='Pump Curve (N2)')
            
            # System resistance curves
            if q_points_n1:
                max_q = max(q_points_n1)
                q_src = np.linspace(0, max_q, 50)
                k1 = h_points_n1[0] / (q_points_n1[0]**2) if q_points_n1[0] > 0 else 0.1
                h_src1 = k1 * q_src**2
                ax.plot(q_src, h_src1, 'g--', linewidth=2, label='SRC1')
                
                k3 = k1 * 0.8
                h_src3 = k3 * q_src**2
                ax.plot(q_src, h_src3, 'm--', linewidth=2, label='SRC3')
            
            ax.set_xlabel('Flow Rate (m³/hr)', fontsize=12)
            ax.set_ylabel('Head (m)', fontsize=12)
            ax.set_title('Plot 2: Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)', fontsize=14, fontweight='bold')
            ax.grid(True, alpha=0.3)
            ax.legend()
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 2: {str(e)}")
            return ""
    
    def _generate_plot3(self, data: Dict) -> str:
        """Generate Plot 3: Qreq–Hreq Curve with SRC (modified/replacement pump Curve)"""
        try:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            q_points_req = data.get('q_points_req', [])
            h_points_req = data.get('h_points_req', [])
            q_points_mod = data.get('q_points_mod', [])
            h_points_mod = data.get('h_points_mod', [])
            duty_point = data.get('duty_point', {})
            
            # Required duty curve
            ax.plot(q_points_req, h_points_req, 'g-', linewidth=2, label='Required Duty Curve')
            
            # Modified pump curve
            ax.plot(q_points_mod, h_points_mod, 'b-', linewidth=2, label='Modified Pump Curve')
            
            # Duty point
            if duty_point:
                ax.plot(duty_point['q'], duty_point['h'], 'ro', markersize=8, label='Duty Point')
            
            # System resistance curve
            if q_points_req:
                max_q = max(q_points_req)
                q_src = np.linspace(0, max_q, 50)
                k = duty_point['h'] / (duty_point['q']**2) if duty_point.get('q', 0) > 0 else 0.1
                h_src = k * q_src**2
                ax.plot(q_src, h_src, 'r--', linewidth=2, label='SRC')
            
            ax.set_xlabel('Flow Rate (m³/hr)', fontsize=12)
            ax.set_ylabel('Head (m)', fontsize=12)
            ax.set_title('Plot 3: Qreq–Hreq Curve with SRC (modified/replacement pump Curve)', fontsize=14, fontweight='bold')
            ax.grid(True, alpha=0.3)
            ax.legend()
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 3: {str(e)}")
            return ""
    
    def _generate_plot4(self, data: Dict) -> str:
        """Generate Plot 4: Efficiency (Eff1 vs Eff2)"""
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            
            efficiency_before = data.get('efficiency_before', 0)
            efficiency_after = data.get('efficiency_after', 0)
            improvement = data.get('improvement', 0)
            
            # Create histogram bars
            categories = ['Before\nOptimization', 'After\nOptimization']
            values = [efficiency_before, efficiency_after]
            colors = [self.colors['danger'], self.colors['success']]
            
            bars = ax.bar(categories, values, color=colors, alpha=0.7, edgecolor='black', linewidth=1)
            
            # Add value labels on bars
            for bar, value in zip(bars, values):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                       f'{value:.1f}%', ha='center', va='bottom', fontweight='bold')
            
            # Add improvement arrow
            if improvement > 0:
                ax.annotate(f'Improvement: +{improvement:.1f}%', 
                           xy=(1, efficiency_after), xytext=(0.5, max(values) + 5),
                           arrowprops=dict(arrowstyle='->', color='green', lw=2),
                           fontsize=12, ha='center', color='green', fontweight='bold')
            
            ax.set_ylabel('Efficiency (%)', fontsize=12)
            ax.set_title('Plot 4: Efficiency (Eff1 vs Eff2)', fontsize=14, fontweight='bold')
            ax.set_ylim(0, max(values) + 10)
            ax.grid(True, alpha=0.3, axis='y')
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 4: {str(e)}")
            return ""
    
    def _generate_plot5(self, data: Dict) -> str:
        """Generate Plot 5: BKW1, BKW2, and Saving vs Time (days)"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            bkw1 = data.get('bkw1', [])
            bkw2 = data.get('bkw2', [])
            saving = data.get('saving', [])
            
            # Plot power consumption
            ax.plot(days, bkw1, 'r-', linewidth=2, label='BKW1 (Before)', alpha=0.8)
            ax.plot(days, bkw2, 'g-', linewidth=2, label='BKW2 (After)', alpha=0.8)
            
            # Create second y-axis for savings
            ax2 = ax.twinx()
            ax2.plot(days, saving, 'b-', linewidth=2, label='Power Saving', alpha=0.8)
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Power Consumption (kW)', fontsize=12, color='black')
            ax2.set_ylabel('Power Saving (kW)', fontsize=12, color='blue')
            ax.set_title('Plot 5: BKW1, BKW2, and Saving vs Time (days)', fontsize=14, fontweight='bold')
            
            # Combine legends
            lines1, labels1 = ax.get_legend_handles_labels()
            lines2, labels2 = ax2.get_legend_handles_labels()
            ax.legend(lines1 + lines2, labels1 + labels2, loc='upper right')
            
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 5: {str(e)}")
            return ""
    
    def _generate_plot6(self, data: Dict) -> str:
        """Generate Plot 6: Power Consumption (Before, After) and Saving vs Time (days)"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            consumption_before = data.get('consumption_before', [])
            consumption_after = data.get('consumption_after', [])
            saving_cumulative = data.get('saving_cumulative', [])
            
            # Plot consumption
            ax.plot(days, consumption_before, 'r-', linewidth=2, label='Power Consumption (Before)', alpha=0.8)
            ax.plot(days, consumption_after, 'g-', linewidth=2, label='Power Consumption (After)', alpha=0.8)
            
            # Create second y-axis for cumulative savings
            ax2 = ax.twinx()
            ax2.plot(days, saving_cumulative, 'b-', linewidth=2, label='Cumulative Energy Saving', alpha=0.8)
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Daily Power Consumption (kWh)', fontsize=12, color='black')
            ax2.set_ylabel('Cumulative Energy Saving (kWh)', fontsize=12, color='blue')
            ax.set_title('Plot 6: Power Consumption (Before, After) and Saving vs Time (days)', fontsize=14, fontweight='bold')
            
            # Combine legends
            lines1, labels1 = ax.get_legend_handles_labels()
            lines2, labels2 = ax2.get_legend_handles_labels()
            ax.legend(lines1 + lines2, labels1 + labels2, loc='upper right')
            
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 6: {str(e)}")
            return ""
    
    def _generate_plot7(self, data: Dict) -> str:
        """Generate Plot 7: Cost of Pump Running (Before, After) vs Time (days)"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            cost_before = data.get('cost_before', [])
            cost_after = data.get('cost_after', [])
            
            # Plot costs
            ax.plot(days, cost_before, 'r-', linewidth=2, label='Cost Before Optimization', alpha=0.8)
            ax.plot(days, cost_after, 'g-', linewidth=2, label='Cost After Optimization', alpha=0.8)
            
            # Fill area between curves to show savings
            ax.fill_between(days, cost_after, cost_before, alpha=0.3, color='green', label='Cost Savings')
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Daily Operating Cost ($)', fontsize=12)
            ax.set_title('Plot 7: Cost of Pump Running (Before, After) vs Time (days)', fontsize=14, fontweight='bold')
            ax.legend()
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 7: {str(e)}")
            return ""
    
    def _generate_plot8(self, data: Dict) -> str:
        """Generate Plot 8: Money Saved vs Time (days) with Investment Cost Curve"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            cumulative_savings = data.get('cumulative_savings', [])
            investment_line = data.get('investment_line', [])
            break_even_point = data.get('break_even_point', {})
            
            # Plot cumulative savings
            ax.plot(days, cumulative_savings, 'g-', linewidth=3, label='Cumulative Savings', alpha=0.8)
            
            # Plot investment line
            ax.plot(days, investment_line, 'r--', linewidth=2, label='Investment Cost', alpha=0.8)
            
            # Mark break-even point
            if break_even_point:
                payback_day = break_even_point['day']
                investment_amount = break_even_point['amount']
                
                # Vertical line at break-even point
                ax.axvline(x=payback_day, color='orange', linestyle=':', linewidth=2, alpha=0.8)
                ax.plot(payback_day, investment_amount, 'ro', markersize=10, label='Break-Even Point')
                
                # Add annotation
                ax.annotate(f'Payback: {payback_day:.0f} days', 
                           xy=(payback_day, investment_amount), 
                           xytext=(payback_day + 30, investment_amount + 5000),
                           arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                           fontsize=12, ha='center', color='orange', fontweight='bold')
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Cumulative Amount ($)', fontsize=12)
            ax.set_title('Plot 8: Money Saved vs Time (days) with Investment Cost Curve', fontsize=14, fontweight='bold')
            ax.legend()
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 8: {str(e)}")
            return ""
    
    def _generate_plot9(self, data: Dict) -> str:
        """Generate Plot 9: Number of Trees Saved vs Time (days)"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            cumulative_trees = data.get('cumulative_trees', [])
            daily_trees = data.get('daily_trees', [])
            
            # Plot cumulative trees saved
            ax.plot(days, cumulative_trees, 'g-', linewidth=3, label='Cumulative Trees Saved', alpha=0.8)
            
            # Add daily trees as bar chart (secondary)
            ax2 = ax.twinx()
            ax2.bar(days[::30], daily_trees[::30], alpha=0.3, color='lightgreen', width=20, label='Daily Trees Saved')
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Cumulative Trees Saved', fontsize=12, color='green')
            ax2.set_ylabel('Daily Trees Saved', fontsize=12, color='lightgreen')
            ax.set_title('Plot 9: Number of Trees Saved vs Time (days)', fontsize=14, fontweight='bold')
            
            # Combine legends
            lines1, labels1 = ax.get_legend_handles_labels()
            lines2, labels2 = ax2.get_legend_handles_labels()
            ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
            
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 9: {str(e)}")
            return ""
    
    def _generate_plot10(self, data: Dict) -> str:
        """Generate Plot 10: CO₂ Reduction (kg) vs Time (days)"""
        try:
            fig, ax = plt.subplots(figsize=(12, 8))
            
            days = data.get('days', [])
            cumulative_co2 = data.get('cumulative_co2', [])
            daily_co2 = data.get('daily_co2', [])
            
            # Plot cumulative CO2 reduction
            ax.plot(days, cumulative_co2, 'b-', linewidth=3, label='Cumulative CO₂ Reduction', alpha=0.8)
            
            # Add daily CO2 as bar chart (secondary)
            ax2 = ax.twinx()
            ax2.bar(days[::30], daily_co2[::30], alpha=0.3, color='lightblue', width=20, label='Daily CO₂ Reduction')
            
            ax.set_xlabel('Time (days)', fontsize=12)
            ax.set_ylabel('Cumulative CO₂ Reduction (kg)', fontsize=12, color='blue')
            ax2.set_ylabel('Daily CO₂ Reduction (kg)', fontsize=12, color='lightblue')
            ax.set_title('Plot 10: CO₂ Reduction (kg) vs Time (days)', fontsize=14, fontweight='bold')
            
            # Combine legends
            lines1, labels1 = ax.get_legend_handles_labels()
            lines2, labels2 = ax2.get_legend_handles_labels()
            ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
            
            ax.grid(True, alpha=0.3)
            
            return self._plot_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating plot 10: {str(e)}")
            return ""


def generate_energy_optimization_plots(calculation_results: Dict) -> Dict:
    """
    Main function to generate all energy optimization plots
    
    Args:
        calculation_results: Results from energy optimization calculations
        
    Returns:
        Dictionary containing base64 encoded plot images
    """
    generator = EnergyOptimizationPlotGenerator()
    return generator.generate_all_plots(calculation_results)
