// Vendor notification service for paused workflow orders
import { dataService } from './database';
import { workflowManager } from './workflowExtensions';

export interface VendorAssignmentAlert {
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

export interface VendorNotification {
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

export class VendorNotificationService {
  
  // Get all paused orders requiring vendor assignment
  async getPausedOrdersNeedingVendors(): Promise<VendorAssignmentAlert[]> {
    try {
      const [supplierOrders, skus, vendors] = await Promise.all([
        workflowManager.getSupplierOrders(),
        dataService.getSKUs(),
        dataService.getVendors()
      ]);

      const pausedOrders = supplierOrders.filter(order => 
        order.workflow_status === 'paused' && 
        (order.pause_reason?.includes('vendor') || 
         order.pause_reason?.includes('supplier') ||
         order.pause_reason?.includes('Waiting for supplier'))
      );

      const alerts: VendorAssignmentAlert[] = [];

      for (const order of pausedOrders) {
        const sku = skus.find(s => s.id === order.sku_id);
        if (!sku) continue;

        // Get current vendor assignment
        const currentVendor = vendors.find(v => v.id === sku.vendor_id);
        
        // Suggest vendors based on category or part type
        const suggestedVendors = vendors
          .filter(v => v.is_active && v.id !== sku.vendor_id)
          .map(v => v.name)
          .slice(0, 3);

        // Calculate priority based on order value and urgency
        const estimatedValue = (order.quantity || 1) * (sku.unit_cost || 25);
        const priority = estimatedValue > 1000 ? 'high' : 
                        estimatedValue > 500 ? 'medium' : 'low';

        alerts.push({
          id: `alert_${order.id}_${Date.now()}`,
          orderId: order.id,
          skuId: sku.id,
          skuCode: sku.sku_code,
          skuName: sku.sku_name,
          quantity: order.quantity || 1,
          pauseReason: order.pause_reason || 'Vendor assignment needed',
          pausedAt: order.updated_at,
          priority,
          category: sku.category || 'General',
          requiredBy: order.required_date,
          estimatedValue,
          currentVendor: currentVendor?.name,
          suggestedVendors,
          status: 'pending'
        });
      }

      // Sort by priority and value
      alerts.sort((a, b) => {
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.estimatedValue - a.estimatedValue;
      });

      return alerts;
    } catch (error) {
      console.error('Error getting paused orders needing vendors:', error);
      return [];
    }
  }

  // Create vendor notifications for the vendor page
  async generateVendorNotifications(): Promise<VendorNotification[]> {
    try {
      const alerts = await this.getPausedOrdersNeedingVendors();
      const notifications: VendorNotification[] = [];

      for (const alert of alerts) {
        // Create vendor assignment notification
        notifications.push({
          id: `vendor_notif_${alert.id}`,
          type: 'vendor_assignment_needed',
          title: `Vendor Needed: ${alert.skuCode}`,
          message: `Order #${alert.orderId} is paused. Need to assign vendor for ${alert.skuName} (${alert.quantity} units). ${alert.pauseReason}`,
          priority: alert.priority,
          skuCode: alert.skuCode,
          orderId: alert.orderId,
          createdAt: alert.pausedAt,
          isRead: false,
          actionRequired: true,
          data: {
            alert,
            suggestedActions: [
              'Assign existing vendor',
              'Add new vendor',
              'Contact current vendor for availability'
            ]
          }
        });

        // Create urgent notifications for high-priority items
        if (alert.priority === 'high') {
          notifications.push({
            id: `urgent_${alert.id}`,
            type: 'urgent_reorder',
            title: `Urgent: High-Value Order Paused`,
            message: `${alert.skuCode} worth $${alert.estimatedValue.toLocaleString()} is waiting for vendor assignment. Immediate attention required.`,
            priority: 'high',
            skuCode: alert.skuCode,
            orderId: alert.orderId,
            createdAt: alert.pausedAt,
            isRead: false,
            actionRequired: true,
            data: { alert }
          });
        }
      }

      // Sort notifications by priority and creation time
      notifications.sort((a, b) => {
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return notifications;
    } catch (error) {
      console.error('Error generating vendor notifications:', error);
      return [];
    }
  }

  // Assign vendor to a paused order
  async assignVendorToOrder(orderId: number, vendorId: number): Promise<boolean> {
    try {
      // First, update the SKU with the new vendor
      const supplierOrders = await workflowManager.getSupplierOrders();
      const order = supplierOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Update SKU with new vendor
      const skus = await dataService.getSKUs();
      const sku = skus.find(s => s.id === order.sku_id);
      
      if (sku) {
        // Update the SKU's vendor assignment
        await this.updateSKUVendor(sku.id, vendorId);
      }

      // Resume the workflow with vendor assigned
      await workflowManager.resumeSupplierOrderWorkflow(orderId, `Vendor assigned`);

      return true;
    } catch (error) {
      console.error('Error assigning vendor to order:', error);
      return false;
    }
  }

  // Update SKU vendor assignment
  private async updateSKUVendor(skuId: number, vendorId: number): Promise<void> {
    try {
      const skus = await dataService.getSKUs();
      const existingSKUs = [...skus];
      const skuIndex = existingSKUs.findIndex(s => s.id === skuId);
      
      if (skuIndex !== -1) {
        existingSKUs[skuIndex] = {
          ...existingSKUs[skuIndex],
          vendor_id: vendorId,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('skus_db', JSON.stringify(existingSKUs));
      }
    } catch (error) {
      console.error('Error updating SKU vendor:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      const notifications = localStorage.getItem('vendor_notifications');
      const existingNotifications = notifications ? JSON.parse(notifications) : [];
      
      const updatedNotifications = existingNotifications.map((notif: VendorNotification) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      
      localStorage.setItem('vendor_notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Get notification count for badges
  async getNotificationCount(): Promise<{ total: number; urgent: number }> {
    try {
      const notifications = await this.generateVendorNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      return {
        total: unreadNotifications.length,
        urgent: unreadNotifications.filter(n => n.priority === 'high').length
      };
    } catch (error) {
      console.error('Error getting notification count:', error);
      return { total: 0, urgent: 0 };
    }
  }

  // Clear resolved notifications
  async clearResolvedNotifications(): Promise<void> {
    try {
      const currentAlerts = await this.getPausedOrdersNeedingVendors();
      const activeOrderIds = new Set(currentAlerts.map(a => a.orderId));
      
      const notifications = localStorage.getItem('vendor_notifications');
      const existingNotifications = notifications ? JSON.parse(notifications) : [];
      
      // Keep only notifications for orders that are still paused
      const activeNotifications = existingNotifications.filter((notif: VendorNotification) =>
        !notif.orderId || activeOrderIds.has(notif.orderId)
      );
      
      localStorage.setItem('vendor_notifications', JSON.stringify(activeNotifications));
    } catch (error) {
      console.error('Error clearing resolved notifications:', error);
    }
  }
}

export const vendorNotificationService = new VendorNotificationService();