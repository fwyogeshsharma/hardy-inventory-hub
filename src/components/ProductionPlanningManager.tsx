import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  ShoppingCart,
  FileText,
  ArrowRight,
  Loader2
} from "lucide-react";
import { inventoryManager, dataService } from "@/lib/database";
import { workflowManager, BOMTemplate } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

interface ProductionPlan {
  id: string;
  sales_order_id: number;
  bom_template_id: number;
  sales_order: any;
  bom_template: BOMTemplate;
  inventory_check: any[];
  status: 'pending_verification' | 'verified' | 'production_ready' | 'awaiting_materials' | 'in_production' | 'completed';
  created_at: string;
}

interface ProductionPlanningManagerProps {
  onProductionStarted?: () => void;
  onStatsUpdate?: (stats: {
    activePlans: number;
    readyToProduce: number;
    awaitingMaterials: number;
    inProduction: number;
  }) => void;
}

export default function ProductionPlanningManager({ onProductionStarted, onStatsUpdate }: ProductionPlanningManagerProps) {
  const { toast } = useToast();
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [recheckingMaterials, setRecheckingMaterials] = useState(false);

  useEffect(() => {
    loadProductionPlans();

    // Listen for material availability updates from Purchase Orders page
    const handleMaterialAvailable = async (event: CustomEvent) => {
      const { sku_id, quantity_added, item_code, item_name } = event.detail;
      
      console.log(`🔄 Production Planning: Material available notification received!`);
      console.log(`📦 Item: ${item_name} (${item_code})`);
      console.log(`📊 Quantity added: ${quantity_added} units`);
      console.log(`🔍 Current production plans count: ${productionPlans.length}`);
      console.log(`⏳ Awaiting materials plans: ${productionPlans.filter(p => p.status === 'awaiting_materials').length}`);
      
      // Re-check all awaiting materials production plans
      await recheckAwaitingMaterialsPlans();
      
      toast({
        title: "Material Available! 🎉",
        description: `${item_name} (${quantity_added} units) is now in warehouse. Re-checking production plans...`,
        variant: "default",
      });
    };

    // Add event listener
    window.addEventListener('material-available', handleMaterialAvailable as EventListener);

    // Cleanup event listener
    return () => {
      window.removeEventListener('material-available', handleMaterialAvailable as EventListener);
    };
  }, []);

  const recheckAwaitingMaterialsPlans = async () => {
    try {
      setRecheckingMaterials(true);
      
      // Get all production plans that are awaiting materials
      const awaitingPlans = productionPlans.filter(plan => plan.status === 'awaiting_materials');
      
      if (awaitingPlans.length === 0) {
        console.log('No production plans awaiting materials to recheck');
        return;
      }

      console.log(`🔍 Re-checking ${awaitingPlans.length} production plans awaiting materials`);

      // Re-verify inventory for each awaiting plan
      for (const plan of awaitingPlans) {
        await verifyInventoryForProduction(plan, true); // true = silent mode
      }

      // Reload plans to reflect any status changes
      await loadProductionPlans();

    } catch (error) {
      console.error('Error rechecking awaiting materials plans:', error);
    } finally {
      setRecheckingMaterials(false);
    }
  };

  const updateStats = (plans: ProductionPlan[]) => {
    if (onStatsUpdate) {
      const stats = {
        activePlans: plans.length,
        readyToProduce: plans.filter(p => p.status === 'production_ready').length,
        awaitingMaterials: plans.filter(p => p.status === 'awaiting_materials').length,
        inProduction: plans.filter(p => p.status === 'in_production').length
      };
      onStatsUpdate(stats);
    }
  };

  const loadProductionPlans = async () => {
    try {
      setLoading(true);
      
      // Get sales orders with BOM templates
      const [salesOrders, bomTemplates, components] = await Promise.all([
        inventoryManager.getSalesOrders(),
        workflowManager.getBOMTemplates(),
        workflowManager.getBOMComponents()
      ]);

      // Filter sales orders that have BOM templates and need production
      const bomBasedOrders = salesOrders.filter(order => 
        order.bom_template_id && order.production_required
      );

      // Create production plans for each BOM-based order
      const plans: ProductionPlan[] = [];
      
      for (const order of bomBasedOrders) {
        const bomTemplate = bomTemplates.find(bom => bom.id === order.bom_template_id);
        if (bomTemplate) {
          // Get existing plan or create new one
          const existingPlans = localStorage.getItem('production_plans');
          const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
          
          let existingPlan = parsedPlans.find((p: any) => 
            p.sales_order_id === order.id && p.bom_template_id === bomTemplate.id
          );

          if (!existingPlan) {
            // Create new production plan
            const planId = `PP-${Date.now()}-${order.id}`;
            const newPlan: ProductionPlan = {
              id: planId,
              sales_order_id: order.id,
              bom_template_id: bomTemplate.id,
              sales_order: order,
              bom_template: bomTemplate,
              inventory_check: [],
              status: 'pending_verification',
              created_at: new Date().toISOString()
            };

            parsedPlans.push(newPlan);
            localStorage.setItem('production_plans', JSON.stringify(parsedPlans));
            existingPlan = newPlan;
          } else {
            // Update with current data
            existingPlan.sales_order = order;
            existingPlan.bom_template = bomTemplate;
          }

          plans.push(existingPlan);
        }
      }

      setProductionPlans(plans);
      updateStats(plans);
    } catch (error) {
      console.error('Error loading production plans:', error);
      toast({
        title: "Error",
        description: "Failed to load production plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyInventoryForProduction = async (plan: ProductionPlan, silentMode = false) => {
    try {
      setProcessingPlan(plan.id);
      
      // Get BOM components
      const allComponents = await workflowManager.getBOMComponents();
      const bomComponents = allComponents.filter(comp => comp.bom_template_id === plan.bom_template_id);
      
      // Get current inventory and SKU data
      const [inventory, skus] = await Promise.all([
        dataService.getInventory(),
        dataService.getSKUs()
      ]);

      // Check inventory for each component (considering sales order quantity if available)
      const salesOrderQuantity = plan.sales_order.quantity || 1; // Default to 1 if not specified
      
      const inventoryResults = bomComponents.map(component => {
        const sku = skus.find(s => s.id === component.component_sku_id);
        const skuInventory = inventory.find(inv => inv.sku_id === component.component_sku_id);
        const availableQuantity = skuInventory ? skuInventory.quantity_available : 0;
        const totalRequired = component.quantity_required * salesOrderQuantity;
        const sufficient = availableQuantity >= totalRequired;
        const shortage = Math.max(0, totalRequired - availableQuantity);

        return {
          component,
          sku,
          required_quantity: totalRequired,
          available_quantity: availableQuantity,
          sufficient,
          shortage,
          per_unit_quantity: component.quantity_required,
          order_quantity: salesOrderQuantity
        };
      });

      // Update production plan with inventory check results
      const updatedPlan = {
        ...plan,
        inventory_check: inventoryResults,
        status: inventoryResults.every(item => item.sufficient) ? 'production_ready' : 'awaiting_materials'
      };

      // Update localStorage
      const existingPlans = localStorage.getItem('production_plans');
      const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
      const planIndex = parsedPlans.findIndex((p: any) => p.id === plan.id);
      
      if (planIndex !== -1) {
        parsedPlans[planIndex] = updatedPlan;
        localStorage.setItem('production_plans', JSON.stringify(parsedPlans));
      }

      // Generate purchase orders for missing materials
      const missingMaterials = inventoryResults.filter(item => !item.sufficient);
      let createdPOs = [];
      
      if (missingMaterials.length > 0) {
        try {
          createdPOs = await generatePurchaseOrdersForMaterials(missingMaterials, plan);
          
          // Update the plan with PO information
          updatedPlan.purchase_orders_generated = true;
          updatedPlan.purchase_orders_count = createdPOs.length;
          updatedPlan.purchase_orders_created_at = new Date().toISOString();
          
        } catch (error) {
          console.error('Failed to generate purchase orders:', error);
          toast({
            title: "Warning",
            description: "Inventory verified but failed to generate some purchase orders. Check manually.",
            variant: "destructive",
          });
        }
      }

      // Update the production plans state
      const newPlans = productionPlans.map(p => p.id === plan.id ? updatedPlan : p);
      setProductionPlans(newPlans);
      updateStats(newPlans);

      // Show detailed success message (unless in silent mode)
      const totalMissingComponents = missingMaterials.length;
      const totalShortage = missingMaterials.reduce((sum, item) => sum + item.shortage, 0);
      
      if (!silentMode) {
        if (missingMaterials.length > 0) {
          toast({
            title: "Inventory Verified & Purchase Orders Generated",
            description: `✅ Created ${createdPOs.length} purchase orders for ${totalMissingComponents} missing components (${totalShortage} total units needed)`,
            variant: "default",
          });
        } else {
          toast({
            title: "Inventory Verified",
            description: "✅ All materials available for production. Ready to start!",
            variant: "default",
          });
        }
      } else {
        // Silent mode - only log status changes
        if (missingMaterials.length === 0 && updatedPlan.status === 'production_ready') {
          console.log(`🎉 Production plan ${plan.id} is now ready for production! All materials available.`);
          
          // Show a notification for newly available plans
          toast({
            title: "Production Ready!",
            description: `Materials for ${plan.bom_template.name} are now available. Production can start!`,
            variant: "default",
          });
        }
      }

    } catch (error) {
      console.error('Error verifying inventory:', error);
      if (!silentMode) {
        toast({
          title: "Error",
          description: "Failed to verify inventory for production",
          variant: "destructive",
        });
      }
    } finally {
      if (!silentMode) {
        setProcessingPlan(null);
      }
    }
  };

  // Helper function to create PO using the extended workflow system (matches PO page)
  const createPurchaseOrderForMaterial = async (material: any, plan: ProductionPlan) => {
    try {
      // Create purchase order in the extended system (same as PO page uses)
      const orders = localStorage.getItem('purchase_orders_extended');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `PO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const totalAmount = (material.component.unit_cost || 25.00) * material.shortage;
      
      const newOrder = {
        id: newId,
        order_number: orderNumber,
        vendor_id: 1, // Default vendor
        warehouse_id: 1, // Default warehouse
        status: 'pending',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_amount: totalAmount,
        notes: `🤖 AUTO-GENERATED for Production Plan ${plan.id}\nBOM: ${plan.bom_template.name}\nSales Order: ${plan.sales_order.order_number}\nComponent: ${material.sku?.sku_name || 'Unknown'} (${material.sku?.sku_code || 'N/A'})\nShortage: ${material.shortage} units`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('purchase_orders_extended', JSON.stringify(existingOrders));
      
      // Create purchase order item using workflow manager
      await workflowManager.createPurchaseOrderItem({
        purchase_order_id: newId,
        sku_id: material.component.component_sku_id,
        quantity_ordered: material.shortage,
        unit_cost: material.component.unit_cost || 25.00,
        notes: `Auto-generated for production plan ${plan.id}`
      });
      
      console.log(`✅ Created PO ${orderNumber} for ${material.sku?.sku_name} (${material.shortage} units)`);
      
      return { order: newOrder };
      
    } catch (error) {
      console.error('❌ Error creating purchase order for material:', error);
      return null;
    }
  };

  const generatePurchaseOrdersForMaterials = async (missingMaterials: any[], plan: ProductionPlan) => {
    try {
      const createdPOs = [];
      
      for (const material of missingMaterials) {
        if (material.shortage > 0) {
          console.log('Creating PO for missing material:', {
            component: material.sku?.sku_name,
            shortage: material.shortage,
            unit_cost: material.component.unit_cost
          });

          // Create purchase order using workflow manager (matches PO page data source)
          const createdPO = await createPurchaseOrderForMaterial(material, plan);
          
          if (createdPO) {
            createdPOs.push({
              po: createdPO,
              material: material
            });
          }
        }
      }

      // Store PO references in production plan
      if (createdPOs.length > 0) {
        const existingPlans = localStorage.getItem('production_plans');
        const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
        const planIndex = parsedPlans.findIndex((p: any) => p.id === plan.id);
        
        if (planIndex !== -1) {
          parsedPlans[planIndex].generated_purchase_orders = createdPOs.map(po => ({
            purchase_order_id: po.po.order?.id,
            component_sku_id: po.material.component.component_sku_id,
            quantity_ordered: po.material.shortage,
            created_at: new Date().toISOString()
          }));
          
          localStorage.setItem('production_plans', JSON.stringify(parsedPlans));
        }
      }

      console.log(`✅ Generated ${createdPOs.length} purchase orders for missing materials`);
      return createdPOs;
      
    } catch (error) {
      console.error('❌ Error generating purchase orders:', error);
      throw error;
    }
  };

  const startProduction = async (plan: ProductionPlan) => {
    try {
      setProcessingPlan(plan.id);

      // Create kit production order
      const salesOrderQuantity = plan.sales_order.quantity || 1;
      const productionOrderData = {
        kit_sku_id: plan.bom_template.kit_sku_id,
        bom_template_id: plan.bom_template_id,
        warehouse_id: 1, // Default warehouse
        quantity_planned: salesOrderQuantity, // Use sales order quantity
        planned_start_date: new Date().toISOString().split('T')[0],
        planned_completion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: `Production for sales order ${plan.sales_order.order_number} (${salesOrderQuantity} units)`,
        priority: plan.sales_order.priority || 'medium'
      };

      const productionOrder = await workflowManager.createKitProductionOrder(productionOrderData);

      // Update production plan status
      const updatedPlan = {
        ...plan,
        status: 'in_production',
        production_order_id: productionOrder.id
      };

      // Update localStorage
      const existingPlans = localStorage.getItem('production_plans');
      const parsedPlans = existingPlans ? JSON.parse(existingPlans) : [];
      const planIndex = parsedPlans.findIndex((p: any) => p.id === plan.id);
      
      if (planIndex !== -1) {
        parsedPlans[planIndex] = updatedPlan;
        localStorage.setItem('production_plans', JSON.stringify(parsedPlans));
      }

      // Update state
      const newPlans = productionPlans.map(p => p.id === plan.id ? updatedPlan : p);
      setProductionPlans(newPlans);
      updateStats(newPlans);

      toast({
        title: "Production Started",
        description: `Production order created for ${plan.bom_template.name}`,
        variant: "default",
      });

      if (onProductionStarted) {
        onProductionStarted();
      }

    } catch (error) {
      console.error('Error starting production:', error);
      toast({
        title: "Error",
        description: "Failed to start production",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_verification': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'verified': return 'bg-green-50 text-green-700 border-green-200';
      case 'production_ready': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'awaiting_materials': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'in_production': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'completed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12">
          <div className="text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Loading production plans...
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Factory className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
            Production Planning Manager
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              {productionPlans.length} plans
            </Badge>
            {recheckingMaterials && (
              <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-300">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Rechecking Materials
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {productionPlans.length === 0 ? (
            <div className="text-center py-8">
              <Factory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Production Plans Found
              </h3>
              <p className="text-gray-500 mb-6">
                Production plans will appear here when sales orders with BOM templates are created
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {productionPlans.map((plan) => (
                <Card key={plan.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {plan.sales_order.order_number} → {plan.bom_template.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {plan.sales_order.customer_name}
                              </Badge>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                Due: {new Date(plan.sales_order.required_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-13 space-y-2">
                          <p className="text-sm text-gray-600">
                            BOM: {plan.bom_template.name} v{plan.bom_template.version} • 
                            Cost: {formatCurrency(plan.bom_template.total_cost)}
                          </p>
                          
                          {plan.inventory_check.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">Material Status:</p>
                              <div className="flex flex-wrap gap-1">
                                {plan.inventory_check.slice(0, 4).map((item, index) => (
                                  <Badge 
                                    key={index}
                                    className={`text-xs ${item.sufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                  >
                                    {item.sku?.sku_code}: {item.sufficient ? '✓' : `Need ${item.shortage}`}
                                  </Badge>
                                ))}
                                {plan.inventory_check.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{plan.inventory_check.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-3 min-w-[250px]">
                        <Badge variant="outline" className={getStatusColor(plan.status)}>
                          {plan.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        
                        <div className="space-y-2">
                          {plan.status === 'pending_verification' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                              onClick={() => verifyInventoryForProduction(plan)}
                              disabled={processingPlan === plan.id}
                            >
                              {processingPlan === plan.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Verify Inventory
                            </Button>
                          )}
                          
                          {plan.status === 'production_ready' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => startProduction(plan)}
                              disabled={processingPlan === plan.id}
                            >
                              {processingPlan === plan.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Play className="h-3 w-3 mr-1" />
                              )}
                              Start Production
                            </Button>
                          )}
                          
                          {plan.status === 'awaiting_materials' && (
                            <div className="text-center space-y-2">
                              <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                              <p className="text-xs text-orange-600">Awaiting Materials</p>
                              {(plan as any).purchase_orders_generated ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-500">
                                    ✅ {(plan as any).purchase_orders_count || 0} POs generated
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {(plan as any).purchase_orders_created_at && 
                                      new Date((plan as any).purchase_orders_created_at).toLocaleDateString()
                                    }
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                                    onClick={() => window.open('/purchase-orders', '_blank')}
                                  >
                                    View Purchase Orders
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-xs bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                                  onClick={() => verifyInventoryForProduction(plan)}
                                  disabled={processingPlan === plan.id}
                                >
                                  {processingPlan === plan.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : (
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                  )}
                                  Generate POs
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {plan.status === 'in_production' && (
                            <div className="text-center">
                              <Clock className="h-4 w-4 mx-auto mb-1 text-indigo-600" />
                              <p className="text-xs text-indigo-600">In Production</p>
                              <p className="text-xs text-gray-500">Check BOM page for progress</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}