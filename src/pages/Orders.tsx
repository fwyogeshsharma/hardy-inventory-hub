import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
import { CustomerOrderForm } from "@/components/forms/CustomerOrderForm";
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Calendar,
  Timer,
  TrendingUp,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  BarChart3,
  MapPin,
  User,
  FileText,
  Activity
} from "lucide-react";

export default function Orders() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = () => {
    setModalOpen(false);
  };

  const orders = [
    { 
      id: 1, 
      orderNumber: "ORD-2024-001", 
      customer: "AutoZone Distribution Center", 
      customerType: "Distributor",
      contactPerson: "Mike Johnson",
      location: "Brooklyn, NY",
      items: 15, 
      total: 24750, 
      status: "Processing", 
      date: "2024-01-15", 
      dueDate: "2024-01-20",
      priority: "High",
      paymentStatus: "Paid",
      shippingMethod: "Express",
      parts: ["Brake Pads", "Oil Filters", "Spark Plugs", "Air Filters", "Belts"]
    },
    { 
      id: 2, 
      orderNumber: "ORD-2024-002", 
      customer: "NAPA Auto Parts Store", 
      customerType: "Retailer",
      contactPerson: "Sarah Chen",
      location: "Manhattan, NY",
      items: 8, 
      total: 18750, 
      status: "Shipped", 
      date: "2024-01-14", 
      dueDate: "2024-01-18",
      priority: "Medium",
      paymentStatus: "Paid",
      shippingMethod: "Standard",
      parts: ["Transmission Fluid", "Brake Rotors", "Shock Absorbers"]
    },
    { 
      id: 3, 
      orderNumber: "ORD-2024-003", 
      customer: "Pep Boys Service Center", 
      customerType: "Service Center",
      contactPerson: "David Rodriguez",
      location: "Queens, NY",
      items: 22, 
      total: 35600, 
      status: "Pending", 
      date: "2024-01-16", 
      dueDate: "2024-01-22",
      priority: "Low",
      paymentStatus: "Pending",
      shippingMethod: "Standard",
      parts: ["Engine Parts", "Electrical Components", "Suspension Parts", "Fluids"]
    },
    { 
      id: 4, 
      orderNumber: "ORD-2024-004", 
      customer: "O'Reilly Auto Parts", 
      customerType: "Distributor",
      contactPerson: "Lisa Martinez",
      location: "Bronx, NY",
      items: 12, 
      total: 16800, 
      status: "Delivered", 
      date: "2024-01-12", 
      dueDate: "2024-01-16",
      priority: "Medium",
      paymentStatus: "Paid",
      shippingMethod: "Express",
      parts: ["Batteries", "Alternators", "Starters", "Ignition Coils"]
    },
    { 
      id: 5, 
      orderNumber: "ORD-2024-005", 
      customer: "Advance Auto Parts", 
      customerType: "Retailer",
      contactPerson: "James Wilson",
      location: "Staten Island, NY",
      items: 6, 
      total: 9450, 
      status: "Processing", 
      date: "2024-01-17", 
      dueDate: "2024-01-23",
      priority: "High",
      paymentStatus: "Paid",
      shippingMethod: "Express",
      parts: ["Filters", "Belts", "Hoses"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "Shipped":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Activity className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      case "Medium":
        return <Badge style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>Medium</Badge>;
      case "Low":
        return <Badge style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>Paid</Badge>;
      case "Pending":
        return <Badge style={{backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7'}}>Pending</Badge>;
      case "Overdue":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalOrders = () => orders.length;
  const getProcessingOrders = () => orders.filter(order => order.status === "Processing").length;
  const getShippedOrders = () => orders.filter(order => order.status === "Shipped").length;
  const getTotalRevenue = () => orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Order Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage automotive parts orders from distributors and retailers
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
          <Button 
            onClick={() => setModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold">{getTotalOrders()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Current active orders
                </p>
              </div>
              <ShoppingCart className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Processing</p>
                <p className="text-3xl font-bold">{getProcessingOrders()}</p>
                <p className="text-blue-100 text-xs mt-1">Pending fulfillment</p>
              </div>
              <Activity className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                Avg processing: 2.3 days
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Shipped</p>
                <p className="text-3xl font-bold">{getShippedOrders()}</p>
                <p className="text-blue-100 text-xs mt-1">In transit to customers</p>
              </div>
              <Truck className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                98% on-time delivery
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(getTotalRevenue())}</p>
                <p className="text-blue-100 text-xs mt-1">Total order value</p>
              </div>
              <DollarSign className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% vs last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <ShoppingCart className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Customer Orders
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {orders.length} orders
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                        <span className="text-white font-bold text-sm">{order.customer.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{order.orderNumber}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{order.customerType}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{order.customer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      {getPriorityBadge(order.priority)}
                      <Button size="sm" variant="outline" className="text-xs" style={{backgroundColor: '#e6f2fa', borderColor: '#3997cd', color: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1e7dd'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        Contact Person
                      </div>
                      <p className="text-sm font-medium text-gray-900">{order.contactPerson}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {order.location}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-4 w-4 mr-1" />
                        Order Details
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{order.items} items</p>
                      <p className="text-sm font-semibold" style={{color: '#3997cd'}}>{formatCurrency(order.total)}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Timeline
                      </div>
                      <p className="text-sm font-medium text-gray-900">Ordered: {new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Truck className="h-4 w-4 mr-1" />
                        Shipping & Payment
                      </div>
                      <p className="text-sm font-medium text-gray-900">{order.shippingMethod}</p>
                      <div className="flex items-center space-x-2">
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Parts List */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="h-4 w-4 mr-1" />
                      Parts Categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.parts.map((part, index) => (
                        <Badge key={index} variant="outline" className="text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                          {part}
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

      {/* Customer Order Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Customer Order"
        maxWidth="max-w-7xl"
      >
        <CustomerOrderForm 
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}