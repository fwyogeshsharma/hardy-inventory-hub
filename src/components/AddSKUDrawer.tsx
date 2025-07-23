import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { skuStorage, SKURecord } from "@/lib/localStorage";

interface AddSKUDrawerProps {
  onSKUAdded: (sku: SKURecord) => void;
}

export function AddSKUDrawer({ onSKUAdded }: AddSKUDrawerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    skuName: "",
    brand: "",
    flavor: "",
    packSize: "",
    skuType: "single" as "single" | "kit",
    status: "active" as "active" | "upcoming" | "discontinued",
    barcode: "",
    unitOfMeasure: "",
    bomVersion: "",
    launchDate: undefined as Date | undefined,
  });
  
  const [componentSKUs, setComponentSKUs] = useState<{ skuId: string; quantity: number }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableSKUs = skuStorage.getAll().filter(sku => sku.skuType === 'single');
  const brands = ["HTWO", "Skhy", "Rallie"];
  const flavors = ["Lime", "Berry", "Peach", "Mixed", "Original", "Citrus", "Tropical"];
  const packSizes = ["330ml", "500ml", "1L", "4-pack", "6-pack", "12-pack"];
  const unitOfMeasures = ["Unit", "Liter", "Pack"];
  const statuses = ["active", "upcoming", "discontinued"];

  const generateBarcode = () => {
    const code = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setFormData(prev => ({ ...prev, barcode: code }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.skuName.trim()) newErrors.skuName = "SKU Name is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.flavor) newErrors.flavor = "Flavor is required";
    if (!formData.packSize) newErrors.packSize = "Pack Size is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required";
    if (!formData.unitOfMeasure) newErrors.unitOfMeasure = "Unit of Measure is required";
    if (!formData.launchDate) newErrors.launchDate = "Launch Date is required";
    
    if (formData.skuType === 'kit' && componentSKUs.length === 0) {
      newErrors.componentSKUs = "Kit SKUs must have at least one component";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSKU = skuStorage.add({
        skuName: formData.skuName,
        brand: formData.brand,
        flavor: formData.flavor,
        packSize: formData.packSize,
        skuType: formData.skuType,
        status: formData.status,
        barcode: formData.barcode,
        unitOfMeasure: formData.unitOfMeasure,
        bomVersion: formData.bomVersion || undefined,
        launchDate: formData.launchDate!.toISOString(),
        componentSKUs: formData.skuType === 'kit' ? componentSKUs : undefined,
      });

      onSKUAdded(newSKU);
      setOpen(false);
      
      // Reset form
      setFormData({
        skuName: "",
        brand: "",
        flavor: "",
        packSize: "",
        skuType: "single",
        status: "active",
        barcode: "",
        unitOfMeasure: "",
        bomVersion: "",
        launchDate: undefined,
      });
      setComponentSKUs([]);
      setErrors({});

      toast({
        title: "SKU Created",
        description: `${newSKU.skuName} has been successfully created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create SKU. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addComponentSKU = () => {
    setComponentSKUs([...componentSKUs, { skuId: "", quantity: 1 }]);
  };

  const removeComponentSKU = (index: number) => {
    setComponentSKUs(componentSKUs.filter((_, i) => i !== index));
  };

  const updateComponentSKU = (index: number, field: 'skuId' | 'quantity', value: string | number) => {
    const updated = [...componentSKUs];
    updated[index] = { ...updated[index], [field]: value };
    setComponentSKUs(updated);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New SKU
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Add New SKU</DrawerTitle>
            <DrawerDescription>
              Create a new SKU for the beverage inventory system.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* SKU Name */}
            <div className="space-y-2">
              <Label htmlFor="skuName">SKU Name *</Label>
              <Input
                id="skuName"
                value={formData.skuName}
                onChange={(e) => setFormData(prev => ({ ...prev, skuName: e.target.value }))}
                placeholder="e.g., HTWO Lime 330ml"
                className={errors.skuName ? "border-destructive" : ""}
              />
              {errors.skuName && <p className="text-sm text-destructive">{errors.skuName}</p>}
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                <SelectTrigger className={errors.brand ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
            </div>

            {/* Flavor */}
            <div className="space-y-2">
              <Label>Flavor *</Label>
              <Select value={formData.flavor} onValueChange={(value) => setFormData(prev => ({ ...prev, flavor: value }))}>
                <SelectTrigger className={errors.flavor ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select flavor" />
                </SelectTrigger>
                <SelectContent>
                  {flavors.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>{flavor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.flavor && <p className="text-sm text-destructive">{errors.flavor}</p>}
            </div>

            {/* Pack Size */}
            <div className="space-y-2">
              <Label>Pack Size *</Label>
              <Select value={formData.packSize} onValueChange={(value) => setFormData(prev => ({ ...prev, packSize: value }))}>
                <SelectTrigger className={errors.packSize ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select pack size" />
                </SelectTrigger>
                <SelectContent>
                  {packSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.packSize && <p className="text-sm text-destructive">{errors.packSize}</p>}
            </div>

            {/* SKU Type */}
            <div className="space-y-2">
              <Label>SKU Type *</Label>
              <RadioGroup
                value={formData.skuType}
                onValueChange={(value: "single" | "kit") => setFormData(prev => ({ ...prev, skuType: value }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single SKU</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kit" id="kit" />
                  <Label htmlFor="kit">Kit SKU</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "upcoming" | "discontinued") => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>

            {/* Barcode */}
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode *</Label>
              <div className="flex space-x-2">
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                  placeholder="Enter barcode"
                  className={cn("flex-1", errors.barcode ? "border-destructive" : "")}
                />
                <Button type="button" variant="outline" onClick={generateBarcode}>
                  Generate
                </Button>
              </div>
              {errors.barcode && <p className="text-sm text-destructive">{errors.barcode}</p>}
            </div>

            {/* Unit of Measure */}
            <div className="space-y-2">
              <Label>Unit of Measure *</Label>
              <Select value={formData.unitOfMeasure} onValueChange={(value) => setFormData(prev => ({ ...prev, unitOfMeasure: value }))}>
                <SelectTrigger className={errors.unitOfMeasure ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOfMeasures.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unitOfMeasure && <p className="text-sm text-destructive">{errors.unitOfMeasure}</p>}
            </div>

            {/* Launch Date */}
            <div className="space-y-2">
              <Label>Launch Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.launchDate && "text-muted-foreground",
                      errors.launchDate ? "border-destructive" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.launchDate ? format(formData.launchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.launchDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, launchDate: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.launchDate && <p className="text-sm text-destructive">{errors.launchDate}</p>}
            </div>

            {/* Component SKUs (for Kit SKU) */}
            {formData.skuType === 'kit' && (
              <div className="space-y-2">
                <Label>Component SKUs *</Label>
                {componentSKUs.map((component, index) => (
                  <div key={index} className="flex space-x-2 items-end">
                    <div className="flex-1">
                      <Select 
                        value={component.skuId} 
                        onValueChange={(value) => updateComponentSKU(index, 'skuId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SKU" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSKUs.map((sku) => (
                            <SelectItem key={sku.id} value={sku.id}>{sku.skuName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={component.quantity}
                        onChange={(e) => updateComponentSKU(index, 'quantity', parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                        min="1"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeComponentSKU(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addComponentSKU} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
                {errors.componentSKUs && <p className="text-sm text-destructive">{errors.componentSKUs}</p>}
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>Create SKU</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}