-- Hardy Inventory Hub Database Schema
-- SQLite Database for Beverage Inventory Management System

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Users and Authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'viewer')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories and Brands
CREATE TABLE brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flavors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pack_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    volume_ml INTEGER,
    unit_count INTEGER DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SKU MANAGEMENT
-- ==========================================

-- Main SKU Table
CREATE TABLE skus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_code VARCHAR(50) UNIQUE NOT NULL,
    sku_name VARCHAR(100) NOT NULL,
    brand_id INTEGER,
    flavor_id INTEGER,
    pack_size_id INTEGER,
    sku_type VARCHAR(10) DEFAULT 'single' CHECK (sku_type IN ('single', 'kit')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'discontinued')),
    barcode VARCHAR(50) UNIQUE,
    unit_of_measure VARCHAR(20) DEFAULT 'Unit',
    bom_version VARCHAR(20),
    launch_date DATE,
    discontinue_date DATE,
    unit_cost DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (flavor_id) REFERENCES flavors(id),
    FOREIGN KEY (pack_size_id) REFERENCES pack_sizes(id)
);

-- Kit SKU Components (for kit SKUs that contain multiple single SKUs)
CREATE TABLE sku_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_sku_id INTEGER NOT NULL,
    component_sku_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kit_sku_id) REFERENCES skus(id) ON DELETE CASCADE,
    FOREIGN KEY (component_sku_id) REFERENCES skus(id),
    UNIQUE(kit_sku_id, component_sku_id)
);

-- ==========================================
-- INVENTORY MANAGEMENT
-- ==========================================

-- Warehouses/Locations
CREATE TABLE warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    manager_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Inventory Stock Levels
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    safety_stock_level INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    unit_cost DECIMAL(10,2),
    last_count_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    UNIQUE(sku_id, warehouse_id)
);

-- Inventory Transactions (all stock movements)
CREATE TABLE inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
        'receipt', 'shipment', 'adjustment', 'transfer', 'production', 'return', 'damage', 'cycle_count'
    )),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), -- 'order', 'production', 'transfer', 'adjustment'
    reference_id INTEGER,
    unit_cost DECIMAL(10,2),
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==========================================
-- VENDOR MANAGEMENT
-- ==========================================

-- Vendor Information
CREATE TABLE vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    payment_terms VARCHAR(50),
    lead_time_days INTEGER DEFAULT 7,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_review')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Materials/Raw Materials that vendors supply
CREATE TABLE materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    unit_of_measure VARCHAR(20) DEFAULT 'Unit',
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vendor-Material relationships
CREATE TABLE vendor_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    lead_time_days INTEGER,
    minimum_order_quantity INTEGER DEFAULT 1,
    is_preferred BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    UNIQUE(vendor_id, material_id)
);

-- ==========================================
-- ORDER MANAGEMENT
-- ==========================================

-- Customer Information
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    customer_type VARCHAR(20) DEFAULT 'distributor' CHECK (customer_type IN ('distributor', 'retailer', 'direct')),
    payment_terms VARCHAR(50),
    credit_limit DECIMAL(12,2),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sales Orders
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    order_date DATE NOT NULL,
    requested_ship_date DATE,
    promised_ship_date DATE,
    actual_ship_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'processing', 'picking', 'packed', 'shipped', 'delivered', 'cancelled'
    )),
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    shipping_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Order Line Items
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    sku_id INTEGER NOT NULL,
    quantity_ordered INTEGER NOT NULL,
    quantity_shipped INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_price) STORED,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (sku_id) REFERENCES skus(id)
);

-- ==========================================
-- PRODUCTION MANAGEMENT
-- ==========================================

-- Bill of Materials (BOM)
CREATE TABLE bom_headers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku_id INTEGER NOT NULL,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    effective_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(sku_id, version)
);

