import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Package, 
  Factory, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Activity,
  DollarSign,
  Zap,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  Star,
  Target,
  Truck,
  Warehouse
} from "lucide-react";
import { dataService, SKU, Inventory } from "@/lib/database";
import { workflowManager } from "@/lib/workflowExtensions";
import { initializeData } from "@/lib/initializeData";
import { skuStorage } from "@/lib/localStorage";
import { useState, useEffect } from "react";
import { FormModal } from "./forms/FormModal";
import { ProductionOrderForm } from "./forms/ProductionOrderForm";
import { CustomerOrderForm } from "./forms/CustomerOrderForm";
import { VendorForm } from "./forms/VendorForm";
import { AddSKUDrawer } from "./AddSKUDrawer";
import { InitializeDataButton } from "./InitializeDataButton";

export const Dashboard = () => {
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [workflowData, setWorkflowData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modals, setModals] = useState({
    addSKU: false,
    startProduction: false,
    createOrder: false,
    manageVendors: false,
    viewReports: false,
    viewAlerts: false
  });
  
  useEffect(() => {
    loadDashboardData();
    
    // Listen for real-time updates
    const handleDashboardRefresh = () => {
      console.log('📊 Dashboard refreshing with latest data...');
      loadDashboardData();
    };
    
    window.addEventListener('dashboard-refresh', handleDashboardRefresh);
    
    return () => {
      window.removeEventListener('dashboard-refresh', handleDashboardRefresh);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all data in parallel
      const [
        skusData,
        inventoryData,
        customerOrdersData,
        workflowSummary,
        reorderRequests,
        purchaseOrderItems,
        supplierOrders,
        bomTemplates,
        kitProductionOrders
      ] = await Promise.all([
        dataService.getSKUs(),
        dataService.getInventory(),
        dataService.getCustomerOrders(),
        workflowManager.getWorkflowSummary(),
        workflowManager.getReorderRequests(),
        workflowManager.getPurchaseOrderItems(),
        workflowManager.getSupplierOrders(),
        workflowManager.getBOMTemplates(),
        workflowManager.getKitProductionOrders()
      ]);
      
      setSKUs(skusData);
      setInventory(inventoryData);
      setCustomerOrders(customerOrdersData);
      setWorkflowData({
        summary: workflowSummary,
        reorderRequests,
        purchaseOrderItems,
        supplierOrders,
        bomTemplates,
        kitProductionOrders
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      // Fallback to localStorage data
      setSKUs(skuStorage.getAll());
    } finally {
      setLoading(false);
    }
  };

  const openModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handleFormSubmit = (modalName: keyof typeof modals) => {
    closeModal(modalName);
    // Refresh SKU data if needed
    setSKUs(skuStorage.getAll());
  };

  // Calculate real metrics from loaded data
  const calculateMetrics = () => {
    const totalSKUs = skus.length;
    const activeSKUs = skus.filter(sku => sku.status === 'active').length;
    const discontinuedSKUs = skus.filter(sku => sku.status === 'discontinued').length;
    const kitSKUs = skus.filter(sku => sku.sku_type === 'kit').length;
    
    // Calculate real inventory metrics
    const outOfStockItems = inventory.filter(inv => inv.quantity_on_hand === 0).length;
    const lowStockItems = inventory.filter(inv => 
      inv.quantity_on_hand > 0 && inv.quantity_on_hand <= inv.safety_stock_level
    ).length;
    
    // Calculate real workflow metrics
    const reorderRequests = workflowData.reorderRequests?.length || 0;
    const pendingReorders = workflowData.reorderRequests?.filter((r: any) => r.status === 'pending').length || 0;
    const purchaseOrderItems = workflowData.purchaseOrderItems?.length || 0;
    const supplierOrders = workflowData.supplierOrders?.length || 0;
    const activeSupplierOrders = workflowData.supplierOrders?.filter((so: any) => so.workflow_status === 'active').length || 0;
    const kitProductionOrders = workflowData.kitProductionOrders?.length || 0;
    const activeProduction = workflowData.kitProductionOrders?.filter((kpo: any) => kpo.status === 'in_progress').length || 0;
    const completedProduction = workflowData.kitProductionOrders?.filter((kpo: any) => kpo.status === 'completed').length || 0;
    
    // Calculate total inventory value
    const totalInventoryValue = inventory.reduce((total, inv) => {
      const sku = skus.find(s => s.id === inv.sku_id);
      return total + (inv.quantity_on_hand * (inv.unit_cost || sku?.unit_cost || 0));
    }, 0);
    
    // Calculate real revenue from customer orders
    const totalRevenue = customerOrders.reduce((sum, order) => {
      // Use total_amount if available, otherwise calculate from order_items
      if (order.total_amount && !isNaN(order.total_amount)) {
        return sum + order.total_amount;
      }
      
      const orderTotal = (order.order_items || []).reduce((itemSum: number, item: any) => {
        const quantity = item.quantity || 0;
        const unitPrice = item.unit_price || 0;
        const discount = (item.discount_percent || 0) / 100;
        return itemSum + (quantity * unitPrice * (1 - discount));
      }, 0);
      
      const orderDiscount = (order.discount_percent || 0) / 100;
      const finalOrderTotal = orderTotal * (1 - orderDiscount);
      return sum + (isNaN(finalOrderTotal) ? 0 : finalOrderTotal);
    }, 0);

    // Get recent orders count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = customerOrders.filter(order => 
      new Date(order.order_date) >= thirtyDaysAgo
    ).length;
    
    return {
      totalSKUs,
      activeSKUs,
      discontinuedSKUs,
      kitSKUs,
      outOfStockItems,
      lowStockItems,
      reorderRequests,
      pendingReorders,
      purchaseOrderItems,
      supplierOrders,
      activeSupplierOrders,
      kitProductionOrders,
      activeProduction,
      completedProduction,
      totalInventoryValue,
      totalRevenue: totalRevenue > 0 ? totalRevenue : 2950000, // Fallback for demonstration
      recentOrders
    };
  };

  const metrics = calculateMetrics();

  // Generate real alerts based on actual data
  const generateRealAlerts = () => {
    const alerts = [];
    let alertId = 1;
    
    // Out of stock alerts
    const outOfStockInventory = inventory.filter(inv => inv.quantity_on_hand === 0);
    outOfStockInventory.slice(0, 3).forEach(inv => {
      const sku = skus.find(s => s.id === inv.sku_id);
      if (sku) {
        alerts.push({
          id: alertId++,
          type: "Out of Stock",
          message: `${sku.sku_name} (${sku.sku_code}) is completely out of stock`,
          priority: "high",
          time: "Just now",
          icon: AlertTriangle,
          color: "text-red-600"
        });
      }
    });
    
    // Low stock alerts
    const lowStockInventory = inventory.filter(inv => 
      inv.quantity_on_hand > 0 && inv.quantity_on_hand <= inv.safety_stock_level
    );
    lowStockInventory.slice(0, 2).forEach(inv => {
      const sku = skus.find(s => s.id === inv.sku_id);
      if (sku) {
        alerts.push({
          id: alertId++,
          type: "Low Stock",
          message: `${sku.sku_name} running low - ${inv.quantity_on_hand} units remaining`,
          priority: "medium",
          time: "2 hours ago",
          icon: Package,
          color: "text-orange-600"
        });
      }
    });
    
    // Production alerts
    const inProgressProduction = workflowData.kitProductionOrders?.filter((kpo: any) => kpo.status === 'in_progress') || [];
    inProgressProduction.slice(0, 1).forEach((prod: any) => {
      const sku = skus.find(s => s.id === prod.kit_sku_id);
      if (sku) {
        alerts.push({
          id: alertId++,
          type: "Production",
          message: `${sku.sku_name} production in progress - ${prod.quantity_planned} units`,
          priority: "low",
          time: "4 hours ago",
          icon: Factory,
          color: "text-blue-600"
        });
      }
    });
    
    // Supplier order alerts
    const activeOrders = workflowData.supplierOrders?.filter((so: any) => so.workflow_status === 'active') || [];
    activeOrders.slice(0, 1).forEach((order: any) => {
      alerts.push({
        id: alertId++,
        type: "Order",
        message: `Supplier order ${order.order_number} in transit - ${order.quantity_ordered} units expected`,
        priority: "low",
        time: "6 hours ago",
        icon: Truck,
        color: "text-green-600"
      });
    });
    
    // Add some default alerts if no real data
    if (alerts.length === 0) {
      alerts.push({
        id: 1,
        type: "System",
        message: "All systems running normally - no critical alerts",
        priority: "low",
        time: "Just now",
        icon: CheckCircle,
        color: "text-green-600"
      });
    }
    
    return alerts;
  };

  const recentAlerts = generateRealAlerts();

  const recentActivities = [
    { id: 1, user: "QA Team", action: "approved alternator batch #A2024-101", time: "45 minutes ago", avatar: "QA" },
    { id: 2, user: "Alex Garcia", action: "updated pricing for Bosch spark plugs", time: "2 hours ago", avatar: "AG" },
    { id: 3, user: "Receiving Dept", action: "unloaded shipment from Magna International", time: "3 hours ago", avatar: "RD" },
    { id: 4, user: "System Bot", action: "generated low stock report for filters", time: "5 hours ago", avatar: "SB" }
  ];

  const topPerformingSKUs = [
    {
      id: 1,
      skuName: "ACDelco Professional Brake Pads",
      brand: "ACDelco",
      revenue: 28500,
      growth: 18.5
    },
    {
      id: 2,
      skuName: "Bosch Premium Oil Filter",
      brand: "Bosch",
      revenue: 24200,
      growth: 15.2
    },
    {
      id: 3,
      skuName: "NGK Iridium Spark Plugs",
      brand: "NGK",
      revenue: 22800,
      growth: 12.8
    },
    {
      id: 4,
      skuName: "Monroe Quick-Strut Assembly",
      brand: "Monroe",
      revenue: 19400,
      growth: 9.7
    },
    {
      id: 5,
      skuName: "Mobil 1 Synthetic Motor Oil",
      brand: "Mobil 1",
      revenue: 17600,
      growth: 8.3
    }
  ];


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#3997cd] text-white";
      case "medium":
        return "bg-[#3997cd] text-white";
      default:
        return "bg-[#3997cd] text-white";
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3997cd] mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Dashboard...</h3>
          <p className="text-gray-500">Fetching your inventory data and metrics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={loadDashboardData} className="bg-[#3997cd] hover:bg-[#2d7aad] text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your inventory today
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white" 
            style={{borderColor: '#3997cd', color: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <Download className="h-4 w-4 mr-2" style={{color: '#3997cd'}} />
            Export
          </Button>
          <InitializeDataButton />
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white" 
            style={{borderColor: '#3997cd', color: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <Settings className="h-4 w-4 mr-2" style={{color: '#3997cd'}} />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total SKUs"
          value={metrics.totalSKUs.toString()}
          description={`${metrics.activeSKUs} active • ${metrics.kitSKUs} kits`}
          icon={Package}
          trend="up"
          trendValue="+12%"
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Stock Issues"
          value={(metrics.outOfStockItems + metrics.lowStockItems).toString()}
          description={`${metrics.outOfStockItems} out • ${metrics.lowStockItems} low`}
          icon={AlertTriangle}
          trend={metrics.outOfStockItems > 0 ? "up" : "down"}
          trendValue={metrics.outOfStockItems > 0 ? "+Alert" : "Good"}
          variant="warning"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Workflow Orders"
          value={metrics.supplierOrders.toString()}
          description={`${metrics.activeSupplierOrders} active • ${metrics.reorderRequests} reorders`}
          icon={ShoppingCart}
          trend="up"
          trendValue="+23%"
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Kit Production"
          value={metrics.kitProductionOrders.toString()}
          description={`${metrics.activeProduction} in progress • ${metrics.completedProduction} completed`}
          icon={Factory}
          trend={metrics.activeProduction > 0 ? "up" : "stable"}
          trendValue={metrics.activeProduction > 0 ? "Active" : "Ready"}
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">75% of monthly goal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>94%</p>
              </div>
              <Zap className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Above target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>98%</p>
              </div>
              <Target className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Delivery rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendors</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>24</p>
              </div>
              <Users className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current" style={{color: '#3997cd'}} />
                <span className="text-xs text-muted-foreground">4.8 avg rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warehouses</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>3</p>
              </div>
              <Warehouse className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">92% capacity utilized</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>{metrics.outOfStockItems + metrics.lowStockItems + metrics.pendingReorders}</p>
              </div>
              <Bell className="h-8 w-8" style={{color: '#3997cd'}} />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">1 high priority</p>
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Alerts - Enhanced */}
        <Card className="lg:col-span-1 bg-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Recent Alerts
              </div>
              <Badge variant="outline" className="text-xs">
                {recentAlerts.filter(a => a.priority === 'high').length} High
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors cursor-pointer">
                <div className={`p-2 rounded-full bg-white/80 ${alert.color}`}>
                  <alert.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm text-foreground mt-1 leading-snug">{alert.message}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1 bg-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs text-white" style={{backgroundColor: '#3997cd'}}>
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Performing SKUs */}
        <Card className="lg:col-span-1 bg-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Top Performing SKUs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingSKUs.map((sku, index) => (
              <div key={sku.id} className="flex items-center justify-between p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{backgroundColor: '#3997cd'}}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sku.skuName}</p>
                    <p className="text-xs text-muted-foreground">{sku.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{color: '#3997cd'}}>{formatCurrency(sku.revenue)}</p>
                  <div className="flex items-center text-xs" style={{color: '#3997cd'}}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{sku.growth}%
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Button 
              onClick={() => openModal('addSKU')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Package className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Add SKU</span>
            </Button>
            
            <Button 
              onClick={() => openModal('startProduction')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Factory className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Start Production</span>
            </Button>
            
            <Button 
              onClick={() => openModal('createOrder')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <ShoppingCart className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Create Order</span>
            </Button>
            
            <Button 
              onClick={() => openModal('manageVendors')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Users className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Manage Vendors</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewReports')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">View Reports</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewAlerts')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <AlertTriangle className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">View Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <FormModal
        isOpen={modals.addSKU}
        onClose={() => closeModal('addSKU')}
        title="Add New SKU"
        maxWidth="max-w-5xl"
      >
        <AddSKUDrawer onSKUAdded={() => handleFormSubmit('addSKU')}/>
      </FormModal>

      <FormModal
        isOpen={modals.startProduction}
        onClose={() => closeModal('startProduction')}
        title="Create Production Order"
        maxWidth="max-w-6xl"
      >
        <ProductionOrderForm 
          onSubmit={() => handleFormSubmit('startProduction')}
          onCancel={() => closeModal('startProduction')}
        />
      </FormModal>

      <FormModal
        isOpen={modals.createOrder}
        onClose={() => closeModal('createOrder')}
        title="Create Customer Order"
        maxWidth="max-w-7xl"
      >
        <CustomerOrderForm 
          onSubmit={() => handleFormSubmit('createOrder')}
          onCancel={() => closeModal('createOrder')}
        />
      </FormModal>

      <FormModal
        isOpen={modals.manageVendors}
        onClose={() => closeModal('manageVendors')}
        title="Add New Vendor"
        maxWidth="max-w-6xl"
      >
        <VendorForm 
          onSubmit={() => handleFormSubmit('manageVendors')}
          onCancel={() => closeModal('manageVendors')}
        />
      </FormModal>

      <FormModal
        isOpen={modals.viewReports}
        onClose={() => closeModal('viewReports')}
        title="Reports & Analytics"
        maxWidth="max-w-4xl"
      >
        <div className="p-6 text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Reports Dashboard</h3>
          <p className="text-muted-foreground mb-4">
            Navigate to the Reports section to access detailed analytics and business intelligence reports.
          </p>
          <Button 
            onClick={() => closeModal('viewReports')}
            className="text-white" 
            style={{backgroundColor: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            Go to Reports
          </Button>
        </div>
      </FormModal>

      <FormModal
        isOpen={modals.viewAlerts}
        onClose={() => closeModal('viewAlerts')}
        title="System Alerts"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="p-4 border border-gray-200 rounded-lg bg-white/60">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-white/80 ${alert.color}`}>
                  <alert.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center pt-4">
            <Button 
              variant="outline"
              onClick={() => closeModal('viewAlerts')}
            >
              Close
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};