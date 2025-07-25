import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar, Download, RefreshCw, Target, Loader2 } from "lucide-react";
import { dataService, SKU, Inventory as InventoryRecord } from "@/lib/database";
import { AddSKUDrawer } from "@/components/AddSKUDrawer";
import { initializeAutoPartsData } from "@/lib/initializeAutoPartsData";

export default function Inventory() {
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await dataService.initialize();
      
      // Check if we have any SKUs, if not, initialize sample data
      const existingSKUs = await dataService.getSKUs();
      if (existingSKUs.length === 0) {
        console.log('No SKUs found, initializing sample automotive data...');
        await initializeAutoPartsData();
      }
      
      const [skusData, inventoryData] = await Promise.all([
        dataService.getSKUs(),
        dataService.getInventory()
      ]);
      setSKUs(skusData);
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSKUAdded = (newSKU: SKU) => {
    setSKUs(prev => [...prev, newSKU]);
    // Reload inventory data to get the new SKU's inventory record
    loadData();
  };

  // Helper functions
  const getStockData = (sku: SKU) => {
    // Get inventory data for this SKU
    const skuInventory = inventory.find(inv => inv.sku_id === sku.id);
    
    if (skuInventory) {
      return {
        stock: skuInventory.quantity_on_hand,
        safetyStock: skuInventory.safety_stock_level,
        reorderPoint: skuInventory.reorder_point,
        maxStock: skuInventory.max_stock_level || 1000,
        unitCost: skuInventory.unit_cost || sku.unit_cost || 2.50,
        totalValue: skuInventory.quantity_on_hand * (skuInventory.unit_cost || sku.unit_cost || 2.50),
        fillLevel: skuInventory.max_stock_level 
          ? (skuInventory.quantity_on_hand / skuInventory.max_stock_level) * 100 
          : 50
      };
    }
    
    // Fallback for SKUs without inventory records
    const seed = sku.id;
    const baseStock = 100 + (seed % 900);
    const variance = (seed % 200) - 100;
    const stock = Math.max(0, baseStock + variance);
    const safetyStock = Math.floor(stock * 0.2);
    const unitCost = sku.unit_cost || 2.50;
    
    return { 
      stock, 
      safetyStock, 
      reorderPoint: Math.floor(stock * 0.35),
      maxStock: Math.floor(stock * 2.5),
      unitCost, 
      totalValue: stock * unitCost,
      fillLevel: (stock / (stock * 2.5)) * 100
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalInventoryValue = () => {
    return skus.reduce((total, sku) => {
      const stockData = getStockData(sku);
      return total + stockData.totalValue;
    }, 0);
  };

  const getLowStockCount = () => {
    return skus.filter(sku => {
      const stockData = getStockData(sku);
      return stockData.stock <= stockData.safetyStock && stockData.stock > 0;
    }).length;
  };

  const getOutOfStockCount = () => {
    return skus.filter(sku => {
      const stockData = getStockData(sku);
      return stockData.stock === 0;
    }).length;
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Auto Parts Inventory
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage all automotive parts, components, and accessories
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddSKUDrawer onSKUAdded={handleSKUAdded} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total SKUs</p>
                <p className="text-3xl font-bold">{skus.length}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Active auto parts
                </p>
              </div>
              <Package className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Low Stock</p>
                <p className="text-3xl font-bold">{getLowStockCount()}</p>
                <p className="text-orange-100 text-xs mt-1">Below safety levels</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-orange-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-orange-100 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                -8% improvement
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold">{getOutOfStockCount()}</p>
                <p className="text-red-100 text-xs mt-1">Requires attention</p>
              </div>
              <Target className="h-10 w-10 text-red-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-red-100 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Critical priority
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(calculateTotalInventoryValue())}</p>
                <p className="text-green-100 text-xs mt-1">Current inventory</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% value growth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Content */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading inventory...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your inventory data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : skus.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Auto Parts Found
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first automotive part to get started with inventory management.
              </p>
              <AddSKUDrawer onSKUAdded={handleSKUAdded} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center text-xl">
              <Package className="h-6 w-6 mr-3 text-blue-500" />
              Auto Parts Inventory
              <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
                {skus.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {skus.map((sku) => {
                const stockData = getStockData(sku);
                return (
                  <div key={sku.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{sku.brand?.name?.charAt(0) || 'S'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{sku.sku_name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{sku.sku_code}</Badge>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{sku.sku_type === 'kit' ? 'Kit SKU' : 'Single SKU'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-13">
                        <p className="text-sm text-gray-600">
                          {sku.brand?.name} • {sku.flavor?.name} • {sku.pack_size?.name}
                        </p>
                        <p className="text-xs text-gray-500">Barcode: {sku.barcode || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Launch Date: {sku.launch_date ? new Date(sku.launch_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2 min-w-[160px]">
                      <div className="flex items-center justify-end space-x-2">
                        <Badge variant={sku.status === 'active' ? 'default' : sku.status === 'upcoming' ? 'secondary' : 'outline'}>
                          {sku.status.charAt(0).toUpperCase() + sku.status.slice(1)}
                        </Badge>
                        {stockData.stock <= stockData.safetyStock && stockData.stock > 0 && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Low Stock
                          </Badge>
                        )}
                        {stockData.stock === 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          Stock: {stockData.stock.toLocaleString()} {sku.unit_of_measure}
                        </p>
                        <p className="text-xs text-gray-500">
                          Safety: {stockData.safetyStock} • Reorder: {stockData.reorderPoint}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(stockData.totalValue)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unit: {formatCurrency(stockData.unitCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}