import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  return (
    <header className="border-b bg-card h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hardy IMS</h1>
            <p className="text-xs text-muted-foreground">Inventory Management System</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search SKUs, materials..." 
            className="pl-10 w-64" 
          />
        </div>
        
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            5
          </Badge>
        </Button>
        
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};