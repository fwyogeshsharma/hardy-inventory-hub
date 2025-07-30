# Inventory Management Workflow Requirements

## Overview
This document outlines the complete workflow requirements for the Hardy Inventory Hub application, detailing the process flow from SKU management to kit production with Bill of Materials (BOM) functionality.

## Workflow Process

### 1. SKU Management & Out of Stock Detection
- Add SKUs to the inventory system
- Monitor stock levels automatically
- Detect when SKUs reach "out of stock" status
- **REQUIREMENT**: Add "Reorder" button on inventory item list for items with status 'out of stock'

### 2. Reorder Process
- When an SKU is out of stock, display a "Reorder" button on the inventory item list
- Clicking the "Reorder" button should:
  - Mark the item for reordering
  - Make the item visible on the Purchase Order page
  - Make the item visible on the Workflow page

### 3. Purchase Order Management
- Navigate to Purchase Order screen
- Display items that have been marked for reorder
- **REQUIREMENT**: Add button to "Check item in warehouse"
- If item is not available in warehouse:
  - Mark as "New Order Required"
  - Move item to Order page

### 4. Order Processing
- Items marked as "New Order Required" appear on Order page
- Verify that orders are coming from regular suppliers
- **REQUIREMENT**: Put SKU process on pause and wait for supplies
- Monitor supplier delivery status
- Once supplies are received from regulars, SKU becomes available for use

### 5. Bill of Materials (BOM) Functionality
- **REQUIREMENT**: Implement BOM functionality in the app
- Track what has been purchased
- Monitor quantity of each component
- Track per-piece price for each component
- Maintain purchase history and pricing data

### 6. Kit SKU Production
- Once individual SKUs are available, create Kit SKUs
- Use BOM data to determine required components
- **REQUIREMENT**: Production of Kit SKU with Kit BOM
- Track which components are used in each kit
- Monitor kit production costs and quantities

### 7. Workflow Dashboard Visualization
- **REQUIREMENT**: Visual representation on workflow-dashboard of inventory
- Real-time status updates for all workflow stages
- Track progress from initial SKU to final kit production
- Display alerts and notifications for critical workflow points

## Key Features Required

### Inventory Page Enhancements
- [x] Display SKU list with current stock status
- [ ] Add "Reorder" button for out-of-stock items
- [ ] Filter and sort by stock status
- [ ] Visual indicators for stock levels

### Purchase Order Page Features
- [ ] Display reorder requests
- [ ] "Check in warehouse" functionality
- [ ] Mark items as "New Order Required"
- [ ] Integration with warehouse management

### Order Management Page
- [ ] List items requiring new orders
- [ ] Supplier verification system
- [ ] Order tracking and status updates
- [ ] Pause/resume SKU processing

### Bill of Materials (BOM) System
- [ ] Create BOM for kit SKUs
- [ ] Track component costs and quantities
- [ ] Purchase history tracking
- [ ] Per-piece pricing system
- [ ] Component availability checking

### Kit Production System
- [ ] Kit SKU creation interface
- [ ] BOM-based production planning
- [ ] Component allocation system
- [ ] Production cost calculation
- [ ] Quality control tracking

### Workflow Dashboard
- [x] Real-time inventory status
- [x] Purchase order tracking
- [x] Sales order monitoring
- [x] Production metrics
- [ ] Enhanced workflow visualization
- [ ] Stage-by-stage progress tracking
- [ ] Alert system for bottlenecks

## Implementation Priority

### Phase 1: Core Reorder System
1. Add reorder buttons to inventory items
2. Implement purchase order request system
3. Create warehouse checking functionality
4. Basic order management page

### Phase 2: BOM System
1. Design BOM data structure
2. Implement BOM creation interface
3. Add cost tracking functionality
4. Purchase history system

### Phase 3: Kit Production
1. Kit SKU creation system
2. BOM-based production planning
3. Component allocation logic
4. Production workflow integration

### Phase 4: Enhanced Workflow Dashboard
1. Advanced visualization components
2. Real-time progress tracking
3. Automated workflow notifications
4. Performance analytics

## Technical Requirements

### Database Schema Updates
- Extend purchase order tables for reorder functionality
- Create BOM tables for kit management
- Add workflow status tracking tables
- Implement order pause/resume functionality

### API Endpoints
- Reorder request endpoints
- Warehouse checking API
- BOM management endpoints
- Kit production tracking API

### User Interface Components
- Reorder button component
- Warehouse status checker
- BOM editor interface
- Kit production dashboard

### Integration Points
- Inventory management system integration
- Purchase order system connection
- Warehouse management interface
- Supplier verification system

## Success Metrics
- Reduction in out-of-stock incidents
- Improved order fulfillment time
- Better cost tracking accuracy
- Enhanced production efficiency
- Real-time workflow visibility

## Dependencies
- Existing inventory management system
- Purchase order functionality
- Warehouse management system
- Supplier management database

This workflow ensures complete traceability from individual SKU procurement through kit production, with proper cost tracking and real-time visibility throughout the entire process.