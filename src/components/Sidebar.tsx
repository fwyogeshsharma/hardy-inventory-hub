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
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, current: true },
  { name: "Inventory", href: "/inventory", icon: Package, current: false },
  { name: "Production", href: "/production", icon: Factory, current: false },
  { name: "Orders", href: "/orders", icon: ShoppingCart, current: false },
  { name: "Warehouse", href: "/warehouse", icon: Warehouse, current: false },
  { name: "Vendors", href: "/vendors", icon: Users, current: false },
  { name: "Promotions", href: "/promotions", icon: Gift, current: false },
  { name: "Reports", href: "/reports", icon: FileText, current: false },
  { name: "Analytics", href: "/analytics", icon: TrendingUp, current: false },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className={cn("flex h-full w-64 flex-col bg-card border-r", className)}>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={activeItem === item.name ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeItem === item.name && "bg-primary text-primary-foreground"
                )}
                onClick={() => setActiveItem(item.name)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>
        
        <div className="px-4 py-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};