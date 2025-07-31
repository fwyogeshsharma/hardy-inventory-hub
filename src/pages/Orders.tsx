import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Download,
  RefreshCw,
  Package,
  DollarSign,
  Search,
  Eye,
  Loader2,
  Pause,
  Play,
  ShoppingBag,
  UserCheck,
  Building2,
  MapPin,
  PauseCircle,
  PlayCircle,
  CheckCircle2
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { workflowManager, SupplierOrder, PurchaseOrderItem } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const { toast } = useToast();
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterWorkflowStatus, setFilterWorkflowStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [supplierOrdersData, purchaseOrderItemsData, skusData] = await Promise.all([
        workflowManager.getSupplierOrders(),
        workflowManager.getPurchaseOrderItems(),
        dataService.getSKUs()
      ]);
      
      // Enrich supplier orders with related purchase order items and SKU data
      const enrichedOrders = supplierOrdersData.map(order => {
        const relatedItem = purchaseOrderItemsData.find(item => item.id === order.purchase_order_item_id);
        const sku = relatedItem ? skusData.find(s => s.id === relatedItem.sku_id) : null;
        return {
          ...order,
          purchaseOrderItem: relatedItem,
          sku: sku
        };
      });
      
      setSupplierOrders(enrichedOrders);
      setPurchaseOrderItems(purchaseOrderItemsData);
      setSKUs(skusData);
      
    } catch (error) {
      console.error('Error loading orders data:', error);
      toast({
        title: "Error",
        description: "Failed to load orders data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: SupplierOrder['status']) => {
    try {
      setUpdatingOrders(prev => new Set(prev).add(orderId));
      
      await workflowManager.updateSupplierOrderStatus(orderId, status);
      
      const order = supplierOrders.find(o => o.id === orderId);
      const statusMessages = {
        'confirmed': 'Order confirmed by supplier',
        'in_transit': 'Order is in transit',
        'received': 'Order received - inventory will be updated',
        'cancelled': 'Order cancelled'
      };
      
      toast({
        title: "Order Status Updated",
        description: `${order?.sku?.sku_code}: ${statusMessages[status] || 'Status updated'}`,
        variant: status === 'cancelled' ? "destructive" : "default",
      });
      
      // Reload data to reflect changes
      await loadData();
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handlePauseWorkflow = async (orderId: number, reason: string) => {
    try {
      setUpdatingOrders(prev => new Set(prev).add(orderId));
      
      await workflowManager.pauseSupplierOrderWorkflow(orderId, reason);
      
      const order = supplierOrders.find(o => o.id === orderId);
      toast({
        title: "Workflow Paused",
        description: `Workflow paused for ${order?.sku?.sku_code}: ${reason}`,
        variant: "default",
      });
      
      // Reload data to reflect changes
      await loadData();
      
    } catch (error) {
      console.error('Error pausing workflow:', error);
      toast({
        title: "Error",
        description: "Failed to pause workflow",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'in_transit': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'received': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'resumed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredOrders = supplierOrders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sku?.sku_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sku?.sku_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesWorkflowFilter = filterWorkflowStatus === 'all' || order.workflow_status === filterWorkflowStatus;
    
    return matchesSearch && matchesStatusFilter && matchesWorkflowFilter;
  }).sort((a, b) => {
    // Sort by creation date (newest first)
    const dateA = new Date(a.created_at || '1970-01-01').getTime();
    const dateB = new Date(b.created_at || '1970-01-01').getTime();
    return dateB - dateA;
  });

  // Calculate summary statistics
  const totalOrders = supplierOrders.length;
  const activeOrders = supplierOrders.filter(order => order.workflow_status === 'active').length;
  const pausedOrders = supplierOrders.filter(order => order.workflow_status === 'paused').length;
  const receivedOrders = supplierOrders.filter(order => order.status === 'received').length;
  const totalValue = supplierOrders.reduce((sum, order) => sum + order.total_cost, 0);

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Supplier Orders & Workflow Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Track orders from regular suppliers and manage workflow status
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
                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
                <p className="text-blue-100 text-xs mt-1">Supplier orders</p>
              </div>
              <ShoppingBag className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Workflow</p>
                <p className="text-3xl font-bold">{activeOrders}</p>
                <p className="text-blue-100 text-xs mt-1">Orders in progress</p>
              </div>
              <PlayCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Paused Workflow</p>
                <p className="text-3xl font-bold">{pausedOrders}</p>
                <p className="text-blue-100 text-xs mt-1">Waiting for supplies</p>
              </div>
              <PauseCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{receivedOrders}</p>
                <p className="text-blue-100 text-xs mt-1">Orders received</p>
              </div>
              <CheckCircle2 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
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
                  placeholder="Search by order number or SKU..."
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
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_transit">In Transit</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterWorkflowStatus}
                onChange={(e) => setFilterWorkflowStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">All Workflow</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="resumed">Resumed</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total Value: <span className="font-semibold">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Orders */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading supplier orders...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Truck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Supplier Orders Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' || filterWorkflowStatus !== 'all'
                  ? 'No orders match your current filters.' 
                  : 'Supplier orders will appear here when items are not available in warehouse.'}
              </p>
              {(searchTerm || filterStatus !== 'all' || filterWorkflowStatus !== 'all') && (
                <Button variant="outline" onClick={() => { 
                  setSearchTerm(''); 
                  setFilterStatus('all'); 
                  setFilterWorkflowStatus('all'); 
                }}>
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
              <Truck className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Supplier Orders
              <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                {filteredOrders.length} orders
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                        <span className="text-white font-bold text-sm">{order.sku?.brand?.name?.charAt(0) || 'S'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.sku?.sku_name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{order.sku?.sku_code}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{order.order_number}</span>
                          {order.is_regular_supplier && (
                            <>
                              <span className="text-xs text-gray-500">•</span>
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Regular Supplier
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Quantity: {order.quantity_ordered} units • Unit Cost: {formatCurrency(order.unit_cost)} • Total: {formatCurrency(order.total_cost)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Order Date: {formatDate(order.order_date)}
                        {order.expected_delivery_date && (
                          <> • Expected: {formatDate(order.expected_delivery_date)}</>
                        )}
                        {order.actual_delivery_date && (
                          <> • Delivered: {formatDate(order.actual_delivery_date)}</>
                        )}
                      </p>
                      {order.tracking_number && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                      {order.pause_reason && (
                        <p className="text-xs text-red-600 mt-1">
                          Paused: {order.pause_reason}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-xs text-gray-500 mt-1">Notes: {order.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[320px]">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <Badge variant="outline" className={getWorkflowStatusColor(order.workflow_status)}>
                        {order.workflow_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    {/* Order Action Buttons */}
                    <div className="space-y-2">
                      {order.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            disabled={updatingOrders.has(order.id)}
                          >
                            {updatingOrders.has(order.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirm
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                            onClick={() => handleUpdateOrderStatus(order.id, 'in_transit')}
                            disabled={updatingOrders.has(order.id)}
                          >
                            {updatingOrders.has(order.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Truck className="h-3 w-3 mr-1" />
                                Ship
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {order.status === 'in_transit' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                            onClick={() => handleUpdateOrderStatus(order.id, 'received')}
                            disabled={updatingOrders.has(order.id)}
                          >
                            {updatingOrders.has(order.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Package className="h-3 w-3 mr-1" />
                                Mark Received
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {/* Workflow Control Buttons */}
                      {order.workflow_status === 'active' && order.status !== 'received' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                          onClick={() => handlePauseWorkflow(order.id, 'Waiting for supplier confirmation')}
                          disabled={updatingOrders.has(order.id)}
                        >
                          {updatingOrders.has(order.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Pause className="h-3 w-3 mr-1" />
                              Pause Workflow
                            </>
                          )}
                        </Button>
                      )}
                      
                      {order.status === 'received' && (
                        <div className="text-center">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Order Completed - Inventory Updated
                          </Badge>
                        </div>
                      )}
                      
                      {order.workflow_status === 'paused' && (
                        <div className="text-center">
                          <Badge className="bg-orange-100 text-orange-800">
                            ⏸️ Workflow Paused - Waiting for Supplies
                          </Badge>
                        </div>
                      )}
                    </div>
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