import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search,
  Bell,
  Settings,
  HelpCircle,
  Plus,
  Download,
  RefreshCw,
  User,
  Calendar,
  Clock,
  Zap,
  Maximize2
} from "lucide-react";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Production from "./pages/Production";
import Orders from "./pages/Orders";
import Warehouse from "./pages/Warehouse";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import WorkflowDashboard from "./pages/WorkflowDashboard";
import PurchaseOrders from "./pages/PurchaseOrders";
import SalesOrders from "./pages/SalesOrders";
import { RealTimeNotifications } from "./components/RealTimeNotifications";
import { SKUIntegrationManager } from "./components/SKUIntegrationManager";

const queryClient = new QueryClient();

// Enhanced Header Component
const EnhancedHeader = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/workflow': 'Workflow Dashboard',
      '/inventory': 'Auto Parts Inventory',
      '/purchase-orders': 'Purchase Orders',
      '/sales-orders': 'Sales Orders',
      '/production': 'Parts Production', 
      '/orders': 'Order Management',
      '/warehouse': 'Warehouse Management',
      '/vendors': 'Supplier Management',
      '/reports': 'Reports & Analytics',
      '/analytics': 'Business Analytics'
    };
    return titles[path as keyof typeof titles] || 'AutoFlow Parts';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    const descriptions = {
      '/': 'Monitor your auto parts inventory operations and key metrics',
      '/workflow': 'Real-time overview of your complete inventory management workflow',
      '/inventory': 'Track and manage all automotive parts, stock levels, and components',
      '/purchase-orders': 'Manage purchase orders and inventory replenishment',
      '/sales-orders': 'Manage customer orders and inventory allocation', 
      '/production': 'Monitor and manage parts production and manufacturing',
      '/orders': 'Track and manage customer orders and fulfillment',
      '/warehouse': 'Manage storage locations and distribution logistics',
      '/vendors': 'Manage supplier relationships and parts sourcing',
      '/reports': 'Generate and export comprehensive business reports',
      '/analytics': 'Analyze performance metrics and business trends'
    };
    return descriptions[path as keyof typeof descriptions] || 'Complete automotive parts inventory solution';
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-all" />
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-600">{getPageDescription()}</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search parts, orders, SKUs..." 
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Date/Time Badge */}
          <Badge variant="outline" className="hidden sm:flex" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Real-time Notifications */}
          <RealTimeNotifications />

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Product Owner-CSR</p>
              <p className="text-xs text-gray-600">yogeshsharma@faberwork.com</p>
            </div>
            <Avatar className="h-8 w-8 ring-2" style={{ringColor: '#e6f2fa'}}>
              <AvatarFallback className="text-white text-sm font-semibold" style={{backgroundColor: '#3997cd'}}>
                YS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
    </header>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <EnhancedHeader />
              <main className="flex-1 overflow-auto" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/workflow" element={<WorkflowDashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/sales-orders" element={<SalesOrders />} />
                  <Route path="/production" element={<Production />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/warehouse" element={<Warehouse />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* Real-time SKU Integration Manager */}
                <SKUIntegrationManager />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;