import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
import { VendorForm } from "@/components/forms/VendorForm";
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Plus,
  Calendar,
  Timer,
  TrendingUp,
  Star,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Building2,
  Package,
  Activity,
  DollarSign
} from "lucide-react";

export default function Vendors() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = () => {
    setModalOpen(false);
  };

  const vendors = [
    { 
      id: 1, 
      name: "ACDelco Supply Chain", 
      contact: "John Anderson", 
      email: "john@acdelco-supply.com", 
      phone: "(555) 123-4567",
      address: "2500 Auto Parts Blvd, Detroit, MI 48201",
      specialization: "OEM Auto Parts",
      parts: ["Brake Components", "Engine Parts", "Electrical Systems", "Filters"],
      status: "Active",
      rating: 4.8,
      leadTime: "3-5 days",
      certifications: ["ISO 9001", "TS 16949"],
      orderVolume: "$2.4M",
      onTimeDelivery: 96,
      lastOrder: "2 days ago"
    },
    { 
      id: 2, 
      name: "Bosch Automotive Distribution", 
      contact: "Sarah Chen", 
      email: "sarah@bosch-auto.com", 
      phone: "(555) 234-5678",
      address: "1800 Technology Drive, Farmington Hills, MI 48331",
      specialization: "Premium Auto Components",
      parts: ["Fuel Systems", "Ignition Components", "Sensors", "Wipers"],
      status: "Active",
      rating: 4.9,
      leadTime: "2-4 days",
      certifications: ["ISO 9001", "ISO 14001"],
      orderVolume: "$3.1M",
      onTimeDelivery: 98,
      lastOrder: "1 day ago"
    },
    { 
      id: 3, 
      name: "Monroe Ride Solutions", 
      contact: "Mike Rodriguez", 
      email: "mike@monroe-parts.com", 
      phone: "(555) 345-6789",
      address: "900 Suspension Way, Monroe, MI 48162",
      specialization: "Suspension & Steering",
      parts: ["Shock Absorbers", "Struts", "Springs", "Steering Components"],
      status: "Active",
      rating: 4.6,
      leadTime: "4-6 days",
      certifications: ["ISO 9001"],
      orderVolume: "$1.8M",
      onTimeDelivery: 94,
      lastOrder: "5 days ago"
    },
    { 
      id: 4, 
      name: "NGK Spark Plug Supply", 
      contact: "Lisa Martinez", 
      email: "lisa@ngk-supply.com", 
      phone: "(555) 456-7890",
      address: "1200 Ignition Pkwy, Wixom, MI 48393",
      specialization: "Ignition Systems",
      parts: ["Spark Plugs", "Ignition Coils", "Oxygen Sensors", "Glow Plugs"],
      status: "Pending Review",
      rating: 4.7,
      leadTime: "5-7 days",
      certifications: ["ISO 9001", "TS 16949"],
      orderVolume: "$950K",
      onTimeDelivery: 92,
      lastOrder: "1 week ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "Pending Review":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7'}}>
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const formatCurrency = (amount: string) => {
    return amount;
  };

  const getTotalVendors = () => vendors.length;
  const getActiveVendors = () => vendors.filter(v => v.status === "Active").length;
  const getAverageRating = () => {
    const total = vendors.reduce((sum, v) => sum + v.rating, 0);
    return (total / vendors.length).toFixed(1);
  };
  const getAverageDelivery = () => {
    const total = vendors.reduce((sum, v) => sum + v.onTimeDelivery, 0);
    return Math.round(total / vendors.length);
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Vendor Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage automotive parts supplier relationships and performance metrics
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
            Analytics
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Vendor
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Vendors</p>
                <p className="text-3xl font-bold">{getTotalVendors()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {getActiveVendors()} active suppliers
                </p>
              </div>
              <Building2 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 new this quarter
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold">{getAverageRating()}</p>
                <p className="text-blue-100 text-xs mt-1">Out of 5.0 stars</p>
              </div>
              <Star className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +0.2 vs last quarter
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Order Volume</p>
                <p className="text-3xl font-bold">$8.3M</p>
                <p className="text-blue-100 text-xs mt-1">Total annual volume</p>
              </div>
              <DollarSign className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% year over year
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">On-Time Delivery</p>
                <p className="text-3xl font-bold">{getAverageDelivery()}%</p>
                <p className="text-blue-100 text-xs mt-1">Average performance</p>
              </div>
              <Truck className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Above 90% target
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Directory */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Users className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Automotive Parts Vendors
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {vendors.length} suppliers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                        <span className="text-white font-bold text-sm">{vendor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{vendor.specialization}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">Volume: {vendor.orderVolume}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(vendor.status)}
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{vendor.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">{getRatingStars(vendor.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          Contact Information
                        </div>
                        <p className="text-sm font-medium text-gray-900">{vendor.contact}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {vendor.email}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          Location & Logistics
                        </div>
                        <p className="text-sm font-medium text-gray-900">{vendor.address}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          Lead Time: {vendor.leadTime}
                        </p>
                        <p className="text-xs text-gray-500">Last Order: {vendor.lastOrder}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Performance Metrics
                        </div>
                        <p className="text-sm font-medium text-gray-900">On-Time: {vendor.onTimeDelivery}%</p>
                        <p className="text-xs text-gray-500">Annual Volume: {vendor.orderVolume}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              vendor.onTimeDelivery >= 95 ? 'bg-gradient-to-r from-[#3997cd] to-[#2d7aad]' :
                              vendor.onTimeDelivery >= 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                            style={{ width: `${vendor.onTimeDelivery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parts Categories */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      Parts & Components Supplied
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vendor.parts.map((part, index) => (
                        <Badge key={index} variant="outline" className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                          {part}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Quality Certifications
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vendor.certifications.map((cert, index) => (
                        <Badge key={index} className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Vendor"
        maxWidth="max-w-6xl"
      >
        <VendorForm 
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}