CREATE TABLE bom_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bom_header_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    quantity_required DECIMAL(10,4) NOT NULL,
    unit_of_measure VARCHAR(20),
    scrap_factor DECIMAL(5,4) DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bom_header_id) REFERENCES bom_headers(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- Production Orders
CREATE TABLE production_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    production_order_number VARCHAR(50) UNIQUE NOT NULL,
    sku_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    bom_header_id INTEGER,
    planned_quantity INTEGER NOT NULL,
    completed_quantity INTEGER DEFAULT 0,
    scrap_quantity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'paused', 'completed', 'cancelled'
    )),
    planned_start_date DATE,
    actual_start_date DATE,
    planned_completion_date DATE,
    actual_completion_date DATE,
    priority INTEGER DEFAULT 5,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku_id) REFERENCES skus(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (bom_header_id) REFERENCES bom_headers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Production Order Material Consumption
CREATE TABLE production_material_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    production_order_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    planned_quantity DECIMAL(10,4) NOT NULL,
    actual_quantity DECIMAL(10,4) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (production_order_id) REFERENCES production_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- ==========================================
-- REPORTING AND ANALYTICS
-- ==========================================

-- System Alerts
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    entity_type VARCHAR(50), -- 'sku', 'order', 'production', 'inventory'
    entity_id INTEGER,
    is_read BOOLEAN DEFAULT 0,
    is_resolved BOOLEAN DEFAULT 0,
    assigned_to INTEGER,
    resolved_by INTEGER,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (resolved_by) REFERENCES users(id)
);

-- Audit Trail
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values TEXT, -- JSON format
    new_values TEXT, -- JSON format
    changed_by INTEGER,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- SKU indexes
CREATE INDEX idx_skus_brand_flavor ON skus(brand_id, flavor_id);
CREATE INDEX idx_skus_status ON skus(status);
CREATE INDEX idx_skus_barcode ON skus(barcode);

-- Inventory indexes
CREATE INDEX idx_inventory_sku_warehouse ON inventory(sku_id, warehouse_id);
CREATE INDEX idx_inventory_low_stock ON inventory(sku_id) WHERE quantity_available <= safety_stock_level;

-- Transaction indexes
CREATE INDEX idx_inventory_transactions_sku_date ON inventory_transactions(sku_id, created_at);
CREATE INDEX idx_inventory_transactions_warehouse_date ON inventory_transactions(warehouse_id, created_at);

-- Order indexes
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_sku ON order_items(sku_id);

-- Production indexes
CREATE INDEX idx_production_orders_sku_date ON production_orders(sku_id, planned_start_date);
CREATE INDEX idx_production_orders_status ON production_orders(status);

-- Alert indexes
CREATE INDEX idx_alerts_unread ON alerts(is_read, created_at);
CREATE INDEX idx_alerts_severity ON alerts(severity, created_at);

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- Current inventory levels with SKU details
CREATE VIEW v_inventory_levels AS
SELECT 
    s.id as sku_id,
    s.sku_code,
    s.sku_name,
    b.name as brand,
    f.name as flavor,
    ps.name as pack_size,
    w.name as warehouse,
    i.quantity_on_hand,
    i.quantity_reserved,
    i.quantity_available,
    i.safety_stock_level,
    i.reorder_point,
    CASE 
        WHEN i.quantity_available <= 0 THEN 'Out of Stock'
        WHEN i.quantity_available <= i.safety_stock_level THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status,
    i.updated_at as last_updated
FROM skus s
JOIN inventory i ON s.id = i.sku_id
JOIN warehouses w ON i.warehouse_id = w.id
LEFT JOIN brands b ON s.brand_id = b.id
LEFT JOIN flavors f ON s.flavor_id = f.id
LEFT JOIN pack_sizes ps ON s.pack_size_id = ps.id
WHERE s.status = 'active' AND w.is_active = 1;

-- Order summary view
CREATE VIEW v_order_summary AS
SELECT 
    o.id,
    o.order_number,
    c.name as customer_name,
    o.order_date,
    o.status,
    COUNT(oi.id) as item_count,
    o.total_amount,
    o.requested_ship_date,
    o.actual_ship_date
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, c.name, o.order_date, o.status, o.total_amount, o.requested_ship_date, o.actual_ship_date;

-- Production status view
CREATE VIEW v_production_status AS
SELECT 
    po.id,
    po.production_order_number,
    s.sku_code,
    s.sku_name,
    po.planned_quantity,
    po.completed_quantity,
    po.status,
    po.planned_start_date,
    po.planned_completion_date,
    ROUND((po.completed_quantity * 100.0 / po.planned_quantity), 2) as completion_percentage
FROM production_orders po
JOIN skus s ON po.sku_id = s.id;