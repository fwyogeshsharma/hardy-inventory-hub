-- Extended Automotive Workflow Schema
-- Adds automotive-specific tables and workflow management functionality

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ==========================================
-- AUTOMOTIVE-SPECIFIC TABLES
-- ==========================================

-- Vehicle Categories
CREATE TABLE IF NOT EXISTS vehicle_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Makes
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Part Categories
CREATE TABLE IF NOT EXISTS part_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    parent_category_id INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES part_categories(id)
);

-- Part Types
CREATE TABLE IF NOT EXISTS part_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category_id INTEGER,
    description TEXT,
    warranty_period_months INTEGER DEFAULT 12,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES part_categories(id)
);

-- Update SKUs table for automotive parts
-- Add automotive-specific columns
ALTER TABLE skus ADD COLUMN category_id INTEGER REFERENCES part_categories(id);
ALTER TABLE skus ADD COLUMN part_type_id INTEGER REFERENCES part_types(id);
ALTER TABLE skus ADD COLUMN make_id INTEGER REFERENCES vehicle_makes(id);
ALTER TABLE skus ADD COLUMN model_compatibility TEXT; -- JSON array of compatible models
ALTER TABLE skus ADD COLUMN year_from INTEGER;
ALTER TABLE skus ADD COLUMN year_to INTEGER;
ALTER TABLE skus ADD COLUMN oem_part_number VARCHAR(100);
ALTER TABLE skus ADD COLUMN manufacturer VARCHAR(100);
ALTER TABLE skus ADD COLUMN warranty_months INTEGER DEFAULT 12;

-- ==========================================
-- WORKFLOW MANAGEMENT TABLES
-- ==========================================

-- Reorder Requests
CREATE TABLE IF NOT EXISTS reorder_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity_requested INTEGER NOT NULL,
    reason VARCHAR(50) DEFAULT 'out_of_stock' CHECK (reason IN ('out_of_stock', 'low_stock', 'manual')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ordered', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    requested_by INTEGER,
    approved_by INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Purchase Orders (Extended)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    reorder_request_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sent', 'partial', 'completed', 'cancelled')),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (reorder_request_id) REFERENCES reorder_requests(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_order_id INTEGER NOT NULL,
    sku_id INTEGER NOT NULL,
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
    warehouse_status VARCHAR(20) DEFAULT 'not_checked' CHECK (warehouse_status IN ('not_checked', 'in_warehouse', 'not_available', 'new_order_required')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES skus(id)
);

-- Warehouse Checks
CREATE TABLE IF NOT EXISTS warehouse_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_order_item_id INTEGER NOT NULL,
    checker_id INTEGER,
    status VARCHAR(20) NOT NULL CHECK (status IN ('in_warehouse', 'not_available', 'partial_available')),
    quantity_found INTEGER DEFAULT 0,
    location VARCHAR(100),
    check_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (purchase_order_item_id) REFERENCES purchase_order_items(id),
    FOREIGN KEY (checker_id) REFERENCES users(id)
);

-- Supplier Orders (For items not in warehouse)
CREATE TABLE IF NOT EXISTS supplier_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    purchase_order_item_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'in_transit', 'received', 'cancelled')),
    is_regular_supplier BOOLEAN DEFAULT 1,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    quantity_ordered INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
    tracking_number VARCHAR(100),
    workflow_status VARCHAR(20) DEFAULT 'active' CHECK (workflow_status IN ('active', 'paused', 'resumed')),
    pause_reason TEXT,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_item_id) REFERENCES purchase_order_items(id),
    FOREIGN KEY (supplier_id) REFERENCES vendors(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==========================================
-- BILL OF MATERIALS (BOM) SYSTEM
-- ==========================================

-- BOM Templates for Kit SKUs
CREATE TABLE IF NOT EXISTS bom_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_sku_id INTEGER NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    total_cost DECIMAL(10,2) DEFAULT 0,
    labor_cost DECIMAL(10,2) DEFAULT 0,
    overhead_cost DECIMAL(10,2) DEFAULT 0,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kit_sku_id) REFERENCES skus(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(kit_sku_id, version)
);

