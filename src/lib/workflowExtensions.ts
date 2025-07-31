// Workflow Extensions for the Inventory Management System
// This module extends the existing database functionality with workflow-specific operations

import { dataService, inventoryManager } from './database';

// Workflow-specific interfaces
export interface ReorderRequest {
  id: number;
  sku_id: number;
  warehouse_id: number;
  quantity_requested: number;
  reason: 'out_of_stock' | 'low_stock' | 'manual';
  status: 'pending' | 'approved' | 'ordered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_by?: number;
  approved_by?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  sku_id: number;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  line_total: number;
  warehouse_status: 'not_checked' | 'in_warehouse' | 'not_available' | 'new_order_required';
  notes?: string;
  created_at: string;
  // Related data
  sku?: any;
}

export interface WarehouseCheck {
  id: number;
  purchase_order_item_id: number;
  checker_id?: number;
  status: 'in_warehouse' | 'not_available' | 'partial_available';
  quantity_found: number;
  location?: string;
  check_date: string;
  notes?: string;
}

export interface SupplierOrder {
  id: number;
  order_number: string;
  purchase_order_item_id: number;
  supplier_id: number;
  status: 'pending' | 'sent' | 'confirmed' | 'in_transit' | 'received' | 'cancelled';
  is_regular_supplier: boolean;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  quantity_ordered: number;
  unit_cost: number;
  total_cost: number;
  tracking_number?: string;
  workflow_status: 'active' | 'paused' | 'resumed';
  pause_reason?: string;
  notes?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface BOMTemplate {
  id: number;
  kit_sku_id: number;
  version: string;
  name: string;
  description?: string;
  is_active: boolean;
  total_cost: number;
  labor_cost: number;
  overhead_cost: number;
  created_by?: number;
  created_at: string;
  updated_at: string;
  components?: BOMComponent[];
}

export interface BOMComponent {
  id: number;
  bom_template_id: number;
  component_sku_id: number;
  quantity_required: number;
  unit_cost: number;
  line_cost: number;
  is_critical: boolean;
  notes?: string;
  created_at: string;
  // Related data
  component_sku?: any;
}

export interface KitProductionOrder {
  id: number;
  order_number: string;
  kit_sku_id: number;
  bom_template_id: number;
  warehouse_id: number;
  quantity_planned: number;
  quantity_completed: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  planned_start_date?: string;
  actual_start_date?: string;
  planned_completion_date?: string;
  actual_completion_date?: string;
  total_material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
  supervisor_id?: number;
  notes?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

// Extended Inventory Manager with Workflow Operations
export class WorkflowManager {
  private static instance: WorkflowManager;
  
  private constructor() {}
  
  public static getInstance(): WorkflowManager {
    if (!WorkflowManager.instance) {
      WorkflowManager.instance = new WorkflowManager();
    }
    return WorkflowManager.instance;
  }

  // ==========================================
  // REORDER REQUEST MANAGEMENT
  // ==========================================

