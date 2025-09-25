"""
Energy Optimization Calculation Engine
Handles all calculations for pump energy optimization analysis
"""

import math
from decimal import Decimal
from typing import Dict, List, Tuple, Optional
import pandas as pd
import numpy as np


class EnergyOptimizationCalculator:
    """
    Main calculator class for energy optimization analysis
    """
    
    def __init__(self, submission_data: Dict):
        """
        Initialize calculator with submission data
        
        Args:
            submission_data: Dictionary containing all form data
        """
        self.data = submission_data
        self.results = {}
        
        # Constants for calculations
        self.GRAVITY = 9.81  # m/s²
        self.WATER_DENSITY = 1000  # kg/m³
        self.KWH_TO_TREES = 0.04  # 1 kWh = 0.04 trees
        self.KWH_TO_CO2_MIN = 0.5  # kg CO2 per kWh (minimum)
        self.KWH_TO_CO2_MAX = 0.9  # kg CO2 per kWh (maximum)
        self.KWH_TO_CO2_AVG = 0.7  # kg CO2 per kWh (average)
        
    def calculate_all(self) -> Dict:
        """
        Perform all energy optimization calculations
        
        Returns:
            Dictionary containing all calculation results
        """
        try:
            # Basic calculations
            self._calculate_pump_efficiency()
            self._calculate_head_developed()
            self._calculate_power_requirements()
            self._calculate_energy_savings()
            self._calculate_cost_savings()
            self._calculate_environmental_impact()
            self._calculate_payback_period()
            
            # Generate plot data
            self._generate_plot_data()
            
            return self.results
            
        except Exception as e:
            print(f"Error in calculations: {str(e)}")
            return {"error": str(e)}
    
    def _calculate_pump_efficiency(self):
        """Calculate pump efficiency before and after optimization"""
        try:
            # Current efficiency (from actual measurements)
            q_act = float(self.data.get('actual_flow_required', 0))
            h_act = self._calculate_head_developed()
            sg = float(self.data.get('specific_gravity', 1.0))
            power_actual = float(self.data.get('actual_power_consumption', 0))
            
            if q_act > 0 and power_actual > 0:
                # Hydraulic power = (Q × H × ρ × g) / 1000
                hydraulic_power = (q_act * h_act * sg * self.WATER_DENSITY * self.GRAVITY) / 1000
                efficiency_before = (hydraulic_power / power_actual) * 100
            else:
                efficiency_before = float(self.data.get('efficiency', 0))
            
            # Optimized efficiency (estimated improvement)
            efficiency_after = min(efficiency_before * 1.15, 85)  # Max 15% improvement, cap at 85%
            
            self.results['efficiency_before'] = round(efficiency_before, 2)
            self.results['efficiency_after'] = round(efficiency_after, 2)
            
        except Exception as e:
            print(f"Error calculating efficiency: {str(e)}")
            self.results['efficiency_before'] = 0
            self.results['efficiency_after'] = 0
    
    def _calculate_head_developed(self) -> float:
        """Calculate total dynamic head developed"""
        try:
            h1 = float(self.data.get('da_tank_height', 0))
            h2 = float(self.data.get('boiler_drum_height', 0))
            p1 = float(self.data.get('da_tank_pressure', 0))
            p2 = float(self.data.get('boiler_drum_pressure', 0))
            sg = float(self.data.get('specific_gravity', 1.0))
            
            # Static head
            static_head = h2 - h1
            
            # Pressure head difference
            pressure_head = ((p2 - p1) * 10) / (sg * self.GRAVITY)  # Convert kg/cm² to meters
            
            # Total head
            total_head = static_head + pressure_head
            
            self.results['head_developed'] = round(total_head, 2)
            return total_head
            
        except Exception as e:
            print(f"Error calculating head: {str(e)}")
            return 0
    
    def _calculate_power_requirements(self):
        """Calculate power requirements before and after optimization"""
        try:
            q_act = float(self.data.get('actual_flow_required', 0))
            h_act = self.results.get('head_developed', 0)
            sg = float(self.data.get('specific_gravity', 1.0))
            
            efficiency_before = self.results.get('efficiency_before', 0)
            efficiency_after = self.results.get('efficiency_after', 0)
            
            if q_act > 0 and h_act > 0:
                # Hydraulic power
                hydraulic_power = (q_act * h_act * sg * self.WATER_DENSITY * self.GRAVITY) / 1000
                
                # Brake power before optimization
                if efficiency_before > 0:
                    power_before = hydraulic_power / (efficiency_before / 100)
                else:
                    power_before = float(self.data.get('actual_power_consumption', 0))
                
                # Brake power after optimization
                if efficiency_after > 0:
                    power_after = hydraulic_power / (efficiency_after / 100)
                else:
                    power_after = power_before
                
                self.results['power_before'] = round(power_before, 2)
                self.results['power_after'] = round(power_after, 2)
                self.results['power_saving'] = round(power_before - power_after, 2)
                
        except Exception as e:
            print(f"Error calculating power requirements: {str(e)}")
            self.results['power_before'] = 0
            self.results['power_after'] = 0
            self.results['power_saving'] = 0
    
    def _calculate_energy_savings(self):
        """Calculate daily energy savings"""
        try:
            power_saving = self.results.get('power_saving', 0)
            
            # Daily energy saving (assuming 24/7 operation)
            daily_energy_saving = power_saving * 24  # kWh per day
            
            # Annual energy saving
            annual_energy_saving = daily_energy_saving * 365  # kWh per year
            
            self.results['daily_energy_saving'] = round(daily_energy_saving, 2)
            self.results['annual_energy_saving'] = round(annual_energy_saving, 2)
            
        except Exception as e:
            print(f"Error calculating energy savings: {str(e)}")
            self.results['daily_energy_saving'] = 0
            self.results['annual_energy_saving'] = 0
    
    def _calculate_cost_savings(self):
        """Calculate cost savings"""
        try:
            daily_energy_saving = self.results.get('daily_energy_saving', 0)
            
            # Cost per kWh (can be made configurable)
            cost_per_kwh = 0.12  # $0.12 per kWh (example rate)
            
            # Daily cost saving
            daily_cost_saving = daily_energy_saving * cost_per_kwh
            
            # Annual cost saving
            annual_cost_saving = daily_cost_saving * 365
            
            self.results['cost_per_kwh'] = cost_per_kwh
            self.results['daily_cost_saving'] = round(daily_cost_saving, 2)
            self.results['annual_cost_saving'] = round(annual_cost_saving, 2)
            
        except Exception as e:
            print(f"Error calculating cost savings: {str(e)}")
            self.results['daily_cost_saving'] = 0
            self.results['annual_cost_saving'] = 0
    
    def _calculate_environmental_impact(self):
        """Calculate environmental impact (trees saved and CO2 reduction)"""
        try:
            daily_energy_saving = self.results.get('daily_energy_saving', 0)
            annual_energy_saving = self.results.get('annual_energy_saving', 0)
            
            # Trees saved
            daily_trees_saved = daily_energy_saving * self.KWH_TO_TREES
            annual_trees_saved = annual_energy_saving * self.KWH_TO_TREES
            
            # CO2 reduction
            daily_co2_reduction = daily_energy_saving * self.KWH_TO_CO2_AVG
            annual_co2_reduction = annual_energy_saving * self.KWH_TO_CO2_AVG
            
            self.results['daily_trees_saved'] = round(daily_trees_saved, 2)
            self.results['annual_trees_saved'] = round(annual_trees_saved, 2)
            self.results['daily_co2_reduction'] = round(daily_co2_reduction, 2)
            self.results['annual_co2_reduction'] = round(annual_co2_reduction, 2)
            
        except Exception as e:
            print(f"Error calculating environmental impact: {str(e)}")
            self.results['daily_trees_saved'] = 0
            self.results['annual_trees_saved'] = 0
            self.results['daily_co2_reduction'] = 0
            self.results['annual_co2_reduction'] = 0
    
    def _calculate_payback_period(self):
        """Calculate payback period"""
        try:
            annual_cost_saving = self.results.get('annual_cost_saving', 0)
            
            # Estimated investment cost (can be made configurable)
            investment_cost = 50000  # $50,000 example investment
            
            if annual_cost_saving > 0:
                payback_period_days = (investment_cost / annual_cost_saving) * 365
                payback_period_years = investment_cost / annual_cost_saving
            else:
                payback_period_days = 0
                payback_period_years = 0
            
            self.results['investment_cost'] = investment_cost
            self.results['payback_period_days'] = round(payback_period_days, 0)
            self.results['payback_period_years'] = round(payback_period_years, 2)
            
        except Exception as e:
            print(f"Error calculating payback period: {str(e)}")
            self.results['payback_period_days'] = 0
            self.results['payback_period_years'] = 0
    
    def _generate_plot_data(self):
        """Generate data for all 10 plots"""
        try:
            # Generate SRC curves using the Q-H curve processor
            from .qh_curve_processor import generate_src_curves
            src_data = generate_src_curves(self.data)
            
            # Plot 1: Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)
            self.results['plot1_data'] = self._generate_qh_curve_data(src_data)
            
            # Plot 2: Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)
            self.results['plot2_data'] = self._generate_qh_curve_different_speed(src_data)
            
            # Plot 3: Qreq–Hreq Curve with SRC (modified/replacement pump Curve)
            self.results['plot3_data'] = self._generate_modified_pump_curve()
            
            # Plot 4: Efficiency (Eff1 vs Eff2)
            self.results['plot4_data'] = self._generate_efficiency_histogram()
            
            # Plot 5: BKW1, BKW2, and Saving vs Time (days)
            self.results['plot5_data'] = self._generate_power_saving_trend()
            
            # Plot 6: Power Consumption (Before, After) and Saving vs Time (days)
            self.results['plot6_data'] = self._generate_power_consumption_trend()
            
            # Plot 7: Cost of Pump Running (Before, After) vs Time (days)
            self.results['plot7_data'] = self._generate_cost_trend()
            
            # Plot 8: Money Saved vs Time (days) with Investment Cost Curve
            self.results['plot8_data'] = self._generate_savings_investment_curve()
            
            # Plot 9: Number of Trees Saved vs Time (days)
            self.results['plot9_data'] = self._generate_trees_saved_trend()
            
            # Plot 10: CO₂ Reduction (kg) vs Time (days)
            self.results['plot10_data'] = self._generate_co2_reduction_trend()
            
        except Exception as e:
            print(f"Error generating plot data: {str(e)}")
    
    def _generate_qh_curve_data(self, src_data: Dict) -> Dict:
        """Generate Q-H curve data for Plot 1"""
        try:
            q_np = float(self.data.get('flow_qnp', 60))
            h_np = float(self.data.get('head_hnp', 910))
            
            # Generate pump curve points
            q_points = np.linspace(0, q_np * 1.2, 20)
            h_points = []
            
            for q in q_points:
                # Simplified pump curve equation: H = H_np * (1 - (Q/Q_np)^2)
                if q <= q_np:
                    h = h_np * (1 - (q/q_np)**2)
                else:
                    h = h_np * (1 - (q/q_np)**2) * 0.5  # Steep drop after rated point
                h_points.append(max(h, 0))
            
            return {
                'q_points': q_points.tolist(),
                'h_points': h_points,
                'src1_points': src_data.get('src1', []),
                'src2_points': src_data.get('src2', []),
                'flow_points': src_data.get('flow_points', []),
                'rated_point': {'q': q_np, 'h': h_np},
                'title': 'Qnp–Hnp Curve with SRC1 & SRC2 (when N1 = N2)'
            }
            
        except Exception as e:
            print(f"Error generating QH curve data: {str(e)}")
            return {'error': str(e)}
    
    def _generate_qh_curve_different_speed(self, src_data: Dict) -> Dict:
        """Generate Q-H curve data for Plot 2 (different speeds)"""
        try:
            q_np = float(self.data.get('flow_qnp', 60))
            h_np = float(self.data.get('head_hnp', 910))
            n1 = float(self.data.get('speed_n1', 2965))
            n2 = float(self.data.get('actual_speed_n2', 2900))
            
            # Generate curves for both speeds
            q_points = np.linspace(0, q_np * 1.2, 20)
            
            # Original speed curve
            h_points_n1 = []
            for q in q_points:
                if q <= q_np:
                    h = h_np * (1 - (q/q_np)**2)
                else:
                    h = h_np * (1 - (q/q_np)**2) * 0.5
                h_points_n1.append(max(h, 0))
            
            # Different speed curve (affinity laws)
            speed_ratio = n2 / n1
            h_points_n2 = [h * (speed_ratio**2) for h in h_points_n1]
            q_points_n2 = [q * speed_ratio for q in q_points]
            
            return {
                'q_points_n1': q_points.tolist(),
                'h_points_n1': h_points_n1,
                'q_points_n2': q_points_n2,
                'h_points_n2': h_points_n2,
                'src1_points': src_data.get('src1', []),
                'src3_points': src_data.get('src3', []),
                'flow_points': src_data.get('flow_points', []),
                'title': 'Qnp–Hnp Curve with SRC1 & SRC3 (when N1 ≠ N2)'
            }
            
        except Exception as e:
            print(f"Error generating different speed curve data: {str(e)}")
            return {'error': str(e)}
    
    def _generate_modified_pump_curve(self) -> Dict:
        """Generate modified pump curve data for Plot 3"""
        try:
            q_act = float(self.data.get('actual_flow_required', 43))
            h_act = self.results.get('head_developed', 0)
            
            # Generate required duty point curve
            q_points = np.linspace(0, q_act * 1.5, 20)
            h_points = [h_act] * len(q_points)  # Constant head requirement
            
            # Generate modified pump curve (improved efficiency)
            q_points_mod = np.linspace(0, q_act * 1.2, 20)
            h_points_mod = []
            
            for q in q_points_mod:
                # Modified pump curve with better efficiency
                h = h_act * (1 + 0.1 * (1 - (q/q_act)**2))
                h_points_mod.append(max(h, h_act * 0.8))
            
            return {
                'q_points_req': q_points.tolist(),
                'h_points_req': h_points,
                'q_points_mod': q_points_mod.tolist(),
                'h_points_mod': h_points_mod,
                'duty_point': {'q': q_act, 'h': h_act},
                'title': 'Qreq–Hreq Curve with SRC (modified/replacement pump Curve)'
            }
            
        except Exception as e:
            print(f"Error generating modified pump curve: {str(e)}")
            return {'error': str(e)}
    
    def _generate_efficiency_histogram(self) -> Dict:
        """Generate efficiency histogram data for Plot 4"""
        try:
            efficiency_before = self.results.get('efficiency_before', 0)
            efficiency_after = self.results.get('efficiency_after', 0)
            
            return {
                'efficiency_before': efficiency_before,
                'efficiency_after': efficiency_after,
                'improvement': efficiency_after - efficiency_before,
                'title': 'Efficiency (Eff1 vs Eff2)'
            }
            
        except Exception as e:
            print(f"Error generating efficiency histogram: {str(e)}")
            return {'error': str(e)}
    
    def _generate_power_saving_trend(self) -> Dict:
        """Generate power saving trend data for Plot 5"""
        try:
            power_before = self.results.get('power_before', 0)
            power_after = self.results.get('power_after', 0)
            power_saving = self.results.get('power_saving', 0)
            
            # Generate 365 days of data
            days = list(range(1, 366))
            bkw1_data = [power_before] * 365
            bkw2_data = [power_after] * 365
            saving_data = [power_saving] * 365
            
            return {
                'days': days,
                'bkw1': bkw1_data,
                'bkw2': bkw2_data,
                'saving': saving_data,
                'title': 'BKW1, BKW2, and Saving vs Time (days)'
            }
            
        except Exception as e:
            print(f"Error generating power saving trend: {str(e)}")
            return {'error': str(e)}
    
    def _generate_power_consumption_trend(self) -> Dict:
        """Generate power consumption trend data for Plot 6"""
        try:
            daily_energy_saving = self.results.get('daily_energy_saving', 0)
            power_before = self.results.get('power_before', 0)
            power_after = self.results.get('power_after', 0)
            
            # Generate cumulative data
            days = list(range(1, 366))
            consumption_before = [power_before * 24] * 365
            consumption_after = [power_after * 24] * 365
            saving_cumulative = [daily_energy_saving * day for day in days]
            
            return {
                'days': days,
                'consumption_before': consumption_before,
                'consumption_after': consumption_after,
                'saving_cumulative': saving_cumulative,
                'title': 'Power Consumption (Before, After) and Saving vs Time (days)'
            }
            
        except Exception as e:
            print(f"Error generating power consumption trend: {str(e)}")
            return {'error': str(e)}
    
    def _generate_cost_trend(self) -> Dict:
        """Generate cost trend data for Plot 7"""
        try:
            daily_cost_saving = self.results.get('daily_cost_saving', 0)
            cost_per_kwh = self.results.get('cost_per_kwh', 0.12)
            power_before = self.results.get('power_before', 0)
            power_after = self.results.get('power_after', 0)
            
            # Generate cost data
            days = list(range(1, 366))
            cost_before = [power_before * 24 * cost_per_kwh] * 365
            cost_after = [power_after * 24 * cost_per_kwh] * 365
            
            return {
                'days': days,
                'cost_before': cost_before,
                'cost_after': cost_after,
                'title': 'Cost of Pump Running (Before, After) vs Time (days)'
            }
            
        except Exception as e:
            print(f"Error generating cost trend: {str(e)}")
            return {'error': str(e)}
    
    def _generate_savings_investment_curve(self) -> Dict:
        """Generate savings and investment curve data for Plot 8"""
        try:
            daily_cost_saving = self.results.get('daily_cost_saving', 0)
            investment_cost = self.results.get('investment_cost', 50000)
            payback_period_days = self.results.get('payback_period_days', 0)
            
            # Generate cumulative savings
            days = list(range(1, 366))
            cumulative_savings = [daily_cost_saving * day for day in days]
            investment_line = [investment_cost] * 365
            
            return {
                'days': days,
                'cumulative_savings': cumulative_savings,
                'investment_line': investment_line,
                'payback_day': payback_period_days,
                'break_even_point': {'day': payback_period_days, 'amount': investment_cost},
                'title': 'Money Saved vs Time (days) with Investment Cost Curve'
            }
            
        except Exception as e:
            print(f"Error generating savings investment curve: {str(e)}")
            return {'error': str(e)}
    
    def _generate_trees_saved_trend(self) -> Dict:
        """Generate trees saved trend data for Plot 9"""
        try:
            daily_trees_saved = self.results.get('daily_trees_saved', 0)
            
            # Generate cumulative trees saved
            days = list(range(1, 366))
            cumulative_trees = [daily_trees_saved * day for day in days]
            
            return {
                'days': days,
                'cumulative_trees': cumulative_trees,
                'daily_trees': [daily_trees_saved] * 365,
                'title': 'Number of Trees Saved vs Time (days)'
            }
            
        except Exception as e:
            print(f"Error generating trees saved trend: {str(e)}")
            return {'error': str(e)}
    
    def _generate_co2_reduction_trend(self) -> Dict:
        """Generate CO2 reduction trend data for Plot 10"""
        try:
            daily_co2_reduction = self.results.get('daily_co2_reduction', 0)
            
            # Generate cumulative CO2 reduction
            days = list(range(1, 366))
            cumulative_co2 = [daily_co2_reduction * day for day in days]
            
            return {
                'days': days,
                'cumulative_co2': cumulative_co2,
                'daily_co2': [daily_co2_reduction] * 365,
                'title': 'CO₂ Reduction (kg) vs Time (days)'
            }
            
        except Exception as e:
            print(f"Error generating CO2 reduction trend: {str(e)}")
            return {'error': str(e)}


def calculate_energy_optimization(submission_data: Dict) -> Dict:
    """
    Main function to calculate energy optimization results
    
    Args:
        submission_data: Dictionary containing all form data
        
    Returns:
        Dictionary containing all calculation results
    """
    calculator = EnergyOptimizationCalculator(submission_data)
    return calculator.calculate_all()
