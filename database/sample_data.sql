-- Hardy Inventory Hub Sample Data
-- Sample data for testing and development

-- Insert Brands
INSERT INTO brands (name, description) VALUES 
('HTWO', 'Premium hydrogen-enhanced water beverages'),
('Skhy', 'Sky-inspired refreshing beverages'),
('Rallie', 'Rally your energy with natural ingredients');

-- Insert Flavors
INSERT INTO flavors (name, description) VALUES 
('Lime', 'Zesty lime flavor'),
('Berry', 'Mixed berry blend'),
('Peach', 'Sweet peach flavor'),
('Mixed', 'Mixed fruit flavor'),
('Original', 'Original unflavored'),
('Citrus', 'Citrus blend'),
('Tropical', 'Tropical fruit mix');

-- Insert Pack Sizes
INSERT INTO pack_sizes (name, volume_ml, unit_count, description) VALUES 
('330ml', 330, 1, '330ml single bottle'),
('500ml', 500, 1, '500ml single bottle'),
('1L', 1000, 1, '1 liter bottle'),
('4-pack', 330, 4, '4-pack of 330ml bottles'),
('6-pack', 330, 6, '6-pack of 330ml bottles'),
('12-pack', 330, 12, '12-pack of 330ml bottles');

-- Insert Warehouses
INSERT INTO warehouses (name, code, address, city, state, zip_code, manager_id) VALUES 
('Main Distribution Center', 'MDC', '123 Industrial Blvd', 'New York', 'NY', '10001', NULL),
('Brooklyn Facility', 'BRK', '456 Storage Ave', 'Brooklyn', 'NY', '11201', NULL),
('New Jersey Hub', 'NJH', '789 Logistics Dr', 'Newark', 'NJ', '07102', NULL);

-- Insert Materials
INSERT INTO materials (material_code, name, category, unit_of_measure, description) VALUES 
('ALU-CAN-330', 'Aluminum Can 330ml', 'Packaging', 'Unit', '330ml aluminum beverage can'),
('ALU-CAN-500', 'Aluminum Can 500ml', 'Packaging', 'Unit', '500ml aluminum beverage can'),
('ALU-CAN-1000', 'Aluminum Can 1L', 'Packaging', 'Unit', '1L aluminum beverage can'),
('LBL-HTWO', 'HTWO Label', 'Packaging', 'Unit', 'HTWO brand label'),
('LBL-SKHY', 'Skhy Label', 'Packaging', 'Unit', 'Skhy brand label'),
('LBL-RALLIE', 'Rallie Label', 'Packaging', 'Unit', 'Rallie brand label'),
('CAP-STD', 'Standard Cap', 'Packaging', 'Unit', 'Standard aluminum cap'),
('FLV-LIME', 'Lime Flavoring', 'Flavoring', 'ML', 'Natural lime flavor concentrate'),
('FLV-BERRY', 'Berry Flavoring', 'Flavoring', 'ML', 'Natural berry flavor concentrate'),
('FLV-PEACH', 'Peach Flavoring', 'Flavoring', 'ML', 'Natural peach flavor concentrate'),
('WATER-PURE', 'Purified Water', 'Base', 'Liter', 'Purified water base'),
('CARDBOARD-4PK', '4-pack Carrier', 'Packaging', 'Unit', 'Cardboard carrier for 4-pack'),
('CARDBOARD-6PK', '6-pack Carrier', 'Packaging', 'Unit', 'Cardboard carrier for 6-pack'),
('CARDBOARD-12PK', '12-pack Box', 'Packaging', 'Unit', 'Cardboard box for 12-pack'),
('SHRINK-WRAP', 'Shrink Wrap', 'Packaging', 'Meter', 'Plastic shrink wrap film'),
('PALLET-STD', 'Standard Pallet', 'Packaging', 'Unit', 'Standard wooden pallet');

