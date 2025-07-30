import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
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
  Users,
  Send
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { FormModal } from "@/components/forms/FormModal";

interface SalesOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_type: 'distributor' | 'retailer' | 'service_center' | 'individual';
  contact_person: string;
  email?: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'backorder' | 'processing' | 'partial_shipment' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  order_date: string;
  required_date: string;
  shipping_method: 'standard' | 'express' | 'overnight' | 'freight';
  payment_terms: 'cod' | 'net_30' | 'net_60' | 'prepaid';
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue';
  total_amount: number;
  notes?: string;
  stock_check_results?: any[];
  created_at: string;
  updated_at: string;
  order_items?: SalesOrderItem[];
}

interface SalesOrderItem {
  id: number;
  order_id: number;
  sku_id: number;
  quantity_ordered: number;
  quantity_allocated: number;
  quantity_shipped: number;
  unit_price: number;
  line_total: number;
  created_at: string;
  sku?: SKU;
}

export default function SalesOrders() {
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  useEffect(() => {
    loadSalesOrders();
    
    // Subscribe to real-time updates
    inventoryManager.subscribe('sales_order_created', handleSalesOrderUpdate);
    inventoryManager.subscribe('sales_order_shipped', handleSalesOrderUpdate);
    
    return () => {
      // Cleanup subscriptions if needed
    };
  }, []);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      const [orders, orderItems, skus] = await Promise.all([
        inventoryManager.getSalesOrders(),
        inventoryManager.getSalesOrderItems(),
        dataService.getSKUs()
      ]);
      
      // Enrich orders with items and SKU data
      const enrichedOrders = orders.map((order: any) => {
        const items = orderItems.filter((item: any) => item.order_id === order.id).map((item: any) => ({
          ...item,
          sku: skus.find(s => s.id === item.sku_id)
        }));
        
        return {
          ...order,
          order_items: items
        };
      });
      
      setSalesOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading sales orders:', error);
      toast({
        title: "Error",
        description: "Failed to load sales orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalesOrderUpdate = () => {
    loadSalesOrders();
  };

  const handleShipOrder = async (orderId: number, orderItems: SalesOrderItem[]) => {
    try {
      const shippedItems = orderItems.map(item => ({
        sku_id: item.sku_id,
        quantity_shipped: item.quantity_allocated - item.quantity_shipped
      }));
      
      await inventoryManager.processSalesOrderShipment(orderId, shippedItems);
      toast({
        title: "Order Shipped",
        description: "Successfully processed order shipment",
      });
      loadSalesOrders();
    } catch (error) {
      console.error('Error shipping order:', error);
      toast({
        title: "Error",
        description: "Failed to process order shipment",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'backorder': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'processing': return 'bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]';
      case 'partial_shipment': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'shipped': return 'bg-green-100 text-green-700 border-green-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getOrderStats = () => {
    const pending = salesOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const processing = salesOrders.filter(o => o.status === 'processing' || o.status === 'partial_shipment').length;
    const shipped = salesOrders.filter(o => o.status === 'shipped' || o.status === 'delivered').length;
    const backorders = salesOrders.filter(o => o.status === 'backorder').length;
    const totalValue = salesOrders.reduce((sum, o) => sum + o.total_amount, 0);
    
    return { pending, processing, shipped, backorders, totalValue };
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
            Sales Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage customer orders and inventory allocation
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
            onClick={loadSalesOrders}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setCreateOrderModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-blue-100 text-xs mt-1">New orders</p>
              </div>
              <Clock className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Backorders</p>
                <p className="text-3xl font-bold">{stats.backorders}</p>
                <p className="text-blue-100 text-xs mt-1">Insufficient stock</p>
              </div>
              <AlertTriangle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Processing</p>
                <p className="text-3xl font-bold">{stats.processing}</p>
                <p className="text-blue-100 text-xs mt-1">In fulfillment</p>
              </div>
              <Package className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Shipped</p>
                <p className="text-3xl font-bold">{stats.shipped}</p>
                <p className="text-blue-100 text-xs mt-1">Completed</p>
              </div>
              <Truck className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
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
                  placeholder="Search by order number, customer name, or contact person..."
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
                <option value="confirmed">Confirmed</option>
                <option value="backorder">Backorder</option>
                <option value="processing">Processing</option>
                <option value="partial_shipment">Partial Shipment</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-white/80 border border-gray-200 rounded-md text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Orders List */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading sales orders...
              </h3>
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Sales Orders Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "No orders match your current filters"
                  : "Customer orders will appear here when they are created"}
              </p>
              <Button 
                onClick={() => setCreateOrderModalOpen(true)}
                className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center text-xl">
              <ShoppingBag className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Sales Orders
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
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">{order.customer_name}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{order.contact_person}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Items: {order.order_items?.length || 0} • 
                        Total Qty: {order.order_items?.reduce((sum, item) => sum + item.quantity_ordered, 0) || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Order Date: {new Date(order.order_date).toLocaleDateString()} • 
                        Required: {new Date(order.required_date).toLocaleDateString()}
                      </p>
                      {order.stock_check_results?.some(r => r.insufficient) && (
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ Some items have insufficient stock
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                        {order.status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityBadgeColor(order.priority)}`}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.shipping_method} • {order.payment_terms}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {(order.status === 'confirmed' || order.status === 'processing') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShipOrder(order.id, order.order_items || [])}
                          className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Ship
                        </Button>
                      )}
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
        title={`Sales Order Details - ${selectedOrder?.order_number}`}
        maxWidth="max-w-5xl"
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
                        {selectedOrder.status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    </p>
                    <p className="text-sm"><strong>Priority:</strong>
                      <Badge className={`ml-2 text-xs ${getPriorityBadgeColor(selectedOrder.priority)}`}>
                        {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                      </Badge>
                    </p>
                    <p className="text-sm"><strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Required Date:</strong> {new Date(selectedOrder.required_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                    <p className="text-sm"><strong>Type:</strong> {selectedOrder.customer_type}</p>
                    <p className="text-sm"><strong>Contact:</strong> {selectedOrder.contact_person}</p>
                    {selectedOrder.email && <p className="text-sm"><strong>Email:</strong> {selectedOrder.email}</p>}
                    {selectedOrder.phone && <p className="text-sm"><strong>Phone:</strong> {selectedOrder.phone}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.sku?.sku_name}</p>
                        <p className="text-xs text-gray-500">{item.sku?.sku_code} • {item.sku?.brand?.name}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm">
                          <strong>Ordered:</strong> {item.quantity_ordered} • 
                          <strong>Allocated:</strong> {item.quantity_allocated} • 
                          <strong>Shipped:</strong> {item.quantity_shipped}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(item.unit_price)} × {item.quantity_ordered} = {formatCurrency(item.line_total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(selectedOrder.total_amount)}
                    </span>
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

      {/* Create Order Modal */}
      <FormModal
        isOpen={createOrderModalOpen}
        onClose={() => setCreateOrderModalOpen(false)}
        title="Create New Sales Order"
        maxWidth="max-w-4xl"
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Sales order creation form would be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            This would include customer selection, item selection with stock checking, and order details.
          </p>
        </div>
      </FormModal>
    </div>
  );
}