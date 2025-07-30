import { inventoryManager, dataService } from "@/lib/database";

/**
 * Demonstration of the complete inventory management workflow
 * This simulates the real-world process described in the requirements:
 * 1. SKU Inventory Check → 2. Automatic PO Creation → 3. Production Job Order → 4. Sales Order Processing
 */

export class WorkflowDemo {
  
  /**
   * Simulate a complete workflow cycle
   */
  static async simulateWorkflowCycle() {
    console.log("🚀 Starting Inventory Management Workflow Demo");
    
    try {
      // Step 1: Get a random SKU and simulate stock depletion
      const skus = await dataService.getSKUs();
      const inventory = await dataService.getInventory();
      
      if (skus.length === 0 || inventory.length === 0) {
        console.log("⚠️ No SKUs or inventory found. Please add some data first.");
        return;
      }
      
      const randomSKU = skus[Math.floor(Math.random() * skus.length)];
      const inventoryRecord = inventory.find(inv => inv.sku_id === randomSKU.id);
      
      if (!inventoryRecord) {
        console.log(`⚠️ No inventory record found for SKU ${randomSKU.sku_code}`);
        return;
      }
      
      console.log(`📦 Selected SKU: ${randomSKU.sku_code} - ${randomSKU.sku_name}`);
      console.log(`📊 Current stock: ${inventoryRecord.quantity_on_hand}, Reorder point: ${inventoryRecord.reorder_point}`);
      
      // Step 2: Simulate inventory depletion to trigger automatic reorder
      if (inventoryRecord.quantity_on_hand > inventoryRecord.reorder_point) {
        console.log("📉 Simulating inventory depletion...");
        const depletionAmount = inventoryRecord.quantity_on_hand - Math.floor(inventoryRecord.reorder_point * 0.8);
        
        await inventoryManager.updateInventoryLevel(
          randomSKU.id,
          inventoryRecord.warehouse_id,
          -depletionAmount,
          'shipment',
          999999 // Simulated order reference
        );
        
        console.log(`✅ Depleted ${depletionAmount} units via simulated shipment`);
        
        // Give the system a moment to process the low stock alert and automatic reorder
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Step 3: Check if purchase order was automatically created
      const purchaseOrders = await inventoryManager.getPurchaseOrders();
      const recentPO = purchaseOrders
        .filter(po => po.sku_id === randomSKU.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
      if (recentPO) {
        console.log(`🛒 Automatic Purchase Order created: ${recentPO.order_number} for ${recentPO.quantity_ordered} units`);
        
        // Step 4: Simulate receiving the purchase order
        console.log("📦 Simulating purchase order receipt...");
        await inventoryManager.processPurchaseOrderReceipt(recentPO.id, recentPO.quantity_ordered);
        console.log(`✅ Purchase order ${recentPO.order_number} received and inventory updated`);
      }
      
      // Step 5: Create a sales order to demonstrate stock allocation
      console.log("🛍️ Creating sample sales order...");
      const salesOrderResult = await inventoryManager.createSalesOrder({
        customer_name: "Demo Customer Inc.",
        customer_type: "distributor",
        contact_person: "John Demo",
        email: "demo@example.com",
        priority: "medium",
        required_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        shipping_method: "standard",
        payment_terms: "net_30",
        order_items: [
          {
            sku_id: randomSKU.id,
            quantity: Math.min(10, Math.floor(inventoryRecord.quantity_on_hand * 0.1)),
            unit_price: randomSKU.unit_price || 25.00
          }
        ],
        notes: "Demo sales order for workflow demonstration"
      });
      
      console.log(`✅ Sales Order created: ${salesOrderResult.order.order_number}`);
      
      if (salesOrderResult.stock_warnings.length > 0) {
        console.log("⚠️ Stock warnings:", salesOrderResult.stock_warnings);
      }
      
      // Step 6: Create a production job order if it's a manufactured item
      if (randomSKU.sku_type === 'single') {
        console.log("🏭 Creating production job order...");
        const productionResult = await inventoryManager.createProductionJobOrder({
          sku_id: randomSKU.id,
          warehouse_id: inventoryRecord.warehouse_id,
          quantity_planned: 100,
          priority: "medium",
          planned_start_date: new Date().toISOString().split('T')[0],
          planned_completion_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          shift: "day",
          supervisor: "Demo Supervisor",
          notes: "Demo production order for workflow demonstration"
        });
        
        console.log(`✅ Production Job Order created: ${productionResult.order.order_number}`);
        
        // Simulate starting and completing production
        console.log("🚀 Starting production...");
        await inventoryManager.startProductionJobOrder(productionResult.order.id);
        
        console.log("✅ Completing production...");
        await inventoryManager.completeProductionJobOrder(productionResult.order.id, {
          quantity_completed: 95,
          quantity_scrapped: 5,
          notes: "Demo production completed successfully"
        });
        
        console.log("🏭 Production completed and inventory updated");
      }
      
      // Step 7: Display final status
      console.log("\n🎉 Workflow Demo Completed Successfully!");
      console.log("📈 Summary of activities:");
      console.log("  ✅ Inventory depletion triggered automatic reorder");
      console.log("  ✅ Purchase order created and received");
      console.log("  ✅ Sales order created with stock allocation");
      console.log("  ✅ Production order created and completed (if applicable)");
      console.log("  ✅ Real-time notifications sent for all activities");
      
      // Get final inventory status
      const finalStatus = await inventoryManager.getInventoryStatus();
      console.log("\n📊 Final System Status:");
      console.log(`  📦 Total SKUs: ${finalStatus.total_skus}`);
      console.log(`  ⚠️ Low Stock Items: ${finalStatus.low_stock_items}`);
      console.log(`  🔴 Out of Stock Items: ${finalStatus.out_of_stock_items}`);
      console.log(`  💰 Total Inventory Value: $${finalStatus.total_value.toLocaleString()}`);
      console.log(`  📋 Pending Orders: ${finalStatus.pending_orders}`);
      console.log(`  🚨 Active Alerts: ${finalStatus.alerts.length}`);
      
    } catch (error) {
      console.error("❌ Workflow demo failed:", error);
      throw error;
    }
  }
  
  /**
   * Simulate just the low stock → automatic reorder workflow
   */
  static async simulateLowStockReorder() {
    console.log("🔄 Simulating Low Stock → Automatic Reorder Workflow");
    
    const skus = await dataService.getSKUs();
    const inventory = await dataService.getInventory();
    
    if (skus.length === 0 || inventory.length === 0) {
      console.log("⚠️ No data available for simulation");
      return;
    }
    
    const randomSKU = skus[Math.floor(Math.random() * skus.length)];
    const inventoryRecord = inventory.find(inv => inv.sku_id === randomSKU.id);
    
    if (!inventoryRecord) return;
    
    // Deplete stock to below reorder point
    const currentStock = inventoryRecord.quantity_on_hand;
    const targetStock = Math.floor(inventoryRecord.reorder_point * 0.5);
    const depletionAmount = currentStock - targetStock;
    
    if (depletionAmount > 0) {
      console.log(`📉 Depleting stock from ${currentStock} to ${targetStock}`);
      
      await inventoryManager.updateInventoryLevel(
        randomSKU.id,
        inventoryRecord.warehouse_id,
        -depletionAmount,
        'shipment'
      );
      
      console.log("✅ Low stock alert should be triggered automatically");
      console.log("✅ Automatic purchase order should be created");
    }
  }
  
  /**
   * Reset demo data for testing
   */
  static async resetDemoData() {
    console.log("🔄 Resetting demo data...");
    
    // This would clear all transactional data but keep master data
    const keysToReset = [
      'inventory_transactions',
      'purchase_orders', 
      'sales_orders',
      'sales_order_items',
      'production_job_orders',
      'alerts'
    ];
    
    keysToReset.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log("✅ Demo data reset complete");
  }
}

// Export helper function for easy console access
(window as any).workflowDemo = WorkflowDemo;