  async createReorderRequest(requestData: {
    sku_id: number;
    warehouse_id: number;
    quantity_requested?: number;
    reason: 'out_of_stock' | 'low_stock' | 'manual';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    notes?: string;
  }): Promise<ReorderRequest> {
    try {
      const requests = localStorage.getItem('reorder_requests');
      const existingRequests = requests ? JSON.parse(requests) : [];
      
      // Get inventory record to determine quantity if not provided
      const inventory = await dataService.getInventory();
      const inventoryRecord = inventory.find(inv => 
        inv.sku_id === requestData.sku_id && inv.warehouse_id === requestData.warehouse_id
      );
      
      const quantityRequested = requestData.quantity_requested || 
        (inventoryRecord ? (inventoryRecord.max_stock_level || 100) - inventoryRecord.quantity_on_hand : 100);
      
      const newRequest: ReorderRequest = {
        id: Math.max(0, ...existingRequests.map((r: any) => r.id)) + 1,
        sku_id: requestData.sku_id,
        warehouse_id: requestData.warehouse_id,
        quantity_requested: quantityRequested,
        reason: requestData.reason,
        status: 'pending',
        priority: requestData.priority || 'medium',
        notes: requestData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingRequests.push(newRequest);
      localStorage.setItem('reorder_requests', JSON.stringify(existingRequests));
      
      // Create alert for reorder request
      await inventoryManager.createAlert({
        alert_type: 'reorder_request_created',
        title: 'Reorder Request Created',
        message: `Reorder request created for SKU ${requestData.sku_id}. Quantity: ${quantityRequested}`,
        severity: requestData.reason === 'out_of_stock' ? 'high' : 'medium',
        entity_type: 'reorder_request',
        entity_id: newRequest.id
      });
      
      return newRequest;
    } catch (error) {
      console.error('Error creating reorder request:', error);
      throw error;
    }
  }

  async getReorderRequests(): Promise<ReorderRequest[]> {
    const requests = localStorage.getItem('reorder_requests');
    return requests ? JSON.parse(requests) : [];
  }

  async updateReorderRequestStatus(requestId: number, status: ReorderRequest['status'], approvedBy?: number): Promise<void> {
    try {
      const requests = localStorage.getItem('reorder_requests');
      const existingRequests = requests ? JSON.parse(requests) : [];
      
      const requestIndex = existingRequests.findIndex((r: any) => r.id === requestId);
      if (requestIndex === -1) {
        throw new Error(`Reorder request ${requestId} not found`);
      }
      
      existingRequests[requestIndex] = {
        ...existingRequests[requestIndex],
        status,
        approved_by: approvedBy,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('reorder_requests', JSON.stringify(existingRequests));
      
      // If approved, create purchase order
      if (status === 'approved') {
        await this.createPurchaseOrderFromReorderRequest(existingRequests[requestIndex]);
      }
    } catch (error) {
      console.error('Error updating reorder request status:', error);
      throw error;
    }
  }

  // ==========================================
  // PURCHASE ORDER MANAGEMENT
  // ==========================================

  async createPurchaseOrderFromReorderRequest(reorderRequest: ReorderRequest): Promise<any> {
    try {
      const orders = localStorage.getItem('purchase_orders_extended');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `PO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const newOrder = {
        id: newId,
        order_number: orderNumber,
        vendor_id: 1, // Default vendor for now
        warehouse_id: reorderRequest.warehouse_id,
        reorder_request_id: reorderRequest.id,
        status: 'pending',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_amount: 0,
        notes: `Created from reorder request ${reorderRequest.id}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('purchase_orders_extended', JSON.stringify(existingOrders));
      
      // Create purchase order item
      await this.createPurchaseOrderItem({
        purchase_order_id: newId,
        sku_id: reorderRequest.sku_id,
        quantity_ordered: reorderRequest.quantity_requested,
        unit_cost: 25.00, // Default cost
        notes: `From reorder request ${reorderRequest.id}`
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error creating purchase order from reorder request:', error);
      throw error;
    }
  }

  async createPurchaseOrderItem(itemData: {
    purchase_order_id: number;
    sku_id: number;
    quantity_ordered: number;
    unit_cost: number;
    notes?: string;
  }): Promise<PurchaseOrderItem> {
    try {
      const items = localStorage.getItem('purchase_order_items');
      const existingItems = items ? JSON.parse(items) : [];
      
      const newItem: PurchaseOrderItem = {
        id: Math.max(0, ...existingItems.map((i: any) => i.id)) + 1,
        purchase_order_id: itemData.purchase_order_id,
        sku_id: itemData.sku_id,
        quantity_ordered: itemData.quantity_ordered,
        quantity_received: 0,
        unit_cost: itemData.unit_cost,
        line_total: itemData.quantity_ordered * itemData.unit_cost,
        warehouse_status: 'not_checked',
        notes: itemData.notes,
        created_at: new Date().toISOString()
      };
      
      existingItems.push(newItem);
      localStorage.setItem('purchase_order_items', JSON.stringify(existingItems));
      
      return newItem;
    } catch (error) {
      console.error('Error creating purchase order item:', error);
      throw error;
    }
  }

  async getPurchaseOrderItems(): Promise<PurchaseOrderItem[]> {
    const items = localStorage.getItem('purchase_order_items');
    return items ? JSON.parse(items) : [];
  }

  async getPurchaseOrdersExtended(): Promise<any[]> {
    const orders = localStorage.getItem('purchase_orders_extended');
    return orders ? JSON.parse(orders) : [];
  }

  // ==========================================
  // WAREHOUSE CHECKING FUNCTIONALITY
  // ==========================================

  async checkItemInWarehouse(purchaseOrderItemId: number, checkerData: {
    status: 'in_warehouse' | 'not_available' | 'partial_available';
    quantity_found: number;
    location?: string;
    notes?: string;
  }): Promise<WarehouseCheck> {
    try {
      const checks = localStorage.getItem('warehouse_checks');
      const existingChecks = checks ? JSON.parse(checks) : [];
      
      const newCheck: WarehouseCheck = {
        id: Math.max(0, ...existingChecks.map((c: any) => c.id)) + 1,
        purchase_order_item_id: purchaseOrderItemId,
        status: checkerData.status,
        quantity_found: checkerData.quantity_found,
        location: checkerData.location,
        check_date: new Date().toISOString(),
        notes: checkerData.notes
      };
      
      existingChecks.push(newCheck);
      localStorage.setItem('warehouse_checks', JSON.stringify(existingChecks));
      
      // Update purchase order item status
      await this.updatePurchaseOrderItemWarehouseStatus(purchaseOrderItemId, checkerData.status);
      
      // If not available, create supplier order
      if (checkerData.status === 'not_available') {
        await this.createSupplierOrderFromPurchaseOrderItem(purchaseOrderItemId);
      }
      
      return newCheck;
    } catch (error) {
      console.error('Error checking item in warehouse:', error);
      throw error;
    }
  }

  async updatePurchaseOrderItemWarehouseStatus(itemId: number, status: PurchaseOrderItem['warehouse_status']): Promise<void> {
    try {
      const items = localStorage.getItem('purchase_order_items');
      const existingItems = items ? JSON.parse(items) : [];
      
      const itemIndex = existingItems.findIndex((i: any) => i.id === itemId);
      if (itemIndex === -1) {
        throw new Error(`Purchase order item ${itemId} not found`);
      }
      
      existingItems[itemIndex] = {
        ...existingItems[itemIndex],
        warehouse_status: status
      };
      
      localStorage.setItem('purchase_order_items', JSON.stringify(existingItems));
    } catch (error) {
      console.error('Error updating purchase order item warehouse status:', error);
      throw error;
    }
  }

  // ==========================================
  // SUPPLIER ORDER MANAGEMENT
  // ==========================================

  async createSupplierOrderFromPurchaseOrderItem(purchaseOrderItemId: number): Promise<SupplierOrder> {
    try {
      // Get the purchase order item
      const items = await this.getPurchaseOrderItems();
      const item = items.find(i => i.id === purchaseOrderItemId);
      if (!item) {
        throw new Error(`Purchase order item ${purchaseOrderItemId} not found`);
      }
      
      const orders = localStorage.getItem('supplier_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `SUP-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const newOrder: SupplierOrder = {
        id: newId,
        order_number: orderNumber,
        purchase_order_item_id: purchaseOrderItemId,
        supplier_id: 1, // Default regular supplier
        status: 'pending',
        is_regular_supplier: true,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity_ordered: item.quantity_ordered,
        unit_cost: item.unit_cost,
        total_cost: item.quantity_ordered * item.unit_cost,
        workflow_status: 'active',
        notes: `Created from purchase order item ${purchaseOrderItemId}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('supplier_orders', JSON.stringify(existingOrders));
      
      // Update purchase order item status
      await this.updatePurchaseOrderItemWarehouseStatus(purchaseOrderItemId, 'new_order_required');
      
      return newOrder;
    } catch (error) {
      console.error('Error creating supplier order:', error);
      throw error;
    }
  }

  async getSupplierOrders(): Promise<SupplierOrder[]> {
    const orders = localStorage.getItem('supplier_orders');
    return orders ? JSON.parse(orders) : [];
  }

  async updateSupplierOrderStatus(orderId: number, status: SupplierOrder['status']): Promise<void> {
    try {
      const orders = localStorage.getItem('supplier_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Supplier order ${orderId} not found`);
      }
      
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'received') {
        existingOrders[orderIndex].actual_delivery_date = new Date().toISOString().split('T')[0];
        existingOrders[orderIndex].workflow_status = 'resumed';
        
        // Process the received order - update inventory
        const order = existingOrders[orderIndex];
        const items = await this.getPurchaseOrderItems();
        const relatedItem = items.find(i => i.id === order.purchase_order_item_id);
        
        if (relatedItem) {
          await inventoryManager.updateInventoryLevel(
            relatedItem.sku_id,
            1, // Main warehouse
            order.quantity_ordered,
            'receipt',
            orderId,
            `Received from supplier order ${order.order_number}`
          );
        }
      }
      
      localStorage.setItem('supplier_orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Error updating supplier order status:', error);
      throw error;
    }
  }

  async pauseSupplierOrderWorkflow(orderId: number, reason: string): Promise<void> {
    try {
      const orders = localStorage.getItem('supplier_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Supplier order ${orderId} not found`);
      }
      
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        workflow_status: 'paused',
        pause_reason: reason,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('supplier_orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Error pausing supplier order workflow:', error);
      throw error;
    }
  }

  async resumeSupplierOrderWorkflow(orderId: number, reason: string): Promise<void> {
    try {
      const orders = localStorage.getItem('supplier_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Supplier order ${orderId} not found`);
      }
      
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        workflow_status: 'active',
        pause_reason: null,
        resume_reason: reason,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('supplier_orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Error resuming supplier order workflow:', error);
      throw error;
    }
  }

  // ==========================================
  // BILL OF MATERIALS (BOM) MANAGEMENT
  // ==========================================

  async createBOMTemplate(templateData: {
    kit_sku_id: number;
    version?: string;
    name: string;
    description?: string;
    labor_cost?: number;
    overhead_cost?: number;
    components: Array<{
      component_sku_id: number;
      quantity_required: number;
      unit_cost: number;
      is_critical?: boolean;
      notes?: string;
    }>;
  }): Promise<BOMTemplate> {
    try {
      const templates = localStorage.getItem('bom_templates');
      const existingTemplates = templates ? JSON.parse(templates) : [];
      
      const newId = Math.max(0, ...existingTemplates.map((t: any) => t.id)) + 1;
      
      // Calculate total material cost
      const materialCost = templateData.components.reduce((sum, comp) => 
        sum + (comp.quantity_required * comp.unit_cost), 0
      );
      
      const newTemplate: BOMTemplate = {
        id: newId,
        kit_sku_id: templateData.kit_sku_id,
        version: templateData.version || '1.0',
        name: templateData.name,
        description: templateData.description,
        is_active: true,
        total_cost: materialCost + (templateData.labor_cost || 0) + (templateData.overhead_cost || 0),
        labor_cost: templateData.labor_cost || 0,
        overhead_cost: templateData.overhead_cost || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingTemplates.push(newTemplate);
      localStorage.setItem('bom_templates', JSON.stringify(existingTemplates));
      
      // Create BOM components
      for (const compData of templateData.components) {
        await this.createBOMComponent({
          bom_template_id: newId,
          component_sku_id: compData.component_sku_id,
          quantity_required: compData.quantity_required,
          unit_cost: compData.unit_cost,
          is_critical: compData.is_critical || false,
          notes: compData.notes
        });
      }
      
      return newTemplate;
    } catch (error) {
      console.error('Error creating BOM template:', error);
      throw error;
    }
  }

  async createBOMComponent(componentData: {
    bom_template_id: number;
    component_sku_id: number;
    quantity_required: number;
    unit_cost: number;
    is_critical: boolean;
    notes?: string;
  }): Promise<BOMComponent> {
    try {
      const components = localStorage.getItem('bom_components');
      const existingComponents = components ? JSON.parse(components) : [];
      
      const newComponent: BOMComponent = {
        id: Math.max(0, ...existingComponents.map((c: any) => c.id)) + 1,
        bom_template_id: componentData.bom_template_id,
        component_sku_id: componentData.component_sku_id,
        quantity_required: componentData.quantity_required,
        unit_cost: componentData.unit_cost,
        line_cost: componentData.quantity_required * componentData.unit_cost,
        is_critical: componentData.is_critical,
        notes: componentData.notes,
        created_at: new Date().toISOString()
      };
      
      existingComponents.push(newComponent);
      localStorage.setItem('bom_components', JSON.stringify(existingComponents));
      
      return newComponent;
    } catch (error) {
      console.error('Error creating BOM component:', error);
      throw error;
    }
  }

  async getBOMTemplates(): Promise<BOMTemplate[]> {
    const templates = localStorage.getItem('bom_templates');
    return templates ? JSON.parse(templates) : [];
  }

  async getBOMComponents(): Promise<BOMComponent[]> {
    const components = localStorage.getItem('bom_components');
    return components ? JSON.parse(components) : [];
  }

  async getBOMTemplateWithComponents(templateId: number): Promise<BOMTemplate | null> {
    const templates = await this.getBOMTemplates();
    const components = await this.getBOMComponents();
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    template.components = components.filter(c => c.bom_template_id === templateId);
    return template;
  }

  // ==========================================
  // KIT PRODUCTION MANAGEMENT
  // ==========================================

  async createKitProductionOrder(orderData: {
    kit_sku_id: number;
    bom_template_id: number;
    warehouse_id: number;
    quantity_planned: number;
    planned_start_date?: string;
    planned_completion_date?: string;
    supervisor_id?: number;
    notes?: string;
  }): Promise<KitProductionOrder> {
    try {
      const orders = localStorage.getItem('kit_production_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `KPO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      // Get BOM template to calculate costs
      const bomTemplate = await this.getBOMTemplateWithComponents(orderData.bom_template_id);
      const totalMaterialCost = bomTemplate ? bomTemplate.total_cost * orderData.quantity_planned : 0;
      
      const newOrder: KitProductionOrder = {
        id: newId,
        order_number: orderNumber,
        kit_sku_id: orderData.kit_sku_id,
        bom_template_id: orderData.bom_template_id,
        warehouse_id: orderData.warehouse_id,
        quantity_planned: orderData.quantity_planned,
        quantity_completed: 0,
        status: 'planned',
        planned_start_date: orderData.planned_start_date,
        actual_start_date: undefined,
        planned_completion_date: orderData.planned_completion_date,
        actual_completion_date: undefined,
        total_material_cost: totalMaterialCost,
        labor_cost: bomTemplate ? bomTemplate.labor_cost * orderData.quantity_planned : 0,
        overhead_cost: bomTemplate ? bomTemplate.overhead_cost * orderData.quantity_planned : 0,
        total_cost: totalMaterialCost + (bomTemplate ? (bomTemplate.labor_cost + bomTemplate.overhead_cost) * orderData.quantity_planned : 0),
        supervisor_id: orderData.supervisor_id,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('kit_production_orders', JSON.stringify(existingOrders));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating kit production order:', error);
      throw error;
    }
  }

  async getKitProductionOrders(): Promise<KitProductionOrder[]> {
    const orders = localStorage.getItem('kit_production_orders');
    return orders ? JSON.parse(orders) : [];
  }

  async startKitProduction(orderId: number): Promise<void> {
    try {
      const orders = localStorage.getItem('kit_production_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Kit production order ${orderId} not found`);
      }
      
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status: 'in_progress',
        actual_start_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('kit_production_orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Error starting kit production:', error);
      throw error;
    }
  }

  async completeKitProduction(orderId: number, quantityCompleted: number): Promise<void> {
    try {
      const orders = localStorage.getItem('kit_production_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Kit production order ${orderId} not found`);
      }
      
      const order = existingOrders[orderIndex];
      
      existingOrders[orderIndex] = {
        ...order,
        quantity_completed: quantityCompleted,
        status: 'completed',
        actual_completion_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('kit_production_orders', JSON.stringify(existingOrders));
      
      // Add completed kits to inventory
      await inventoryManager.updateInventoryLevel(
        order.kit_sku_id,
        order.warehouse_id,
        quantityCompleted,
        'production',
        orderId,
        `Kit production completed: ${quantityCompleted} units`
      );
      
      // Consume component materials
      const bomTemplate = await this.getBOMTemplateWithComponents(order.bom_template_id);
      if (bomTemplate && bomTemplate.components) {
        for (const component of bomTemplate.components) {
          const totalRequired = component.quantity_required * quantityCompleted;
          await inventoryManager.updateInventoryLevel(
            component.component_sku_id,
            order.warehouse_id,
            -totalRequired,
            'production',
            orderId,
            `Material consumed for kit production: ${component.quantity_required} x ${quantityCompleted}`
          );
        }
      }
    } catch (error) {
      console.error('Error completing kit production:', error);
      throw error;
    }
  }

  // ==========================================
  // WORKFLOW STATUS TRACKING
  // ==========================================

  async getWorkflowSummary(): Promise<{
    reorder_requests: { pending: number; approved: number; total: number };
    purchase_orders: { pending: number; in_progress: number; total: number };
    warehouse_checks: { pending: number; completed: number; not_available: number };
    supplier_orders: { active: number; paused: number; received: number };
    kit_production: { planned: number; in_progress: number; completed: number };
  }> {
    try {
      const [reorderRequests, purchaseOrders, warehouseChecks, supplierOrders, kitProduction] = await Promise.all([
        this.getReorderRequests(),
        this.getPurchaseOrdersExtended(),
        this.getWarehouseChecks(),
        this.getSupplierOrders(),
        this.getKitProductionOrders()
      ]);

      return {
        reorder_requests: {
          pending: reorderRequests.filter(r => r.status === 'pending').length,
          approved: reorderRequests.filter(r => r.status === 'approved').length,
          total: reorderRequests.length
        },
        purchase_orders: {
          pending: purchaseOrders.filter(po => po.status === 'pending').length,
          in_progress: purchaseOrders.filter(po => po.status === 'partial').length,
          total: purchaseOrders.length
        },
        warehouse_checks: {
          pending: warehouseChecks.filter(wc => wc.status === 'not_available').length,
          completed: warehouseChecks.filter(wc => wc.status === 'in_warehouse').length,
          not_available: warehouseChecks.filter(wc => wc.status === 'not_available').length
        },
        supplier_orders: {
          active: supplierOrders.filter(so => so.workflow_status === 'active').length,
          paused: supplierOrders.filter(so => so.workflow_status === 'paused').length,
          received: supplierOrders.filter(so => so.status === 'received').length
        },
        kit_production: {
          planned: kitProduction.filter(kp => kp.status === 'planned').length,
          in_progress: kitProduction.filter(kp => kp.status === 'in_progress').length,
          completed: kitProduction.filter(kp => kp.status === 'completed').length
        }
      };
    } catch (error) {
      console.error('Error getting workflow summary:', error);
      throw error;
    }
  }

  async getWarehouseChecks(): Promise<WarehouseCheck[]> {
    const checks = localStorage.getItem('warehouse_checks');
    return checks ? JSON.parse(checks) : [];
  }
}

// Export singleton instance
export const workflowManager = WorkflowManager.getInstance();