-- Insert SKUs
INSERT INTO skus (sku_code, sku_name, brand_id, flavor_id, pack_size_id, sku_type, status, barcode, unit_of_measure, launch_date, unit_cost, unit_price, description) VALUES 
-- HTWO Single SKUs
('HTWO-LM-330', 'HTWO Lime 330ml', 1, 1, 1, 'single', 'active', '1234567890001', 'Unit', '2024-01-01', 1.25, 2.99, 'HTWO Lime 330ml single bottle'),
('HTWO-LM-500', 'HTWO Lime 500ml', 1, 1, 2, 'single', 'active', '1234567890002', 'Unit', '2024-01-01', 1.75, 3.99, 'HTWO Lime 500ml single bottle'),
('HTWO-BR-330', 'HTWO Berry 330ml', 1, 2, 1, 'single', 'active', '1234567890003', 'Unit', '2024-01-01', 1.25, 2.99, 'HTWO Berry 330ml single bottle'),

-- Skhy Single SKUs
('SKHY-BR-500', 'Skhy Berry 500ml', 2, 2, 2, 'single', 'active', '1234567890004', 'Unit', '2024-01-01', 1.50, 3.49, 'Skhy Berry 500ml single bottle'),
('SKHY-PC-1L', 'Skhy Peach 1L', 2, 3, 3, 'single', 'upcoming', '1234567890005', 'Unit', '2024-02-01', 2.50, 5.99, 'Skhy Peach 1L bottle'),

-- Rallie Single SKUs
('RLLIE-PC-1L', 'Rallie Peach 1L', 3, 3, 3, 'single', 'active', '1234567890006', 'Unit', '2024-01-01', 2.25, 5.49, 'Rallie Peach 1L bottle'),
('RLLIE-OR-330', 'Rallie Original 330ml', 3, 5, 1, 'single', 'active', '1234567890007', 'Unit', '2024-01-01', 1.15, 2.49, 'Rallie Original 330ml bottle'),

-- Kit SKUs
('HTWO-LM-4PK', 'HTWO Lime 4-pack', 1, 1, 4, 'kit', 'active', '1234567890008', 'Pack', '2024-01-01', 4.50, 10.99, 'HTWO Lime 4-pack'),
('HTWO-LM-6PK', 'HTWO Lime 6-pack', 1, 1, 5, 'kit', 'active', '1234567890009', 'Pack', '2024-01-01', 6.75, 15.99, 'HTWO Lime 6-pack'),
('SKHY-BR-12PK', 'Skhy Berry 12-pack', 2, 2, 6, 'kit', 'active', '1234567890010', 'Pack', '2024-01-01', 15.00, 35.99, 'Skhy Berry 12-pack');

