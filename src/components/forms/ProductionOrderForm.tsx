import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Package, Factory, Users, Clock, AlertCircle } from "lucide-react";
import { dataService, SKU, Warehouse } from "@/lib/database";
import { toast } from "sonner";

interface ProductionOrderFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const ProductionOrderForm: React.FC<ProductionOrderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    sku_id: '',
    quantity_ordered: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    start_date: '',
    target_completion_date: '',
    warehouse_id: '',
    shift: 'day' as 'day' | 'evening' | 'night',
    supervisor: '',
    notes: ''
  });

  const [skus, setSKUs] = useState<SKU[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skusData, warehousesData] = await Promise.all([
          dataService.getSKUs(),
          dataService.getWarehouses()
        ]);
        setSKUs(skusData);
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load form data');
      }
    };

    loadData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'sku_id' && value) {
      const sku = skus.find(s => s.id === parseInt(value));
      setSelectedSKU(sku || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sku_id || !formData.quantity_ordered || !formData.start_date || 
        !formData.target_completion_date || !formData.warehouse_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.quantity_ordered) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.target_completion_date)) {
      toast.error('Target completion date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      await dataService.createProductionOrder({
        sku_id: parseInt(formData.sku_id),
        quantity_ordered: parseInt(formData.quantity_ordered),
        priority: formData.priority,
        start_date: formData.start_date,
        target_completion_date: formData.target_completion_date,
        warehouse_id: parseInt(formData.warehouse_id),
        shift: formData.shift,
        supervisor: formData.supervisor || undefined,
        notes: formData.notes || undefined
      });

      toast.success('Production order created successfully!');
      onSubmit();
    } catch (error) {
      console.error('Error creating production order:', error);
      toast.error('Failed to create production order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-[#3997cd] text-white';
      case 'high': return 'bg-[#3997cd] text-white';
      case 'medium': return 'bg-[#3997cd] text-white';
      case 'low': return 'bg-[#3997cd] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getShiftIcon = (shift: string) => {
    switch (shift) {
      case 'day': return '☀️';
      case 'evening': return '🌅';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #e6f2fa 0%, #f8fafc 100%)'}}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-2xl">
            <Factory className="h-7 w-7 mr-3 text-blue-500" />
            Create Production Order
            <Badge className="ml-3 bg-blue-100 text-blue-700 border-blue-200">
              New Order
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sku_id" className="flex items-center">
                  SKU Selection <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.sku_id} onValueChange={(value) => handleInputChange('sku_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a SKU to produce" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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

              {selectedSKU && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Selected SKU Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-blue-700 font-medium">Name:</span> {selectedSKU.sku_name}</div>
                    <div><span className="text-blue-700 font-medium">Brand:</span> {selectedSKU.brand?.name || 'N/A'}</div>
                    <div><span className="text-blue-700 font-medium">Category:</span> {selectedSKU.category?.name || 'N/A'}</div>
                    <div><span className="text-blue-700 font-medium">Status:</span> 
                      <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd] ml-1">
                        {selectedSKU.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="quantity_ordered" className="flex items-center">
                  Production Quantity <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="quantity_ordered"
                  type="number"
                  min="1"
                  placeholder="Enter quantity to produce"
                  value={formData.quantity_ordered}
                  onChange={(e) => handleInputChange('quantity_ordered', e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center">
                  Priority Level <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <Badge className="text-white" style={{backgroundColor: '#3997cd'}}>Low</Badge>
                        <span>Standard production</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-yellow-500 text-white">Medium</Badge>
                        <span>Normal priority</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-orange-500 text-white">High</Badge>
                        <span>High priority</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-500 text-white">Urgent</Badge>
                        <span>Rush order</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CalendarDays className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Schedule & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="flex items-center">
                  Start Date <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_completion_date" className="flex items-center">
                  Target Completion <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="target_completion_date"
                  type="date"
                  value={formData.target_completion_date}
                  onChange={(e) => handleInputChange('target_completion_date', e.target.value)}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse_id" className="flex items-center">
                  Production Warehouse <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.warehouse_id} onValueChange={(value) => handleInputChange('warehouse_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{warehouse.name}</span>
                          <span className="text-xs text-muted-foreground">{warehouse.code} - {warehouse.city}, {warehouse.state}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift" className="flex items-center">
                  Production Shift
                </Label>
                <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="day">
                      <div className="flex items-center space-x-2">
                        <span>{getShiftIcon('day')}</span>
                        <span>Day Shift (6 AM - 2 PM)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="evening">
                      <div className="flex items-center space-x-2">
                        <span>{getShiftIcon('evening')}</span>
                        <span>Evening Shift (2 PM - 10 PM)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="night">
                      <div className="flex items-center space-x-2">
                        <span>{getShiftIcon('night')}</span>
                        <span>Night Shift (10 PM - 6 AM)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor" className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Supervisor
                </Label>
                <Input
                  id="supervisor"
                  placeholder="Enter supervisor name (optional)"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Production Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any special instructions, quality requirements, or notes for this production order..."
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Order will be automatically assigned a production number</span>
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
                      <Factory className="h-4 w-4 mr-2" />
                      Create Production Order
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