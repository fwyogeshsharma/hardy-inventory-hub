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
import Promotions from "./pages/Promotions";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Enhanced Header Component
const EnhancedHeader = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/inventory': 'Auto Parts Inventory',
      '/production': 'Parts Production', 
      '/orders': 'Order Management',
      '/warehouse': 'Warehouse Management',
      '/vendors': 'Supplier Management',
      '/promotions': 'Promotions & Marketing',
      '/reports': 'Reports & Analytics',
      '/analytics': 'Business Analytics'
    };
    return titles[path as keyof typeof titles] || 'AutoFlow Parts';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    const descriptions = {
      '/': 'Monitor your auto parts inventory operations and key metrics',
      '/inventory': 'Track and manage all automotive parts, stock levels, and components',
      '/production': 'Monitor and manage parts production and manufacturing',
      '/orders': 'Track and manage customer orders and fulfillment',
      '/warehouse': 'Manage storage locations and distribution logistics',
      '/vendors': 'Manage supplier relationships and parts sourcing',
      '/promotions': 'Create and manage marketing campaigns',
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
          <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200">
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

          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

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
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
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
              <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/production" element={<Production />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/warehouse" element={<Warehouse />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;