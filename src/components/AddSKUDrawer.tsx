import React, { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, Trash2, Package, Sparkles, Target, Users, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {dataService, Brand, SKU, Category, PartType} from "@/lib/database";
import { createSKUWithIntegration } from "./SKUIntegrationManager";

interface AddSKUDrawerProps {
  onSKUAdded: (sku: SKU) => void;
}

export function AddSKUDrawer({ onSKUAdded }: AddSKUDrawerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skuName: "",
    brandId: 0,
    categoryId: 0,
    partTypeId: 0,
    skuType: "single" as "single" | "kit",
    status: "active" as "active" | "upcoming" | "discontinued",
    barcode: "",
    unitOfMeasure: "Each",
    bomVersion: "",
    launchDate: undefined as Date | undefined,
  });
  
  const [componentSKUs, setComponentSKUs] = useState<{ component_sku_id: number; quantity: number }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Database-driven dropdown data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [partTypes, setPartTypes] = useState<PartType[]>([]);
  const [availableSKUs, setAvailableSKUs] = useState<SKU[]>([]);
  const unitOfMeasures = ["Each", "Set", "Pair", "Kit", "Box", "Piece", "Assembly", "Unit"];
  const statuses = ["active", "upcoming", "discontinued"];

  // Load dropdown data on component mount
  React.useEffect(() => {
    loadDropdownData();
  }, []);

  React.useEffect(() => {
    if (open) {
      loadDropdownData();
    }
  }, [open]);

  const loadDropdownData = async () => {
    try {
      // Load data from database service
      const [brandsData, categoriesData, partTypesData, skusData] = await Promise.all([
        dataService.getBrands(),
        dataService.getCategories(),
        dataService.getPartTypes(),
        dataService.getSKUs(),
      ]);

      setBrands(brandsData.filter(b => b.is_active));
      setCategories(categoriesData.filter(c => c.is_active));
      setPartTypes(partTypesData.filter(pt => pt.is_active));
      setAvailableSKUs(skusData.filter(s => s.sku_type === 'single' && s.status === 'active'));
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  const generateBarcode = () => {
    const code = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setFormData(prev => ({ ...prev, barcode: code }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.skuName.trim()) newErrors.skuName = "SKU Name is required";
    if (!formData.brandId || formData.brandId === 0) newErrors.brandId = "Brand is required";
    if (!formData.categoryId || formData.categoryId === 0) newErrors.categoryId = "Category is required";
    if (!formData.partTypeId || formData.partTypeId === 0) newErrors.partTypeId = "Part Type is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required";
    if (!formData.unitOfMeasure) newErrors.unitOfMeasure = "Unit of Measure is required";
    if (!formData.launchDate) newErrors.launchDate = "Launch Date is required";

    if (formData.skuType === 'kit' && componentSKUs.length === 0) {
      newErrors.componentSKUs = "Kit SKUs must have at least one component";
    }

    // Validate kit components
    if (formData.skuType === 'kit') {
      componentSKUs.forEach((comp, index) => {
        if (!comp.component_sku_id || comp.component_sku_id === 0) {
          newErrors[`component_${index}`] = "Please select a component SKU";
        }
        if (!comp.quantity || comp.quantity < 1) {
          newErrors[`quantity_${index}`] = "Quantity must be at least 1";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newSKU = await createSKUWithIntegration({
        sku_name: formData.skuName,
        brand_id: formData.brandId,
        category_id: formData.categoryId,
        part_type_id: formData.partTypeId,
        sku_type: formData.skuType,
        status: formData.status,
        barcode: formData.barcode,
        unit_of_measure: formData.unitOfMeasure,
        bom_version: formData.bomVersion || undefined,
        launch_date: formData.launchDate!.toISOString().split('T')[0], // Store as date only
        components: formData.skuType === 'kit' ? componentSKUs : undefined,
      });

      onSKUAdded(newSKU);
      setOpen(false);

      // Reset form
      setFormData({
        skuName: "",
        brandId: 0,
        categoryId: 0,
        partTypeId: 0,
        skuType: "single",
        status: "active",
        barcode: "",
        unitOfMeasure: "Each",
        bomVersion: "",
        launchDate: undefined,
      });
      setComponentSKUs([]);
      setErrors({});

      toast({
        title: "Part Added Successfully! 🎉",
        description: `${newSKU.sku_name} (${newSKU.sku_code}) is now available across all modules - Inventory, Orders, and Production.`,
      });
    } catch (error) {
      console.error('Error creating SKU:', error);
      toast({
        title: "Error",
        description: "Failed to create SKU. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComponentSKU = () => {
    setComponentSKUs([...componentSKUs, { component_sku_id: 0, quantity: 1 }]);
  };

  const removeComponentSKU = (index: number) => {
    setComponentSKUs(componentSKUs.filter((_, i) => i !== index));
  };

  const updateComponentSKU = (index: number, field: 'component_sku_id' | 'quantity', value: string | number) => {
    const updated = [...componentSKUs];
    if (field === 'component_sku_id') {
      updated[index] = { ...updated[index], [field]: parseInt(value as string) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value as number };
    }
    setComponentSKUs(updated);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}>
          <Plus className="h-4 w-4 mr-2" />
          Add New SKU
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[92vh] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <DrawerTitle className="text-2xl font-bold" style={{color: '#3997cd'}}>
              Create New SKU
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 text-lg">
              Add a new automotive part to your inventory management system
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Basic Product Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                  Basic Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SKU Name */}
                  <div className="space-y-2">
                    <Label htmlFor="skuName" className="text-sm font-semibold text-gray-700">SKU Name *</Label>
                    <Input
                      id="skuName"
                      value={formData.skuName}
                      onChange={(e) => setFormData(prev => ({ ...prev, skuName: e.target.value }))}
                      placeholder="e.g., ACDelco Brake Pads"
                      className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all",
                        errors.skuName ? "border-red-500 focus:border-red-500" : ""
                      )}
                    />
                    {errors.skuName && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.skuName}</p>}
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Brand *</Label>
                    <Select value={formData.brandId.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: parseInt(value) }))}>
                      <SelectTrigger className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 transition-all h-11 text-left",
                        errors.brandId ? "border-red-500" : ""
                      )}>
                        <SelectValue placeholder="Select brand...">
                          {formData.brandId > 0 && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-bold">
                                  {brands.find(b => b.id === formData.brandId)?.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium">{brands.find(b => b.id === formData.brandId)?.name}</span>
                            </div>
                          )}
                        </SelectValue>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-white border border-gray-200 shadow-lg">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Available Brands</div>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()} className="h-12 cursor-pointer">
                              <div className="flex items-center space-x-3 py-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">{brand.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{brand.name}</div>
                                  {brand.description && (
                                    <div className="text-xs text-gray-500">{brand.description}</div>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.brandId && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.brandId}</p>}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Category *</Label>
                    <Select value={formData.categoryId.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}>
                      <SelectTrigger className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 transition-all h-11",
                        errors.categoryId ? "border-red-500" : ""
                      )}>
                        <SelectValue placeholder="Select category...">
                          {formData.categoryId > 0 && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-bold">
                                  {categories.find(c => c.id === formData.categoryId)?.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium">{categories.find(c => c.id === formData.categoryId)?.name}</span>
                            </div>
                          )}
                        </SelectValue>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-white border border-gray-200 shadow-lg">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Available Categories</div>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()} className="h-10 cursor-pointer">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{category.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{category.name}</div>
                                  {category.description && (
                                    <div className="text-xs text-gray-500">{category.description}</div>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.categoryId}</p>}
                  </div>

                  {/* Part Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Part Type *</Label>
                    <Select value={formData.partTypeId.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, partTypeId: parseInt(value) }))}>
                      <SelectTrigger className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 transition-all h-11",
                        errors.partTypeId ? "border-red-500" : ""
                      )}>
                        <SelectValue placeholder="Select part type...">
                          {formData.partTypeId > 0 && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mr-2">
                                <Package className="h-3 w-3 text-white" />
                              </div>
                              <span className="font-medium">{partTypes.find(pt => pt.id === formData.partTypeId)?.name}</span>
                            </div>
                          )}
                        </SelectValue>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-white border border-gray-200 shadow-lg">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Available Part Types</div>
                          {partTypes.map((partType) => (
                            <SelectItem key={partType.id} value={partType.id.toString()} className="h-12 cursor-pointer">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{partType.name}</div>
                                    {partType.description && (
                                      <div className="text-xs text-gray-500">{partType.description}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    {errors.partTypeId && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.partTypeId}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SKU Configuration */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                  SKU Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SKU Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">SKU Type *</Label>
                    <RadioGroup
                      value={formData.skuType}
                      onValueChange={(value: "single" | "kit") => setFormData(prev => ({ ...prev, skuType: value }))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="single" id="single" className="text-blue-600" />
                        <div className="flex-1">
                          <Label htmlFor="single" className="font-medium cursor-pointer">Single SKU</Label>
                          <p className="text-xs text-gray-500">Individual product</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                        <RadioGroupItem value="kit" id="kit" className="text-blue-600" />
                        <div className="flex-1">
                          <Label htmlFor="kit" className="font-medium cursor-pointer">Kit SKU</Label>
                          <p className="text-xs text-gray-500">Bundle of products</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: "active" | "upcoming" | "discontinued") => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 transition-all",
                        errors.status ? "border-red-500" : ""
                      )}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center">
                              <Badge
                                className={cn(
                                  "mr-2 text-xs",
                                  status === "active" ? "bg-green-100 text-green-700" :
                                  status === "upcoming" ? "bg-blue-100 text-blue-700" :
                                  "bg-gray-100 text-gray-700"
                                )}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.status}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Barcode */}
                  <div className="space-y-2">
                    <Label htmlFor="barcode" className="text-sm font-semibold text-gray-700">Barcode *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                        placeholder="Enter barcode"
                        className={cn(
                          "flex-1 bg-white/80 border-gray-200 focus:border-blue-500 transition-all",
                          errors.barcode ? "border-red-500" : ""
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateBarcode}
                        className="hover:bg-blue-100" style={{backgroundColor: '#e6f2fa', borderColor: '#3997cd', color: '#3997cd'}}
                      >
                        Generate
                      </Button>
                    </div>
                    {errors.barcode && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.barcode}</p>}
                  </div>

                  {/* Unit of Measure */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Unit of Measure *</Label>
                    <Select value={formData.unitOfMeasure} onValueChange={(value) => setFormData(prev => ({ ...prev, unitOfMeasure: value }))}>
                      <SelectTrigger className={cn(
                        "bg-white/80 border-gray-200 focus:border-blue-500 transition-all",
                        errors.unitOfMeasure ? "border-red-500" : ""
                      )}>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {unitOfMeasures.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.unitOfMeasure && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.unitOfMeasure}</p>}
                  </div>

                  {/* Launch Date */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">Launch Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full md:w-auto justify-start text-left font-normal bg-white/80 border-gray-200 focus:border-blue-500 transition-all",
                            !formData.launchDate && "text-gray-500",
                            errors.launchDate ? "border-red-500" : ""
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.launchDate ? format(formData.launchDate, "PPP") : "Pick a launch date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.launchDate}
                          onSelect={(date) => setFormData(prev => ({ ...prev, launchDate: date }))}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.launchDate && <p className="text-sm text-red-500 flex items-center"><Target className="h-3 w-3 mr-1" />{errors.launchDate}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Component SKUs (for Kit SKU) */}
            {formData.skuType === 'kit' && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                    Component SKUs
                    <Badge variant="outline" className="ml-2 text-xs" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                      {componentSKUs.length} components
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {componentSKUs.map((component, index) => (
                      <div key={index} className="flex space-x-3 items-end p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Component SKU</Label>
                          <Select 
                            value={component.component_sku_id.toString()} 
                            onValueChange={(value) => updateComponentSKU(index, 'component_sku_id', value)}
                          >
                            <SelectTrigger className="bg-white border-gray-200 h-10">
                              <SelectValue placeholder="Select a component SKU">
                                {component.component_sku_id > 0 && (
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2 text-xs">
                                      {availableSKUs.find(s => s.id === component.component_sku_id)?.brand?.name}
                                    </Badge>
                                    {availableSKUs.find(s => s.id === component.component_sku_id)?.sku_name}
                                  </div>
                                )}
                              </SelectValue>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] bg-white border border-gray-200 shadow-lg">
                              <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 mb-2 px-2">Available SKUs</div>
                                {availableSKUs.map((sku) => (
                                  <SelectItem key={sku.id} value={sku.id.toString()} className="h-12 cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{sku.brand?.name?.charAt(0) || 'S'}</span>
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{sku.sku_name}</div>
                                        <div className="text-xs text-gray-500">
                                          {sku.brand?.name} • {sku.category?.name} • {sku.part_type?.name}
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Qty</Label>
                          <Input
                            type="number"
                            value={component.quantity}
                            onChange={(e) => updateComponentSKU(index, 'quantity', parseInt(e.target.value) || 1)}
                            placeholder="1"
                            min="1"
                            className="bg-white border-gray-200"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeComponentSKU(index)}
                          className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {componentSKUs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm">No components added yet</p>
                        <p className="text-xs text-gray-400">Kit SKUs require at least one component</p>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addComponentSKU} 
                      className="w-full hover:bg-blue-100" style={{backgroundColor: '#e6f2fa', borderColor: '#3997cd', color: '#3997cd'}}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Component SKU
                    </Button>
                    {errors.componentSKUs && <p className="text-sm text-red-500 flex items-center mt-2"><Target className="h-3 w-3 mr-1" />{errors.componentSKUs}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DrawerFooter className="pt-6 pb-6 px-6 bg-white/50 backdrop-blur-sm border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Create SKU
                  </>
                )}
              </Button>
              <DrawerClose asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white/80 border-gray-300 hover:bg-gray-50"
                  size="lg"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center text-xs text-gray-500">
              All fields marked with * are required
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}