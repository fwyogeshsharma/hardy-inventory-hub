import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Download,
  RefreshCw,
  Package,
  DollarSign,
  Search,
  Eye,
  Edit,
  Loader2,
  Settings,
  Layers,
  Component,
  Calculator,
  Building2,
  ClipboardList,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  CheckCircle2
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { workflowManager, BOMTemplate, BOMComponent, KitProductionOrder } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";
import { FormModal } from "@/components/forms/FormModal";

interface ExtendedBOMTemplate extends BOMTemplate {
  components?: (BOMComponent & { component_sku?: SKU })[];
  kit_sku?: SKU;
}

interface ExtendedKitProductionOrder extends KitProductionOrder {
  kit_sku?: SKU;
  bom_template?: BOMTemplate;
}

export default function BillOfMaterials() {
  const { toast } = useToast();
  const [bomTemplates, setBOMTemplates] = useState<ExtendedBOMTemplate[]>([]);
  const [kitProductionOrders, setKitProductionOrders] = useState<ExtendedKitProductionOrder[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [createBOMModal, setCreateBOMModal] = useState(false);
  const [createProductionModal, setCreateProductionModal] = useState(false);
  const [processingOrders, setProcessingOrders] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // BOM Creation Form State
  const [bomForm, setBOMForm] = useState({
    kit_sku_id: '',
    name: '',
    description: '',
    version: '1.0',
    labor_cost: 0,
    overhead_cost: 0,
    components: [{ component_sku_id: '', quantity_required: 1, unit_cost: 0, is_critical: false, notes: '' }]
  });

  // Kit Production Form State
  const [productionForm, setProductionForm] = useState({
    kit_sku_id: '',
    bom_template_id: '',
    warehouse_id: 1,
    quantity_planned: 1,
    planned_start_date: '',
    planned_completion_date: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [bomTemplatesData, kitProductionData, skusData, bomComponents] = await Promise.all([
        workflowManager.getBOMTemplates(),
        workflowManager.getKitProductionOrders(),
        dataService.getSKUs(),
        workflowManager.getBOMComponents()
      ]);
      
      // Enrich BOM templates with components and SKU data
      const enrichedBOMTemplates = bomTemplatesData.map(template => {
        const templateComponents = bomComponents.filter(comp => comp.bom_template_id === template.id);
        const enrichedComponents = templateComponents.map(comp => ({
          ...comp,
          component_sku: skusData.find(sku => sku.id === comp.component_sku_id)
        }));
        
        return {
          ...template,
          components: enrichedComponents,
          kit_sku: skusData.find(sku => sku.id === template.kit_sku_id)
        };
      });
      
      // Enrich kit production orders with SKU and BOM data
      const enrichedProductionOrders = kitProductionData.map(order => ({
        ...order,
        kit_sku: skusData.find(sku => sku.id === order.kit_sku_id),
        bom_template: bomTemplatesData.find(template => template.id === order.bom_template_id)
      }));
      
      setBOMTemplates(enrichedBOMTemplates);
      setKitProductionOrders(enrichedProductionOrders);
      setSKUs(skusData);
      
    } catch (error) {
      console.error('Error loading BOM data:', error);
      toast({
        title: "Error",
        description: "Failed to load BOM data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBOM = async () => {
    try {
      if (!bomForm.kit_sku_id || !bomForm.name || bomForm.components.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields and add at least one component",
          variant: "destructive",
        });
        return;
      }

      const componentsData = bomForm.components.map(comp => ({
        component_sku_id: parseInt(comp.component_sku_id),
        quantity_required: comp.quantity_required,
        unit_cost: comp.unit_cost,
        is_critical: comp.is_critical,
        notes: comp.notes
      }));

      await workflowManager.createBOMTemplate({
        kit_sku_id: parseInt(bomForm.kit_sku_id),
        version: bomForm.version,
        name: bomForm.name,
        description: bomForm.description,
        labor_cost: bomForm.labor_cost,
        overhead_cost: bomForm.overhead_cost,
        components: componentsData
      });

      toast({
        title: "BOM Template Created",
        description: `BOM template "${bomForm.name}" has been created successfully`,
        variant: "default",
      });

      setCreateBOMModal(false);
      setBOMForm({
        kit_sku_id: '',
        name: '',
        description: '',
        version: '1.0',
        labor_cost: 0,
        overhead_cost: 0,
        components: [{ component_sku_id: '', quantity_required: 1, unit_cost: 0, is_critical: false, notes: '' }]
      });
      await loadData();

    } catch (error) {
      console.error('Error creating BOM template:', error);
      toast({
        title: "Error",
        description: "Failed to create BOM template",
        variant: "destructive",
      });
    }
  };

  const handleCreateKitProduction = async () => {
    try {
      if (!productionForm.kit_sku_id || !productionForm.bom_template_id) {
        toast({
          title: "Validation Error",
          description: "Please select both kit SKU and BOM template",
          variant: "destructive",
        });
        return;
      }

      await workflowManager.createKitProductionOrder({
        kit_sku_id: parseInt(productionForm.kit_sku_id),
        bom_template_id: parseInt(productionForm.bom_template_id),
        warehouse_id: productionForm.warehouse_id,
        quantity_planned: productionForm.quantity_planned,
        planned_start_date: productionForm.planned_start_date,
        planned_completion_date: productionForm.planned_completion_date,
        notes: productionForm.notes
      });

      toast({
        title: "Kit Production Order Created",
        description: `Production order for ${productionForm.quantity_planned} units has been created`,
        variant: "default",
      });

      setCreateProductionModal(false);
      setProductionForm({
        kit_sku_id: '',
        bom_template_id: '',
        warehouse_id: 1,
        quantity_planned: 1,
        planned_start_date: '',
        planned_completion_date: '',
        notes: ''
      });
      await loadData();

    } catch (error) {
      console.error('Error creating kit production order:', error);
      toast({
        title: "Error",
        description: "Failed to create kit production order",
        variant: "destructive",
      });
    }
  };

  const handleStartProduction = async (orderId: number) => {
    try {
      setProcessingOrders(prev => new Set(prev).add(orderId));
      
      await workflowManager.startKitProduction(orderId);
      
      toast({
        title: "Production Started",
        description: "Kit production has been started successfully",
        variant: "default",
      });
      
      await loadData();
      
    } catch (error) {
      console.error('Error starting production:', error);
      toast({
        title: "Error",
        description: "Failed to start production",
        variant: "destructive",
      });
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCompleteProduction = async (orderId: number, quantityCompleted: number) => {
    try {
      setProcessingOrders(prev => new Set(prev).add(orderId));
      
      await workflowManager.completeKitProduction(orderId, quantityCompleted);
      
      toast({
        title: "Production Completed",
        description: `${quantityCompleted} units completed and added to inventory. Sales order automatically created.`,
        variant: "default",
      });
      
      await loadData();
      
    } catch (error) {
      console.error('Error completing production:', error);
      toast({
        title: "Error",
        description: "Failed to complete production",
        variant: "destructive",
      });
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const addComponent = () => {
    setBOMForm(prev => ({
      ...prev,
      components: [...prev.components, { component_sku_id: '', quantity_required: 1, unit_cost: 0, is_critical: false, notes: '' }]
    }));
  };

  const removeComponent = (index: number) => {
    setBOMForm(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
  };

  const updateComponent = (index: number, field: string, value: any) => {
    setBOMForm(prev => ({
      ...prev,
      components: prev.components.map((comp, i) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'on_hold': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = kitProductionOrders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kit_sku?.sku_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kit_sku?.sku_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate summary statistics
  const totalBOMs = bomTemplates.length;
  const activeBOMs = bomTemplates.filter(bom => bom.is_active).length;
  const totalProduction = kitProductionOrders.length;
  const inProgressProduction = kitProductionOrders.filter(order => order.status === 'in_progress').length;
  const completedProduction = kitProductionOrders.filter(order => order.status === 'completed').length;
  const totalProductionValue = kitProductionOrders.reduce((sum, order) => sum + order.total_cost, 0);

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Bill of Materials & Kit Production
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage BOMs, track purchased components, and control kit production
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
          <Button 
            onClick={() => setCreateBOMModal(true)}
            className="text-white shadow-lg bg-green-600 hover:bg-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create BOM
          </Button>
          <Button 
            onClick={() => setCreateProductionModal(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Package className="h-4 w-4 mr-2" />
            New Production
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total BOMs</p>
                <p className="text-3xl font-bold">{totalBOMs}</p>
                <p className="text-blue-100 text-xs mt-1">Templates created</p>
              </div>
              <FileText className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active BOMs</p>
                <p className="text-3xl font-bold">{activeBOMs}</p>
                <p className="text-blue-100 text-xs mt-1">Currently in use</p>
              </div>
              <CheckCircle2 className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">In Production</p>
                <p className="text-3xl font-bold">{inProgressProduction}</p>
                <p className="text-blue-100 text-xs mt-1">Active orders</p>
              </div>
              <Settings className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Production Value</p>
                <p className="text-3xl font-bold">{formatCurrency(totalProductionValue)}</p>
                <p className="text-blue-100 text-xs mt-1">Total investment</p>
              </div>
              <DollarSign className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOM Templates Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <FileText className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Bill of Materials Templates
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {bomTemplates.length} templates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {bomTemplates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No BOM Templates Found
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first BOM template to track component costs and quantities.
              </p>
              <Button onClick={() => setCreateBOMModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Create First BOM
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bomTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                        <Layers className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{template.kit_sku?.sku_code}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">v{template.version}</span>
                          {template.is_active && (
                            <>
                              <span className="text-xs text-gray-500">•</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Kit: {template.kit_sku?.sku_name} • Components: {template.components?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Material: {formatCurrency(template.total_cost - template.labor_cost - template.overhead_cost)} • 
                        Labor: {formatCurrency(template.labor_cost)} • 
                        Overhead: {formatCurrency(template.overhead_cost)}
                      </p>
                      {template.description && (
                        <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[200px]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Total Cost: {formatCurrency(template.total_cost)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {template.components && template.components.length > 0 && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="font-medium">Components:</p>
                        {template.components.slice(0, 3).map((comp, index) => (
                          <p key={index}>
                            {comp.component_sku?.sku_code}: {comp.quantity_required} × {formatCurrency(comp.unit_cost)}
                          </p>
                        ))}
                        {template.components.length > 3 && (
                          <p>+{template.components.length - 3} more components...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kit Production Orders Section */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <CardTitle className="flex items-center text-xl">
              <Package className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Kit Production Orders
              <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                {filteredOrders.length} orders
              </Badge>
            </CardTitle>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">All Status</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading production orders...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your data.
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Production Orders Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'No orders match your current filters.'
                  : 'Create your first kit production order to get started.'}
              </p>
              {(searchTerm || filterStatus !== 'all') ? (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setCreateProductionModal(true)} className="text-white" style={{backgroundColor: '#3997cd'}}>
                  <Package className="h-4 w-4 mr-2" />
                  Create Production Order
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                        <span className="text-white font-bold text-sm">{order.kit_sku?.brand?.name?.charAt(0) || 'K'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.kit_sku?.sku_name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{order.order_number}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{order.kit_sku?.sku_code}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">BOM: {order.bom_template?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-13">
                      <p className="text-sm text-gray-600">
                        Planned: {order.quantity_planned} units • Completed: {order.quantity_completed} units • Total Cost: {formatCurrency(order.total_cost)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.planned_start_date && `Start: ${new Date(order.planned_start_date).toLocaleDateString()}`}
                        {order.planned_completion_date && ` • Completion: ${new Date(order.planned_completion_date).toLocaleDateString()}`}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 mt-1">Notes: {order.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2 min-w-[280px]">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    {/* Production Action Buttons */}
                    <div className="space-y-2">
                      {order.status === 'planned' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                          onClick={() => handleStartProduction(order.id)}
                          disabled={processingOrders.has(order.id)}
                        >
                          {processingOrders.has(order.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Start Production
                            </>
                          )}
                        </Button>
                      )}
                      
                      {order.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          onClick={() => handleCompleteProduction(order.id, order.quantity_planned)}
                          disabled={processingOrders.has(order.id)}
                        >
                          {processingOrders.has(order.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete Production
                            </>
                          )}
                        </Button>
                      )}
                      
                      {order.status === 'completed' && (
                        <div className="text-center">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Production Completed
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.quantity_completed} units added to inventory
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create BOM Modal */}
      <FormModal
        isOpen={createBOMModal}
        onClose={() => setCreateBOMModal(false)}
        title="Create New BOM Template"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kit SKU</label>
              <select
                value={bomForm.kit_sku_id}
                onChange={(e) => setBOMForm(prev => ({ ...prev, kit_sku_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Kit SKU</option>
                {skus.filter(sku => sku.sku_type === 'kit').map(sku => (
                  <option key={sku.id} value={sku.id}>
                    {sku.sku_code} - {sku.sku_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BOM Name</label>
              <Input
                value={bomForm.name}
                onChange={(e) => setBOMForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter BOM name"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <Input
                value={bomForm.version}
                onChange={(e) => setBOMForm(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labor Cost ($)</label>
              <Input
                type="number"
                step="0.01"
                value={bomForm.labor_cost}
                onChange={(e) => setBOMForm(prev => ({ ...prev, labor_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overhead Cost ($)</label>
              <Input
                type="number"
                step="0.01"
                value={bomForm.overhead_cost}
                onChange={(e) => setBOMForm(prev => ({ ...prev, overhead_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={bomForm.description}
              onChange={(e) => setBOMForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter BOM description"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Components</h3>
              <Button onClick={addComponent} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Component
              </Button>
            </div>
            
            <div className="space-y-3">
              {bomForm.components.map((component, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Component SKU</label>
                    <select
                      value={component.component_sku_id}
                      onChange={(e) => updateComponent(index, 'component_sku_id', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="">Select Component</option>
                      {skus.filter(sku => sku.sku_type !== 'kit').map(sku => (
                        <option key={sku.id} value={sku.id}>
                          {sku.sku_code} - {sku.sku_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={component.quantity_required}
                      onChange={(e) => updateComponent(index, 'quantity_required', parseFloat(e.target.value) || 1)}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={component.unit_cost}
                      onChange={(e) => updateComponent(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Critical</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={component.is_critical}
                        onChange={(e) => updateComponent(index, 'is_critical', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeComponent(index)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCreateBOMModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBOM} className="bg-green-600 hover:bg-green-700 text-white">
              Create BOM Template
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Create Kit Production Modal */}
      <FormModal
        isOpen={createProductionModal}
        onClose={() => setCreateProductionModal(false)}
        title="Create Kit Production Order"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kit SKU</label>
              <select
                value={productionForm.kit_sku_id}
                onChange={(e) => setProductionForm(prev => ({ ...prev, kit_sku_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Kit SKU</option>
                {skus.filter(sku => sku.sku_type === 'kit').map(sku => (
                  <option key={sku.id} value={sku.id}>
                    {sku.sku_code} - {sku.sku_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BOM Template</label>
              <select
                value={productionForm.bom_template_id}
                onChange={(e) => setProductionForm(prev => ({ ...prev, bom_template_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select BOM Template</option>
                {bomTemplates.filter(bom => 
                  !productionForm.kit_sku_id || bom.kit_sku_id === parseInt(productionForm.kit_sku_id)
                ).map(bom => (
                  <option key={bom.id} value={bom.id}>
                    {bom.name} (v{bom.version})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Produce</label>
              <Input
                type="number"
                min="1"
                value={productionForm.quantity_planned}
                onChange={(e) => setProductionForm(prev => ({ ...prev, quantity_planned: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={productionForm.warehouse_id}
                onChange={(e) => setProductionForm(prev => ({ ...prev, warehouse_id: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={1}>Main Warehouse</option>
                <option value={2}>Secondary Warehouse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Start Date</label>
              <Input
                type="date"
                value={productionForm.planned_start_date}
                onChange={(e) => setProductionForm(prev => ({ ...prev, planned_start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Completion Date</label>
              <Input
                type="date"
                value={productionForm.planned_completion_date}
                onChange={(e) => setProductionForm(prev => ({ ...prev, planned_completion_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Textarea
              value={productionForm.notes}
              onChange={(e) => setProductionForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter production notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCreateProductionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKitProduction} className="text-white" style={{backgroundColor: '#3997cd'}}>
              Create Production Order
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}