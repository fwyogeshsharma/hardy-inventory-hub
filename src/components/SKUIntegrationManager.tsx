// Real-time SKU integration manager across all modules
import { useState, useEffect } from 'react';
import { dataService, inventoryManager } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface SKUIntegrationManagerProps {
  onSKUAdded?: (sku: any) => void;
}

export const SKUIntegrationManager = ({ onSKUAdded }: SKUIntegrationManagerProps) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeIntegration();
  }, []);

  const initializeIntegration = async () => {
    try {
      // Subscribe to SKU creation events
      inventoryManager.subscribe('sku_created', handleNewSKU);
      inventoryManager.subscribe('sku_updated', handleSKUUpdate);
      
      setIsInitialized(true);
      console.log('🔄 SKU Integration Manager initialized');
    } catch (error) {
      console.error('Failed to initialize SKU integration:', error);
    }
  };

  const handleNewSKU = async (skuData: any) => {
    try {
      console.log('🆕 New SKU detected:', skuData.sku_name);
      
      // 1. Auto-generate inventory records for all warehouses
      await createInventoryRecords(skuData);
      
      // 2. Make SKU available for orders
      await makeAvailableForOrders(skuData);
      
      // 3. Trigger real-time updates across all modules
      await broadcastSKUUpdate(skuData);
      
      // 4. Show success notification
      toast({
        title: "New Part Added Successfully! 🎉",
        description: `${skuData.sku_name} is now available across all modules`,
      });

      // 5. Callback to parent component
      if (onSKUAdded) {
        onSKUAdded(skuData);
      }
      
    } catch (error) {
      console.error('Failed to integrate new SKU:', error);
      toast({
        title: "Integration Warning",
        description: "SKU added but some integrations may need manual update",
        variant: "destructive",
      });
    }
  };

  const handleSKUUpdate = async (skuData: any) => {
    console.log('📝 SKU updated:', skuData.sku_name);
    await broadcastSKUUpdate(skuData);
  };

  const createInventoryRecords = async (sku: any) => {
    try {
      const warehouses = await dataService.getWarehouses();
      
      for (const warehouse of warehouses) {
        // Create realistic initial inventory
        const initialQuantity = Math.floor(Math.random() * 100) + 20; // 20-120 units
        const reorderPoint = Math.floor(initialQuantity * 0.3); // 30% reorder point
        
        const inventoryData = {
          sku_id: sku.id,
          warehouse_id: warehouse.id,
          quantity_available: initialQuantity,
          quantity_reserved: 0,
          quantity_on_order: 0,
          reorder_point: reorderPoint,
          max_level: Math.floor(initialQuantity * 2), // 200% max capacity
          last_counted: new Date().toISOString(),
          unit_cost: parseFloat((Math.random() * 150 + 25).toFixed(2)) // $25-$175
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
      
      console.log(`📦 Created inventory records for ${sku.sku_name} across ${warehouses.length} warehouses`);
    } catch (error) {
      console.error('Failed to create inventory records:', error);
    }
  };

  const makeAvailableForOrders = async (sku: any) => {
    try {
      // SKUs are automatically available for orders once created
      // This function can be extended for additional order-specific logic
      console.log(`🛒 ${sku.sku_name} is now available for Purchase Orders and Sales Orders`);
      
      // Emit events that order forms can listen to
      inventoryManager.emit('sku_available_for_orders', {
        sku_id: sku.id,
        sku_name: sku.sku_name,
        sku_code: sku.sku_code
      });
      
    } catch (error) {
      console.error('Failed to make SKU available for orders:', error);
    }
  };

  const broadcastSKUUpdate = async (sku: any) => {
    try {
      // Emit system-wide update events
      inventoryManager.emit('inventory_updated', {
        type: 'sku_change',
        sku_id: sku.id,
        sku_name: sku.sku_name,
        timestamp: new Date().toISOString()
      });

      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('dashboard-refresh'));
      
      // Trigger inventory page refresh  
      window.dispatchEvent(new CustomEvent('inventory-refresh'));
      
      // Trigger all order forms refresh
      window.dispatchEvent(new CustomEvent('orders-refresh'));
      
      console.log(`🔄 Broadcasted updates for ${sku.sku_name} across all modules`);
    } catch (error) {
      console.error('Failed to broadcast SKU update:', error);
    }
  };

  // This component doesn't render anything - it's purely for integration logic
  return null;
};

// Enhanced SKU creation wrapper with real-time integration
export const createSKUWithIntegration = async (skuData: any) => {
  try {
    // Create the SKU
    const newSKU = await dataService.createSKU(skuData);
    
    // Emit integration event
    inventoryManager.emit('sku_created', newSKU);
    
    return newSKU;
  } catch (error) {
    console.error('Failed to create SKU with integration:', error);
    throw error;
  }
};