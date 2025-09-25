from django.urls import path
from . import views

urlpatterns = [
    path('pump-makes/', views.PumpMakeListView.as_view(), name='pump-makes'),
    path('pump-models/', views.PumpModelListView.as_view(), name='pump-models'),
    path('pump-sizes/', views.PumpSizeListView.as_view(), name='pump-sizes'),
    path('part-numbers/', views.PartNumberListView.as_view(), name='part-numbers'),
    path('part-names/', views.PartNameListView.as_view(), name='part-names'),
    path('materials/', views.MaterialOfConstructionListView.as_view(), name='materials'),
    
    path('filtered-options/', views.get_filtered_options, name='filtered-options'),
    path('materials-for-part/', views.get_materials_for_part, name='materials-for-part'),
    path('material/<int:material_id>/', views.get_material_by_id, name='material-detail'),
    path('generate-receipt/', views.generate_receipt, name='generate-receipt'),
    path('submit-pump-details/', views.submit_pump_details, name='submit-pump-details'),
    path('test-email/', views.test_email, name='test-email'),
    
    path('submit-energy-optimization/', views.submit_energy_optimization, name='submit-energy-optimization'),
    path('energy-optimization-submissions/', views.get_energy_optimization_submissions, name='energy-optimization-submissions'),
    path('test-energy-optimization/', views.test_energy_optimization, name='test-energy-optimization'),
    path('process-qh-curve/', views.process_qh_curve, name='process-qh-curve'),
    path('calculate-src-curves/', views.calculate_src_curves, name='calculate-src-curves'),
    
    path('inventory/', views.InventoryDatabaseListCreateView.as_view(), name='inventory-list-create'),
    path('inventory/<int:pk>/', views.InventoryDatabaseDetailView.as_view(), name='inventory-detail'),
    path('inventory/item/<int:item_id>/', views.get_inventory_item_by_id, name='inventory-item-detail'),
    path('inventory/search/', views.search_inventory, name='inventory-search'),
    path('inventory/bulk-create/', views.bulk_create_inventory, name='inventory-bulk-create'),
    path('inventory/stats/', views.get_inventory_stats, name='inventory-stats'),
    path('inventory/generate-receipt/', views.generate_inventory_receipt, name='generate-inventory-receipt'),
]
