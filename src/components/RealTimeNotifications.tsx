import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertTriangle, Info, Zap, Package, ShoppingCart, Factory } from "lucide-react";
import { inventoryManager } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'inventory_updated' | 'low_stock_alert' | 'purchase_order_created' | 'sales_order_created' | 'production_job_order_created' | 'automatic_reorder';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
  data?: any;
  read?: boolean;
}

export function RealTimeNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Subscribe to all inventory manager events
    const eventTypes = [
      'inventory_updated',
      'low_stock_alert', 
      'purchase_order_created',
      'sales_order_created',
      'production_job_order_created',
      'automatic_reorder',
      'transaction_created',
      'alert_created'
    ];

    eventTypes.forEach(eventType => {
      inventoryManager.subscribe(eventType, (data) => {
        handleNewNotification(eventType as any, data);
      });
    });

    // Clean up old notifications every 30 seconds
    const cleanupInterval = setInterval(() => {
      setNotifications(prev => prev.filter(n => 
        Date.now() - n.timestamp.getTime() < 5 * 60 * 1000 // Keep for 5 minutes
      ));
    }, 30000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleNewNotification = (type: Notification['type'], data: any) => {
    const notification = createNotificationFromEvent(type, data);
    
    setNotifications(prev => [notification, ...prev].slice(0, 20)); // Keep max 20 notifications
    
    // Show toast for important notifications
    if (notification.severity === 'error' || notification.severity === 'warning') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.severity === 'error' ? 'destructive' : 'default'
      });
    }
  };

  const createNotificationFromEvent = (type: Notification['type'], data: any): Notification => {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    switch (type) {
      case 'inventory_updated':
        return {
          id,
          type,
          title: 'Inventory Updated',
          message: `SKU ${data.sku_id} quantity changed from ${data.old_quantity} to ${data.new_quantity} (${data.transaction_type})`,
          timestamp,
          severity: 'info',
          data
        };

      case 'low_stock_alert':
        return {
          id,
          type,
          title: data.is_out_of_stock ? 'Out of Stock Alert' : 'Low Stock Alert',
          message: `SKU ${data.inventory_record.sku_id} is ${data.is_out_of_stock ? 'out of stock' : 'running low'} (Available: ${data.inventory_record.quantity_available})`,
          timestamp,
          severity: data.is_out_of_stock ? 'error' : 'warning',
          data
        };

      case 'purchase_order_created':
        return {
          id,
          type,
          title: 'Purchase Order Created',
          message: `New PO ${data.order_number} created for ${data.quantity_ordered} units of SKU ${data.sku_id}`,
          timestamp,
          severity: 'success',
          data
        };

      case 'sales_order_created':
        return {
          id,
          type,
          title: 'Sales Order Created',
          message: `New sales order ${data.order.order_number} for ${data.order.customer_name} (${data.items.length} items)`,
          timestamp,
          severity: 'success',
          data
        };

      case 'production_job_order_created':
        return {
          id,
          type,
          title: 'Production Order Created',
          message: `New production order ${data.order.order_number} for ${data.order.quantity_planned} units of SKU ${data.order.sku_id}`,
          timestamp,
          severity: 'success',
          data
        };

      case 'automatic_reorder':
        return {
          id,
          type,
          title: 'Automatic Reorder Triggered',
          message: `Automatic reorder of ${data.quantity} units for SKU ${data.sku_id} due to ${data.trigger}`,
          timestamp,
          severity: 'info',
          data
        };

      default:
        return {
          id,
          type,
          title: 'System Notification',
          message: 'A system event occurred',
          timestamp,
          severity: 'info',
          data
        };
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'inventory_updated':
        return <Package className="h-4 w-4" />;
      case 'low_stock_alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'purchase_order_created':
        return <ShoppingCart className="h-4 w-4" />;
      case 'sales_order_created':
        return <ShoppingCart className="h-4 w-4" />;
      case 'production_job_order_created':
        return <Factory className="h-4 w-4" />;
      case 'automatic_reorder':
        return <Zap className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return `text-[#3997cd] bg-[#e6f2fa] border-[#3997cd]`;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative bg-white/50 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs text-white border-0" style={{backgroundColor: '#dc2626'}}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 bg-white border shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Real-time Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAll}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Real-time updates will appear here
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-[#e6f2fa]/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-full ${getSeverityColor(notification.severity)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: '#3997cd'}}></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp.toLocaleTimeString()} • {notification.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}