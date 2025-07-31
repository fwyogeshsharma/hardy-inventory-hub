import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
import { dataService, inventoryManager } from "@/lib/database";
import { workflowManager } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Package, 
  Scan,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Truck,
  BarChart3,
  RefreshCw,
  Plus,
  Activity,
  Target,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  ClipboardCheck,
  Timer,
  Users,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react";

interface InventoryRecord {
  id: number;
  sku_id: number;
  warehouse_id: number;
  quantity_on_hand: number;
  quantity_available: number;
  quantity_allocated: number;
  reorder_point: number;
  max_stock_level: number;
  location?: string;
  last_count_date?: string;
  sku?: any;
}

interface WarehouseInventory {
  warehouse_id: number;
  warehouse_name: string;
  total_skus: number;
  total_quantity: number;
  recent_additions: InventoryRecord[];
  low_stock_items: InventoryRecord[];
}

export default function Warehouse() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [warehouseInventory, setWarehouseInventory] = useState<WarehouseInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadWarehouseData();
    
    // Set up real-time updates by checking for new data every 30 seconds
    const dataRefreshTimer = setInterval(loadWarehouseData, 30000);
    
    return () => {
      clearInterval(timer);
      clearInterval(dataRefreshTimer);
    };
  }, []);

  const loadWarehouseData = async () => {
    try {
      setLoading(true);
      const [inventory, skus, movements] = await Promise.all([
        dataService.getInventory(),
        dataService.getSKUs(),
        inventoryManager.getInventoryMovements()
      ]);
      
      // Enrich inventory with SKU data
      const enrichedInventory = inventory.map(inv => ({
        ...inv,
        sku: skus.find(s => s.id === inv.sku_id)
      }));
      
      // Group by warehouse
      const warehouseGroups = warehouseLocations.map(warehouse => {
        const warehouseInv = enrichedInventory.filter(inv => inv.warehouse_id === warehouse.id);
        const recentItems = warehouseInv
          .filter(inv => {
            const recentMovement = movements
              .filter(mov => mov.sku_id === inv.sku_id && mov.warehouse_id === inv.warehouse_id)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
            if (!recentMovement) return false;
            const movementDate = new Date(recentMovement.created_at);
            const today = new Date();
            const diffHours = (today.getTime() - movementDate.getTime()) / (1000 * 60 * 60);
            return diffHours <= 24; // Items moved in last 24 hours
          })
          .slice(0, 5);
          
        const lowStockItems = warehouseInv
          .filter(inv => inv.quantity_on_hand <= inv.reorder_point)
          .slice(0, 5);
          
        return {
          warehouse_id: warehouse.id,
          warehouse_name: warehouse.name,
          total_skus: warehouseInv.length,
          total_quantity: warehouseInv.reduce((sum, inv) => sum + inv.quantity_on_hand, 0),
          recent_additions: recentItems,
          low_stock_items: lowStockItems
        };
      });
      
      setWarehouseInventory(warehouseGroups);
      
      // Get recent movements with enriched data
      const enrichedMovements = movements
        .slice(0, 10)
        .map(mov => ({
          ...mov,
          sku: skus.find(s => s.id === mov.sku_id),
          warehouse: warehouseLocations.find(w => w.id === mov.warehouse_id)
        }));
      
      setRecentMovements(enrichedMovements);
      
    } catch (error) {
      console.error('Error loading warehouse data:', error);
      toast({
        title: "Error",
        description: "Failed to load warehouse data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    loadWarehouseData(); // Refresh data after form submission
  };

  const warehouseLocations = [
    { 
      id: 1, 
      name: "Main Auto Parts Warehouse", 
      code: "APW-001",
      address: "2450 Auto Parts Drive, Detroit, MI 48201", 
      capacity: 50000, 
      occupied: 32500, 
      zones: 12, 
      status: "Active",
      manager: "John Smith",
      specialization: "Engine & Transmission Parts",
      temperature: "Ambient",
      lastActivity: "5 minutes ago"
    },
    { 
      id: 2, 
      name: "West Coast Distribution Center", 
      code: "WDC-002",
      address: "1875 Parts Boulevard, Los Angeles, CA 90001", 
      capacity: 35000, 
      occupied: 28750, 
      zones: 8, 
      status: "Active",
      manager: "Maria Garcia",
      specialization: "Brake & Suspension Systems",
      temperature: "Climate Controlled",
      lastActivity: "12 minutes ago"
    },
    { 
      id: 3, 
      name: "East Coast Hub", 
      code: "ECH-003",
      address: "3200 Industrial Way, Atlanta, GA 30309", 
      capacity: 28000, 
      occupied: 18200, 
      zones: 6, 
      status: "Active",
      manager: "David Chen",
      specialization: "Electrical & Electronics",
      temperature: "Climate Controlled",
      lastActivity: "8 minutes ago"
    },
    { 
      id: 4, 
      name: "Midwest Storage Facility", 
      code: "MSF-004",
      address: "1650 Logistics Lane, Chicago, IL 60607", 
      capacity: 42000, 
      occupied: 31500, 
      zones: 10, 
      status: "Maintenance",
      manager: "Sarah Johnson",
      specialization: "Fluids & Filters",
      temperature: "Temperature Controlled",
      lastActivity: "2 hours ago"
    }
  ];


  const getMovementBadge = (type: string) => {
    switch (type) {
      case "production":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Production
          </Badge>
        );
      case "sale":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Sale
          </Badge>
        );
      case "receipt":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Receipt
          </Badge>
        );
      case "transfer":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Transfer
          </Badge>
        );
      case "adjustment":
        return (
          <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd] shadow-sm">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            Adjustment
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getQuantityBadge = (quantity: number) => {
    if (quantity > 0) {
      return <Badge className="bg-green-100 text-green-700 border-green-200">+{quantity}</Badge>;
    } else if (quantity < 0) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">{quantity}</Badge>;
    }
    return <Badge variant="outline">0</Badge>;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "Maintenance":
        return (
          <Badge style={{backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7'}}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUtilizationPercentage = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-blue-600";
    return "text-blue-600";
  };

  const getTotalCapacity = () => warehouseLocations.reduce((sum, wh) => sum + wh.capacity, 0);
  const getTotalOccupied = () => warehouseLocations.reduce((sum, wh) => sum + wh.occupied, 0);
  const getActiveWarehouses = () => warehouseLocations.filter(wh => wh.status === "Active").length;
  const getTotalZones = () => warehouseLocations.reduce((sum, wh) => sum + wh.zones, 0);
  const getTotalInventoryUnits = () => warehouseInventory.reduce((sum, wh) => sum + wh.total_quantity, 0);
  const getTotalSKUs = () => warehouseInventory.reduce((sum, wh) => sum + wh.total_skus, 0);
  const getTodayMovements = () => {
    const today = new Date().toISOString().split('T')[0];
    return recentMovements.filter(mov => 
      new Date(mov.created_at).toISOString().split('T')[0] === today
    ).length;
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Warehouse Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor auto parts locations, stock movements, and capacity across facilities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Timer className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </Badge>
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm"
            onClick={loadWarehouseData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Scan className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Truck className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Facilities</p>
                <p className="text-3xl font-bold">{getActiveWarehouses()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Of {warehouseLocations.length} total locations
                </p>
              </div>
              <Building2 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                2 new facilities planned
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total SKUs</p>
                <p className="text-3xl font-bold">{getTotalSKUs().toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">Unique products tracked</p>
              </div>
              <Target className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Package className="h-4 w-4 mr-1" />
                {getTotalZones()} storage zones
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Units</p>
                <p className="text-3xl font-bold">{getTotalInventoryUnits().toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">Units in all warehouses</p>
              </div>
              <BarChart3 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                Live inventory tracking
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100())'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today's Movements</p>
                <p className="text-3xl font-bold">{getTodayMovements()}</p>
                <p className="text-blue-100 text-xs mt-1">Inventory transactions</p>
              </div>
              <Activity className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Real-time tracking
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Locations */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <WarehouseIcon className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Warehouse Locations
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {warehouseLocations.length} facilities
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {warehouseLocations.map((location) => {
              const utilization = getUtilizationPercentage(location.occupied, location.capacity);
              return (
                <div key={location.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{location.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{location.code}</Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{location.specialization}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(location.status)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          Location
                        </div>
                        <p className="text-sm font-medium text-gray-900">{location.address}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          Manager
                        </div>
                        <p className="text-sm font-medium text-gray-900">{location.manager}</p>
                        <p className="text-xs text-gray-500">{location.temperature}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="text-lg font-semibold text-gray-900">{(location.capacity / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">sq ft</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Occupied</p>
                        <p className="text-lg font-semibold" style={{color: '#3997cd'}}>{(location.occupied / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-gray-500">sq ft</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Zones</p>
                        <p className="text-lg font-semibold" style={{color: '#3997cd'}}>{location.zones}</p>
                        <p className="text-xs text-gray-500">storage</p>
                      </div>
                    </div>
                    
                    {/* Utilization Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Storage Utilization</span>
                        <span className={`text-sm font-bold ${getUtilizationColor(utilization)}`}>{utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            utilization >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                            utilization >= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                            'bg-gradient-to-r from-[#3997cd] to-[#2d7aad]'
                          }`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span className="text-xs text-gray-400">Last activity: {location.lastActivity}</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    {/* Real-time Inventory Section */}
                    {warehouseInventory.find(w => w.warehouse_id === location.id) && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Live Inventory Data
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-sm text-blue-600">Total SKUs</p>
                            <p className="text-lg font-semibold text-blue-900">
                              {warehouseInventory.find(w => w.warehouse_id === location.id)?.total_skus || 0}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-blue-600">Total Units</p>
                            <p className="text-lg font-semibold text-blue-900">
                              {warehouseInventory.find(w => w.warehouse_id === location.id)?.total_quantity.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>
                        
                        {/* Recent Additions */}
                        {warehouseInventory.find(w => w.warehouse_id === location.id)?.recent_additions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-blue-700 mb-2">Recent Additions (24hrs)</p>
                            <div className="space-y-1">
                              {warehouseInventory.find(w => w.warehouse_id === location.id)?.recent_additions.slice(0, 3).map(item => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                  <span className="text-blue-600">{item.sku?.sku_code}</span>
                                  <Badge className="bg-green-100 text-green-700 text-xs">+{item.quantity_on_hand}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Low Stock Items */}
                        {warehouseInventory.find(w => w.warehouse_id === location.id)?.low_stock_items.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-700 mb-2">Low Stock Alert</p>
                            <div className="space-y-1">
                              {warehouseInventory.find(w => w.warehouse_id === location.id)?.low_stock_items.slice(0, 3).map(item => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                  <span className="text-red-600">{item.sku?.sku_code}</span>
                                  <Badge className="bg-red-100 text-red-700 text-xs">{item.quantity_on_hand} left</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Activity className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Recent Stock Movements
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {recentMovements.length} recent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading inventory movements...</p>
            </div>
          ) : recentMovements.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Recent Movements</h3>
              <p className="text-gray-500 mb-6">
                Inventory movements will appear here when products are moved, received, or shipped.
              </p>
              <p className="text-sm text-gray-400">
                Complete production inspections to see new inventory movements.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                          <span className="text-white font-bold text-sm">
                            {movement.sku?.sku_code?.charAt(0) || movement.sku?.brand?.name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{movement.sku?.sku_name || 'Unknown Product'}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{movement.sku?.sku_code || 'N/A'}</Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{movement.warehouse?.name || `Warehouse ${movement.warehouse_id}`}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getMovementBadge(movement.movement_type)}
                        {getQuantityBadge(movement.quantity_change)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500">
                          <Package className="h-4 w-4 mr-1" />
                          Quantity Change
                        </div>
                        <p className="font-medium text-gray-900">
                          {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change.toLocaleString()} units
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500">
                          <Activity className="h-4 w-4 mr-1" />
                          New Balance
                        </div>
                        <p className="font-medium text-gray-900">{movement.quantity_after.toLocaleString()} units</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500">
                          <Building2 className="h-4 w-4 mr-1" />
                          Reference
                        </div>
                        <p className="font-medium text-gray-900">
                          {movement.reference_type === 'production' ? `PO #${movement.reference_id}` : 
                           movement.reference_type === 'sale' ? `SO #${movement.reference_id}` :
                           movement.reference_type || 'Manual'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500">
                          <Timer className="h-4 w-4 mr-1" />
                          Time
                        </div>
                        <p className="font-medium text-gray-900">{formatTimeAgo(movement.created_at)}</p>
                        <p className="text-xs text-gray-500">{new Date(movement.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {movement.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Note:</strong> {movement.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Shipment Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Process New Shipment"
        maxWidth="max-w-4xl"
      >
        <div className="p-6 text-center">
          <Truck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Shipment Processing</h3>
          <p className="text-muted-foreground mb-4">
            Shipment processing functionality will be available soon. This will include inbound/outbound shipment tracking, inventory movements, and logistics management.
          </p>
          <Button 
            onClick={() => setModalOpen(false)}
            className="text-white" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            Close
          </Button>
        </div>
      </FormModal>
    </div>
  );
}