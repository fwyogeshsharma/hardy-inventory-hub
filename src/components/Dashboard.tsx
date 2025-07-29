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
import { dataService } from "@/lib/database";
import { initializeData } from "@/lib/initializeData";
import { skuStorage } from "@/lib/localStorage";
import { useState, useEffect } from "react";
import { FormModal } from "./forms/FormModal";
import { ProductionOrderForm } from "./forms/ProductionOrderForm";
import { CustomerOrderForm } from "./forms/CustomerOrderForm";
import { VendorForm } from "./forms/VendorForm";
import { AddSKUDrawer } from "./AddSKUDrawer";

export const Dashboard = () => {
  const [skus, setSKUs] = useState<any[]>([]);
  const [modals, setModals] = useState({
    addSKU: false,
    startProduction: false,
    createOrder: false,
    manageVendors: false,
    viewReports: false,
    viewAlerts: false
  });
  
  useEffect(() => {
    setSKUs(skuStorage.getAll());
  }, []);

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

  // Calculate real metrics from SKU data
  const calculateMetrics = () => {
    const totalSKUs = skus.length;
    const activeSKUs = skus.filter(sku => sku.status === 'active').length;

    const discontinuedSKUs = skus.filter(sku => sku.status === 'discontinued').length;
    
    // Mock additional data based on real SKUs
    const lowStockItems = Math.floor(totalSKUs * 0.15); // 15% low stock
    const activeOrders = Math.floor(totalSKUs * 2.3); // ~2.3 orders per SKU
    const productionRuns = Math.floor(totalSKUs * 0.18); // ~18% in production
    
    return {
      totalSKUs,
      activeSKUs,
      // upcomingSKUs,
      discontinuedSKUs,
      lowStockItems,
      activeOrders,
      productionRuns
    };
  };

  const metrics = calculateMetrics();

  const recentAlerts = [
    { 
      id: 1, 
      type: "Stock Alert", 
      message: "Brake pads for Toyota Camry running low - 22 units remaining",
      priority: "high", 
      time: "30 minutes ago",
      icon: Package,
      color: "text-red-500"
    },
    { 
      id: 2, 
      type: "Production", 
      message: "Alternator assembly for Honda Civic batch completed", 
      priority: "low", 
      time: "2 hours ago",
      icon: Factory,
      color: "text-green-500"
    },
    { 
      id: 3, 
      type: "Order", 
      message: "Bulk order from AutoZone received", 
      priority: "medium", 
      time: "4 hours ago",
      icon: ShoppingCart,
      color: "text-blue-500"
    },
    { 
      id: 4, 
      type: "Vendor", 
      message: "Shipment from Denso Parts confirmed", 
      priority: "low", 
      time: "6 hours ago",
      icon: Truck,
      color: "text-gray-500"
    }
  ];

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
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
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
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your inventory today
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total SKUs"
          value={metrics.totalSKUs.toString()}
          description={`${metrics.activeSKUs} active items`}
          icon={Package}
          trend="up"
          trendValue="+12%"
          variant="default"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockItems.toString()}
          description="Require immediate attention"
          icon={AlertTriangle}
          trend="down"
          trendValue="-8%"
          variant="warning"
          className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg"
        />
        <MetricCard
          title="Active Orders"
          value={metrics.activeOrders.toString()}
          description="In progress & pending"
          icon={ShoppingCart}
          trend="up"
          trendValue="+23%"
          variant="default"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg"
        />
        <MetricCard
          title="Production Runs"
          value={metrics.productionRuns.toString()}
          description="Active this month"
          icon={Factory}
          trend="stable"
          trendValue="+5%"
          variant="default"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-green-600">$847K</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">75% of monthly goal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Above target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time</p>
                <p className="text-2xl font-bold text-purple-600">98%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Delivery rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendors</p>
                <p className="text-2xl font-bold text-indigo-600">24</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-muted-foreground">4.8 avg rating</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warehouses</p>
                <p className="text-2xl font-bold text-cyan-600">3</p>
              </div>
              <Warehouse className="h-8 w-8 text-cyan-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">92% capacity utilized</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{recentAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">1 high priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Alerts - Enhanced */}
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
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
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
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
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
              Top Performing SKUs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformingSKUs.map((sku, index) => (
              <div key={sku.id} className="flex items-center justify-between p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{sku.skuName}</p>
                    <p className="text-xs text-muted-foreground">{sku.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-600">{formatCurrency(sku.revenue)}</p>
                  <div className="flex items-center text-xs text-green-600">
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
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Button 
              onClick={() => openModal('addSKU')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group"
            >
              <Package className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Add SKU</span>
            </Button>
            
            <Button 
              onClick={() => openModal('startProduction')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group"
            >
              <Factory className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Start Production</span>
            </Button>
            
            <Button 
              onClick={() => openModal('createOrder')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md group"
            >
              <ShoppingCart className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Create Order</span>
            </Button>
            
            <Button 
              onClick={() => openModal('manageVendors')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group"
            >
              <Users className="h-8 w-8 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Manage Vendors</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewReports')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-orange-200 hover:border-orange-300 transition-all duration-200 hover:shadow-md group"
            >
              <BarChart3 className="h-8 w-8 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">View Reports</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewAlerts')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md group"
            >
              <AlertTriangle className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
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
        <AddSKUDrawer onClose={() => handleFormSubmit('addSKU')} />
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
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
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