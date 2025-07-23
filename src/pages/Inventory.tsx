import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, Filter } from "lucide-react";
import { AddSKUDrawer } from "@/components/AddSKUDrawer";
import { skuStorage, SKURecord } from "@/lib/localStorage";
import { useState, useEffect } from "react";

export default function Inventory() {
  const [skus, setSKUs] = useState<SKURecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load SKUs from localStorage on component mount
    setSKUs(skuStorage.getAll());
  }, []);

  const handleSKUAdded = (newSKU: SKURecord) => {
    setSKUs(prev => [...prev, newSKU]);
  };

  // Filter SKUs based on search term
  const filteredSKUs = skus.filter(sku => 
    sku.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.flavor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stock for display (mock data for now)
  const getStockData = (sku: SKURecord) => {
    // Mock stock data - in real app this would come from actual inventory
    const mockStock = Math.floor(Math.random() * 1000) + 50;
    const mockSafetyStock = Math.floor(mockStock * 0.3);
    return { stock: mockStock, safetyStock: mockSafetyStock };
  };

  const getStatusBadge = (sku: SKURecord, stock: number, safetyStock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= safetyStock) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    } else if (sku.status === 'active') {
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    } else if (sku.status === 'upcoming') {
      return <Badge className="bg-primary text-primary-foreground">Upcoming</Badge>;
    } else {
      return <Badge variant="secondary">Discontinued</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage all SKUs and materials</p>
        </div>
        <AddSKUDrawer onSKUAdded={handleSKUAdded} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search SKUs..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            <div className="text-2xl font-bold">{skus.length}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{skus.filter(sku => sku.status === 'upcoming').length}</div>
            <p className="text-xs text-muted-foreground">Below safety levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{skus.filter(sku => sku.status === 'discontinued').length}</div>
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
            {filteredSKUs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {skus.length === 0 ? "No SKUs found. Add your first SKU to get started." : "No SKUs match your search criteria."}
              </div>
            ) : (
              filteredSKUs.map((sku) => {
                const stockData = getStockData(sku);
                return (
                  <div key={sku.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-medium">{sku.skuName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>ID: {sku.id.slice(-8)}</span>
                            <span>•</span>
                            <span>{sku.brand}</span>
                            <span>•</span>
                            <span>{sku.flavor}</span>
                            <span>•</span>
                            <span>{sku.packSize}</span>
                            <span>•</span>
                            <span>{sku.skuType === 'kit' ? 'Kit SKU' : 'Single SKU'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{stockData.stock.toLocaleString()} {sku.unitOfMeasure.toLowerCase()}s</div>
                        <div className="text-sm text-muted-foreground">Safety: {stockData.safetyStock}</div>
                      </div>
                      {getStatusBadge(sku, stockData.stock, stockData.safetyStock)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}