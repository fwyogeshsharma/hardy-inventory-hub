// Initialize AutoFlow Parts with comprehensive automotive data
import { dataService } from './database';
import { initializeComprehensiveData } from './comprehensiveSampleData';
import { initializeCustomerOrdersData } from './sampleCustomerOrders';
import { initializePausedOrdersForTesting } from './initializePausedOrders';

export const initializeData = async () => {
  try {
    // Clear existing data first
    localStorage.removeItem('brands');
    localStorage.removeItem('categories');
    localStorage.removeItem('part_types');
    localStorage.removeItem('pack_sizes');
    localStorage.removeItem('warehouses');
    localStorage.removeItem('skus_db');
    localStorage.removeItem('inventory');
    localStorage.removeItem('sku_components');
    localStorage.removeItem('purchase_orders');
    localStorage.removeItem('sales_orders');
    localStorage.removeItem('production_orders');
    localStorage.removeItem('customer_orders');
    localStorage.removeItem('customer_order_items');

    // Initialize database structure
    await dataService.initialize();
    
    // Initialize comprehensive sample data (100+ SKUs)
    const result = await initializeComprehensiveData();
    console.log('📊 Sample data results:', result);

    // Generate realistic inventory levels for all SKUs
    await generateInitialInventoryLevels();

    // Initialize customer orders with realistic revenue data
    const customerOrdersResult = await initializeCustomerOrdersData();
    console.log('🛒 Customer orders initialized:', customerOrdersResult);

    console.log('🎉 Complete automotive parts database initialized!');
    console.log('📦 System now contains 100+ automotive parts');
    console.log('💰 Customer orders with revenue data included');
    console.log('🔄 Real-time synchronization enabled across all modules');
    return true;
  } catch (error) {
    console.error('Failed to initialize data:', error);
    return false;
  }
};

// Generate realistic inventory levels for all SKUs
const generateInitialInventoryLevels = async () => {
  try {
    const skus = await dataService.getSKUs();
    const warehouses = await dataService.getWarehouses();
    
    console.log(`📊 Generating inventory levels for ${skus.length} SKUs...`);
    
    for (const sku of skus) {
      for (const warehouse of warehouses) {
        // Generate realistic inventory quantities
        const baseQuantity = Math.floor(Math.random() * 500) + 50; // 50-550 units
        const reservedQuantity = Math.floor(baseQuantity * 0.1); // 10% reserved
        const availableQuantity = baseQuantity - reservedQuantity;
        
        // Set reorder points based on demand patterns
        const reorderPoint = Math.floor(baseQuantity * 0.2); // 20% of total stock
        const maxLevel = Math.floor(baseQuantity * 1.5); // 150% for max capacity
        
        // Add inventory record
        const inventoryData = {
          sku_id: sku.id,
          warehouse_id: warehouse.id,
          quantity_available: availableQuantity,
          quantity_reserved: reservedQuantity,
          quantity_on_order: Math.floor(Math.random() * 100), // Random on-order qty
          reorder_point: reorderPoint,
          max_level: maxLevel,
          last_counted: new Date().toISOString(),
          unit_cost: parseFloat((Math.random() * 200 + 10).toFixed(2)) // $10-$210
        };
        
        // Store inventory record
        const existingInventory = localStorage.getItem('inventory');
        const inventoryRecords = existingInventory ? JSON.parse(existingInventory) : [];
        const newId = Math.max(0, ...inventoryRecords.map((inv: any) => inv.id)) + 1;
        
        inventoryRecords.push({
          id: newId,
          ...inventoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        localStorage.setItem('inventory', JSON.stringify(inventoryRecords));
      }
    }
    
    console.log(`✅ Generated inventory records for ${skus.length} SKUs across ${warehouses.length} warehouses`);
    
    // Initialize paused orders for testing vendor notification workflow
    await initializePausedOrdersForTesting();
    
  } catch (error) {
    console.error('❌ Failed to generate inventory levels:', error);
  }
};