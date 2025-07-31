import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, User, MapPin, Globe, CreditCard, Award, Plus, X } from "lucide-react";
import { dataService } from "@/lib/database";
import { toast } from "sonner";

interface VendorFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const VendorForm: React.FC<VendorFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'manufacturer' as 'manufacturer' | 'distributor' | 'service_provider',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    website: '',
    tax_id: '',
    payment_terms: 'net_30' as 'cod' | 'net_30' | 'net_60' | 'net_90',
    currency: 'USD',
    lead_time_days: '',
    minimum_order_amount: '',
    notes: ''
  });

  const [certifications, setCertifications] = useState<string[]>(['']);
  const [specializations, setSpecializations] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    array: string[], 
    setArray: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number, 
    value: string
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (
    array: string[], 
    setArray: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.contact_person || !formData.lead_time_days) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.lead_time_days) <= 0) {
      toast.error('Lead time must be greater than 0');
      return;
    }

    if (formData.minimum_order_amount && parseFloat(formData.minimum_order_amount) < 0) {
      toast.error('Minimum order amount cannot be negative');
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredCertifications = certifications.filter(cert => cert.trim() !== '');
      const filteredSpecializations = specializations.filter(spec => spec.trim() !== '');

      await dataService.createVendor({
        name: formData.name,
        type: formData.type,
        contact_person: formData.contact_person,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zip_code: formData.zip_code || undefined,
        country: formData.country,
        website: formData.website || undefined,
        tax_id: formData.tax_id || undefined,
        payment_terms: formData.payment_terms,
        currency: formData.currency,
        lead_time_days: parseInt(formData.lead_time_days),
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : undefined,
        certifications: filteredCertifications.length > 0 ? filteredCertifications : undefined,
        specializations: filteredSpecializations.length > 0 ? filteredSpecializations : undefined,
        notes: formData.notes || undefined
      });

      toast.success('Vendor created successfully!');
      onSubmit();
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error('Failed to create vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVendorTypeColor = (type: string) => {
    switch (type) {
      case 'manufacturer': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'distributor': return 'bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]';
      case 'service_provider': return 'bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const commonCertifications = [
    'ISO 9001', 'ISO 14001', 'TS 16949', 'AS9100', 'ISO 45001',
    'IATF 16949', 'OHSAS 18001', 'QS-9000', 'VDA 6.1', 'Six Sigma'
  ];

  const commonSpecializations = [
    'Engine Components', 'Brake Systems', 'Electrical Parts', 'Transmission',
    'Suspension', 'Body Parts', 'Interior Components', 'Filters', 'Fluids',
    'Performance Parts', 'Heavy Duty Parts', 'OEM Parts', 'Aftermarket Parts'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #e6f2fa 0%, #f8fafc 100%)'}}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-2xl">
            <Building2 className="h-7 w-7 mr-3" style={{color: '#3997cd'}} />
            Add New Vendor
            <Badge className="ml-3 bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">
              New Vendor
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Company Information */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  Company Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center">
                  Vendor Type <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="manufacturer">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Manufacturer</Badge>
                        <span>Original parts manufacturer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="distributor">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">Distributor</Badge>
                        <span>Parts distributor/wholesaler</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="service_provider">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-[#e6f2fa] text-[#3997cd] border-[#3997cd]">Service Provider</Badge>
                        <span>Service/support provider</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    placeholder="Tax identification number"
                    value={formData.tax_id}
                    onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    placeholder="contact@vendor.com"
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
        </div>

        {/* Address */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Company Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Business Street"
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
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  placeholder="12345"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Terms */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
              Business Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="net_30">Net 30 Days</SelectItem>
                    <SelectItem value="net_60">Net 60 Days</SelectItem>
                    <SelectItem value="net_90">Net 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_time_days" className="flex items-center">
                  Lead Time (Days) <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="lead_time_days"
                  type="number"
                  min="1"
                  placeholder="7"
                  value={formData.lead_time_days}
                  onChange={(e) => handleInputChange('lead_time_days', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_order_amount">Min Order Amount</Label>
                <Input
                  id="minimum_order_amount"
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  value={formData.minimum_order_amount}
                  onChange={(e) => handleInputChange('minimum_order_amount', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Certifications
              </div>
              <Button 
                type="button" 
                onClick={() => addArrayItem(certifications, setCertifications)} 
                size="sm" 
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select 
                  value={cert} 
                  onValueChange={(value) => handleArrayChange(certifications, setCertifications, index, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select or type certification" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {commonCertifications.map((certification) => (
                      <SelectItem key={certification} value={certification}>
                        {certification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or type custom certification"
                  value={cert}
                  onChange={(e) => handleArrayChange(certifications, setCertifications, index, e.target.value)}
                  className="flex-1"
                />
                {certifications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(certifications, setCertifications, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                Specializations
              </div>
              <Button 
                type="button" 
                onClick={() => addArrayItem(specializations, setSpecializations)} 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {specializations.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select 
                  value={spec} 
                  onValueChange={(value) => handleArrayChange(specializations, setSpecializations, index, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select or type specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {commonSpecializations.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or type custom specialization"
                  value={spec}
                  onChange={(e) => handleArrayChange(specializations, setSpecializations, index, e.target.value)}
                  className="flex-1"
                />
                {specializations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(specializations, setSpecializations, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional information about this vendor..."
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Vendor will be created with pending approval status</span>
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="bg-white hover:bg-white"
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
                      Creating Vendor...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Create Vendor
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