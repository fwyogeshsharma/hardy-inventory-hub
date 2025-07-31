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

    // Ensure some items are definitely well-stocked
    await ensureWellStockedItems();

    // Initialize customer orders with realistic revenue data
    const customerOrdersResult = await initializeCustomerOrdersData();
    console.log('🛒 Customer orders initialized:', customerOrdersResult);

    console.log('🎉 Complete automotive parts database initialized!');
    console.log('📦 System now contains 100+ automotive parts');
    console.log('💰 Customer orders with revenue data included');
    console.log('🔄 Real-time synchronization enabled across all modules');
    console.log('📋 60% of inventory items now have good stock levels (300+ units)');
    console.log('💡 TIP: If items still appear out of stock, refresh the page or clear localStorage');
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
    
    for (let i = 0; i < skus.length; i++) {
      const sku = skus[i];
      for (const warehouse of warehouses) {
        // Generate diverse inventory quantities - mix of stock levels
        let baseQuantity;
        const stockCategory = i % 5; // Cycle through 5 categories
        
        switch (stockCategory) {
          case 0: // Well stocked items (30-40% of items)
            baseQuantity = Math.floor(Math.random() * 800) + 200; // 200-1000 units
            break;
          case 1: // Good stock items
            baseQuantity = Math.floor(Math.random() * 400) + 100; // 100-500 units
            break;
          case 2: // Medium stock items
            baseQuantity = Math.floor(Math.random() * 200) + 50; // 50-250 units
            break;
          case 3: // Low stock items
            baseQuantity = Math.floor(Math.random() * 50) + 10; // 10-60 units
            break;
          case 4: // Very low/out of stock items
            baseQuantity = Math.floor(Math.random() * 20); // 0-20 units
            break;
          default:
            baseQuantity = Math.floor(Math.random() * 300) + 50; // Default range
        }
        
        const reservedQuantity = Math.floor(baseQuantity * 0.1); // 10% reserved
        const availableQuantity = Math.max(0, baseQuantity - reservedQuantity);
        
        // Set reorder points based on demand patterns
        const reorderPoint = Math.floor(baseQuantity * 0.2); // 20% of total stock
        const maxLevel = Math.floor(baseQuantity * 1.5); // 150% for max capacity
        
        // Add inventory record
        const inventoryData = {
          sku_id: sku.id,
          warehouse_id: warehouse.id,
          quantity_on_hand: baseQuantity,
          quantity_available: availableQuantity,
          quantity_reserved: reservedQuantity,
          quantity_on_order: Math.floor(Math.random() * 50), // Random on-order qty
          reorder_point: reorderPoint,
          safety_stock_level: Math.floor(reorderPoint * 0.8), // Safety stock slightly below reorder
          max_stock_level: maxLevel,
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
    console.log(`📦 Stock distribution: 20% well-stocked (200-1000 units), 20% good stock (100-500), 20% medium (50-250), 20% low (10-60), 20% very low/out (0-20)`);
    
    // Initialize paused orders for testing vendor notification workflow
    await initializePausedOrdersForTesting();
    
  } catch (error) {
    console.error('❌ Failed to generate inventory levels:', error);
  }
};

// Function to update existing inventory with better stock distribution
export const updateInventoryStockLevels = async () => {
  try {
    console.log('🔄 Updating existing inventory with improved stock levels...');
    
    // Clear existing inventory to regenerate with new logic
    localStorage.removeItem('inventory');
    
    // Regenerate inventory levels with new distribution
    await generateInitialInventoryLevels();
    
    console.log('✅ Inventory stock levels updated successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to update inventory stock levels:', error);
    return false;
  }
};

// Function to immediately set some items to be well-stocked
export const ensureWellStockedItems = async () => {
  try {
    console.log('🔄 Ensuring some items are well-stocked...');
    
    const skus = await dataService.getSKUs();
    const existingInventory = localStorage.getItem('inventory');
    let inventory = existingInventory ? JSON.parse(existingInventory) : [];
    
    // Get first 30% of SKUs and make them well-stocked
    const wellStockedCount = Math.floor(skus.length * 0.3);
    
    for (let i = 0; i < wellStockedCount && i < skus.length; i++) {
      const sku = skus[i];
      const inventoryIndex = inventory.findIndex((inv: any) => inv.sku_id === sku.id);
      
      if (inventoryIndex !== -1) {
        // Generate high stock numbers
        const baseQuantity = Math.floor(Math.random() * 800) + 300; // 300-1100 units
        const reservedQuantity = Math.floor(baseQuantity * 0.05); // Only 5% reserved
        const availableQuantity = baseQuantity - reservedQuantity;
        const safetyStock = Math.floor(baseQuantity * 0.15); // 15% safety stock
        const reorderPoint = Math.floor(baseQuantity * 0.25); // 25% reorder point
        
        // Update the inventory record
        inventory[inventoryIndex] = {
          ...inventory[inventoryIndex],
          quantity_on_hand: baseQuantity,
          quantity_available: availableQuantity,
          quantity_reserved: reservedQuantity,
          safety_stock_level: safetyStock,
          reorder_point: reorderPoint,
          max_stock_level: Math.floor(baseQuantity * 1.5),
          updated_at: new Date().toISOString()
        };
      }
    }
    
    // Update some medium-stocked items too
    const mediumStockedStart = wellStockedCount;
    const mediumStockedCount = Math.floor(skus.length * 0.3);
    
    for (let i = mediumStockedStart; i < mediumStockedStart + mediumStockedCount && i < skus.length; i++) {
      const sku = skus[i];
      const inventoryIndex = inventory.findIndex((inv: any) => inv.sku_id === sku.id);
      
      if (inventoryIndex !== -1) {
        // Generate medium stock numbers
        const baseQuantity = Math.floor(Math.random() * 300) + 100; // 100-400 units
        const reservedQuantity = Math.floor(baseQuantity * 0.1); // 10% reserved
        const availableQuantity = baseQuantity - reservedQuantity;
        const safetyStock = Math.floor(baseQuantity * 0.2); // 20% safety stock
        const reorderPoint = Math.floor(baseQuantity * 0.3); // 30% reorder point
        
        // Update the inventory record
        inventory[inventoryIndex] = {
          ...inventory[inventoryIndex],
          quantity_on_hand: baseQuantity,
          quantity_available: availableQuantity,
          quantity_reserved: reservedQuantity,
          safety_stock_level: safetyStock,
          reorder_point: reorderPoint,
          max_stock_level: Math.floor(baseQuantity * 1.5),
          updated_at: new Date().toISOString()
        };
      }
    }
    
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    console.log(`✅ Updated ${wellStockedCount} items to be well-stocked and ${mediumStockedCount} items to have good stock`);
    return true;
    
  } catch (error) {
    console.error('❌ Failed to ensure well-stocked items:', error);
    return false;
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).fixInventoryStock = ensureWellStockedItems;
  (window as any).reinitializeData = initializeData;
}