from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from pump_spares.models import InventoryDatabase
from decimal import Decimal
import csv
import os

class Command(BaseCommand):
    help = 'Import inventory data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_file',
            type=str,
            help='Path to the CSV file containing inventory data'
        )
        parser.add_argument(
            '--update',
            action='store_true',
            help='Update existing items instead of skipping them'
        )

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        update_existing = options['update']
        
        if not os.path.exists(csv_file):
            raise CommandError(f'CSV file not found: {csv_file}')
        
        self.stdout.write(f'Importing inventory data from: {csv_file}')
        
        created_count = 0
        updated_count = 0
        error_count = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                
                for row_num, row in enumerate(csv_reader, 1):
                    try:
                        # Clean and prepare data
                        item_data = {
                            'part_name': row['Part Name'].strip(),
                            'part_no': row['Part No'].strip(),
                            'drawing': row['Drg'].strip() if row['Drg'].strip() else None,
                            'ref_location': row['Ref Location'].strip() if row['Ref Location'].strip() and row['Ref Location'].strip() != 'N/a' else None,
                            'moc': row['MOC'].strip(),
                            'availability': int(row['Avail']) if row['Avail'].strip() else 0,
                            'uom': row['UOM'].strip(),
                            'unit_price': Decimal(row['Unit Price']) if row['Unit Price'].strip() else Decimal('0.00'),
                            'drawing_vendor': row['Drg for Vendor'].strip() if row['Drg for Vendor'].strip() else None
                        }
                        
                        # Check if item already exists
                        existing_item = InventoryDatabase.objects.filter(part_no=item_data['part_no']).first()
                        
                        if existing_item:
                            if update_existing:
                                # Update existing item
                                for key, value in item_data.items():
                                    setattr(existing_item, key, value)
                                existing_item.save()
                                updated_count += 1
                                self.stdout.write(f'Row {row_num}: Updated {item_data["part_name"]} (Part No: {item_data["part_no"]})')
                            else:
                                self.stdout.write(f'Row {row_num}: Skipped existing item {item_data["part_name"]} (Part No: {item_data["part_no"]})')
                        else:
                            # Create new item
                            InventoryDatabase.objects.create(**item_data)
                            created_count += 1
                            self.stdout.write(f'Row {row_num}: Created {item_data["part_name"]} (Part No: {item_data["part_no"]})')
                            
                    except Exception as e:
                        error_count += 1
                        self.stdout.write(
                            self.style.ERROR(f'Row {row_num}: Error importing {row.get("Part Name", "Unknown")}: {str(e)}')
                        )
        
        except Exception as e:
            raise CommandError(f'Error reading CSV file: {str(e)}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nImport Summary:\n'
                f'Created: {created_count} items\n'
                f'Updated: {updated_count} items\n'
                f'Errors: {error_count} items\n'
                f'Total processed: {created_count + updated_count + error_count} items'
            )
        )
