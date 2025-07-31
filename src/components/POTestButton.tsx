import React from "react";
import { Button } from "@/components/ui/button";
import { Package, Zap } from "lucide-react";
import { workflowManager } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

export default function POTestButton() {
  const { toast } = useToast();

  const createTestPO = async () => {
    try {
      // Create a test purchase order using the extended system
      const orders = localStorage.getItem('purchase_orders_extended');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `PO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const testOrder = {
        id: newId,
        order_number: orderNumber,
        vendor_id: 1,
        warehouse_id: 1,
        status: 'pending',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_amount: 150.00,
        notes: `🧪 TEST AUTO-GENERATED PO\nCreated to verify PO visibility\nTest component shortage`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(testOrder);
      localStorage.setItem('purchase_orders_extended', JSON.stringify(existingOrders));
      
      // Create a test purchase order item
      await workflowManager.createPurchaseOrderItem({
        purchase_order_id: newId,
        sku_id: 1, // Test SKU ID
        quantity_ordered: 10,
        unit_cost: 15.00,
        notes: 'Test auto-generated item'
      });
      
      console.log('✅ Created test PO:', orderNumber);
      
      toast({
        title: "Test PO Created",
        description: `Created test purchase order ${orderNumber}. Check the Purchase Orders page!`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('❌ Error creating test PO:', error);
      toast({
        title: "Error",
        description: "Failed to create test purchase order",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={createTestPO}
      variant="outline"
      size="sm"
      className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
    >
      <Zap className="h-4 w-4 mr-2" />
      Create Test PO
    </Button>
  );
}