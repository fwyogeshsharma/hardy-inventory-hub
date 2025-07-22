import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Warehouse as WarehouseIcon, MapPin, Package, Scan } from "lucide-react";

export default function Warehouse() {
  const warehouseLocations = [
    { id: 1, name: "Main Warehouse - Brooklyn", address: "123 Industrial Blvd, Brooklyn, NY", capacity: 50000, occupied: 32500, zones: 8, status: "Active" },
    { id: 2, name: "Distribution Center - Queens", address: "456 Commerce Ave, Queens, NY", capacity: 30000, occupied: 18750, zones: 5, status: "Active" },
    { id: 3, name: "Cold Storage - Bronx", address: "789 Storage Way, Bronx, NY", capacity: 15000, occupied: 12300, zones: 3, status: "Active" },
  ];

  const recentMovements = [
    { id: 1, type: "Inbound", sku: "HTWO-LM-330", quantity: 2500, location: "Zone A-1", timestamp: "2 hours ago", operator: "John Smith" },
    { id: 2, type: "Outbound", sku: "SKHY-BR-500", quantity: 1200, location: "Zone B-3", timestamp: "4 hours ago", operator: "Maria Garcia" },
    { id: 3, type: "Transfer", sku: "RLLIE-PC-1L", quantity: 800, location: "Zone C-2 → D-1", timestamp: "6 hours ago", operator: "David Kim" },
    { id: 4, type: "Audit", sku: "HTWO-LM-4PK", quantity: 450, location: "Zone A-2", timestamp: "8 hours ago", operator: "Sarah Johnson" },
  ];

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "Inbound":
        return <Badge className="bg-success text-success-foreground">Inbound</Badge>;
      case "Outbound":
        return <Badge className="bg-warning text-warning-foreground">Outbound</Badge>;
      case "Transfer":
        return <Badge className="bg-accent text-accent-foreground">Transfer</Badge>;
      case "Audit":
        return <Badge variant="secondary">Audit</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getUtilizationPercentage = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 75) return "text-warning";
    return "text-success";
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Warehouse Management</h2>
          <p className="text-muted-foreground">Monitor locations, stock movements, and capacity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active warehouses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95K</div>
            <p className="text-xs text-muted-foreground">Square feet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">63.5K</div>
            <p className="text-xs text-muted-foreground">67% utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <WarehouseIcon className="h-5 w-5 mr-2" />
              Warehouse Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouseLocations.map((location) => {
                const utilization = getUtilizationPercentage(location.occupied, location.capacity);
                return (
                  <div key={location.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {location.address}
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <p className="font-medium">{location.capacity.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Occupied:</span>
                        <p className="font-medium">{location.occupied.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zones:</span>
                        <p className="font-medium">{location.zones}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization</span>
                        <span className={getUtilizationColor(utilization)}>{utilization}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            utilization >= 90 ? 'bg-destructive' : 
                            utilization >= 75 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Recent Movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getMovementBadge(movement.type)}
                      <span className="text-sm font-medium">{movement.sku}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{movement.quantity.toLocaleString()} units • {movement.location}</p>
                      <p>{movement.timestamp} • {movement.operator}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}