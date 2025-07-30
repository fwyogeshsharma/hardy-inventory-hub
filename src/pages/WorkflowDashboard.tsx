import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  ArrowRight,
  Package,
  ShoppingCart,
  Factory,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { inventoryManager, dataService, SKU, Inventory } from "@/lib/database";
import { workflowManager } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStats {
  inventory: {
    total_skus: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_value: number;
  };
  purchase_orders: {
    pending: number;
    in_transit: number;
    received_today: number;
    total_value: number;
  };
  sales_orders: {
    pending: number;
    processing: number;
    shipped_today: number;
    total_value: number;
  };
  production: {
    scheduled: number;
    in_progress: number;
    completed_today: number;
    efficiency: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'inventory' | 'purchase' | 'sales' | 'production';
  action: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function WorkflowDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<WorkflowStats>({
    inventory: { total_skus: 0, low_stock_items: 0, out_of_stock_items: 0, total_value: 0 },
    purchase_orders: { pending: 0, in_transit: 0, received_today: 0, total_value: 0 },
    sales_orders: { pending: 0, processing: 0, shipped_today: 0, total_value: 0 },
    production: { scheduled: 0, in_progress: 0, completed_today: 0, efficiency: 0 }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time updates
    const eventTypes = [
      'inventory_updated',
      'low_stock_alert',
      'purchase_order_created',
      'purchase_order_received',
      'sales_order_created',
      'sales_order_shipped',
      'production_job_order_created',
      'production_job_order_completed',
      'automatic_reorder'
    ];

    eventTypes.forEach(eventType => {
      inventoryManager.subscribe(eventType, handleRealtimeUpdate);
    });

    // Refresh data every 30 seconds
    const refreshInterval = setInterval(loadDashboardData, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real automotive SKUs and inventory data
      const skus = await dataService.getSKUs();
      const inventory = await dataService.getInventory();
      
      // Calculate inventory stats from real data
      const activeSKUs = skus.filter(sku => sku.status === 'active');
      const outOfStockItems = inventory.filter(inv => inv.quantity_on_hand === 0);
      const lowStockItems = inventory.filter(inv => 
        inv.quantity_on_hand > 0 && inv.quantity_on_hand <= inv.safety_stock_level
      );
      const totalValue = inventory.reduce((sum, inv) => 
        sum + (inv.quantity_on_hand * inv.unit_cost), 0
      );
      
      // Load workflow data
      const reorderRequests = await workflowManager.getReorderRequests();
      const purchaseOrderItems = await workflowManager.getPurchaseOrderItems();
      const supplierOrders = await workflowManager.getSupplierOrders();
      const bomTemplates = await workflowManager.getBOMTemplates();
      const kitProductionOrders = await workflowManager.getKitProductionOrders();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate purchase order stats
      const pendingPOs = purchaseOrderItems.filter(item => item.status === 'pending').length;
      const inTransitPOs = purchaseOrderItems.filter(item => item.status === 'ordered').length;
      const receivedToday = purchaseOrderItems.filter(item => 
        item.status === 'received' && item.updated_at?.startsWith(today)
      ).length;
      const poTotalValue = purchaseOrderItems.reduce((sum, item) => 
        sum + (item.quantity_ordered * item.unit_cost), 0
      );

      // Calculate supplier order stats (treating as sales orders)
      const pendingSOs = supplierOrders.filter(order => order.status === 'pending').length;
      const processingSOs = supplierOrders.filter(order => order.status === 'processing').length;
      const shippedToday = supplierOrders.filter(order => 
        order.status === 'completed' && order.updated_at?.startsWith(today)
      ).length;
      const soTotalValue = supplierOrders.reduce((sum, order) => sum + order.total_amount, 0);

      // Calculate production stats from kit production orders
      const scheduledProduction = kitProductionOrders.filter(order => order.status === 'scheduled').length;
      const inProgressProduction = kitProductionOrders.filter(order => order.status === 'in_progress').length;
      const completedToday = kitProductionOrders.filter(order => 
        order.status === 'completed' && order.completion_date === today
      ).length;
      
      // Calculate production efficiency
      const completedOrders = kitProductionOrders.filter(order => order.status === 'completed');
      const avgEfficiency = completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => 
            sum + ((order.quantity_completed / order.quantity_planned) * 100), 0
          ) / completedOrders.length
        : 85; // Default efficiency for display

      setStats({
        inventory: {
          total_skus: activeSKUs.length,
          low_stock_items: lowStockItems.length,
          out_of_stock_items: outOfStockItems.length,
          total_value: totalValue
        },
        purchase_orders: {
          pending: pendingPOs,
          in_transit: inTransitPOs,
          received_today: receivedToday,
          total_value: poTotalValue
        },
        sales_orders: {
          pending: pendingSOs,
          processing: processingSOs,
          shipped_today: shippedToday,
          total_value: soTotalValue
        },
        production: {
          scheduled: scheduledProduction,
          in_progress: inProgressProduction,
          completed_today: completedToday,
          efficiency: Math.round(avgEfficiency)
        }
      });
      
      // Generate some sample recent activity based on real data
      const activities: RecentActivity[] = [];
      
      // Add out of stock alerts
      outOfStockItems.slice(0, 3).forEach((item, index) => {
        activities.push({
          id: `out_of_stock_${index}`,
          type: 'inventory',
          action: 'Out of Stock Alert',
          description: `SKU ${item.sku_id} is out of stock`,
          timestamp: new Date(Date.now() - (index * 300000)), // 5 min intervals
          status: 'error'
        });
      });
      
      // Add low stock warnings
      lowStockItems.slice(0, 2).forEach((item, index) => {
        activities.push({
          id: `low_stock_${index}`,
          type: 'inventory',
          action: 'Low Stock Warning',
          description: `SKU ${item.sku_id} has ${item.quantity_on_hand} units remaining`,
          timestamp: new Date(Date.now() - (index * 600000)), // 10 min intervals
          status: 'warning'
        });
      });
      
      // Add reorder activities
      reorderRequests.slice(0, 2).forEach((request, index) => {
        activities.push({
          id: `reorder_${index}`,
          type: 'purchase',
          action: 'Reorder Request',
          description: `Reorder request created for SKU ${request.sku_id}`,
          timestamp: new Date(Date.now() - (index * 900000)), // 15 min intervals
          status: 'info'
        });
      });
      
      // Add production activities
      kitProductionOrders.filter(order => order.status === 'completed').slice(0, 1).forEach((order, index) => {
        activities.push({
          id: `production_${index}`,
          type: 'production',
          action: 'Production Completed',
          description: `Kit production order ${order.id} completed - ${order.quantity_completed} units`,
          timestamp: new Date(Date.now() - (index * 1200000)), // 20 min intervals
          status: 'success'
        });
      });
      
      setRecentActivity(activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (data: any) => {
    // Add to recent activity
    const activity: RecentActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: determineActivityType(data),
      action: determineActivityAction(data),
      description: determineActivityDescription(data),
      timestamp: new Date(),
      status: determineActivityStatus(data)
    };

    setRecentActivity(prev => [activity, ...prev].slice(0, 10)); // Keep last 10 activities
    
    // Refresh stats
    loadDashboardData();
  };

  const determineActivityType = (data: any): RecentActivity['type'] => {
    if (data.sku_id || data.inventory_record) return 'inventory';
    if (data.order_number?.startsWith('PO-')) return 'purchase';
    if (data.order_number?.startsWith('SO-') || data.order?.order_number?.startsWith('SO-')) return 'sales';
    if (data.order_number?.startsWith('PJO-') || data.order?.order_number?.startsWith('PJO-')) return 'production';
    return 'inventory';
  };

  const determineActivityAction = (data: any): string => {
    if (data.transaction_type) return `Stock ${data.transaction_type}`;
    if (data.order_number?.startsWith('PO-')) return 'Purchase Order';
    if (data.order_number?.startsWith('SO-')) return 'Sales Order';
    if (data.order_number?.startsWith('PJO-')) return 'Production Order';
    if (data.is_out_of_stock) return 'Out of Stock';
    if (data.quantity) return 'Automatic Reorder';
    return 'System Update';
  };

  const determineActivityDescription = (data: any): string => {
    if (data.sku_id && data.new_quantity !== undefined) {
      return `SKU ${data.sku_id} quantity updated to ${data.new_quantity}`;
    }
    if (data.order_number) {
      return `${data.order_number} created`;
    }
    if (data.order?.order_number) {
      return `${data.order.order_number} created`;
    }
    if (data.inventory_record) {
      return `SKU ${data.inventory_record.sku_id} stock alert`;
    }
    return 'System activity';
  };

  const determineActivityStatus = (data: any): RecentActivity['status'] => {
    if (data.is_out_of_stock) return 'error';
    if (data.inventory_record?.quantity_available <= data.inventory_record?.safety_stock_level) return 'warning';
    if (data.order_number || data.order?.order_number) return 'success';
    return 'info';
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'purchase': return <ShoppingCart className="h-4 w-4" />;
      case 'sales': return <Users className="h-4 w-4" />;
      case 'production': return <Factory className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Inventory Workflow Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time overview of your complete inventory management workflow
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Inventory Status */}
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Inventory</p>
                <p className="text-3xl font-bold">{stats.inventory.total_skus}</p>
                <p className="text-blue-100 text-xs mt-1">Active SKUs</p>
              </div>
              <Package className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Low Stock:</span>
                <span className="font-medium">{stats.inventory.low_stock_items}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Out of Stock:</span>
                <span className="font-medium">{stats.inventory.out_of_stock_items}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm font-semibold">
                <span>Total Value:</span>
                <span>{formatCurrency(stats.inventory.total_value)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders */}
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Purchase Orders</p>
                <p className="text-3xl font-bold">{stats.purchase_orders.pending}</p>
                <p className="text-blue-100 text-xs mt-1">Pending Orders</p>
              </div>
              <ShoppingCart className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-blue-100 text-sm">
                <span>In Transit:</span>
                <span className="font-medium">{stats.purchase_orders.in_transit}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Received Today:</span>
                <span className="font-medium">{stats.purchase_orders.received_today}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm font-semibold">
                <span>Total Value:</span>
                <span>{formatCurrency(stats.purchase_orders.total_value)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Orders */}
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Sales Orders</p>
                <p className="text-3xl font-bold">{stats.sales_orders.pending}</p>
                <p className="text-blue-100 text-xs mt-1">Pending Orders</p>
              </div>
              <Users className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Processing:</span>
                <span className="font-medium">{stats.sales_orders.processing}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Shipped Today:</span>
                <span className="font-medium">{stats.sales_orders.shipped_today}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm font-semibold">
                <span>Total Value:</span>
                <span>{formatCurrency(stats.sales_orders.total_value)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production */}
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Production</p>
                <p className="text-3xl font-bold">{stats.production.in_progress}</p>
                <p className="text-blue-100 text-xs mt-1">Active Jobs</p>
              </div>
              <Factory className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Scheduled:</span>
                <span className="font-medium">{stats.production.scheduled}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm">
                <span>Completed Today:</span>
                <span className="font-medium">{stats.production.completed_today}</span>
              </div>
              <div className="flex justify-between text-blue-100 text-sm font-semibold">
                <span>Efficiency:</span>
                <span>{stats.production.efficiency}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Process Flow */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Activity className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Inventory Management Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4 overflow-x-auto pb-4">
            {/* SKU Management */}
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{backgroundColor: '#3997cd'}}>
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">SKU Management</h3>
              <div className="mt-2 space-y-1 text-center">
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  {stats.inventory.total_skus} Active
                </Badge>
                {stats.inventory.low_stock_items > 0 && (
                  <Badge className="text-xs" style={{backgroundColor: '#fff3cd', color: '#856404'}}>
                    {stats.inventory.low_stock_items} Low Stock
                  </Badge>
                )}
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

            {/* Purchase Orders */}
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">Purchase Orders</h3>
              <div className="mt-2 space-y-1 text-center">
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  {stats.purchase_orders.pending} Pending
                </Badge>
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  Auto Reorder
                </Badge>
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

            {/* Sales Orders */}
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">Sales Orders</h3>
              <div className="mt-2 space-y-1 text-center">
                <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd] text-xs">
                  {stats.sales_orders.pending} Pending
                </Badge>
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  Stock Allocation
                </Badge>
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

            {/* Production */}
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                <Factory className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">Production</h3>
              <div className="mt-2 space-y-1 text-center">
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  {stats.production.in_progress} Active
                </Badge>
                <Badge className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd'}}>
                  {stats.production.efficiency}% Efficiency
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Zap className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Real-time Activity Feed
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              Live Updates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">
                Activity will appear here as events occur in the system
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className={`flex-shrink-0 p-2 rounded-full ${getActivityStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </h4>
                      <Badge className={`text-xs ${getActivityStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}