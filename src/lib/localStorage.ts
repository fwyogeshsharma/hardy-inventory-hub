export interface SKURecord {
  id: string;
  skuName: string;
  brand: string;
  flavor: string;
  packSize: string;
  skuType: 'single' | 'kit';
  status: 'active' | 'upcoming' | 'discontinued';
  barcode: string;
  unitOfMeasure: string;
  bomVersion?: string;
  launchDate: string;
  componentSKUs?: { skuId: string; quantity: number }[];
  createdAt: string;
  updatedAt: string;
}

const SKU_STORAGE_KEY = 'hardy_beverages_skus';

export const skuStorage = {
  // Get all SKUs
  getAll(): SKURecord[] {
    const data = localStorage.getItem(SKU_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Add new SKU
  add(sku: Omit<SKURecord, 'id' | 'createdAt' | 'updatedAt'>): SKURecord {
    const skus = this.getAll();
    const newSKU: SKURecord = {
      ...sku,
      id: `sku_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    skus.push(newSKU);
    localStorage.setItem(SKU_STORAGE_KEY, JSON.stringify(skus));
    return newSKU;
  },

  // Update SKU
  update(id: string, updates: Partial<SKURecord>): SKURecord | null {
    const skus = this.getAll();
    const index = skus.findIndex(sku => sku.id === id);
    
    if (index === -1) return null;
    
    skus[index] = {
      ...skus[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(SKU_STORAGE_KEY, JSON.stringify(skus));
    return skus[index];
  },

  // Delete SKU
  delete(id: string): boolean {
    const skus = this.getAll();
    const filteredSKUs = skus.filter(sku => sku.id !== id);
    
    if (filteredSKUs.length === skus.length) return false;
    
    localStorage.setItem(SKU_STORAGE_KEY, JSON.stringify(filteredSKUs));
    return true;
  },

  // Get SKU by ID
  getById(id: string): SKURecord | null {
    const skus = this.getAll();
    return skus.find(sku => sku.id === id) || null;
  },

  // Get dropdown options
  getDropdownOptions() {
    const skus = this.getAll();
    return {
      brands: [...new Set(skus.map(sku => sku.brand))],
      flavors: [...new Set(skus.map(sku => sku.flavor))],
      packSizes: [...new Set(skus.map(sku => sku.packSize))],
    };
  }
};