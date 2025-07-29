// Database utility functions for SQLite integration
// This module provides a clean interface for database operations

interface DBConfig {
  databasePath: string;
}

// Database connection and initialization
export class DatabaseManager {
  private dbPath: string;

  constructor(config: DBConfig) {
    this.dbPath = config.databasePath;
  }

  // Initialize database connection (for future server implementation)
  async initialize(): Promise<void> {
    try {
      // For now, we'll use localStorage as a bridge until server implementation
      console.log('Database manager initialized with path:', this.dbPath);
      
      // In production, this would:
      // 1. Connect to SQLite database
      // 2. Run schema migrations
      // 3. Verify database integrity
      // 4. Set up connection pooling
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  // Execute query (for future server implementation)
  async query(sql: string, params: any[] = []): Promise<any[]> {
    // Placeholder for actual database queries
    console.log('Executing query:', sql, 'with params:', params);
    return [];
  }
}

// Database models and types
export interface Brand {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SKU {
  id: number;
  sku_code: string;
  sku_name: string;
  brand_id?: number;
  category_id?: number;
  part_type_id?: number;
  sku_type: 'single' | 'kit';
  status: 'active' | 'upcoming' | 'discontinued';
  barcode?: string;
  unit_of_measure: string;
  bom_version?: string;
  launch_date?: string;
  discontinue_date?: string;
  unit_cost?: number;
  unit_price?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  brand?: Brand;
  category?: Category;
  part_type?: PartType;
  components?: SKUComponent[];
}

export interface SKUComponent {
  id: number;
  kit_sku_id: number;
  component_sku_id: number;
  quantity: number;
  created_at: string;
  
  // Related data
  component_sku?: SKU;
}

export interface Inventory {
  id: number;
  sku_id: number;
  warehouse_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  safety_stock_level: number;
  reorder_point: number;
  max_stock_level?: number;
  unit_cost?: number;
  last_count_date?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  sku?: SKU;
  warehouse?: Warehouse;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  manager_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductionOrder {
  id: number;
  order_number: string;
  sku_id: number;
  quantity_ordered: number;
  quantity_produced: number;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string;
  target_completion_date: string;
  actual_completion_date?: string;
  warehouse_id: number;
  shift: 'day' | 'evening' | 'night';
  supervisor?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  sku?: SKU;
  warehouse?: Warehouse;
}

export interface CustomerOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_type: 'distributor' | 'retailer' | 'service_center' | 'individual';
  contact_person: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  order_date: string;
  required_date: string;
  shipping_method: 'standard' | 'express' | 'overnight' | 'freight';
  payment_terms: 'cod' | 'net_30' | 'net_60' | 'prepaid';
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue';
  total_amount?: number;
  discount_percent?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  order_items?: CustomerOrderItem[];
}

export interface CustomerOrderItem {
  id: number;
  order_id: number;
  sku_id: number;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  line_total: number;
  created_at: string;
  
  // Related data
  sku?: SKU;
}

export interface Vendor {
  id: number;
  vendor_code: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'service_provider';
  contact_person: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  website?: string;
  tax_id?: string;
  payment_terms: 'cod' | 'net_30' | 'net_60' | 'net_90';
  currency: string;
  lead_time_days: number;
  minimum_order_amount?: number;
  quality_rating: number; // 1-5 scale
  delivery_rating: number; // 1-5 scale
  price_rating: number; // 1-5 scale
  status: 'active' | 'inactive' | 'pending_approval';
  certifications?: string[];
  specializations?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Data access layer - currently using localStorage with database-like structure
export class DataService {
  private static instance: DataService;
  
  private constructor() {}
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Initialize default data if not exists
  async initialize(): Promise<void> {
    try {
      await Promise.all([
        this.initializeBrands(),
        this.initializeCategories(),
        this.initializePartTypes(),
        this.initializeWarehouses()
      ]);
      
      console.log('DataService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DataService:', error);
      throw new Error('DataService initialization failed');
    }
  }

  private async initializeBrands(): Promise<void> {
    const existing = localStorage.getItem('brands');
    if (!existing) {
      const defaultBrands: Brand[] = [
        {
          id: 1,
          name: 'ACDelco',
          description: 'GM OEM and aftermarket automotive parts',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Bosch',
          description: 'Premium automotive technology and parts',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Motorcraft',
          description: 'Ford OEM parts and components',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Denso',
          description: 'Japanese automotive parts manufacturer',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'NGK',
          description: 'Spark plugs and ignition components',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          name: 'Monroe',
          description: 'Suspension and steering components',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 7,
          name: 'Moog',
          description: 'Chassis parts and suspension components',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 8,
          name: 'Brembo',
          description: 'High-performance brake systems',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 9,
          name: 'Mobil 1',
          description: 'Synthetic motor oils and lubricants',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 10,
          name: 'Castrol',
          description: 'Engine oils and automotive fluids',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 11,
          name: 'K&N',
          description: 'High-flow air filters and intake systems',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 12,
          name: 'Fram',
          description: 'Oil, air, and fuel filters',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 13,
          name: 'Wix',
          description: 'Premium filtration products',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 14,
          name: 'Champion',
          description: 'Spark plugs and ignition products',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 15,
          name: 'Delphi',
          description: 'Automotive electronics and fuel systems',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 16,
          name: 'Bilstein',
          description: 'Premium shock absorbers and struts',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 17,
          name: 'KYB',
          description: 'Shock absorbers and suspension parts',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 18,
          name: 'Gates',
          description: 'Belts, hoses, and fluid power products',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 19,
          name: 'Dayco',
          description: 'Belt drive systems and engine products',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 20,
          name: 'Aisin',
          description: 'Transmission and drivetrain components',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('brands', JSON.stringify(defaultBrands));
    }
  }

  private async initializeCategories(): Promise<void> {
    const existing = localStorage.getItem('categories');
    if (!existing) {
      const defaultCategories: Category[] = [
        { id: 1, name: 'Engine', description: 'Engine components and parts', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: 'Transmission', description: 'Transmission and drivetrain parts', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: 'Brake System', description: 'Braking system components', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: 'Electrical', description: 'Electrical system components', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: 'Suspension', description: 'Suspension and steering parts', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 6, name: 'Body Parts', description: 'Exterior body components', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 7, name: 'Interior', description: 'Interior components and trim', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 8, name: 'Filters', description: 'Air, oil, fuel, and cabin filters', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 9, name: 'Fluids', description: 'Automotive fluids and lubricants', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  }

  private async initializePartTypes(): Promise<void> {
    const existing = localStorage.getItem('part_types');
    if (!existing) {
      const defaultPartTypes: PartType[] = [
        { id: 1, name: 'Individual', description: 'Single part or component', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: 'Set of 2', description: 'Two-piece set', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: 'Set of 4', description: 'Four-piece set (wheels, brake pads, etc.)', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: 'Kit', description: 'Complete assembly kit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: 'Pair', description: 'Matched pair (left/right)', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 6, name: 'Bulk Pack', description: 'Bulk package of 10 units', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 7, name: 'Case', description: 'Case of 12 units', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 8, name: 'Pallet', description: 'Pallet quantity', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      localStorage.setItem('part_types', JSON.stringify(defaultPartTypes));
    }
  }

  private async initializeWarehouses(): Promise<void> {
    const existing = localStorage.getItem('warehouses');
    if (!existing) {
      const defaultWarehouses: Warehouse[] = [
        {
          id: 1,
          name: 'Main Auto Parts Warehouse',
          code: 'APW-001',
          address: '2450 Auto Parts Drive',
          city: 'Detroit',
          state: 'MI',
          zip_code: '48201',
          country: 'USA',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'West Coast Distribution Center',
          code: 'WDC-002',
          address: '1875 Parts Boulevard',
          city: 'Los Angeles',
          state: 'CA',
          zip_code: '90001',
          country: 'USA',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem('warehouses', JSON.stringify(defaultWarehouses));
    }
  }

  // CRUD operations for brands
  async getBrands(): Promise<Brand[]> {
    try {
      const brands = localStorage.getItem('brands');
      return brands ? JSON.parse(brands) : [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw new Error('Failed to fetch brands from storage');
    }
  }

  async getBrandById(id: number): Promise<Brand | null> {
    const brands = await this.getBrands();
    return brands.find(b => b.id === id) || null;
  }

  async createBrand(brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>): Promise<Brand> {
    const brands = await this.getBrands();
    const newId = Math.max(0, ...brands.map(b => b.id)) + 1;
    const newBrand: Brand = {
      ...brandData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    brands.push(newBrand);
    localStorage.setItem('brands', JSON.stringify(brands));
    return newBrand;
  }

  // CRUD operations for categories
  async getCategories(): Promise<Category[]> {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : [];
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const categories = await this.getCategories();
    return categories.find(c => c.id === id) || null;
  }

  // CRUD operations for part types
  async getPartTypes(): Promise<PartType[]> {
    const partTypes = localStorage.getItem('part_types');
    return partTypes ? JSON.parse(partTypes) : [];
  }

  async getPartTypeById(id: number): Promise<PartType | null> {
    const partTypes = await this.getPartTypes();
    return partTypes.find(pt => pt.id === id) || null;
  }

  // CRUD operations for SKUs
  async getSKUs(): Promise<SKU[]> {
    try {
      const skus = localStorage.getItem('skus_db');
      const parsedSKUs: SKU[] = skus ? JSON.parse(skus) : [];
      
      // Enrich with related data
      const [brands, categories, partTypes] = await Promise.all([
        this.getBrands(),
        this.getCategories(),
        this.getPartTypes()
      ]);
      
      return parsedSKUs.map(sku => ({
        ...sku,
        brand: sku.brand_id ? brands.find(b => b.id === sku.brand_id) : undefined,
        category: sku.category_id ? categories.find(c => c.id === sku.category_id) : undefined,
        part_type: sku.part_type_id ? partTypes.find(pt => pt.id === sku.part_type_id) : undefined
      }));
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      throw new Error('Failed to fetch SKUs from storage');
    }
  }

  async getSKUById(id: number): Promise<SKU | null> {
    const skus = await this.getSKUs();
    return skus.find(s => s.id === id) || null;
  }

  async createSKU(skuData: {
    sku_name: string;
    brand_id?: number;
    category_id?: number;
    part_type_id?: number;
    sku_type: 'single' | 'kit';
    status: 'active' | 'upcoming' | 'discontinued';
    barcode?: string;
    unit_of_measure: string;
    bom_version?: string;
    launch_date?: string;
    components?: { component_sku_id: number; quantity: number }[];
  }): Promise<SKU> {
    try {
      // Validation
      if (!skuData.sku_name?.trim()) {
        throw new Error('SKU name is required');
      }
      
      if (!skuData.unit_of_measure?.trim()) {
        throw new Error('Unit of measure is required');
      }

      // Check for duplicate barcode
      if (skuData.barcode) {
        const existingSKUs = await this.getSKUs();
        const duplicateBarcode = existingSKUs.find(sku => sku.barcode === skuData.barcode);
        if (duplicateBarcode) {
          throw new Error(`Barcode ${skuData.barcode} already exists for SKU: ${duplicateBarcode.sku_name}`);
        }
      }

      const skus = localStorage.getItem('skus_db');
      const existingSKUs: SKU[] = skus ? JSON.parse(skus) : [];
      
      const newId = Math.max(0, ...existingSKUs.map(s => s.id)) + 1;
      
      // Generate SKU code
      const [brand, category, partType] = await Promise.all([
        skuData.brand_id ? this.getBrandById(skuData.brand_id) : null,
        skuData.category_id ? this.getCategoryById(skuData.category_id) : null,
        skuData.part_type_id ? this.getPartTypeById(skuData.part_type_id) : null
      ]);
      
      const skuCode = `${brand?.name || 'UNK'}-${category?.name || 'UNK'}-${partType?.name || 'UNK'}-${newId.toString().padStart(3, '0')}`;
      
      const newSKU: SKU = {
        id: newId,
        sku_code: skuCode,
        sku_name: skuData.sku_name,
        brand_id: skuData.brand_id,
        category_id: skuData.category_id,
        part_type_id: skuData.part_type_id,
        sku_type: skuData.sku_type,
        status: skuData.status,
        barcode: skuData.barcode,
        unit_of_measure: skuData.unit_of_measure,
        bom_version: skuData.bom_version,
        launch_date: skuData.launch_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingSKUs.push(newSKU);
      localStorage.setItem('skus_db', JSON.stringify(existingSKUs));
      
      // Handle kit components
      if (skuData.sku_type === 'kit' && skuData.components) {
        if (skuData.components.length === 0) {
          throw new Error('Kit SKUs must have at least one component');
        }
        
        const components = localStorage.getItem('sku_components');
        const existingComponents: SKUComponent[] = components ? JSON.parse(components) : [];
        
        const newComponents = skuData.components.map((comp, index) => ({
          id: Math.max(0, ...existingComponents.map(c => c.id)) + index + 1,
          kit_sku_id: newId,
          component_sku_id: comp.component_sku_id,
          quantity: comp.quantity,
          created_at: new Date().toISOString()
        }));
        
        existingComponents.push(...newComponents);
        localStorage.setItem('sku_components', JSON.stringify(existingComponents));
      }
      
      // Initialize inventory for the new SKU
      await this.initializeInventoryForSKU(newId);
      
      return newSKU;
    } catch (error) {
      console.error('Error creating SKU:', error);
      if (error instanceof Error) {
        throw error; // Re-throw validation errors as-is
      }
      throw new Error('Failed to create SKU');
    }
  }

  private async initializeInventoryForSKU(skuId: number): Promise<void> {
    const inventory = localStorage.getItem('inventory');
    const existingInventory: Inventory[] = inventory ? JSON.parse(inventory) : [];
    
    // Create inventory record for main warehouse
    const mainWarehouse = (await this.getWarehouses())[0];
    if (mainWarehouse) {
      const newInventory: Inventory = {
        id: Math.max(0, ...existingInventory.map(i => i.id)) + 1,
        sku_id: skuId,
        warehouse_id: mainWarehouse.id,
        quantity_on_hand: 0,
        quantity_reserved: 0,
        quantity_available: 0,
        safety_stock_level: 50,
        reorder_point: 100,
        max_stock_level: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingInventory.push(newInventory);
      localStorage.setItem('inventory', JSON.stringify(existingInventory));
    }
  }

  // CRUD operations for warehouses
  async getWarehouses(): Promise<Warehouse[]> {
    const warehouses = localStorage.getItem('warehouses');
    return warehouses ? JSON.parse(warehouses) : [];
  }

  // CRUD operations for inventory
  async getInventory(): Promise<Inventory[]> {
    const inventory = localStorage.getItem('inventory');
    const parsedInventory: Inventory[] = inventory ? JSON.parse(inventory) : [];
    
    // Enrich with related data
    const skus = await this.getSKUs();
    const warehouses = await this.getWarehouses();
    
    return parsedInventory.map(inv => ({
      ...inv,
      sku: skus.find(s => s.id === inv.sku_id),
      warehouse: warehouses.find(w => w.id === inv.warehouse_id)
    }));
  }

  async getInventoryBySKU(skuId: number): Promise<Inventory[]> {
    const inventory = await this.getInventory();
    return inventory.filter(inv => inv.sku_id === skuId);
  }

  // Get SKU components for kit SKUs
  async getSKUComponents(kitSkuId: number): Promise<SKUComponent[]> {
    const components = localStorage.getItem('sku_components');
    const parsedComponents: SKUComponent[] = components ? JSON.parse(components) : [];
    
    const kitComponents = parsedComponents.filter(comp => comp.kit_sku_id === kitSkuId);
    
    // Enrich with component SKU data
    const skus = await this.getSKUs();
    return kitComponents.map(comp => ({
      ...comp,
      component_sku: skus.find(s => s.id === comp.component_sku_id)
    }));
  }

  // CRUD operations for production orders
  async getProductionOrders(): Promise<ProductionOrder[]> {
    const orders = localStorage.getItem('production_orders');
    const parsedOrders: ProductionOrder[] = orders ? JSON.parse(orders) : [];
    
    // Enrich with related data
    const skus = await this.getSKUs();
    const warehouses = await this.getWarehouses();
    
    return parsedOrders.map(order => ({
      ...order,
      sku: skus.find(s => s.id === order.sku_id),
      warehouse: warehouses.find(w => w.id === order.warehouse_id)
    }));
  }

  async createProductionOrder(orderData: {
    sku_id: number;
    quantity_ordered: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    start_date: string;
    target_completion_date: string;
    warehouse_id: number;
    shift: 'day' | 'evening' | 'night';
    supervisor?: string;
    notes?: string;
  }): Promise<ProductionOrder> {
    try {
      const orders = localStorage.getItem('production_orders');
      const existingOrders: ProductionOrder[] = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map(o => o.id)) + 1;
      const orderNumber = `PRO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const newOrder: ProductionOrder = {
        id: newId,
        order_number: orderNumber,
        sku_id: orderData.sku_id,
        quantity_ordered: orderData.quantity_ordered,
        quantity_produced: 0,
        status: 'planned',
        priority: orderData.priority,
        start_date: orderData.start_date,
        target_completion_date: orderData.target_completion_date,
        warehouse_id: orderData.warehouse_id,
        shift: orderData.shift,
        supervisor: orderData.supervisor,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('production_orders', JSON.stringify(existingOrders));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating production order:', error);
      throw new Error('Failed to create production order');
    }
  }

  // CRUD operations for customer orders
  async getCustomerOrders(): Promise<CustomerOrder[]> {
    const orders = localStorage.getItem('customer_orders');
    const parsedOrders: CustomerOrder[] = orders ? JSON.parse(orders) : [];
    
    // Enrich with order items
    const orderItems = await this.getCustomerOrderItems();
    
    return parsedOrders.map(order => ({
      ...order,
      order_items: orderItems.filter(item => item.order_id === order.id)
    }));
  }

  async getCustomerOrderItems(): Promise<CustomerOrderItem[]> {
    const items = localStorage.getItem('customer_order_items');
    const parsedItems: CustomerOrderItem[] = items ? JSON.parse(items) : [];
    
    // Enrich with SKU data
    const skus = await this.getSKUs();
    
    return parsedItems.map(item => ({
      ...item,
      sku: skus.find(s => s.id === item.sku_id)
    }));
  }

  async createCustomerOrder(orderData: {
    customer_name: string;
    customer_type: 'distributor' | 'retailer' | 'service_center' | 'individual';
    contact_person: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    priority: 'low' | 'medium' | 'high';
    required_date: string;
    shipping_method: 'standard' | 'express' | 'overnight' | 'freight';
    payment_terms: 'cod' | 'net_30' | 'net_60' | 'prepaid';
    discount_percent?: number;
    notes?: string;
    order_items: Array<{
      sku_id: number;
      quantity: number;
      unit_price: number;
      discount_percent?: number;
    }>;
  }): Promise<CustomerOrder> {
    try {
      const orders = localStorage.getItem('customer_orders');
      const existingOrders: CustomerOrder[] = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map(o => o.id)) + 1;
      const orderNumber = `ORD-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      // Calculate total amount
      const totalAmount = orderData.order_items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unit_price;
        const itemDiscount = (item.discount_percent || 0) / 100;
        return sum + (itemTotal * (1 - itemDiscount));
      }, 0);
      
      const orderDiscount = (orderData.discount_percent || 0) / 100;
      const finalTotal = totalAmount * (1 - orderDiscount);
      
      const newOrder: CustomerOrder = {
        id: newId,
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_type: orderData.customer_type,
        contact_person: orderData.contact_person,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        zip_code: orderData.zip_code,
        status: 'pending',
        priority: orderData.priority,
        order_date: new Date().toISOString().split('T')[0],
        required_date: orderData.required_date,
        shipping_method: orderData.shipping_method,
        payment_terms: orderData.payment_terms,
        payment_status: 'pending',
        total_amount: finalTotal,
        discount_percent: orderData.discount_percent,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('customer_orders', JSON.stringify(existingOrders));
      
      // Create order items
      const items = localStorage.getItem('customer_order_items');
      const existingItems: CustomerOrderItem[] = items ? JSON.parse(items) : [];
      
      const newItems = orderData.order_items.map((item, index) => {
        const itemTotal = item.quantity * item.unit_price;
        const itemDiscount = (item.discount_percent || 0) / 100;
        const lineTotal = itemTotal * (1 - itemDiscount);
        
        return {
          id: Math.max(0, ...existingItems.map(i => i.id)) + index + 1,
          order_id: newId,
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent,
          line_total: lineTotal,
          created_at: new Date().toISOString()
        };
      });
      
      existingItems.push(...newItems);
      localStorage.setItem('customer_order_items', JSON.stringify(existingItems));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating customer order:', error);
      throw new Error('Failed to create customer order');
    }
  }

  // CRUD operations for vendors
  async getVendors(): Promise<Vendor[]> {
    const vendors = localStorage.getItem('vendors');
    return vendors ? JSON.parse(vendors) : [];
  }

  async createVendor(vendorData: {
    name: string;
    type: 'manufacturer' | 'distributor' | 'service_provider';
    contact_person: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country: string;
    website?: string;
    tax_id?: string;
    payment_terms: 'cod' | 'net_30' | 'net_60' | 'net_90';
    currency: string;
    lead_time_days: number;
    minimum_order_amount?: number;
    certifications?: string[];
    specializations?: string[];
    notes?: string;
  }): Promise<Vendor> {
    try {
      const vendors = localStorage.getItem('vendors');
      const existingVendors: Vendor[] = vendors ? JSON.parse(vendors) : [];
      
      const newId = Math.max(0, ...existingVendors.map(v => v.id)) + 1;
      const vendorCode = `VEN-${newId.toString().padStart(4, '0')}`;
      
      const newVendor: Vendor = {
        id: newId,
        vendor_code: vendorCode,
        name: vendorData.name,
        type: vendorData.type,
        contact_person: vendorData.contact_person,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
        city: vendorData.city,
        state: vendorData.state,
        zip_code: vendorData.zip_code,
        country: vendorData.country,
        website: vendorData.website,
        tax_id: vendorData.tax_id,
        payment_terms: vendorData.payment_terms,
        currency: vendorData.currency,
        lead_time_days: vendorData.lead_time_days,
        minimum_order_amount: vendorData.minimum_order_amount,
        quality_rating: 3, // Default rating
        delivery_rating: 3, // Default rating
        price_rating: 3, // Default rating
        status: 'pending_approval',
        certifications: vendorData.certifications || [],
        specializations: vendorData.specializations || [],
        notes: vendorData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingVendors.push(newVendor);
      localStorage.setItem('vendors', JSON.stringify(existingVendors));
      
      return newVendor;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('Failed to create vendor');
    }
  }

  // Clear all data - useful for resetting the application
  async clearAllData(): Promise<void> {
    try {
      const keysToRemove = [
        'brands',
        'categories',
        'part_types',
        'warehouses',
        'skus_db',
        'sku_components',
        'inventory',
        'production_orders',
        'customer_orders',
        'customer_order_items',
        'vendors'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('All inventory data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear inventory data');
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
