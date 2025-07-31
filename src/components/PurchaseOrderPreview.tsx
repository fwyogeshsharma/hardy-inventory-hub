import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  DollarSign, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Eye,
  ExternalLink
} from "lucide-react";
import { inventoryManager, dataService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrderPreviewProps {
  productionPlanId: string;
  onClose: () => void;
}

export default function PurchaseOrderPreview({ productionPlanId, onClose }: PurchaseOrderPreviewProps) {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrders();
  }, [productionPlanId]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      
      // Get all purchase orders
      const allPOs = await inventoryManager.getPurchaseOrders();
      
      // Filter POs that were created for this production plan
      const planPOs = allPOs.filter(po => 
        po.notes && po.notes.includes(productionPlanId)
      );

      // Get PO items and SKU data for each PO
      const [poItems, skus] = await Promise.all([
        inventoryManager.getPurchaseOrderItems(),
        dataService.getSKUs()
      ]);

      // Enrich POs with items and SKU data
      const enrichedPOs = planPOs.map(po => {
        const items = poItems.filter(item => item.purchase_order_id === po.id);
        const enrichedItems = items.map(item => ({
          ...item,
          sku: skus.find(sku => sku.id === item.sku_id)
        }));

        return {
          ...po,
          items: enrichedItems
        };
      });

      setPurchaseOrders(enrichedPOs);
      
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ordered': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'received': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading purchase orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
            Generated Purchase Orders
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              {purchaseOrders.length} orders
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {purchaseOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Purchase Orders Found
            </h3>
            <p className="text-gray-500">
              No purchase orders have been generated for this production plan yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchaseOrders.map((po) => (
              <Card key={po.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{po.order_number}</h4>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(po.order_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-2 ${getStatusColor(po.status)}`}>
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </Badge>
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(po.total_amount || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expected: {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>

                  {/* PO Items */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Items:</h5>
                    {po.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.sku?.sku_name || 'Unknown Item'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.sku?.sku_code} • Qty: {item.quantity_ordered}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.unit_cost || 0)}
                          </p>
                          <p className="text-xs text-gray-500">per unit</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Auto-generated note */}
                  {po.notes && (
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-800 mb-1">Auto-Generated Order</p>
                          <p className="text-xs text-blue-700 whitespace-pre-line">
                            {po.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open('/purchase-orders', '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View in PO Page
                    </Button>
                    {po.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          toast({
                            title: "Order Sent",
                            description: `Purchase order ${po.order_number} marked as sent to supplier`,
                            variant: "default",
                          });
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark as Sent
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}