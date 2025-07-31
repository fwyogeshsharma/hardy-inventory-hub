import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
import { VendorForm } from "@/components/forms/VendorForm";
import { dataService, Vendor } from "@/lib/database";
import { vendorNotificationService } from "@/lib/vendorNotificationService";
import { useToast } from "@/hooks/use-toast";
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
  DollarSign,
  Bell,
  UserPlus,
  ExternalLink,
  PauseCircle,
  PlayCircle,
  Zap,
  BellRing,
  CheckCircle2
} from "lucide-react";

interface VendorAssignmentAlert {
  id: string;
  orderId: number;
  skuId: number;
  skuCode: string;
  skuName: string;
  quantity: number;
  pauseReason: string;
  pausedAt: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  requiredBy?: string;
  estimatedValue: number;
  currentVendor?: string;
  suggestedVendors: string[];
  status: 'pending' | 'assigned' | 'resolved';
}

interface VendorNotification {
  id: string;
  type: 'vendor_assignment_needed' | 'urgent_reorder' | 'price_update_required';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  skuCode?: string;
  orderId?: number;
  createdAt: string;
  isRead: boolean;
  actionRequired: boolean;
  data?: any;
}

export default function Vendors() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorAlerts, setVendorAlerts] = useState<VendorAssignmentAlert[]>([]);
  const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningVendor, setAssigningVendor] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const [vendorsData, alertsData, notificationsData] = await Promise.all([
        dataService.getVendors(),
        vendorNotificationService.getPausedOrdersNeedingVendors(),
        vendorNotificationService.generateVendorNotifications()
      ]);
      
      setVendors(vendorsData);
      setVendorAlerts(alertsData);
      setNotifications(notificationsData);
      
      // Clear resolved notifications
      await vendorNotificationService.clearResolvedNotifications();
    } catch (error) {
      console.error('Error loading vendor data:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    loadVendorData(); // Refresh data after adding vendor
  };

  const handleAssignVendor = async (alertId: string, vendorId: number) => {
    try {
      setAssigningVendor(vendorId);
      const alert = vendorAlerts.find(a => a.id === alertId);
      
      if (!alert) {
        throw new Error('Alert not found');
      }

      const success = await vendorNotificationService.assignVendorToOrder(alert.orderId, vendorId);
      
      if (success) {
        const vendor = vendors.find(v => v.id === vendorId);
        toast({
          title: "Vendor Assigned",
          description: `${vendor?.name} has been assigned to ${alert.skuCode}. Order workflow resumed.`,
        });
        
        // Refresh data to show updated state
        await loadVendorData();
      } else {
        throw new Error('Failed to assign vendor');
      }
    } catch (error) {
      console.error('Error assigning vendor:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign vendor to order",
        variant: "destructive"
      });
    } finally {
      setAssigningVendor(null);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await vendorNotificationService.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  const getStatusBadge = (status: string) => {
    const isActive = status === 'active' || status === 'Active' || status === true;
    
    if (isActive) {
      return (
        <Badge className="bg-white shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-white shadow-sm" style={{backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb'}}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <Zap className="h-3 w-3 mr-1" />
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Medium Priority
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Activity className="h-3 w-3 mr-1" />
            Low Priority
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const highPriorityAlerts = vendorAlerts.filter(a => a.priority === 'high');

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3997cd] mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Vendor Data...</h3>
          <p className="text-gray-500">Checking for paused orders and vendor assignments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Vendor Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage automotive parts supplier relationships and workflow assignments
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
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm" onClick={loadVendorData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            className="text-white shadow-lg" 
            style={{backgroundColor: '#3997cd'}} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Paused Order Notifications */}
      {vendorAlerts.length > 0 && showNotifications && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <PauseCircle className="h-5 w-5 mr-2 text-orange-600" />
                Paused Orders Need Vendor Assignment
                <Badge className="ml-3 bg-orange-100 text-orange-700 border-orange-200">
                  {vendorAlerts.length} orders paused
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.skuCode} - {alert.skuName}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.pauseReason}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Order #{alert.orderId}</span>
                        <span>Qty: {alert.quantity}</span>
                        <span>Value: {formatCurrency(alert.estimatedValue)}</span>
                        <span>Paused: {new Date(alert.pausedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex flex-wrap gap-2">
                        {vendors.filter(v => v.is_active).slice(0, 3).map((vendor) => (
                          <Button
                            key={vendor.id}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleAssignVendor(alert.id, vendor.id)}
                            disabled={assigningVendor === vendor.id}
                          >
                            {assigningVendor === vendor.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <UserPlus className="h-3 w-3 mr-1" />
                            )}
                            Assign to {vendor.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {vendorAlerts.length > 3 && (
                <div className="text-center">
                  <Badge variant="outline" className="bg-white">
                    +{vendorAlerts.length - 3} more paused orders
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Vendors</p>
                <p className="text-3xl font-bold">{vendors.length}</p>
                <p className="text-blue-100 text-xs mt-1">{vendors.filter(v => v.is_active).length} active suppliers</p>
              </div>
              <Building2 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Paused Orders</p>
                <p className="text-3xl font-bold">{vendorAlerts.length}</p>
                <p className="text-blue-100 text-xs mt-1">Need vendor assignment</p>
              </div>
              <PauseCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">High Priority</p>
                <p className="text-3xl font-bold">{highPriorityAlerts.length}</p>
                <p className="text-blue-100 text-xs mt-1">Urgent assignments</p>
              </div>
              <Zap className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg bg-gradient-to-br from-[#3997cd] to-[#2d7aad]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Notifications</p>
                <p className="text-3xl font-bold">{unreadNotifications.length}</p>
                <p className="text-blue-100 text-xs mt-1">Unread alerts</p>
              </div>
              <BellRing className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Cards */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3997cd] to-[#2d7aad] flex items-center justify-center text-white font-bold">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.contact_person}</p>
                  </div>
                </div>
                {getStatusBadge(vendor.is_active ? 'active' : 'inactive')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{vendor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{vendor.lead_time_days} days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-600">{vendor.rating || 4.0}/5.0</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">On-time Delivery</span>
                    <span className="font-medium">{vendor.on_time_delivery_rate || 90}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quality Rating</span>
                    <span className="font-medium">{vendor.quality_rating || 4.2}/5.0</span>
                  </div>
                </div>

                {/* Show assigned orders for this vendor */}
                {vendorAlerts.some(alert => alert.currentVendor === vendor.name) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Paused Orders Assigned</p>
                    <p className="text-xs text-blue-600">
                      {vendorAlerts.filter(alert => alert.currentVendor === vendor.name).length} orders waiting
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Vendor"
        maxWidth="max-w-2xl"
      >
        <VendorForm onSubmit={handleFormSubmit} />
      </FormModal>
    </div>
  );
}