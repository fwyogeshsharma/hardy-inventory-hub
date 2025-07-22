import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Filter } from "lucide-react";

export default function Inventory() {
  const inventoryItems = [
    { id: 1, sku: "HTWO-LM-330", name: "HTWO Lime 330ml", brand: "HTWO", flavor: "Lime", packSize: "330ml", stock: 1250, safetyStock: 500, status: "Active" },
    { id: 2, sku: "SKHY-BR-500", name: "Skhy Berry 500ml", brand: "Skhy", flavor: "Berry", packSize: "500ml", stock: 45, safetyStock: 200, status: "Low Stock" },
    { id: 3, sku: "RLLIE-PC-1L", name: "Rallie Peach 1L", brand: "Rallie", flavor: "Peach", packSize: "1L", stock: 892, safetyStock: 300, status: "Active" },
    { id: 4, sku: "HTWO-LM-4PK", name: "HTWO Lime 4-Pack", brand: "HTWO", flavor: "Lime", packSize: "4-pack", stock: 234, safetyStock: 150, status: "Active" },
    { id: 5, sku: "SKHY-MX-330", name: "Skhy Mixed 330ml", brand: "Skhy", flavor: "Mixed", packSize: "330ml", stock: 0, safetyStock: 100, status: "Out of Stock" },
  ];

  const getStatusBadge = (status: string, stock: number, safetyStock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= safetyStock) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage all SKUs and materials</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New SKU
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search SKUs..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">23</div>
            <p className="text-xs text-muted-foreground">Below safety levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">5</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>SKU: {item.sku}</span>
                        <span>•</span>
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>{item.flavor}</span>
                        <span>•</span>
                        <span>{item.packSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{item.stock.toLocaleString()} units</div>
                    <div className="text-sm text-muted-foreground">Safety: {item.safetyStock}</div>
                  </div>
                  {getStatusBadge(item.status, item.stock, item.safetyStock)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}