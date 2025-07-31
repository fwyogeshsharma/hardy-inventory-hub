import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Download,
  RefreshCw,
  Plus,
  Package,
  Truck,
  DollarSign,
  Filter,
  Search,
  Eye,
  Edit,
  Loader2,
  Warehouse,
  ClipboardCheck,
  XCircle,
  PlayCircle
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { workflowManager, PurchaseOrderItem, ReorderRequest } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";
import { FormModal } from "@/components/forms/FormModal";

interface ExtendedPurchaseOrder {
  id: number;
  order_number: string;
  vendor_id: number;
  warehouse_id: number;
  reorder_request_id?: number;
  status: 'pending' | 'approved' | 'sent' | 'partial' | 'completed' | 'cancelled';
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PurchaseOrderItem[];
}

export default function PurchaseOrders() {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<ExtendedPurchaseOrder[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [reorderRequests, setReorderRequests] = useState<ReorderRequest[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingItems, setCheckingItems] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [purchaseOrdersData, purchaseOrderItemsData, reorderRequestsData, skusData] = await Promise.all([
        workflowManager.getPurchaseOrdersExtended(),
        workflowManager.getPurchaseOrderItems(),
        workflowManager.getReorderRequests(),
        dataService.getSKUs()
      ]);
      
      // Enrich purchase orders with items
      const enrichedPurchaseOrders = purchaseOrdersData.map(po => ({
        ...po,
        items: purchaseOrderItemsData.filter(item => item.purchase_order_id === po.id)
      }));
      
      // Enrich purchase order items with SKU data
      const enrichedItems = purchaseOrderItemsData.map(item => ({
        ...item,
        sku: skusData.find(sku => sku.id === item.sku_id)
      }));
      
      setPurchaseOrders(enrichedPurchaseOrders);
      setPurchaseOrderItems(enrichedItems);
      setReorderRequests(reorderRequestsData);
      setSKUs(skusData);
      
    } catch (error) {
      console.error('Error loading purchase orders data:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseCheck = async (item: PurchaseOrderItem, status: 'in_warehouse' | 'not_available' | 'partial_available') => {
    try {
      setCheckingItems(prev => new Set(prev).add(item.id));
      
      const quantityFound = status === 'in_warehouse' ? item.quantity_ordered : 
                          status === 'partial_available' ? Math.floor(item.quantity_ordered / 2) : 0;
      
      await workflowManager.checkItemInWarehouse(item.id, {
        status,
        quantity_found: quantityFound,
        location: status === 'in_warehouse' ? `Aisle A-${Math.floor(Math.random() * 20) + 1}` : undefined,
        notes: `Warehouse check performed on ${new Date().toLocaleDateString()}`
      });
      
      toast({
        title: "Warehouse Check Complete",
        description: status === 'in_warehouse' 
          ? `Item ${item.sku?.sku_code} found in warehouse (${quantityFound} units)`
          : status === 'not_available'
            ? `Item ${item.sku?.sku_code} not available - supplier order will be created`
            : `Item ${item.sku?.sku_code} partially available (${quantityFound} units)`,
        variant: status === 'not_available' ? "destructive" : "default",
      });
      
      // Reload data to reflect changes
      await loadData();
      
    } catch (error) {
      console.error('Error performing warehouse check:', error);
      toast({
        title: "Error",
        description: "Failed to perform warehouse check",
        variant: "destructive",
      });
    } finally {
      setCheckingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'sent': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'partial': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getWarehouseStatusColor = (status: string) => {
    switch (status) {
      case 'not_checked': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'in_warehouse': return 'bg-green-50 text-green-700 border-green-200';
      case 'not_available': return 'bg-red-50 text-red-700 border-red-200';
      case 'new_order_required': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredItems = purchaseOrderItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.sku?.sku_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.sku_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.warehouse_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by creation date (newest first)
    const dateA = new Date(a.created_at || '1970-01-01').getTime();
    const dateB = new Date(b.created_at || '1970-01-01').getTime();
    return dateB - dateA;
  });

  // Calculate summary statistics
  const totalItems = purchaseOrderItems.length;
  const pendingChecks = purchaseOrderItems.filter(item => item.warehouse_status === 'not_checked').length;
  const inWarehouse = purchaseOrderItems.filter(item => item.warehouse_status === 'in_warehouse').length;
  const needNewOrders = purchaseOrderItems.filter(item => item.warehouse_status === 'new_order_required').length;
  const totalValue = purchaseOrderItems.reduce((sum, item) => sum + (item.unit_cost * item.quantity_ordered), 0);

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Purchase Orders & Reorder Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage reorder requests, warehouse checks, and supplier orders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold">{totalItems}</p>
                <p className="text-blue-100 text-xs mt-1">Purchase order items</p>
              </div>
              <Package className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pending Checks</p>
                <p className="text-3xl font-bold">{pendingChecks}</p>
                <p className="text-blue-100 text-xs mt-1">Need warehouse verification</p>
              </div>
              <ClipboardCheck className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">In Warehouse</p>
                <p className="text-3xl font-bold">{inWarehouse}</p>
                <p className="text-blue-100 text-xs mt-1">Available items</p>
              </div>
              <Warehouse className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Need Orders</p>
                <p className="text-3xl font-bold">{needNewOrders}</p>
                <p className="text-blue-100 text-xs mt-1">Require supplier orders</p>
              </div>
              <AlertTriangle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by SKU code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">All Status</option>
                <option value="not_checked">Not Checked</option>
                <option value="in_warehouse">In Warehouse</option>
                <option value="not_available">Not Available</option>
                <option value="new_order_required">New Order Required</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total Value: <span className="font-semibold">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Order Items */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading purchase orders...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Purchase Order Items Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No items match your current filters.' 
                  : 'Create reorder requests from the Inventory page to get started.'}
              </p>
              {(searchTerm || filterStatus !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center text-xl">
              <ShoppingCart className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Purchase Order Items
              <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                {filteredItems.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                        <span className="text-white font-bold text-sm">{item.sku?.brand?.name?.charAt(0) || 'P'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.sku?.sku_name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{item.sku?.sku_code}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">PO Item #{item.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Ordered: {item.quantity_ordered} units • Unit Cost: {formatCurrency(item.unit_cost)} • Total: {formatCurrency(item.line_total)}
                      </p>
                      <p className="text-xs text-gray-500">Created: {new Date(item.created_at).toLocaleDateString()}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">Notes: {item.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[280px]">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge variant="outline" className={getWarehouseStatusColor(item.warehouse_status)}>
                        {item.warehouse_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    {/* Warehouse Check Buttons */}
                    {item.warehouse_status === 'not_checked' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 mb-2">Check item in warehouse:</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                            onClick={() => handleWarehouseCheck(item, 'in_warehouse')}
                            disabled={checkingItems.has(item.id)}
                          >
                            {checkingItems.has(item.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                In Stock
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                            onClick={() => handleWarehouseCheck(item, 'not_available')}
                            disabled={checkingItems.has(item.id)}
                          >
                            {checkingItems.has(item.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Not Available
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {item.warehouse_status === 'in_warehouse' && (
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Available in Warehouse
                        </Badge>
                      </div>
                    )}
                    
                    {item.warehouse_status === 'new_order_required' && (
                      <div className="text-center">
                        <Badge className="bg-orange-100 text-orange-800">
                          📦 Supplier Order Created
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Check Orders page for supplier order status
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}