import { 
  Package, 
  Factory, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  Gift,
  TrendingUp,
  Home,
  HelpCircle,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Production", url: "/production", icon: Factory },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Warehouse", url: "/warehouse", icon: Warehouse },
  { title: "Vendors", url: "/vendors", icon: Users },
  { title: "Promotions", url: "/promotions", icon: Gift },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
            <img className="w-9 h-9  rounded-lg flex items-center justify-center" src="/favicon.png" alt="AF Logo" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AutoFlow </h1>
            <p className="text-xs text-gray-500">Auto Parts Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      className={`
                        w-full justify-start px-3 py-2 rounded-md transition-colors
                        ${active 
                          ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <NavLink to={item.url} end={item.url === "/"} className="flex items-center w-full">
                        <Icon className="h-4 w-4 mr-3" />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={currentPath === "/settings"}
              className="w-full justify-start px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <NavLink to="/settings" className="flex items-center w-full">
                <Settings className="h-4 w-4 mr-3" />
                <span className="font-medium">Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="w-full justify-start px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <NavLink to="/help" className="flex items-center w-full">
                <HelpCircle className="h-4 w-4 mr-3" />
                <span className="font-medium">Help</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="w-full justify-start px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <NavLink to="/logout" className="flex items-center w-full">
                <LogOut className="h-4 w-4 mr-3" />
                <span className="font-medium">Sign Out</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}