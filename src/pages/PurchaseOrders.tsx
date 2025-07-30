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
  Loader2
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { FormModal } from "@/components/forms/FormModal";

interface PurchaseOrder {
  id: number;
  order_number: string;
  sku_id: number;
  warehouse_id: number;
  quantity_ordered: number;
  quantity_received: number;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  vendor_id?: number;
  unit_cost?: number;
  total_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  sku?: SKU;
}

export default function PurchaseOrders() {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    loadPurchaseOrders();
    
    // Subscribe to real-time updates
    inventoryManager.subscribe('purchase_order_created', handlePurchaseOrderUpdate);
    inventoryManager.subscribe('purchase_order_received', handlePurchaseOrderUpdate);
    
    return () => {
      // Cleanup subscriptions if needed
    };
  }, []);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const orders = await inventoryManager.getPurchaseOrders();
      const skus = await dataService.getSKUs();
      
      // Enrich orders with SKU data
      const enrichedOrders = orders.map((order: any) => ({
        ...order,
        sku: skus.find(s => s.id === order.sku_id)
      }));
      
      setPurchaseOrders(enrichedOrders);
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

  const handlePurchaseOrderUpdate = () => {
    loadPurchaseOrders();
  };

  const handleReceiveOrder = async (orderId: number, quantityReceived: number) => {
    try {
      await inventoryManager.processPurchaseOrderReceipt(orderId, quantityReceived);
      toast({
        title: "Order Received",
        description: `Successfully received ${quantityReceived} units`,
      });
      loadPurchaseOrders();
    } catch (error) {
      console.error('Error receiving order:', error);
      toast({
        title: "Error",
        description: "Failed to process order receipt",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sku?.sku_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sku?.sku_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'partial': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-blue-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-blue-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getOrderStats = () => {
    const pending = purchaseOrders.filter(o => o.status === 'pending').length;
    const partial = purchaseOrders.filter(o => o.status === 'partial').length;
    const completed = purchaseOrders.filter(o => o.status === 'completed').length;
    const totalValue = purchaseOrders.reduce((sum, o) => sum + ((o.total_cost || o.quantity_ordered * (o.unit_cost || 0))), 0);
    
    return { pending, partial, completed, totalValue };
  };

  const stats = getOrderStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Purchase Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage purchase orders and inventory replenishment
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
            onClick={loadPurchaseOrders}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-yellow-100 text-xs mt-1">Awaiting delivery</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Partial Orders</p>
                <p className="text-3xl font-bold">{stats.partial}</p>
                <p className="text-blue-100 text-xs mt-1">Partially received</p>
              </div>
              <Truck className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
                <p className="text-blue-100 text-xs mt-1">Fully received</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</p>
                <p className="text-blue-100 text-xs mt-1">All orders</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by order number, SKU name, or SKU code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white/80 border border-gray-200 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-white/80 border border-gray-200 rounded-md text-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading purchase orders...
              </h3>
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Purchase Orders Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "No orders match your current filters"
                  : "Purchase orders will appear here when inventory reaches reorder points"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center text-xl">
              <ShoppingCart className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Purchase Orders
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
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{order.sku?.sku_code}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{order.sku?.sku_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Quantity: {order.quantity_received}/{order.quantity_ordered} units
                      </p>
                      <p className="text-xs text-gray-500">
                        Order Date: {new Date(order.order_date).toLocaleDateString()} • 
                        Expected: {new Date(order.expected_delivery_date).toLocaleDateString()}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 mt-1">Note: {order.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityBadgeColor(order.priority)}`}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(order.total_cost || (order.quantity_ordered * (order.unit_cost || 0)))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Unit: {formatCurrency(order.unit_cost || 0)}
                      </p>
                    </div>
                    
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const remainingQty = order.quantity_ordered - order.quantity_received;
                            handleReceiveOrder(order.id, remainingQty);
                          }}
                          className="text-xs bg-green-50 border-green-200 text-blue-700 hover:bg-green-100"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Receive
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalOpen(true);
                          }}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Purchase Order Details - ${selectedOrder?.order_number}`}
        maxWidth="max-w-4xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Order Number:</strong> {selectedOrder.order_number}</p>
                    <p className="text-sm"><strong>Status:</strong> 
                      <Badge className={`ml-2 text-xs ${getStatusBadgeColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </p>
                    <p className="text-sm"><strong>Priority:</strong>
                      <Badge className={`ml-2 text-xs ${getPriorityBadgeColor(selectedOrder.priority)}`}>
                        {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                      </Badge>
                    </p>
                    <p className="text-sm"><strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Expected Delivery:</strong> {new Date(selectedOrder.expected_delivery_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">SKU Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>SKU Code:</strong> {selectedOrder.sku?.sku_code}</p>
                    <p className="text-sm"><strong>SKU Name:</strong> {selectedOrder.sku?.sku_name}</p>
                    <p className="text-sm"><strong>Brand:</strong> {selectedOrder.sku?.brand?.name}</p>
                    <p className="text-sm"><strong>Category:</strong> {selectedOrder.sku?.category?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quantity & Pricing</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ordered</p>
                    <p className="font-semibold">{selectedOrder.quantity_ordered}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Received</p>
                    <p className="font-semibold">{selectedOrder.quantity_received}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unit Cost</p>
                    <p className="font-semibold">{formatCurrency(selectedOrder.unit_cost || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Cost</p>
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(selectedOrder.total_cost || (selectedOrder.quantity_ordered * (selectedOrder.unit_cost || 0)))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </FormModal>
    </div>
  );
}