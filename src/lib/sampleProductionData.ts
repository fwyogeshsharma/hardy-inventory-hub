// Sample data for production planning and BOM workflow testing
import { inventoryManager, dataService } from './database';
import { workflowManager } from './workflowExtensions';

export async function initializeSampleProductionData() {
  try {
    console.log('🔧 Initializing sample production data...');

    // Create sample BOM templates if they don't exist
    const existingBOMs = await workflowManager.getBOMTemplates();
    
    if (existingBOMs.length === 0) {
      console.log('📋 Creating sample BOM templates...');
      
      // Get available SKUs for BOM creation
      const skus = await dataService.getSKUs();
      const kitSKUs = skus.filter(sku => sku.sku_type === 'kit');
      const componentSKUs = skus.filter(sku => sku.sku_type === 'single');

      if (kitSKUs.length > 0 && componentSKUs.length >= 3) {
        // Create Engine Kit BOM
        const engineKitBOM = await workflowManager.createBOMTemplate({
          kit_sku_id: kitSKUs[0].id,
          name: 'Engine Maintenance Kit v2.1',
          description: 'Complete engine maintenance kit with filters and fluids',
          version: '2.1',
          labor_cost: 45.00,
          overhead_cost: 25.00,
          components: [
            {
              component_sku_id: componentSKUs[0].id,
              quantity_required: 25,
              unit_cost: 15.50,
              is_critical: true,
              notes: 'High-performance air filter'
            },
            {
              component_sku_id: componentSKUs[1].id,
              quantity_required: 8,
              unit_cost: 8.75,
              is_critical: true,
              notes: 'Premium spark plugs'
            },
            {
              component_sku_id: componentSKUs[2].id,
              quantity_required: 12,
              unit_cost: 22.00,
              is_critical: false,
              notes: 'Oil filter standard'
            }
          ]
        });

        console.log('✅ Created Engine Kit BOM:', engineKitBOM.name);

        // Create sample sales order with BOM template
        const salesOrder = await inventoryManager.createSalesOrder({
          customer_name: 'AutoZone Distribution Center',
          customer_type: 'distributor',
          contact_person: 'Mike Johnson',
          email: 'mike.johnson@autozone.com',
          phone: '(555) 123-4567',
          priority: 'high',
          required_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
          shipping_method: 'express',
          payment_terms: 'net_30',
          bom_template_id: engineKitBOM.id,
          production_required: true,
          total_amount: engineKitBOM.total_cost,
          notes: '🚗 High-priority order for AutoZone. Engine maintenance kits needed for Q1 promotion.'
        });

        console.log('✅ Created sample sales order with BOM:', salesOrder.order.order_number);

        // Create another BOM template for variety
        if (kitSKUs.length > 1) {
          const transmissionBOM = await workflowManager.createBOMTemplate({
            kit_sku_id: kitSKUs[1].id,
            name: 'Transmission Service Kit v1.5',
            description: 'Complete transmission service kit with filters and gaskets',
            version: '1.5',
            labor_cost: 65.00,
            overhead_cost: 35.00,
            components: componentSKUs.slice(0, 4).map((sku, index) => ({
              component_sku_id: sku.id,
              quantity_required: [15, 6, 20, 4][index],
              unit_cost: [18.00, 12.50, 8.25, 45.00][index],
              is_critical: index < 2,
              notes: ['Transmission filter', 'Gasket set', 'Fluid additive', 'Seal kit'][index]
            }))
          });

          console.log('✅ Created Transmission Kit BOM:', transmissionBOM.name);
        }
      }
    }

    // Simulate low inventory for demonstration
    console.log('📦 Adjusting inventory levels for demonstration...');
    
    // Set some components to low/zero inventory to trigger PO generation
    const inventory = await dataService.getInventory();
    const componentsToAdjust = inventory.slice(0, 3);
    
    for (const item of componentsToAdjust) {
      // Set inventory to low levels to demonstrate shortage
      const lowQuantity = Math.floor(Math.random() * 5); // 0-4 units
      
      await inventoryManager.updateInventoryLevel(
        item.sku_id,
        item.warehouse_id,
        lowQuantity - item.quantity_on_hand, // Adjust to target quantity
        'adjustment',
        0,
        '🧪 Demo adjustment - Set low inventory to demonstrate PO generation'
      );
    }

    console.log('✅ Sample production data initialized successfully');
    return true;

  } catch (error) {
    console.error('❌ Error initializing sample production data:', error);
    return false;
  }
}

// Function to create a demonstration production plan
export async function createDemoProductionPlan() {
  try {
    console.log('🎭 Creating demo production plan...');

    const [salesOrders, bomTemplates] = await Promise.all([
      inventoryManager.getSalesOrders(),
      workflowManager.getBOMTemplates()
    ]);

    // Find a sales order with BOM template
    const bomBasedOrders = salesOrders.filter(order => 
      order.bom_template_id && order.production_required
    );

    if (bomBasedOrders.length === 0) {
      console.log('⚠️ No BOM-based sales orders found for demo');
      return null;
    }

    const order = bomBasedOrders[0];
    const bomTemplate = bomTemplates.find(bom => bom.id === order.bom_template_id);

    if (!bomTemplate) {
      console.log('⚠️ BOM template not found for demo');
      return null;
    }

    // Create production plan
    const planId = `DEMO-${Date.now()}`;
    const productionPlan = {
      id: planId,
      sales_order_id: order.id,
      bom_template_id: bomTemplate.id,
      sales_order: order,
      bom_template: bomTemplate,
      inventory_check: [],
      status: 'pending_verification',
      created_at: new Date().toISOString()
    };

    // Store in localStorage
    const existingPlans = localStorage.getItem('production_plans');
    const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
    parsedPlans.push(productionPlan);
    localStorage.setItem('production_plans', JSON.stringify(parsedPlans));

    console.log('✅ Demo production plan created:', planId);
    return productionPlan;

  } catch (error) {
    console.error('❌ Error creating demo production plan:', error);
    return null;
  }
}

// Export initialization function
export { initializeSampleProductionData as default };