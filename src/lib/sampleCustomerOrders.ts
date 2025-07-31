// Sample customer orders with realistic automotive parts data
import { dataService } from './database';

export const initializeCustomerOrdersData = async () => {
  try {
    console.log('🛒 Initializing customer orders data...');
    
    // Get existing SKUs to create realistic order items
    const skus = await dataService.getSKUs();
    if (skus.length === 0) {
      console.warn('No SKUs found. Customer orders will be created without items.');
      return false;
    }

    // Clear existing customer orders data
    localStorage.removeItem('customer_orders');
    localStorage.removeItem('customer_order_items');

    // Generate sample customer orders for the past 6 months
    const orders = [];
    const orderItems = [];
    const currentDate = new Date();
    let orderIdCounter = 1;
    let itemIdCounter = 1;

    // Generate 50 orders spread across 6 months
    for (let month = 5; month >= 0; month--) {
      const ordersThisMonth = Math.floor(Math.random() * 10) + 5; // 5-15 orders per month
      
      for (let i = 0; i < ordersThisMonth; i++) {
        const orderDate = new Date(currentDate);
        orderDate.setMonth(orderDate.getMonth() - month);
        orderDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        const requiredDate = new Date(orderDate);
        requiredDate.setDate(requiredDate.getDate() + Math.floor(Math.random() * 14) + 3);

        // Realistic customer data
        const customers = [
          { name: "AutoZone Distribution", type: "distributor", contact: "Mike Johnson" },
          { name: "NAPA Auto Parts", type: "distributor", contact: "Sarah Williams" },
          { name: "O'Reilly Auto Parts", type: "retailer", contact: "David Chen" },
          { name: "Advance Auto Parts", type: "retailer", contact: "Lisa Rodriguez" },
          { name: "Pep Boys Service Center", type: "service_center", contact: "Robert Kim" },
          { name: "Jiffy Lube", type: "service_center", contact: "Emma Thompson" },
          { name: "Midas Auto Repair", type: "service_center", contact: "John Smith" },
          { name: "Valvoline Instant Oil", type: "service_center", contact: "Maria Garcia" },
          { name: "Independent Garage LLC", type: "service_center", contact: "Tom Anderson" },
          { name: "Fleet Solutions Inc", type: "distributor", contact: "Jennifer Lee" }
        ];

        const customer = customers[Math.floor(Math.random() * customers.length)];
        
        const order = {
          id: orderIdCounter++,
          order_number: `ORD-${orderDate.getFullYear()}-${orderIdCounter.toString().padStart(4, '0')}`,
          customer_name: customer.name,
          customer_type: customer.type as 'distributor' | 'retailer' | 'service_center' | 'individual',
          contact_person: customer.contact,
          email: `${customer.contact.toLowerCase().replace(' ', '.')}@${customer.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          address: `${Math.floor(Math.random() * 9000) + 1000} Commerce St`,
          city: ["Detroit", "Chicago", "Atlanta", "Dallas", "Phoenix", "Los Angeles"][Math.floor(Math.random() * 6)],
          state: ["MI", "IL", "GA", "TX", "AZ", "CA"][Math.floor(Math.random() * 6)],
          zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
          status: Math.random() > 0.9 ? 'cancelled' : 
                  Math.random() > 0.8 ? 'pending' :
                  Math.random() > 0.6 ? 'processing' :
                  Math.random() > 0.3 ? 'shipped' : 'delivered',
          priority: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          order_date: orderDate.toISOString(),
          required_date: requiredDate.toISOString(),
          shipping_method: Math.random() > 0.7 ? 'express' : 
                          Math.random() > 0.4 ? 'standard' : 
                          Math.random() > 0.2 ? 'overnight' : 'freight',
          payment_terms: Math.random() > 0.6 ? 'net_30' : 
                        Math.random() > 0.3 ? 'net_60' : 
                        Math.random() > 0.1 ? 'prepaid' : 'cod',
          payment_status: Math.random() > 0.8 ? 'overdue' :
                         Math.random() > 0.6 ? 'partial' :
                         Math.random() > 0.2 ? 'pending' : 'paid',
          discount_percent: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0,
          notes: Math.random() > 0.5 ? "Standard shipping, handle with care" : undefined,
          created_at: orderDate.toISOString(),
          updated_at: orderDate.toISOString()
        };

        // Generate 2-8 order items per order
        const numItems = Math.floor(Math.random() * 7) + 2;
        const selectedSkus = [];
        let orderTotal = 0;

        for (let j = 0; j < numItems; j++) {
          // Select a random SKU that hasn't been used in this order
          let sku;
          let attempts = 0;
          do {
            sku = skus[Math.floor(Math.random() * skus.length)];
            attempts++;
          } while (selectedSkus.includes(sku.id) && attempts < 10);
          
          if (!selectedSkus.includes(sku.id)) {
            selectedSkus.push(sku.id);
            
            const quantity = Math.floor(Math.random() * 20) + 1;
            const basePrice = sku.unit_cost || 25; // Fallback if no unit cost
            const markup = customer.type === 'distributor' ? 1.25 : 
                          customer.type === 'retailer' ? 1.4 : 
                          customer.type === 'service_center' ? 1.5 : 1.6;
            const unitPrice = Math.round(basePrice * markup * 100) / 100;
            const itemDiscount = Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 5 : 0;
            
            const lineTotal = quantity * unitPrice * (1 - itemDiscount / 100);
            orderTotal += lineTotal;

            const orderItem = {
              id: itemIdCounter++,
              order_id: order.id,
              sku_id: sku.id,
              quantity: quantity,
              unit_price: unitPrice,
              discount_percent: itemDiscount,
              line_total: Math.round(lineTotal * 100) / 100,
              created_at: orderDate.toISOString(),
              updated_at: orderDate.toISOString()
            };

            orderItems.push(orderItem);
          }
        }

        // Apply order-level discount and set total
        const finalTotal = orderTotal * (1 - (order.discount_percent || 0) / 100);
        order.total_amount = Math.round(finalTotal * 100) / 100;

        orders.push(order);
      }
    }

    // Save to localStorage
    localStorage.setItem('customer_orders', JSON.stringify(orders));
    localStorage.setItem('customer_order_items', JSON.stringify(orderItems));

    console.log(`✅ Generated ${orders.length} customer orders with ${orderItems.length} order items`);
    console.log(`💰 Total revenue: $${orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing customer orders:', error);
    return false;
  }
};

// Helper function to get realistic pricing based on customer type
export const getCustomerPricing = (baseCost: number, customerType: string): number => {
  const markups = {
    distributor: 1.25,    // 25% markup for volume buyers
    retailer: 1.4,        // 40% markup for retail
    service_center: 1.5,  // 50% markup for service centers
    individual: 1.6       // 60% markup for individual customers
  };
  
  const markup = markups[customerType as keyof typeof markups] || 1.5;
  return Math.round(baseCost * markup * 100) / 100;
};

// Helper function to calculate order totals
export const calculateOrderTotal = (orderItems: any[], orderDiscount: number = 0): number => {
  const itemsTotal = orderItems.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unit_price;
    const itemDiscount = (item.discount_percent || 0) / 100;
    return sum + (itemTotal * (1 - itemDiscount));
  }, 0);
  
  return Math.round(itemsTotal * (1 - orderDiscount / 100) * 100) / 100;
};