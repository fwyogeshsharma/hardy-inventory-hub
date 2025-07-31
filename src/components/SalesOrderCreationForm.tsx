import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Factory,
  ShoppingCart,
  Users,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight
} from "lucide-react";
import { inventoryManager, dataService, SKU } from "@/lib/database";
import { workflowManager, BOMTemplate } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

interface SalesOrderCreationFormProps {
  onClose: () => void;
  onOrderCreated: () => void;
}

interface OrderItem {
  sku_id: string;
  quantity: number;
  unit_price: number;
}

export default function SalesOrderCreationForm({ onClose, onOrderCreated }: SalesOrderCreationFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [bomTemplates, setBOMTemplates] = useState<BOMTemplate[]>([]);
  const [selectedBOMTemplate, setSelectedBOMTemplate] = useState<BOMTemplate | null>(null);
  const [inventoryCheck, setInventoryCheck] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_type: 'distributor' as 'distributor' | 'retailer' | 'service_center' | 'individual',
    contact_person: '',
    email: '',
    phone: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    required_date: '',
    shipping_method: 'standard' as 'standard' | 'express' | 'overnight' | 'freight',
    payment_terms: 'net_30' as 'cod' | 'net_30' | 'net_60' | 'prepaid',
    notes: '',
    items: [] as OrderItem[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [skusData, bomTemplatesData] = await Promise.all([
        dataService.getSKUs(),
        workflowManager.getBOMTemplates()
      ]);
      
      setSKUs(skusData);
      setBOMTemplates(bomTemplatesData.filter(bom => bom.is_active));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load product and BOM data",
        variant: "destructive",
      });
    }
  };

  const handleBOMSelection = async (bomTemplate: BOMTemplate) => {
    try {
      setLoading(true);
      setSelectedBOMTemplate(bomTemplate);
      
      // Get BOM components and check inventory
      const components = await workflowManager.getBOMComponents();
      const bomComponents = components.filter(comp => comp.bom_template_id === bomTemplate.id);
      
      // Check inventory for each component
      const inventoryResults = await Promise.all(
        bomComponents.map(async (component) => {
          const sku = skus.find(s => s.id === component.component_sku_id);
          const inventory = await inventoryManager.getSKUInventory(component.component_sku_id);
          const totalAvailable = inventory.reduce((sum: number, inv: any) => sum + inv.quantity_available, 0);
          
          return {
            component,
            sku,
            required_quantity: component.quantity_required,
            available_quantity: totalAvailable,
            sufficient: totalAvailable >= component.quantity_required,
            shortage: Math.max(0, component.quantity_required - totalAvailable)
          };
        })
      );
      
      setInventoryCheck(inventoryResults);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Error checking BOM inventory:', error);
      toast({
        title: "Error",
        description: "Failed to check BOM inventory requirements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      
      if (!selectedBOMTemplate) {
        toast({
          title: "Error",
          description: "Please select a BOM template",
          variant: "destructive",
        });
        return;
      }

      // Validate form
      if (!orderForm.customer_name || !orderForm.contact_person || !orderForm.required_date) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create sales order with BOM template reference
      const orderData = {
        ...orderForm,
        order_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        payment_status: 'pending',
        total_amount: selectedBOMTemplate.total_cost,
        bom_template_id: selectedBOMTemplate.id,
        production_required: true
      };

      await inventoryManager.createSalesOrder(orderData);

      // Check if we need to create purchase orders for missing items
      const missingItems = inventoryCheck.filter(item => !item.sufficient);
      if (missingItems.length > 0) {
        await createPurchaseOrdersForMissingItems(missingItems);
      }

      toast({
        title: "Sales Order Created",
        description: `Sales order created successfully with BOM template ${selectedBOMTemplate.name}`,
        variant: "default",
      });

      onOrderCreated();
      onClose();
      
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast({
        title: "Error",
        description: "Failed to create sales order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPurchaseOrdersForMissingItems = async (missingItems: any[]) => {
    try {
      for (const item of missingItems) {
        if (item.shortage > 0) {
          // Create purchase order using the extended system (matches PO page)
          const orders = localStorage.getItem('purchase_orders_extended');
          const existingOrders = orders ? JSON.parse(orders) : [];
          
          const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
          const orderNumber = `PO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
          
          const totalAmount = (item.component.unit_cost || 25.00) * item.shortage;
          
          const newOrder = {
            id: newId,
            order_number: orderNumber,
            vendor_id: 1, // Default vendor
            warehouse_id: 1, // Default warehouse
            status: 'pending',
            order_date: new Date().toISOString().split('T')[0],
            expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            total_amount: totalAmount,
            notes: `🤖 AUTO-GENERATED for BOM production: ${selectedBOMTemplate?.name}\nComponent: ${item.sku?.sku_name || 'Unknown'} (${item.sku?.sku_code || 'N/A'})\nShortage: ${item.shortage} units`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          existingOrders.push(newOrder);
          localStorage.setItem('purchase_orders_extended', JSON.stringify(existingOrders));
          
          // Create purchase order item
          await workflowManager.createPurchaseOrderItem({
            purchase_order_id: newId,
            sku_id: item.component.component_sku_id,
            quantity_ordered: item.shortage,
            unit_cost: item.component.unit_cost || 25.00,
            notes: `Auto-generated for BOM: ${selectedBOMTemplate?.name}`
          });
          
          console.log(`✅ Created PO ${orderNumber} for ${item.sku?.sku_name} (${item.shortage} units)`);
        }
      }
    } catch (error) {
      console.error('Error creating purchase orders:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center py-4">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4" style={{color: '#3997cd'}} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Sales Order</h3>
        <p className="text-gray-600">Enter customer details and order information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
          <Input
            value={orderForm.customer_name}
            onChange={(e) => setOrderForm(prev => ({ ...prev, customer_name: e.target.value }))}
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
          <select
            value={orderForm.customer_type}
            onChange={(e) => setOrderForm(prev => ({ ...prev, customer_type: e.target.value as any }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="distributor">Distributor</option>
            <option value="retailer">Retailer</option>
            <option value="service_center">Service Center</option>
            <option value="individual">Individual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
          <Input
            value={orderForm.contact_person}
            onChange={(e) => setOrderForm(prev => ({ ...prev, contact_person: e.target.value }))}
            placeholder="Enter contact person"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            value={orderForm.email}
            onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <Input
            value={orderForm.phone}
            onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Date *</label>
          <Input
            type="date"
            value={orderForm.required_date}
            onChange={(e) => setOrderForm(prev => ({ ...prev, required_date: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={orderForm.priority}
            onChange={(e) => setOrderForm(prev => ({ ...prev, priority: e.target.value as any }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
          <select
            value={orderForm.shipping_method}
            onChange={(e) => setOrderForm(prev => ({ ...prev, shipping_method: e.target.value as any }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
            <option value="freight">Freight</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <Textarea
          value={orderForm.notes}
          onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Enter order notes"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep(2)}
          className="text-white" 
          style={{backgroundColor: '#3997cd'}}
        >
          Next: Select BOM Template
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center py-4">
        <FileText className="h-16 w-16 mx-auto mb-4" style={{color: '#3997cd'}} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select BOM Template</h3>
        <p className="text-gray-600">Choose a BOM template for production based on forecasting</p>
      </div>
      
      {bomTemplates.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No active BOM templates available</p>
          <p className="text-sm text-gray-500 mt-2">Please create BOM templates first</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bomTemplates.map((template) => {
            const templateSKU = skus.find(sku => sku.id === template.kit_sku_id);
            return (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBOMTemplate?.id === template.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleBOMSelection(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Factory className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {templateSKU?.sku_code}
                            </Badge>
                            <span className="text-xs text-gray-500">v{template.version}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 ml-13">
                        <p className="text-sm text-gray-600">
                          {templateSKU?.sku_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(template.total_cost)}
                      </p>
                      <p className="text-xs text-gray-500">Total Cost</p>
                      {selectedBOMTemplate?.id === template.id && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Selected</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        {selectedBOMTemplate && (
          <Button 
            onClick={() => setCurrentStep(3)}
            className="text-white" 
            style={{backgroundColor: '#3997cd'}}
            disabled={loading}
          >
            {loading ? 'Checking Inventory...' : 'Check Inventory'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center py-4">
        <Package className="h-16 w-16 mx-auto mb-4" style={{color: '#3997cd'}} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Verification</h3>
        <p className="text-gray-600">Checking component availability for production</p>
      </div>
      
      {selectedBOMTemplate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Selected BOM: {selectedBOMTemplate.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              Kit: {skus.find(s => s.id === selectedBOMTemplate.kit_sku_id)?.sku_name}
            </p>
            <p className="text-lg font-semibold text-green-600">
              Total Cost: {formatCurrency(selectedBOMTemplate.total_cost)}
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
            Component Inventory Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inventoryCheck.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {item.sufficient ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {item.sku?.sku_name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.sku?.sku_code}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    Required: {item.required_quantity} • Available: {item.available_quantity}
                    {!item.sufficient && (
                      <span className="text-orange-600 font-medium">
                        • Shortage: {item.shortage}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={item.sufficient ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {item.sufficient ? 'Available' : 'Need to Order'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Production Plan</h4>
            <p className="text-sm text-gray-600">
              {inventoryCheck.every(item => item.sufficient) ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  All components available - Production can start immediately
                </span>
              ) : (
                <span className="text-orange-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Missing components detected - Purchase orders will be created automatically
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        <Button 
          onClick={handleCreateOrder}
          className="text-white" 
          style={{backgroundColor: '#3997cd'}}
          disabled={loading}
        >
          {loading ? 'Creating Order...' : 'Create Sales Order'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Progress Steps */}
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step 
                  ? 'bg-blue-600 text-white' 
                  : currentStep > step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
}