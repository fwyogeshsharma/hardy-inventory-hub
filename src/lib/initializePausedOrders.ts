// Initialize some paused orders for testing vendor notification workflow
import { workflowManager } from './workflowExtensions';

export const initializePausedOrdersForTesting = async () => {
  try {
    console.log('Initializing paused orders for vendor notification testing...');

    // Create sample paused orders
    const pausedOrders = [
      {
        id: 501,
        order_number: 'SUP-2024-0501',
        purchase_order_item_id: 501,
        supplier_id: 1,
        status: 'pending',
        is_regular_supplier: true,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity_ordered: 25,
        unit_cost: 45.99,
        total_cost: 1149.75,
        workflow_status: 'paused',
        pause_reason: 'Waiting for supplier confirmation - vendor assignment needed',
        notes: 'Regular supplier unavailable, need alternative vendor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sku_id: 1
      },
      {
        id: 502,
        order_number: 'SUP-2024-0502',
        purchase_order_item_id: 502,
        supplier_id: 2,
        status: 'pending',
        is_regular_supplier: false,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity_ordered: 100,
        unit_cost: 12.50,
        total_cost: 1250.00,
        workflow_status: 'paused',
        pause_reason: 'Supplier pricing issue - need vendor reassignment',
        notes: 'High volume order requires competitive pricing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sku_id: 2
      },
      {
        id: 503,
        order_number: 'SUP-2024-0503',
        purchase_order_item_id: 503,
        supplier_id: 3,
        status: 'pending',
        is_regular_supplier: true,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity_ordered: 50,
        unit_cost: 78.99,
        total_cost: 3949.50,
        workflow_status: 'paused',
        pause_reason: 'Waiting for supplier availability - urgent vendor needed',
        notes: 'Critical component for high-priority customer order',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sku_id: 3
      }
    ];

    // Get existing supplier orders
    const existingOrders = JSON.parse(localStorage.getItem('supplier_orders') || '[]');
    
    // Add paused orders if they don't already exist
    const existingIds = new Set(existingOrders.map((order: any) => order.id));
    const newOrders = pausedOrders.filter(order => !existingIds.has(order.id));
    
    if (newOrders.length > 0) {
      const allOrders = [...existingOrders, ...newOrders];
      localStorage.setItem('supplier_orders', JSON.stringify(allOrders));
      console.log(`Added ${newOrders.length} paused orders for testing`);
    } else {
      console.log('Paused test orders already exist');
    }

    // Also create corresponding purchase order items if they don't exist
    const purchaseOrderItems = [
      {
        id: 501,
        purchase_order_id: 101,
        sku_id: 1,
        quantity_ordered: 25,
        quantity_received: 0,
        unit_cost: 45.99,
        line_total: 1149.75,
        warehouse_status: 'new_order_required',
        notes: 'Generated for paused workflow test',
        created_at: new Date().toISOString()
      },
      {
        id: 502,
        purchase_order_id: 102,
        sku_id: 2,
        quantity_ordered: 100,
        quantity_received: 0,
        unit_cost: 12.50,
        line_total: 1250.00,
        warehouse_status: 'new_order_required',
        notes: 'Generated for paused workflow test',
        created_at: new Date().toISOString()
      },
      {
        id: 503,
        purchase_order_id: 103,
        sku_id: 3,
        quantity_ordered: 50,
        quantity_received: 0,
        unit_cost: 78.99,
        line_total: 3949.50,
        warehouse_status: 'new_order_required',
        notes: 'Generated for paused workflow test',
        created_at: new Date().toISOString()
      }
    ];

    const existingItems = JSON.parse(localStorage.getItem('purchase_order_items') || '[]');
    const existingItemIds = new Set(existingItems.map((item: any) => item.id));
    const newItems = purchaseOrderItems.filter(item => !existingItemIds.has(item.id));
    
    if (newItems.length > 0) {
      const allItems = [...existingItems, ...newItems];
      localStorage.setItem('purchase_order_items', JSON.stringify(allItems));
      console.log(`Added ${newItems.length} purchase order items for testing`);
    }

    console.log('✅ Paused orders initialization complete');
    console.log('📋 You can now test the vendor notification workflow:');
    console.log('   1. Go to Orders page to see paused workflows');
    console.log('   2. Go to Vendors page to see assignment notifications');
    console.log('   3. Assign vendors to resume workflows');

    return true;
  } catch (error) {
    console.error('Error initializing paused orders:', error);
    return false;
  }
};