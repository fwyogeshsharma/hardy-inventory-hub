# Hardy Inventory Hub Database

This SQLite database contains the complete data model for the Hardy Inventory Hub beverage inventory management system.

## Database Files

- `hardy_inventory.db` - Main SQLite database file
- `schema.sql` - Database schema definition
- `sample_data.sql` - Sample data for testing and development

## Database Schema Overview

### Core Tables

#### User Management
- `users` - System users and authentication
- `audit_log` - Audit trail for all changes

#### Product Catalog
- `brands` - Beverage brands (HTWO, Skhy, Rallie)
- `flavors` - Product flavors (Lime, Berry, Peach, etc.)
- `pack_sizes` - Package sizes (330ml, 500ml, 1L, multi-packs)
- `skus` - Stock Keeping Units (products)
- `sku_components` - Kit SKU compositions

#### Inventory Management
- `warehouses` - Storage locations
- `inventory` - Current stock levels by SKU and warehouse
- `inventory_transactions` - All stock movements and history

#### Vendor Management
- `vendors` - Supplier information
- `materials` - Raw materials and components
- `vendor_materials` - Vendor-material relationships and pricing

#### Order Management
- `customers` - Customer/distributor information
- `orders` - Sales orders header
- `order_items` - Order line items

#### Production Management
- `bom_headers` - Bill of Materials headers
- `bom_lines` - BOM components and quantities
- `production_orders` - Production runs
- `production_material_usage` - Material consumption tracking

#### System Management
- `alerts` - System notifications and alerts

### Key Views

- `v_inventory_levels` - Current inventory with SKU details and stock status
- `v_order_summary` - Order summary with customer details
- `v_production_status` - Production run status with completion percentages

## Sample Data Included

### SKUs (10 total)
- **HTWO Brand**: Lime and Berry flavors in 330ml, 500ml
- **Skhy Brand**: Berry 500ml, Peach 1L (upcoming)
- **Rallie Brand**: Peach 1L, Original 330ml
- **Kit SKUs**: 4-pack, 6-pack, and 12-pack configurations

### Customers (4 total)
- NYC Distributor A
- Brooklyn Retailer B
- Manhattan Store C
- Queens Distributor D

### Vendors (3 total)
- Premium Materials Co. (packaging supplies)
- Flavor Solutions Ltd. (flavoring concentrates)
- Packaging Innovations (secondary packaging)

### Orders (4 total)
- Various order statuses: pending, processing, shipped, delivered
- Mix of distributor and retailer orders

### Production Orders (3 total)
- In-progress HTWO Lime production
- Completed Skhy Berry production
- Scheduled Rallie Peach production

## Database Features

### Performance Optimization
- Strategic indexes on frequently queried columns
- Computed columns for derived values
- Optimized views for common queries

### Data Integrity
- Foreign key constraints enabled
- Check constraints for valid status values
- Unique constraints on business keys

### Audit Trail
- Created/updated timestamps on all tables
- Comprehensive audit log for tracking changes
- User attribution for all modifications

### Business Rules
- Kit SKUs automatically track component relationships
- Inventory transactions maintain stock level accuracy
- Order processing updates inventory reservations
- Production orders consume materials per BOM

## Usage Examples

### Check Current Inventory Levels
```sql
SELECT * FROM v_inventory_levels 
WHERE stock_status = 'Low Stock' 
ORDER BY quantity_available;
```

### View Order Summary
```sql
SELECT * FROM v_order_summary 
WHERE status IN ('pending', 'processing') 
ORDER BY order_date;
```

### Production Status
```sql
SELECT * FROM v_production_status 
WHERE status = 'in_progress';
```

### Vendor Performance
```sql
SELECT v.name, v.rating, v.lead_time_days, COUNT(vm.material_id) as materials_supplied
FROM vendors v
LEFT JOIN vendor_materials vm ON v.id = vm.vendor_id
WHERE v.status = 'active'
GROUP BY v.id, v.name, v.rating, v.lead_time_days
ORDER BY v.rating DESC;
```

## Schema Evolution

The database schema supports future expansion:
- Extensible material categories
- Flexible production workflow states
- Scalable multi-warehouse operations
- Comprehensive reporting capabilities

## Connection Information

**Database Type**: SQLite 3
**File Location**: `./hardy_inventory.db`
**Character Set**: UTF-8
**Foreign Keys**: Enabled

## Maintenance

Regular maintenance tasks:
1. **Vacuum** - Reclaim space: `VACUUM;`
2. **Analyze** - Update statistics: `ANALYZE;`
3. **Backup** - Copy database file regularly
4. **Archive** - Move old transaction data to history tables