-- BOM Components
CREATE TABLE IF NOT EXISTS bom_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bom_template_id INTEGER NOT NULL,
    component_sku_id INTEGER NOT NULL,
    quantity_required INTEGER NOT NULL DEFAULT 1,
    unit_cost DECIMAL(10,2) NOT NULL,
    line_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity_required * unit_cost) STORED,
    is_critical BOOLEAN DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bom_template_id) REFERENCES bom_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (component_sku_id) REFERENCES skus(id)
);

-- Kit Production Orders
CREATE TABLE IF NOT EXISTS kit_production_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    kit_sku_id INTEGER NOT NULL,
    bom_template_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity_planned INTEGER NOT NULL,
    quantity_completed INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    planned_start_date DATE,
    actual_start_date DATE,
    planned_completion_date DATE,
    actual_completion_date DATE,
    total_material_cost DECIMAL(12,2) DEFAULT 0,
    labor_cost DECIMAL(12,2) DEFAULT 0,
    overhead_cost DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    supervisor_id INTEGER,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kit_sku_id) REFERENCES skus(id),
    FOREIGN KEY (bom_template_id) REFERENCES bom_templates(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (supervisor_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Material Consumption Tracking
CREATE TABLE IF NOT EXISTS material_consumption (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_production_order_id INTEGER NOT NULL,
    component_sku_id INTEGER NOT NULL,
    planned_quantity INTEGER NOT NULL,
    actual_quantity INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    actual_cost DECIMAL(10,2) GENERATED ALWAYS AS (actual_quantity * unit_cost) STORED,
    consumption_date DATE,
    recorded_by INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kit_production_order_id) REFERENCES kit_production_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (component_sku_id) REFERENCES skus(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- ==========================================
-- WORKFLOW TRACKING TABLES
-- ==========================================

-- Workflow States
CREATE TABLE IF NOT EXISTS workflow_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('sku', 'purchase_order', 'supplier_order', 'kit_production')),
    entity_id INTEGER NOT NULL,
    current_stage VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    stage_started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    estimated_completion DATETIME,
    blocking_reason TEXT,
    assigned_to INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Workflow History
CREATE TABLE IF NOT EXISTS workflow_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_state_id INTEGER NOT NULL,
    previous_stage VARCHAR(50),
    new_stage VARCHAR(50) NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    action_taken TEXT,
    duration_minutes INTEGER,
    changed_by INTEGER,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_state_id) REFERENCES workflow_states(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ==========================================
-- COST TRACKING TABLES
-- ==========================================

-- Cost History
CREATE TABLE IF NOT EXISTS cost_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    cost_type VARCHAR(20) NOT NULL CHECK (cost_type IN ('purchase', 'production', 'labor', 'overhead')),
    old_cost DECIMAL(10,2),
    new_cost DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    vendor_id INTEGER,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==========================================
-- INDEXES FOR WORKFLOW PERFORMANCE
-- ==========================================

-- Reorder and Purchase Order indexes
CREATE INDEX IF NOT EXISTS idx_reorder_requests_sku_status ON reorder_requests(sku_id, status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status_date ON purchase_orders(status, order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_warehouse_status ON purchase_order_items(warehouse_status);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON supplier_orders(status, workflow_status);

-- BOM indexes
CREATE INDEX IF NOT EXISTS idx_bom_templates_kit_active ON bom_templates(kit_sku_id, is_active);
CREATE INDEX IF NOT EXISTS idx_bom_components_template ON bom_components(bom_template_id);

-- Workflow indexes
CREATE INDEX IF NOT EXISTS idx_workflow_states_entity ON workflow_states(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_workflow_states_stage_status ON workflow_states(current_stage, status);

-- ==========================================
-- AUTOMOTIVE DATA INSERTS
-- ==========================================

-- Insert Vehicle Categories
INSERT OR IGNORE INTO vehicle_categories (name, description) VALUES
('Sedan', 'Four-door passenger cars'),
('SUV', 'Sport Utility Vehicles'),
('Truck', 'Pickup trucks and commercial vehicles'),
('Coupe', 'Two-door passenger cars'),
('Hatchback', 'Compact cars with rear hatch'),
('Convertible', 'Cars with retractable roofs'),
('Wagon', 'Station wagons and estate cars'),
('Van', 'Passenger and cargo vans'),
('Motorcycle', 'Two-wheeled motor vehicles'),
('ATV', 'All-terrain vehicles');

-- Insert Vehicle Makes
INSERT OR IGNORE INTO vehicle_makes (name, country) VALUES
('Toyota', 'Japan'),
('Honda', 'Japan'),
('Ford', 'USA'),
('Chevrolet', 'USA'),
('BMW', 'Germany'),
('Mercedes-Benz', 'Germany'),
('Audi', 'Germany'),
('Volkswagen', 'Germany'),
('Nissan', 'Japan'),
('Hyundai', 'South Korea'),
('Kia', 'South Korea'),
('Mazda', 'Japan'),
('Subaru', 'Japan'),
('Jeep', 'USA'),
('Ram', 'USA'),
('GMC', 'USA'),
('Cadillac', 'USA'),
('Lexus', 'Japan'),
('Acura', 'Japan'),
('Infiniti', 'Japan');

-- Insert Part Categories
INSERT OR IGNORE INTO part_categories (name, description) VALUES
('Engine', 'Engine components and parts'),
('Transmission', 'Transmission and drivetrain parts'),
('Brakes', 'Brake system components'),
('Suspension', 'Suspension and steering parts'),
('Electrical', 'Electrical system components'),
('Body', 'Body panels and exterior parts'),
('Interior', 'Interior components and accessories'),
('Exhaust', 'Exhaust system parts'),
('Cooling', 'Cooling system components'),
('Fuel System', 'Fuel delivery and injection parts'),
('Air Intake', 'Air intake and filtration systems'),
('Ignition', 'Ignition system components'),
('Lights', 'Lighting systems and bulbs'),
('HVAC', 'Heating, ventilation, and air conditioning'),
('Tools', 'Automotive tools and equipment'),
('Fluids', 'Automotive fluids and lubricants'),
('Tires', 'Tires and wheel components'),
('Glass', 'Windows and mirrors'),
('Trim', 'Decorative and finishing parts'),
('Safety', 'Safety equipment and accessories');

-- Insert Part Types
INSERT OR IGNORE INTO part_types (name, category_id, warranty_period_months) VALUES
-- Engine parts
('Oil Filter', 1, 6),
('Air Filter', 1, 12),
('Spark Plug', 1, 24),
('Piston Ring', 1, 36),
('Valve Cover Gasket', 1, 24),
('Timing Belt', 1, 60),
('Water Pump', 1, 24),
('Fuel Pump', 1, 24),
('Alternator', 1, 24),
('Starter Motor', 1, 24),

-- Transmission parts
('Transmission Filter', 2, 12),
('Clutch Kit', 2, 36),
('CV Joint', 2, 24),
('Drive Belt', 2, 12),
('Transmission Mount', 2, 24),

-- Brake parts
('Brake Pad', 3, 12),
('Brake Rotor', 3, 24),
('Brake Caliper', 3, 24),
('Brake Line', 3, 36),
('Master Cylinder', 3, 24),

-- Suspension parts
('Shock Absorber', 4, 24),
('Strut Assembly', 4, 36),
('Control Arm', 4, 36),
('Ball Joint', 4, 24),
('Sway Bar Link', 4, 18),

-- Electrical parts
('Battery', 5, 24),
('Headlight Bulb', 5, 6),
('Fuse', 5, 12),
('Relay', 5, 24),
('Wiring Harness', 5, 36),

-- Body parts
('Bumper', 6, 12),
('Hood', 6, 12),
('Door Panel', 6, 12),
('Mirror', 6, 12),
('Grille', 6, 12),

-- Interior parts
('Seat Cover', 7, 12),
('Floor Mat', 7, 12),
('Dashboard', 7, 24),
('Steering Wheel Cover', 7, 6),
('Armrest', 7, 12),

-- Exhaust parts
('Muffler', 8, 24),
('Catalytic Converter', 8, 60),
('Exhaust Pipe', 8, 24),
('Resonator', 8, 24),
('Oxygen Sensor', 8, 24),

-- Cooling parts
('Radiator', 9, 24),
('Thermostat', 9, 12),
('Coolant Hose', 9, 24),
('Radiator Cap', 9, 12),
('Cooling Fan', 9, 24),

-- Fuel System parts
('Fuel Filter', 10, 12),
('Fuel Injector', 10, 36),
('Fuel Rail', 10, 36),
('Fuel Tank', 10, 60),
('Fuel Cap', 10, 12);

-- Insert Vendors (Regular Suppliers)
INSERT OR IGNORE INTO vendors (vendor_code, name, contact_person, email, phone, payment_terms, lead_time_days, rating, status) VALUES
('SUP001', 'AutoParts Direct LLC', 'John Smith', 'john@autopartsdirect.com', '555-0101', 'Net 30', 5, 4.5, 'active'),
('SUP002', 'Premium Auto Supply', 'Sarah Johnson', 'sarah@premiumauto.com', '555-0102', 'Net 30', 7, 4.8, 'active'),
('SUP003', 'Fast Track Parts', 'Mike Wilson', 'mike@fasttrackparts.com', '555-0103', 'Net 15', 3, 4.2, 'active'),
('SUP004', 'Quality Components Inc', 'Lisa Brown', 'lisa@qualitycomp.com', '555-0104', 'Net 30', 10, 4.7, 'active'),
('SUP005', 'Reliable Auto Parts', 'David Lee', 'david@reliableauto.com', '555-0105', 'Net 30', 6, 4.3, 'active'),
('SUP006', 'OEM Solutions', 'Jennifer Davis', 'jennifer@oemsolutions.com', '555-0106', 'Net 45', 14, 4.9, 'active'),
('SUP007', 'Budget Auto Supply', 'Robert Taylor', 'robert@budgetauto.com', '555-0107', 'Net 15', 4, 3.8, 'active'),
('SUP008', 'European Parts Specialist', 'Maria Garcia', 'maria@europeanparts.com', '555-0108', 'Net 30', 12, 4.6, 'active'),
('SUP009', 'Asian Auto Import', 'Kevin Chen', 'kevin@asianautoimport.com', '555-0109', 'Net 30', 8, 4.4, 'active'),
('SUP010', 'American Made Parts', 'Susan Miller', 'susan@americanmade.com', '555-0110', 'Net 30', 5, 4.1, 'active');

-- Insert Warehouses
INSERT OR IGNORE INTO warehouses (name, code, address, city, state, zip_code, is_active) VALUES
('Main Distribution Center', 'MDC', '1500 Industrial Blvd', 'Houston', 'TX', '77001', 1),
('West Coast Facility', 'WCF', '2200 Pacific Ave', 'Los Angeles', 'CA', '90021', 1),
('East Coast Hub', 'ECH', '800 Atlantic St', 'Atlanta', 'GA', '30309', 1),
('Midwest Center', 'MWC', '1200 Great Lakes Dr', 'Chicago', 'IL', '60601', 1),
('Southeast Branch', 'SEB', '950 Sunshine Blvd', 'Miami', 'FL', '33101', 1);