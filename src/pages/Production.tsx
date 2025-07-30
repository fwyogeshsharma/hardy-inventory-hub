import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormModal } from "@/components/forms/FormModal";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { 
  Factory, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Package,
  Zap,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  Plus,
  Timer,
  Wrench
} from "lucide-react";

interface ProductionJobOrder {
  id: number;
  order_number: string;
  sku_id: number;
  warehouse_id: number;
  quantity_planned: number;
  quantity_completed: number;
  quantity_scrapped: number;
  status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  planned_start_date: string;
  planned_completion_date: string;
  actual_start_date?: string;
  actual_completion_date?: string;
  shift: 'day' | 'evening' | 'night';
  supervisor?: string;
  notes?: string;
  material_requirements?: any[];
  material_check_results?: any[];
  created_at: string;
  updated_at: string;
  sku?: SKU;
}

export default function Production() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [productionOrders, setProductionOrders] = useState<ProductionJobOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionJobOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadProductionOrders();
    
    // Subscribe to real-time updates
    inventoryManager.subscribe('production_job_order_created', handleProductionOrderUpdate);
    inventoryManager.subscribe('production_job_order_started', handleProductionOrderUpdate);
    inventoryManager.subscribe('production_job_order_completed', handleProductionOrderUpdate);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  const loadProductionOrders = async () => {
    try {
      setLoading(true);
      const [orders, skus] = await Promise.all([
        inventoryManager.getProductionJobOrders(),
        dataService.getSKUs()
      ]);
      
      // Enrich orders with SKU data
      const enrichedOrders = orders.map((order: any) => ({
        ...order,
        sku: skus.find(s => s.id === order.sku_id)
      }));
      
      setProductionOrders(enrichedOrders);
    } catch (error) {
      console.error('Error loading production orders:', error);
      toast({
        title: "Error",
        description: "Failed to load production orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductionOrderUpdate = () => {
    loadProductionOrders();
  };

  const handleStartOrder = async (orderId: number) => {
    try {
      await inventoryManager.startProductionJobOrder(orderId);
      toast({
        title: "Production Started",
        description: "Production job order has been started",
      });
      loadProductionOrders();
    } catch (error) {
      console.error('Error starting production order:', error);
      toast({
        title: "Error",
        description: "Failed to start production order",
        variant: "destructive",
      });
    }
  };

  const handleCompleteOrder = async (orderId: number, quantityCompleted: number) => {
    try {
      await inventoryManager.completeProductionJobOrder(orderId, {
        quantity_completed: quantityCompleted,
        notes: "Production completed successfully"
      });
      toast({
        title: "Production Completed",
        description: `Successfully completed ${quantityCompleted} units`,
      });
      loadProductionOrders();
    } catch (error) {
      console.error('Error completing production order:', error);
      toast({
        title: "Error",
        description: "Failed to complete production order",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    loadProductionOrders();
  };

  const filteredOrders = productionOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sku?.sku_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sku?.sku_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
            <Activity className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 shadow-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getActiveRuns = () => productionOrders.filter(order => order.status === "in_progress").length;
  const getCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return productionOrders
      .filter(order => order.actual_completion_date === today)
      .reduce((sum, order) => sum + order.quantity_completed, 0);
  };
  const getScheduledRuns = () => productionOrders.filter(order => order.status === "scheduled").length;
  const getAverageEfficiency = () => {
    const completedOrders = productionOrders.filter(order => order.status === "completed" && order.quantity_completed > 0);
    if (completedOrders.length === 0) return 0;
    const avgEfficiency = completedOrders.reduce((sum, order) => {
      const efficiency = (order.quantity_completed / order.quantity_planned) * 100;
      return sum + efficiency;
    }, 0) / completedOrders.length;
    return Math.round(avgEfficiency);
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Production Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage automotive parts production runs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Clock className="h-3 w-3 mr-1" />
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
            onClick={loadProductionOrders}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Production Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Runs</p>
                <p className="text-3xl font-bold">{getActiveRuns()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Currently in progress
                </p>
              </div>
              <Activity className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 from yesterday
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Completed Today</p>
                <p className="text-3xl font-bold">{getCompletedToday().toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">Units produced</p>
              </div>
              <CheckCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% vs target
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Scheduled</p>
                <p className="text-3xl font-bold">{getScheduledRuns()}</p>
                <p className="text-blue-100 text-xs mt-1">Upcoming runs</p>
              </div>
              <Timer className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                Next: Tomorrow 8AM
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Efficiency</p>
                <p className="text-3xl font-bold">{getAverageEfficiency()}%</p>
                <p className="text-blue-100 text-xs mt-1">This week</p>
              </div>
              <Target className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Zap className="h-4 w-4 mr-1" />
                Above 85% target
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by order number, SKU name, or SKU code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white/80 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Orders */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Factory className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Production Job Orders
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {filteredOrders.length} orders
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading production orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Factory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Production Orders</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "No orders match your current filters"
                  : "Create your first production order to start manufacturing"}
              </p>
              <Button 
                onClick={() => setModalOpen(true)}
                className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Production Order
              </Button>
            </div>
          ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                        <span className="text-white font-bold text-sm">{order.sku?.brand?.name?.charAt(0) || 'P'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{order.order_number}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{order.sku?.sku_code}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{order.sku?.sku_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      {getPriorityBadge(order.priority)}
                      {order.status === "in_progress" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          onClick={() => handleCompleteOrder(order.id, order.quantity_planned)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === "scheduled" && (
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleStartOrder(order.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-4 w-4 mr-1" />
                        Planned Quantity
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{order.quantity_planned.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                      <p className="text-lg font-semibold text-green-600">{order.quantity_completed.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Wrench className="h-4 w-4 mr-1" />
                        Supervisor
                      </div>
                      <p className="text-sm font-medium text-gray-900">{order.supervisor || 'Not assigned'}</p>
                      <p className="text-xs text-gray-500">{order.shift.charAt(0).toUpperCase() + order.shift.slice(1)} shift</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Target className="h-4 w-4 mr-1" />
                        Priority
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(order.priority)}
                        {order.quantity_scrapped > 0 && (
                          <Badge className="bg-red-100 text-red-700 text-xs">{order.quantity_scrapped} Scrapped</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Planned Start
                      </div>
                      <p className="text-sm font-medium text-gray-900">{new Date(order.planned_start_date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                      {order.actual_start_date && (
                        <p className="text-xs text-green-600">Started: {new Date(order.actual_start_date).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Expected Completion
                      </div>
                      <p className="text-sm font-medium text-gray-900">{new Date(order.planned_completion_date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                      {order.actual_completion_date && (
                        <p className="text-xs text-green-600">Completed: {new Date(order.actual_completion_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {(order.status === "in_progress" || order.status === "completed") && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Production Progress</span>
                        <span className="text-sm font-bold" style={{color: '#3997cd'}}>{getProgress(order.quantity_completed, order.quantity_planned)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${getProgress(order.quantity_completed, order.quantity_planned)}%`,
                            background: order.status === "completed" 
                              ? 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'
                              : 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>{order.quantity_planned.toLocaleString()} units</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Material Requirements */}
                  {order.material_check_results && order.material_check_results.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Material Requirements</h4>
                      <div className="space-y-1">
                        {order.material_check_results.map((material: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>Material {material.material_id}</span>
                            <span className={material.sufficient ? 'text-green-600' : 'text-red-600'}>
                              {material.available}/{material.required} {material.sufficient ? '✓' : '⚠️'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Production Order Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Production Job Order"
        maxWidth="max-w-4xl"
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Production job order creation form would be implemented here.</p>
          <p className="text-sm text-gray-500 mt-2">
            This would include SKU selection, quantity planning, scheduling, and material requirements.
          </p>
          <Button 
            onClick={handleFormSubmit}
            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Close
          </Button>
        </div>
      </FormModal>
    </div>
  );
}