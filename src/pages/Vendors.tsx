import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, MapPin, Plus } from "lucide-react";

export default function Vendors() {
  const vendors = [
    { 
      id: 1, 
      name: "Premium Materials Co.", 
      contact: "John Anderson", 
      email: "john@premiummat.com", 
      phone: "(555) 123-4567",
      address: "123 Industrial Ave, NY",
      materials: ["Aluminum Cans", "Labels", "Caps"],
      status: "Active",
      rating: 4.8,
      leadTime: "5-7 days"
    },
    { 
      id: 2, 
      name: "Flavor Solutions Ltd.", 
      contact: "Sarah Chen", 
      email: "sarah@flavorsol.com", 
      phone: "(555) 234-5678",
      address: "456 Commerce St, NJ",
      materials: ["Natural Flavors", "Concentrates"],
      status: "Active",
      rating: 4.9,
      leadTime: "3-5 days"
    },
    { 
      id: 3, 
      name: "Packaging Innovations", 
      contact: "Mike Rodriguez", 
      email: "mike@packinno.com", 
      phone: "(555) 345-6789",
      address: "789 Supply Rd, CT",
      materials: ["Cardboard Boxes", "Shrink Wrap", "Pallets"],
      status: "Pending Review",
      rating: 4.2,
      leadTime: "7-10 days"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "Pending Review":
        return <Badge className="bg-warning text-warning-foreground">Pending Review</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Vendor Management</h2>
          <p className="text-muted-foreground">Manage supplier relationships and performance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Lead Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2</div>
            <p className="text-xs text-muted-foreground">Days average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Vendor Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">{vendor.contact}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(vendor.status)}
                    <div className="text-right">
                      <div className="text-sm font-medium">{getRatingStars(vendor.rating)}</div>
                      <div className="text-xs text-muted-foreground">{vendor.rating}/5</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lead Time: </span>
                    <span className="font-medium">{vendor.leadTime}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Materials Supplied: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendor.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}