-- Insert Kit Components
INSERT INTO sku_components (kit_sku_id, component_sku_id, quantity) VALUES 
-- HTWO Lime 4-pack contains 4x HTWO Lime 330ml
(8, 1, 4),
-- HTWO Lime 6-pack contains 6x HTWO Lime 330ml
(9, 1, 6),
-- Skhy Berry 12-pack contains 12x Skhy Berry 500ml (we'll need to create 330ml version first)
(10, 4, 12);

-- Insert Customers
INSERT INTO customers (customer_code, name, contact_person, email, phone, address, city, state, zip_code, customer_type, payment_terms, credit_limit) VALUES 
('DIST-NYC-001', 'NYC Distributor A', 'John Smith', 'john@nycdist.com', '(555) 123-4567', '100 Distribution Ave', 'New York', 'NY', '10001', 'distributor', 'Net 30', 50000.00),
('RETAIL-BRK-001', 'Brooklyn Retailer B', 'Sarah Johnson', 'sarah@brkretail.com', '(555) 234-5678', '200 Retail St', 'Brooklyn', 'NY', '11201', 'retailer', 'Net 15', 25000.00),
('DIST-MAN-001', 'Manhattan Store C', 'Mike Davis', 'mike@manstore.com', '(555) 345-6789', '300 Store Blvd', 'Manhattan', 'NY', '10002', 'retailer', 'Net 30', 35000.00),
('DIST-QNS-001', 'Queens Distributor D', 'Lisa Wilson', 'lisa@qnsdist.com', '(555) 456-7890', '400 Queens Ave', 'Queens', 'NY', '11101', 'distributor', 'Net 30', 60000.00);

-- Insert Vendors
INSERT INTO vendors (vendor_code, name, contact_person, email, phone, address, city, state, zip_code, payment_terms, lead_time_days, rating, status) VALUES 
('VEN-001', 'Premium Materials Co.', 'John Anderson', 'john@premiummat.com', '(555) 123-4567', '123 Industrial Ave', 'Newark', 'NJ', '07102', 'Net 30', 7, 4.8, 'active'),
('VEN-002', 'Flavor Solutions Ltd.', 'Sarah Chen', 'sarah@flavorsol.com', '(555) 234-5678', '456 Commerce St', 'Trenton', 'NJ', '08601', 'Net 15', 5, 4.9, 'active'),
('VEN-003', 'Packaging Innovations', 'Mike Rodriguez', 'mike@packinno.com', '(555) 345-6789', '789 Supply Rd', 'Hartford', 'CT', '06101', 'Net 30', 10, 4.2, 'pending_review');

-- Link vendors to materials
INSERT INTO vendor_materials (vendor_id, material_id, unit_cost, lead_time_days, minimum_order_quantity, is_preferred) VALUES 
-- Premium Materials Co. supplies packaging
(1, 1, 0.15, 7, 1000, 1), -- ALU-CAN-330
(1, 2, 0.18, 7, 1000, 1), -- ALU-CAN-500
(1, 3, 0.25, 7, 500, 1),  -- ALU-CAN-1000
(1, 4, 0.05, 5, 5000, 1), -- LBL-HTWO
(1, 5, 0.05, 5, 5000, 1), -- LBL-SKHY
(1, 6, 0.05, 5, 5000, 1), -- LBL-RALLIE
(1, 7, 0.03, 5, 10000, 1), -- CAP-STD

-- Flavor Solutions Ltd. supplies flavoring
(2, 8, 0.50, 3, 100, 1),  -- FLV-LIME
(2, 9, 0.55, 3, 100, 1),  -- FLV-BERRY
(2, 10, 0.52, 3, 100, 1), -- FLV-PEACH

-- Packaging Innovations supplies secondary packaging
(3, 12, 0.25, 10, 500, 0), -- CARDBOARD-4PK
(3, 13, 0.35, 10, 500, 0), -- CARDBOARD-6PK
(3, 14, 0.75, 10, 250, 0), -- CARDBOARD-12PK
(3, 15, 0.05, 10, 1000, 0), -- SHRINK-WRAP
(3, 16, 15.00, 14, 50, 0);  -- PALLET-STD

-- Insert initial inventory
INSERT INTO inventory (sku_id, warehouse_id, quantity_on_hand, quantity_reserved, safety_stock_level, reorder_point, max_stock_level, unit_cost) VALUES 
-- Main Distribution Center
(1, 1, 5000, 500, 1000, 2000, 10000, 1.25), -- HTWO Lime 330ml
(2, 1, 3000, 200, 800, 1500, 8000, 1.75),   -- HTWO Lime 500ml
(3, 1, 4500, 300, 1200, 2500, 12000, 1.25), -- HTWO Berry 330ml
(4, 1, 2500, 150, 600, 1200, 6000, 1.50),   -- Skhy Berry 500ml
(5, 1, 0, 0, 500, 1000, 5000, 2.50),        -- Skhy Peach 1L (upcoming)
(6, 1, 1800, 100, 400, 800, 4000, 2.25),    -- Rallie Peach 1L
(7, 1, 6000, 400, 1500, 3000, 15000, 1.15), -- Rallie Original 330ml

-- Brooklyn Facility
(1, 2, 2000, 100, 500, 1000, 5000, 1.25),   -- HTWO Lime 330ml
(4, 2, 1500, 50, 300, 600, 3000, 1.50),     -- Skhy Berry 500ml
(7, 2, 3000, 200, 800, 1500, 8000, 1.15),   -- Rallie Original 330ml

-- New Jersey Hub
(2, 3, 1200, 80, 300, 600, 3000, 1.75),     -- HTWO Lime 500ml
(3, 3, 2200, 150, 600, 1200, 6000, 1.25),   -- HTWO Berry 330ml
(6, 3, 900, 50, 200, 400, 2000, 2.25);      -- Rallie Peach 1L

-- Insert sample orders
INSERT INTO orders (order_number, customer_id, warehouse_id, order_date, requested_ship_date, status, subtotal, tax_amount, shipping_amount, total_amount, notes) VALUES 
('ORD-2024-001', 1, 1, '2024-01-15', '2024-01-20', 'processing', 12000.00, 960.00, 200.00, 13160.00, 'Large distributor order'),
('ORD-2024-002', 2, 2, '2024-01-14', '2024-01-18', 'shipped', 8400.00, 672.00, 150.00, 9222.00, 'Regular retailer order'),
('ORD-2024-003', 3, 1, '2024-01-16', '2024-01-22', 'pending', 21400.00, 1712.00, 300.00, 23412.00, 'Monthly store restock'),
('ORD-2024-004', 4, 3, '2024-01-12', '2024-01-16', 'delivered', 5400.00, 432.00, 100.00, 5932.00, 'Small distributor order');

-- Insert order items
INSERT INTO order_items (order_id, sku_id, quantity_ordered, quantity_shipped, unit_price) VALUES 
-- ORD-2024-001
(1, 1, 2000, 0, 2.99), -- HTWO Lime 330ml
(1, 3, 1500, 0, 2.99), -- HTWO Berry 330ml
(1, 7, 2000, 0, 2.49), -- Rallie Original 330ml

-- ORD-2024-002
(2, 1, 1500, 1500, 2.99), -- HTWO Lime 330ml
(2, 4, 800, 800, 3.49),   -- Skhy Berry 500ml

-- ORD-2024-003
(3, 1, 3000, 0, 2.99), -- HTWO Lime 330ml
(3, 2, 2000, 0, 3.99), -- HTWO Lime 500ml
(3, 6, 1000, 0, 5.49), -- Rallie Peach 1L

-- ORD-2024-004
(4, 7, 2000, 2000, 2.49), -- Rallie Original 330ml
(4, 6, 200, 200, 5.49);   -- Rallie Peach 1L

-- Insert BOM headers
INSERT INTO bom_headers (sku_id, version, is_active, effective_date, notes) VALUES 
(1, 'V1.0', 1, '2024-01-01', 'Initial BOM for HTWO Lime 330ml'),
(2, 'V1.0', 1, '2024-01-01', 'Initial BOM for HTWO Lime 500ml'),
(3, 'V1.0', 1, '2024-01-01', 'Initial BOM for HTWO Berry 330ml'),
(4, 'V1.0', 1, '2024-01-01', 'Initial BOM for Skhy Berry 500ml'),
(6, 'V1.0', 1, '2024-01-01', 'Initial BOM for Rallie Peach 1L'),
(7, 'V1.0', 1, '2024-01-01', 'Initial BOM for Rallie Original 330ml');

-- Insert BOM lines
INSERT INTO bom_lines (bom_header_id, material_id, quantity_required, unit_of_measure, scrap_factor) VALUES 
-- HTWO Lime 330ml BOM
(1, 1, 1.0, 'Unit', 0.02),   -- ALU-CAN-330
(1, 4, 1.0, 'Unit', 0.01),   -- LBL-HTWO
(1, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(1, 8, 5.0, 'ML', 0.0),      -- FLV-LIME
(1, 11, 320.0, 'ML', 0.0),   -- WATER-PURE

-- HTWO Lime 500ml BOM
(2, 2, 1.0, 'Unit', 0.02),   -- ALU-CAN-500
(2, 4, 1.0, 'Unit', 0.01),   -- LBL-HTWO
(2, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(2, 8, 8.0, 'ML', 0.0),      -- FLV-LIME
(2, 11, 485.0, 'ML', 0.0),   -- WATER-PURE

-- HTWO Berry 330ml BOM
(3, 1, 1.0, 'Unit', 0.02),   -- ALU-CAN-330
(3, 4, 1.0, 'Unit', 0.01),   -- LBL-HTWO
(3, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(3, 9, 6.0, 'ML', 0.0),      -- FLV-BERRY
(3, 11, 318.0, 'ML', 0.0),   -- WATER-PURE

-- Skhy Berry 500ml BOM
(4, 2, 1.0, 'Unit', 0.02),   -- ALU-CAN-500
(4, 5, 1.0, 'Unit', 0.01),   -- LBL-SKHY
(4, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(4, 9, 7.0, 'ML', 0.0),      -- FLV-BERRY
(4, 11, 485.0, 'ML', 0.0),   -- WATER-PURE

-- Rallie Peach 1L BOM
(5, 3, 1.0, 'Unit', 0.02),   -- ALU-CAN-1000
(5, 6, 1.0, 'Unit', 0.01),   -- LBL-RALLIE
(5, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(5, 10, 15.0, 'ML', 0.0),    -- FLV-PEACH
(5, 11, 975.0, 'ML', 0.0),   -- WATER-PURE

-- Rallie Original 330ml BOM
(6, 1, 1.0, 'Unit', 0.02),   -- ALU-CAN-330
(6, 6, 1.0, 'Unit', 0.01),   -- LBL-RALLIE
(6, 7, 1.0, 'Unit', 0.01),   -- CAP-STD
(6, 11, 325.0, 'ML', 0.0);   -- WATER-PURE (no flavoring for original)

-- Insert production orders
INSERT INTO production_orders (production_order_number, sku_id, warehouse_id, bom_header_id, planned_quantity, completed_quantity, status, planned_start_date, actual_start_date, planned_completion_date, priority) VALUES 
('PRD-2024-001', 1, 1, 1, 5000, 3500, 'in_progress', '2024-01-15', '2024-01-15', '2024-01-18', 1),
('PRD-2024-002', 4, 1, 4, 2000, 2000, 'completed', '2024-01-10', '2024-01-10', '2024-01-12', 2),
('PRD-2024-003', 6, 1, 5, 3000, 0, 'scheduled', '2024-01-20', NULL, '2024-01-23', 3);

-- Insert sample alerts
INSERT INTO alerts (alert_type, title, message, severity, entity_type, entity_id, is_read, assigned_to) VALUES 
('low_stock', 'Low Stock Alert', 'HTWO Lime 330ml - 45 units remaining in Main Distribution Center', 'high', 'sku', 1, 0, NULL),
('expiry_alert', 'Batch Expiry Alert', 'Batch #B2024-001 expires in 7 days', 'medium', 'inventory', NULL, 0, NULL),
('production_complete', 'Production Completed', 'Skhy Berry 500ml production run PRD-2024-002 completed successfully', 'low', 'production', 2, 1, NULL),
('vendor_confirmation', 'Vendor Confirmation', 'Vendor Premium Materials Co. confirmed PO #PO-2024-156', 'low', 'vendor', 1, 1, NULL);

-- Insert some inventory transactions
INSERT INTO inventory_transactions (sku_id, warehouse_id, transaction_type, quantity, reference_type, reference_id, unit_cost, notes) VALUES 
-- Production receipts
(1, 1, 'production', 3500, 'production', 1, 1.25, 'Production run PRD-2024-001 - partial completion'),
(4, 1, 'production', 2000, 'production', 2, 1.50, 'Production run PRD-2024-002 - completed'),

-- Order shipments
(1, 2, 'shipment', -1500, 'order', 2, 1.25, 'Order ORD-2024-002 shipment'),
(4, 2, 'shipment', -800, 'order', 2, 1.50, 'Order ORD-2024-002 shipment'),
(7, 3, 'shipment', -2000, 'order', 4, 1.15, 'Order ORD-2024-004 shipment'),
(6, 3, 'shipment', -200, 'order', 4, 2.25, 'Order ORD-2024-004 shipment'),

-- Inventory adjustments
(1, 1, 'adjustment', -50, 'adjustment', NULL, 1.25, 'Cycle count adjustment - damage'),
(3, 1, 'adjustment', 25, 'adjustment', NULL, 1.25, 'Cycle count adjustment - found inventory');

-- Update inventory quantities based on transactions
UPDATE inventory SET 
    quantity_on_hand = quantity_on_hand + 3500,
    updated_at = CURRENT_TIMESTAMP
WHERE sku_id = 1 AND warehouse_id = 1; -- HTWO Lime 330ml production

UPDATE inventory SET 
    quantity_on_hand = quantity_on_hand + 2000,
    updated_at = CURRENT_TIMESTAMP
WHERE sku_id = 4 AND warehouse_id = 1; -- Skhy Berry 500ml production

UPDATE inventory SET 
    quantity_on_hand = quantity_on_hand - 1500,
    updated_at = CURRENT_TIMESTAMP
WHERE sku_id = 1 AND warehouse_id = 2; -- HTWO Lime 330ml shipment

UPDATE inventory SET 
    quantity_on_hand = quantity_on_hand - 800,
    updated_at = CURRENT_TIMESTAMP
WHERE sku_id = 4 AND warehouse_id = 2; -- Skhy Berry 500ml shipment