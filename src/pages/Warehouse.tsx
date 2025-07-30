import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
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
  Users
} from "lucide-react";

export default function Warehouse() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = () => {
    setModalOpen(false);
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

  const recentMovements = [
    { 
      id: 1, 
      type: "Inbound", 
      sku: "ACDelco-BRK-015", 
      skuName: "Ceramic Brake Pads Set",
      quantity: 2500, 
      location: "Zone A-1", 
      warehouse: "APW-001",
      timestamp: "2 hours ago", 
      operator: "John Smith",
      priority: "High",
      batchNumber: "BT-2024-001"
    },
    { 
      id: 2, 
      type: "Outbound", 
      sku: "Bosch-ENG-023", 
      skuName: "Premium Oil Filter",
      quantity: 1200, 
      location: "Zone B-3", 
      warehouse: "WDC-002",
      timestamp: "4 hours ago", 
      operator: "Maria Garcia",
      priority: "Medium",
      batchNumber: "BT-2024-002"
    },
    { 
      id: 3, 
      type: "Transfer", 
      sku: "Monroe-SUS-008", 
      skuName: "Shock Absorber Pair",
      quantity: 800, 
      location: "Zone C-2 → D-1", 
      warehouse: "ECH-003",
      timestamp: "6 hours ago", 
      operator: "David Kim",
      priority: "Low",
      batchNumber: "BT-2024-003"
    },
    { 
      id: 4, 
      type: "Audit", 
      sku: "NGK-IGN-012", 
      skuName: "Iridium Spark Plugs",
      quantity: 450, 
      location: "Zone A-2", 
      warehouse: "APW-001",
      timestamp: "8 hours ago", 
      operator: "Sarah Johnson",
      priority: "High",
      batchNumber: "BT-2024-004"
    },
    { 
      id: 5, 
      type: "Inbound", 
      sku: "Mobil1-FLD-005", 
      skuName: "Synthetic Motor Oil 5W-30",
      quantity: 3200, 
      location: "Zone F-1", 
      warehouse: "MSF-004",
      timestamp: "10 hours ago", 
      operator: "Mike Rodriguez",
      priority: "Medium",
      batchNumber: "BT-2024-005"
    }
  ];

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "Inbound":
        return (
          <Badge className="bg-green-100 text-blue-700 border-green-200 shadow-sm">
            <ArrowDownLeft className="h-3 w-3 mr-1" />
            Inbound
          </Badge>
        );
      case "Outbound":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Outbound
          </Badge>
        );
      case "Transfer":
        return (
          <Badge className="bg-orange-100 text-blue-700 border-orange-200 shadow-sm">
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Transfer
          </Badge>
        );
      case "Audit":
        return (
          <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd] shadow-sm">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            Audit
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      case "Low":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-blue-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "Maintenance":
        return (
          <Badge className="bg-orange-100 text-blue-700 border-orange-200">
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

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Scan className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Truck className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Facilities</p>
                <p className="text-3xl font-bold">{getActiveWarehouses()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Of {warehouseLocations.length} total locations
                </p>
              </div>
              <Building2 className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                2 new facilities planned
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Capacity</p>
                <p className="text-3xl font-bold">{(getTotalCapacity() / 1000).toFixed(0)}K</p>
                <p className="text-blue-100 text-xs mt-1">Square feet available</p>
              </div>
              <Target className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Package className="h-4 w-4 mr-1" />
                {getTotalZones()} storage zones
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Utilization</p>
                <p className="text-3xl font-bold">{getUtilizationPercentage(getTotalOccupied(), getTotalCapacity())}%</p>
                <p className="text-blue-100 text-xs mt-1">{(getTotalOccupied() / 1000).toFixed(1)}K sq ft occupied</p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                Optimal range: 70-85%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Daily Movements</p>
                <p className="text-3xl font-bold">{recentMovements.length * 45}</p>
                <p className="text-blue-100 text-xs mt-1">Transactions today</p>
              </div>
              <Activity className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18% vs yesterday
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Locations */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <WarehouseIcon className="h-6 w-6 mr-3 text-blue-500" />
            Warehouse Locations
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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
                        <p className="text-lg font-semibold text-blue-600">{(location.occupied / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-gray-500">sq ft</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Zones</p>
                        <p className="text-lg font-semibold text-blue-600">{location.zones}</p>
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
                            'bg-gradient-to-r from-green-500 to-green-600'
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
            <Activity className="h-6 w-6 mr-3 text-blue-500" />
            Recent Stock Movements
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
              {recentMovements.length} recent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{movement.sku.split('-')[0].charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{movement.skuName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{movement.sku}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{movement.warehouse}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getMovementBadge(movement.type)}
                      {getPriorityBadge(movement.priority)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-500">
                        <Package className="h-4 w-4 mr-1" />
                        Quantity
                      </div>
                      <p className="font-medium text-gray-900">{movement.quantity.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </div>
                      <p className="font-medium text-gray-900">{movement.location}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        Operator
                      </div>
                      <p className="font-medium text-gray-900">{movement.operator}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-gray-500">
                        <Timer className="h-4 w-4 mr-1" />
                        Time
                      </div>
                      <p className="font-medium text-gray-900">{movement.timestamp}</p>
                      <p className="text-xs text-gray-500">Batch: {movement.batchNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            Close
          </Button>
        </div>
      </FormModal>
    </div>
  );
}