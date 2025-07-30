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
import { InitializeDataButton } from "./InitializeDataButton";

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
    
    // Listen for real-time updates
    const handleDashboardRefresh = () => {
      console.log('📊 Dashboard refreshing with latest data...');
      setSKUs(skuStorage.getAll());
    };
    
    window.addEventListener('dashboard-refresh', handleDashboardRefresh);
    
    return () => {
      window.removeEventListener('dashboard-refresh', handleDashboardRefresh);
    };
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
      color: "text-[#3997cd]"
    },
    { 
      id: 2, 
      type: "Production", 
      message: "Alternator assembly for Honda Civic batch completed", 
      priority: "low", 
      time: "2 hours ago",
      icon: Factory,
      color: "text-[#3997cd]"
    },
    { 
      id: 3, 
      type: "Order", 
      message: "Bulk order from AutoZone received", 
      priority: "medium", 
      time: "4 hours ago",
      icon: ShoppingCart,
      color: '#3997cd'
    },
    { 
      id: 4, 
      type: "Vendor", 
      message: "Shipment from Denso Parts confirmed", 
      priority: "low", 
      time: "6 hours ago",
      icon: Truck,
      color: "text-[#3997cd]"
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
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm" 
            style={{borderColor: '#3997cd', color: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
          >
            <Download className="h-4 w-4 mr-2" style={{color: '#3997cd'}} />
            Export
          </Button>
          <InitializeDataButton />
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm" 
            style={{borderColor: '#3997cd', color: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
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
          description={`${metrics.activeSKUs} active items`}
          icon={Package}
          trend="up"
          trendValue="+12%"
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockItems.toString()}
          description="Require immediate attention"
          icon={AlertTriangle}
          trend="down"
          trendValue="-8%"
          variant="warning"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Active Orders"
          value={metrics.activeOrders.toString()}
          description="In progress & pending"
          icon={ShoppingCart}
          trend="up"
          trendValue="+23%"
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
        <MetricCard
          title="Production Runs"
          value={metrics.productionRuns.toString()}
          description="Active this month"
          icon={Factory}
          trend="stable"
          trendValue="+5%"
          variant="default"
          className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>$847K</p>
              </div>
              <DollarSign className="h-8 w-8" style={{color: '#3997cd'}} />
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

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
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

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
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

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
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

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold" style={{color: '#3997cd'}}>{recentAlerts.length}</p>
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
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
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
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
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
        <Card className="lg:col-span-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
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
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
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
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Package className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Add SKU</span>
            </Button>
            
            <Button 
              onClick={() => openModal('startProduction')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Factory className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Start Production</span>
            </Button>
            
            <Button 
              onClick={() => openModal('createOrder')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <ShoppingCart className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Create Order</span>
            </Button>
            
            <Button 
              onClick={() => openModal('manageVendors')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <Users className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">Manage Vendors</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewReports')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
            >
              <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform" style={{color: '#3997cd'}} />
              <span className="text-sm font-medium">View Reports</span>
            </Button>
            
            <Button 
              onClick={() => openModal('viewAlerts')}
              variant="outline" 
              className="h-24 flex-col space-y-2 bg-white/80 hover:bg-white transition-all duration-200 hover:shadow-md group" style={{borderColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3997cd'}
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