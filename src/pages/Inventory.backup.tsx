import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  MoreHorizontal, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Zap,
  Grid3X3,
  List,
  Download,
  RefreshCw,
  Settings,
  Calendar,
  Star,
  Target
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddSKUDrawer } from "@/components/AddSKUDrawer";
import { skuStorage, SKURecord } from "@/lib/localStorage";
import { useState, useEffect } from "react";

export default function Inventory() {
  const [skus, setSKUs] = useState<SKURecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState<string>("skuName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setSKUs(skuStorage.getAll());
  }, []);

  const handleSKUAdded = (newSKU: SKURecord) => {
    setSKUs(prev => [...prev, newSKU]);
  };

  // Filter and sort SKUs
  const filteredSKUs = skus
    .filter(sku => {
      const matchesSearch = 
        sku.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.flavor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sku.barcode && sku.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand = !selectedBrand || sku.brand === selectedBrand;
      const matchesStatus = !selectedStatus || sku.status === selectedStatus;
      
      return matchesSearch && matchesBrand && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof SKURecord]?.toString() || "";
      const bValue = b[sortBy as keyof SKURecord]?.toString() || "";
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Get unique brands and statuses for filters
  const availableBrands = [...new Set(skus.map(sku => sku.brand))].filter(Boolean);
  const availableStatuses = [...new Set(skus.map(sku => sku.status))].filter(Boolean);

  // Enhanced stock data calculation
  const getStockData = (sku: SKURecord) => {
    const seed = sku.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseStock = 100 + (seed % 900);
    const variance = (seed % 200) - 100;
    const stock = Math.max(0, baseStock + variance);
    const safetyStock = Math.floor(stock * 0.2);
    const reorderPoint = Math.floor(stock * 0.35);
    const maxStock = Math.floor(stock * 2.5);
    const unitCost = 1.00 + (seed % 300) / 100;
    const totalValue = stock * unitCost;
    
    return { 
      stock, 
      safetyStock, 
      reorderPoint, 
      maxStock, 
      unitCost, 
      totalValue,
      fillLevel: (stock / maxStock) * 100
    };
  };

  const getStatusBadge = (sku: SKURecord, stock: number, safetyStock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-500 text-white">Out of Stock</Badge>;
    } else if (stock <= safetyStock) {
      return <Badge className="bg-orange-500 text-white">Low Stock</Badge>;
    } else if (sku.status === 'active') {
      return <Badge className="bg-green-500 text-white">Active</Badge>;
    } else if (sku.status === 'upcoming') {
      return <Badge className="bg-blue-500 text-white">Upcoming</Badge>;
    } else {
      return <Badge className="bg-gray-500 text-white">Discontinued</Badge>;
    }
  };

  const getStockStatusIcon = (stock: number, safetyStock: number, reorderPoint: number) => {
    if (stock === 0) {
      return <Minus className="h-4 w-4 text-red-500" />;
    } else if (stock <= safetyStock) {
      return <TrendingDown className="h-4 w-4 text-orange-500" />;
    } else if (stock <= reorderPoint) {
      return <TrendingDown className="h-4 w-4 text-yellow-500" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
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

  const getStockLevelColor = (fillLevel: number) => {
    if (fillLevel > 70) return "bg-green-500";
    if (fillLevel > 40) return "bg-yellow-500";
    if (fillLevel > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage all SKUs, stock levels, and materials
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
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <AddSKUDrawer onSKUAdded={handleSKUAdded} />
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total SKUs</p>
                <p className="text-3xl font-bold">{skus.length}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {filteredSKUs.length !== skus.length && `${filteredSKUs.length} shown`}
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

      {/* Enhanced Search and Filter Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Inventory</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search SKUs, brands, barcodes..." 
                  className="pl-10 bg-white/80 border-gray-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-white/80 border-gray-200">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Brands</SelectItem>
                    {availableBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white/80 border-gray-200">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/80 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skuName">Name</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">View</label>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Inventory Display */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Package className="h-6 w-6 mr-3 text-blue-500" />
              Inventory Items
              <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
                {filteredSKUs.length} items
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-white/80"
              >
                {sortOrder === "asc" ? "↑" : "↓"} Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {filteredSKUs.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {skus.length === 0 ? "No SKUs found" : "No SKUs match your filters"}
              </h3>
              <p className="text-gray-500 mb-6">
                {skus.length === 0 ? "Add your first SKU to get started." : "Try adjusting your search criteria."}
              </p>
              {skus.length === 0 && <AddSKUDrawer onSKUAdded={handleSKUAdded} />}
            </div>
          ) : (
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
              <TabsContent value="table" className="mt-0">
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        <TableHead>SKU Details</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Stock Level</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSKUs.map((sku) => {
                        const stockData = getStockData(sku);
                        return (
                          <TableRow key={sku.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell>
                              {getStockStatusIcon(stockData.stock, stockData.safetyStock, stockData.reorderPoint)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-semibold text-gray-900">{sku.skuName}</div>
                                <div className="text-sm text-gray-600">
                                  {sku.flavor} • {sku.packSize}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Barcode: {sku.barcode || 'N/A'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {sku.brand}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge variant={sku.skuType === 'kit' ? 'default' : 'secondary'}>
                                    {sku.skuType === 'kit' ? 'Kit' : 'Single'}
                                  </Badge>
                                  {getStatusBadge(sku, stockData.stock, stockData.safetyStock)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="space-y-2">
                                <div className="font-semibold text-gray-900">
                                  {stockData.stock.toLocaleString()} {sku.unitOfMeasure}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Safety: {stockData.safetyStock} • Reorder: {stockData.reorderPoint}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all ${getStockLevelColor(stockData.fillLevel)}`}
                                    style={{ width: `${Math.min(100, stockData.fillLevel)}%` }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500">
                                  {Math.round(stockData.fillLevel)}% capacity
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(stockData.unitCost)}
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600">
                              {formatCurrency(stockData.totalValue)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit SKU
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Package className="h-4 w-4 mr-2" />
                                    Adjust Stock
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="grid" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSKUs.map((sku) => {
                    const stockData = getStockData(sku);
                    return (
                      <Card key={sku.id} className="hover:shadow-xl transition-all duration-200 bg-white border border-gray-200 group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                {sku.skuName}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {sku.brand} • {sku.flavor} • {sku.packSize}
                              </p>
                            </div>
                            {getStockStatusIcon(stockData.stock, stockData.safetyStock, stockData.reorderPoint)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Stock Level</span>
                            <span className="font-bold text-gray-900">
                              {stockData.stock.toLocaleString()} {sku.unitOfMeasure}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all ${getStockLevelColor(stockData.fillLevel)}`}
                                style={{ width: `${Math.min(100, stockData.fillLevel)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Safety: {stockData.safetyStock}</span>
                              <span>Max: {stockData.maxStock}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex flex-col space-y-1">
                              <Badge variant={sku.skuType === 'kit' ? 'default' : 'secondary'} className="w-fit">
                                {sku.skuType === 'kit' ? 'Kit' : 'Single'}
                              </Badge>
                              {getStatusBadge(sku, stockData.stock, stockData.safetyStock)}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {formatCurrency(stockData.totalValue)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(stockData.unitCost)} each
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}