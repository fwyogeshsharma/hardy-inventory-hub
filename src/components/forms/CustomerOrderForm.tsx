import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, User, MapPin, Package, DollarSign, Plus, Trash2, Calculator } from "lucide-react";
import { dataService, SKU } from "@/lib/database";
import { toast } from "sonner";

interface CustomerOrderFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

interface OrderItem {
  sku_id: string;
  quantity: string;
  unit_price: string;
  discount_percent: string;
}

export const CustomerOrderForm: React.FC<CustomerOrderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_type: 'distributor' as 'distributor' | 'retailer' | 'service_center' | 'individual',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    required_date: '',
    shipping_method: 'standard' as 'standard' | 'express' | 'overnight' | 'freight',
    payment_terms: 'net_30' as 'cod' | 'net_30' | 'net_60' | 'prepaid',
    discount_percent: '',
    notes: ''
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { sku_id: '', quantity: '', unit_price: '', discount_percent: '' }
  ]);

  const [skus, setSKUs] = useState<SKU[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSKUs = async () => {
      try {
        const skusData = await dataService.getSKUs();
        setSKUs(skusData);
      } catch (error) {
        console.error('Error loading SKUs:', error);
        toast.error('Failed to load SKU data');
      }
    };

    loadSKUs();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { sku_id: '', quantity: '', unit_price: '', discount_percent: '' }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const calculateItemTotal = (item: OrderItem) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unit_price) || 0;
    const discount = parseFloat(item.discount_percent) || 0;
    const subtotal = quantity * unitPrice;
    return subtotal * (1 - discount / 100);
  };

  const calculateOrderTotal = () => {
    const itemsTotal = orderItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const orderDiscount = parseFloat(formData.discount_percent) || 0;
    return itemsTotal * (1 - orderDiscount / 100);
  };

  const getSKUById = (id: string) => {
    return skus.find(sku => sku.id === parseInt(id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customer_name || !formData.contact_person || !formData.required_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validItems = orderItems.filter(item => 
      item.sku_id && item.quantity && item.unit_price
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one order item');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItemsData = validItems.map(item => ({
        sku_id: parseInt(item.sku_id),
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(item.unit_price),
        discount_percent: parseFloat(item.discount_percent) || undefined
      }));

      await dataService.createCustomerOrder({
        customer_name: formData.customer_name,
        customer_type: formData.customer_type,
        contact_person: formData.contact_person,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zip_code: formData.zip_code || undefined,
        priority: formData.priority,
        required_date: formData.required_date,
        shipping_method: formData.shipping_method,
        payment_terms: formData.payment_terms,
        discount_percent: parseFloat(formData.discount_percent) || undefined,
        notes: formData.notes || undefined,
        order_items: orderItemsData
      });

      toast.success('Customer order created successfully!');
      onSubmit();
    } catch (error) {
      console.error('Error creating customer order:', error);
      toast.error('Failed to create customer order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'distributor': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'retailer': return 'bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]';
      case 'service_center': return 'bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]';
      case 'individual': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #e6f2fa 0%, #f8fafc 100%)'}}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-2xl">
            <ShoppingCart className="h-7 w-7 mr-3" style={{color: '#3997cd'}} />
            Create Customer Order
            <Badge className="ml-3 bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">
              New Order
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Customer Information */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="flex items-center">
                  Customer Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="customer_name"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_type" className="flex items-center">
                  Customer Type <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.customer_type} onValueChange={(value) => handleInputChange('customer_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distributor">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Distributor</Badge>
                        <span>Large scale distribution</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="retailer">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">Retailer</Badge>
                        <span>Retail store/chain</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="service_center">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">Service Center</Badge>
                        <span>Auto repair/service</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="individual">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">Individual</Badge>
                        <span>Individual customer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_person" className="flex items-center">
                  Contact Person <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="contact_person"
                  placeholder="Enter contact person name"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="required_date" className="flex items-center">
                  Required Date <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="required_date"
                  type="date"
                  value={formData.required_date}
                  onChange={(e) => handleInputChange('required_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_method">Shipping Method</Label>
                <Select value={formData.shipping_method} onValueChange={(value) => handleInputChange('shipping_method', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                    <SelectItem value="express">Express (2-3 days)</SelectItem>
                    <SelectItem value="overnight">Overnight (1 day)</SelectItem>
                    <SelectItem value="freight">Freight (7-10 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="net_30">Net 30 Days</SelectItem>
                    <SelectItem value="net_60">Net 60 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Address */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                placeholder="12345"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Order Items
              </div>
              <Button type="button" onClick={addOrderItem} size="sm" className="text-white" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                <div className="grid gap-4 md:grid-cols-6 items-end">
                  <div className="md:col-span-2 space-y-2">
                    <Label>SKU</Label>
                    <Select 
                      value={item.sku_id} 
                      onValueChange={(value) => handleOrderItemChange(index, 'sku_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {skus.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{sku.sku_code}</span>
                              <span className="text-muted-foreground">- {sku.sku_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.unit_price}
                      onChange={(e) => handleOrderItemChange(index, 'unit_price', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={item.discount_percent}
                      onChange={(e) => handleOrderItemChange(index, 'discount_percent', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-semibold" style={{color: '#3997cd'}}>
                      ${calculateItemTotal(item).toFixed(2)}
                    </div>
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="discount_percent">Order Discount %</Label>
                  <Input
                    id="discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discount_percent}
                    onChange={(e) => handleInputChange('discount_percent', e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {calculateOrderTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any special instructions or notes for this order..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calculator className="h-4 w-4" />
                <span>Order total: ${calculateOrderTotal().toFixed(2)}</span>
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="bg-white/80 hover:bg-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Order...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Create Customer Order
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};