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
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
  } | {
    flavor_id: number;
    pack_size_id: number;
    sku_type: string;
    unit_of_measure: string;
    sku_name: string;
    launch_date: string;
    barcode: string;
    brand_id: number;
    status: string
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
        'inventory_transactions',
        'production_orders',
        'production_job_orders',
        'customer_orders',
        'customer_order_items',
        'sales_orders',
        'sales_order_items',
        'purchase_orders',
        'vendors',
        'alerts'
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

// Real-time inventory management functions
export class InventoryManager {
  private static instance: InventoryManager;
  private dataService: DataService;
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();
  
  private constructor() {
    this.dataService = DataService.getInstance();
  }
  
  public static getInstance(): InventoryManager {
    if (!InventoryManager.instance) {
      InventoryManager.instance = new InventoryManager();
    }
    return InventoryManager.instance;
  }

  // Event subscription for real-time updates
  subscribe(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // Emit events for real-time updates
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Update inventory levels and trigger workflows
  async updateInventoryLevel(skuId: number, warehouseId: number, quantityChange: number, transactionType: string, referenceId?: number): Promise<void> {
    try {
      // Get current inventory
      const inventory = await this.dataService.getInventory();
      const inventoryRecord = inventory.find(inv => inv.sku_id === skuId && inv.warehouse_id === warehouseId);
      
      if (!inventoryRecord) {
        throw new Error(`Inventory record not found for SKU ${skuId} in warehouse ${warehouseId}`);
      }

      // Update inventory levels
      const updatedInventory = inventory.map(inv => {
        if (inv.sku_id === skuId && inv.warehouse_id === warehouseId) {
          const newQuantity = Math.max(0, inv.quantity_on_hand + quantityChange);
          return {
            ...inv,
            quantity_on_hand: newQuantity,
            quantity_available: newQuantity - inv.quantity_reserved,
            updated_at: new Date().toISOString()
          };
        }
        return inv;
      });

      localStorage.setItem('inventory', JSON.stringify(updatedInventory));

      // Create inventory transaction record
      await this.createInventoryTransaction({
        sku_id: skuId,
        warehouse_id: warehouseId,
        transaction_type: transactionType as any,
        quantity: quantityChange,
        reference_id: referenceId,
        notes: `Inventory ${transactionType} - Quantity: ${quantityChange}`
      });

      const updatedRecord = updatedInventory.find(inv => inv.sku_id === skuId && inv.warehouse_id === warehouseId)!;
      
      // Check for low stock alerts
      await this.checkLowStockAlerts(updatedRecord);
      
      // Emit real-time update event
      this.emit('inventory_updated', {
        sku_id: skuId,
        warehouse_id: warehouseId,
        old_quantity: inventoryRecord.quantity_on_hand,
        new_quantity: updatedRecord.quantity_on_hand,
        transaction_type: transactionType
      });

    } catch (error) {
      console.error('Error updating inventory level:', error);
      throw error;
    }
  }

  // Create inventory transaction
  async createInventoryTransaction(transactionData: {
    sku_id: number;
    warehouse_id: number;
    transaction_type: 'receipt' | 'shipment' | 'adjustment' | 'transfer' | 'production' | 'return' | 'damage' | 'cycle_count';
    quantity: number;
    reference_id?: number;
    unit_cost?: number;
    notes?: string;
  }): Promise<void> {
    try {
      const transactions = localStorage.getItem('inventory_transactions');
      const existingTransactions = transactions ? JSON.parse(transactions) : [];
      
      const newTransaction = {
        id: Math.max(0, ...existingTransactions.map((t: any) => t.id)) + 1,
        sku_id: transactionData.sku_id,
        warehouse_id: transactionData.warehouse_id,
        transaction_type: transactionData.transaction_type,
        quantity: transactionData.quantity,
        reference_id: transactionData.reference_id,
        unit_cost: transactionData.unit_cost,
        notes: transactionData.notes,
        created_at: new Date().toISOString()
      };
      
      existingTransactions.push(newTransaction);
      localStorage.setItem('inventory_transactions', JSON.stringify(existingTransactions));
      
      // Emit transaction event
      this.emit('transaction_created', newTransaction);
      
    } catch (error) {
      console.error('Error creating inventory transaction:', error);
      throw error;
    }
  }

  // Check for low stock and trigger alerts/reorders
  async checkLowStockAlerts(inventoryRecord: Inventory): Promise<void> {
    try {
      if (inventoryRecord.quantity_available <= inventoryRecord.reorder_point) {
        // Create alert
        await this.createAlert({
          alert_type: inventoryRecord.quantity_available === 0 ? 'out_of_stock' : 'low_stock',
          title: inventoryRecord.quantity_available === 0 ? 'Out of Stock Alert' : 'Low Stock Alert',
          message: `SKU ${inventoryRecord.sku_id} is ${inventoryRecord.quantity_available === 0 ? 'out of stock' : 'below reorder point'}. Current: ${inventoryRecord.quantity_available}, Reorder Point: ${inventoryRecord.reorder_point}`,
          severity: inventoryRecord.quantity_available === 0 ? 'critical' : 'high',
          entity_type: 'inventory',
          entity_id: inventoryRecord.id
        });

        // Trigger automatic reorder if enabled
        if (inventoryRecord.quantity_available <= inventoryRecord.reorder_point) {
          await this.triggerAutomaticReorder(inventoryRecord);
        }

        // Emit low stock event
        this.emit('low_stock_alert', {
          inventory_record: inventoryRecord,
          is_out_of_stock: inventoryRecord.quantity_available === 0
        });
      }
    } catch (error) {
      console.error('Error checking low stock alerts:', error);
    }
  }

  // Create system alert
  async createAlert(alertData: {
    alert_type: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    entity_type?: string;
    entity_id?: number;
  }): Promise<void> {
    try {
      const alerts = localStorage.getItem('alerts');
      const existingAlerts = alerts ? JSON.parse(alerts) : [];
      
      const newAlert = {
        id: Math.max(0, ...existingAlerts.map((a: any) => a.id)) + 1,
        alert_type: alertData.alert_type,
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity,
        entity_type: alertData.entity_type,
        entity_id: alertData.entity_id,
        is_read: false,
        is_resolved: false,
        created_at: new Date().toISOString()
      };
      
      existingAlerts.push(newAlert);
      localStorage.setItem('alerts', JSON.stringify(existingAlerts));
      
      // Emit alert event
      this.emit('alert_created', newAlert);
      
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  // Trigger automatic reorder (create purchase order)
  async triggerAutomaticReorder(inventoryRecord: Inventory): Promise<void> {
    try {
      const sku = await this.dataService.getSKUById(inventoryRecord.sku_id);
      if (!sku) return;

      // Calculate reorder quantity (simple logic: bring to max stock level)
      const reorderQuantity = (inventoryRecord.max_stock_level || 1000) - inventoryRecord.quantity_on_hand;
      
      if (reorderQuantity > 0) {
        // Create purchase order (simplified)
        await this.createPurchaseOrder({
          sku_id: inventoryRecord.sku_id,
          warehouse_id: inventoryRecord.warehouse_id,
          quantity: reorderQuantity,
          priority: 'high',
          notes: `Automatic reorder triggered by low stock. Current: ${inventoryRecord.quantity_available}, Reorder Point: ${inventoryRecord.reorder_point}`
        });

        // Emit reorder event
        this.emit('automatic_reorder', {
          sku_id: inventoryRecord.sku_id,
          warehouse_id: inventoryRecord.warehouse_id,
          quantity: reorderQuantity,
          trigger: 'low_stock'
        });
      }
    } catch (error) {
      console.error('Error triggering automatic reorder:', error);
    }
  }

  // Create purchase order
  async createPurchaseOrder(orderData: {
    sku_id: number;
    warehouse_id: number;
    quantity: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    vendor_id?: number;
    notes?: string;
  }): Promise<any> {
    try {
      const orders = localStorage.getItem('purchase_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `PO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const newOrder = {
        id: newId,
        order_number: orderNumber,
        sku_id: orderData.sku_id,
        warehouse_id: orderData.warehouse_id,
        quantity_ordered: orderData.quantity,
        quantity_received: 0,
        status: 'pending',
        priority: orderData.priority,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        vendor_id: orderData.vendor_id,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('purchase_orders', JSON.stringify(existingOrders));
      
      // Emit purchase order event
      this.emit('purchase_order_created', newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  // Process purchase order receipt (increase inventory)
  async processPurchaseOrderReceipt(orderId: number, quantityReceived: number): Promise<void> {
    try {
      const orders = localStorage.getItem('purchase_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Purchase order ${orderId} not found`);
      }

      const order = existingOrders[orderIndex];
      
      // Update order status
      const updatedQuantityReceived = order.quantity_received + quantityReceived;
      existingOrders[orderIndex] = {
        ...order,
        quantity_received: updatedQuantityReceived,
        status: updatedQuantityReceived >= order.quantity_ordered ? 'completed' : 'partial',
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('purchase_orders', JSON.stringify(existingOrders));
      
      // Increase inventory
      await this.updateInventoryLevel(
        order.sku_id,
        order.warehouse_id,
        quantityReceived,
        'receipt',
        orderId
      );
      
      // Emit receipt event
      this.emit('purchase_order_received', {
        order_id: orderId,
        quantity_received: quantityReceived,
        order_status: existingOrders[orderIndex].status
      });
      
    } catch (error) {
      console.error('Error processing purchase order receipt:', error);
      throw error;
    }
  }

  // Get real-time inventory status
  async getInventoryStatus(): Promise<{
    total_skus: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_value: number;
    pending_orders: number;
    alerts: any[];
  }> {
    try {
      const [inventory, alerts, purchaseOrders] = await Promise.all([
        this.dataService.getInventory(),
        this.getAlerts(),
        this.getPurchaseOrders()
      ]);

      const lowStockItems = inventory.filter(inv => 
        inv.quantity_available <= inv.safety_stock_level && inv.quantity_available > 0
      ).length;
      
      const outOfStockItems = inventory.filter(inv => 
        inv.quantity_available === 0
      ).length;
      
      const totalValue = inventory.reduce((sum, inv) => 
        sum + (inv.quantity_on_hand * (inv.unit_cost || 0)), 0
      );
      
      const pendingOrders = purchaseOrders.filter((po: any) => 
        po.status === 'pending' || po.status === 'partial'
      ).length;
      
      const unreadAlerts = alerts.filter(alert => !alert.is_read);

      return {
        total_skus: inventory.length,
        low_stock_items: lowStockItems,
        out_of_stock_items: outOfStockItems,
        total_value: totalValue,
        pending_orders: pendingOrders,
        alerts: unreadAlerts
      };
    } catch (error) {
      console.error('Error getting inventory status:', error);
      throw error;
    }
  }

  // Get alerts
  async getAlerts(): Promise<any[]> {
    const alerts = localStorage.getItem('alerts');
    return alerts ? JSON.parse(alerts) : [];
  }

  // Get purchase orders
  async getPurchaseOrders(): Promise<any[]> {
    const orders = localStorage.getItem('purchase_orders');
    return orders ? JSON.parse(orders) : [];
  }

  // Sales Order workflow methods
  async createSalesOrder(orderData: {
    customer_name: string;
    customer_type: 'distributor' | 'retailer' | 'service_center' | 'individual';
    contact_person: string;
    email?: string;
    phone?: string;
    priority: 'low' | 'medium' | 'high';
    required_date: string;
    shipping_method: 'standard' | 'express' | 'overnight' | 'freight';
    payment_terms: 'cod' | 'net_30' | 'net_60' | 'prepaid';
    order_items: Array<{
      sku_id: number;
      quantity: number;
      unit_price: number;
    }>;
    notes?: string;
  }): Promise<any> {
    try {
      // First, check stock availability for all items
      const inventory = await this.dataService.getInventory();
      const stockCheckResults = [];
      
      for (const item of orderData.order_items) {
        const skuInventory = inventory.find(inv => inv.sku_id === item.sku_id);
        if (!skuInventory || skuInventory.quantity_available < item.quantity) {
          stockCheckResults.push({
            sku_id: item.sku_id,
            requested: item.quantity,
            available: skuInventory?.quantity_available || 0,
            insufficient: true
          });
        } else {
          stockCheckResults.push({
            sku_id: item.sku_id,
            requested: item.quantity,
            available: skuInventory.quantity_available,
            insufficient: false
          });
        }
      }
      
      // If any items have insufficient stock, create backorder suggestions
      const insufficientItems = stockCheckResults.filter(item => item.insufficient);
      if (insufficientItems.length > 0) {
        // Create alerts for insufficient stock
        for (const item of insufficientItems) {
          await this.createAlert({
            alert_type: 'insufficient_stock_for_order',
            title: 'Insufficient Stock for Sales Order',
            message: `Insufficient stock for SKU ${item.sku_id}. Requested: ${item.requested}, Available: ${item.available}`,
            severity: 'high',
            entity_type: 'inventory',
            entity_id: item.sku_id
          });
        }
      }
      
      // Create the sales order
      const orders = localStorage.getItem('sales_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `SO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      // Calculate total amount
      const totalAmount = orderData.order_items.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0
      );
      
      const newOrder = {
        id: newId,
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_type: orderData.customer_type,
        contact_person: orderData.contact_person,
        email: orderData.email,
        phone: orderData.phone,
        status: insufficientItems.length > 0 ? 'backorder' : 'confirmed',
        priority: orderData.priority,
        order_date: new Date().toISOString().split('T')[0],
        required_date: orderData.required_date,
        shipping_method: orderData.shipping_method,
        payment_terms: orderData.payment_terms,
        payment_status: 'pending',
        total_amount: totalAmount,
        notes: orderData.notes,
        stock_check_results: stockCheckResults,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('sales_orders', JSON.stringify(existingOrders));
      
      // Create order items
      const items = localStorage.getItem('sales_order_items');
      const existingItems = items ? JSON.parse(items) : [];
      
      const newItems = orderData.order_items.map((item, index) => ({
        id: Math.max(0, ...existingItems.map((i: any) => i.id)) + index + 1,
        order_id: newId,
        sku_id: item.sku_id,
        quantity_ordered: item.quantity,
        quantity_allocated: Math.min(item.quantity, stockCheckResults.find(s => s.sku_id === item.sku_id)?.available || 0),
        quantity_shipped: 0,
        unit_price: item.unit_price,
        line_total: item.quantity * item.unit_price,
        created_at: new Date().toISOString()
      }));
      
      existingItems.push(...newItems);
      localStorage.setItem('sales_order_items', JSON.stringify(existingItems));
      
      // Reserve available inventory for the order
      await this.reserveInventoryForOrder(newId, newItems);
      
      // Emit sales order created event
      this.emit('sales_order_created', {
        order: newOrder,
        items: newItems,
        insufficient_stock_items: insufficientItems
      });
      
      return {
        order: newOrder,
        items: newItems,
        stock_warnings: insufficientItems
      };
      
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw error;
    }
  }

  // Reserve inventory for sales order
  async reserveInventoryForOrder(orderId: number, orderItems: any[]): Promise<void> {
    try {
      const inventory = localStorage.getItem('inventory');
      const existingInventory = inventory ? JSON.parse(inventory) : [];
      
      const updatedInventory = existingInventory.map((inv: any) => {
        const orderItem = orderItems.find(item => item.sku_id === inv.sku_id);
        if (orderItem) {
          const reserveQuantity = Math.min(orderItem.quantity_allocated, inv.quantity_on_hand - inv.quantity_reserved);
          return {
            ...inv,
            quantity_reserved: inv.quantity_reserved + reserveQuantity,
            quantity_available: inv.quantity_on_hand - (inv.quantity_reserved + reserveQuantity),
            updated_at: new Date().toISOString()
          };
        }
        return inv;
      });
      
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      // Create reservation transactions
      for (const item of orderItems) {
        if (item.quantity_allocated > 0) {
          await this.createInventoryTransaction({
            sku_id: item.sku_id,
            warehouse_id: 1, // Main warehouse
            transaction_type: 'adjustment',
            quantity: -item.quantity_allocated, // Negative for reservation
            reference_id: orderId,
            notes: `Inventory reserved for sales order ${orderId}`
          });
        }
      }
      
      // Emit inventory reserved event
      this.emit('inventory_reserved', {
        order_id: orderId,
        reserved_items: orderItems.filter(item => item.quantity_allocated > 0)
      });
      
    } catch (error) {
      console.error('Error reserving inventory:', error);
      throw error;
    }
  }

  // Process sales order shipment
  async processSalesOrderShipment(orderId: number, shippedItems: Array<{ sku_id: number; quantity_shipped: number }>): Promise<void> {
    try {
      // Update sales order status
      const orders = localStorage.getItem('sales_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Sales order ${orderId} not found`);
      }
      
      // Update order items
      const items = localStorage.getItem('sales_order_items');
      const existingItems = items ? JSON.parse(items) : [];
      
      let allItemsShipped = true;
      const updatedItems = existingItems.map((item: any) => {
        if (item.order_id === orderId) {
          const shippedItem = shippedItems.find(s => s.sku_id === item.sku_id);
          if (shippedItem) {
            const newShippedQuantity = Math.min(
              item.quantity_shipped + shippedItem.quantity_shipped,
              item.quantity_ordered
            );
            
            if (newShippedQuantity < item.quantity_ordered) {
              allItemsShipped = false;
            }
            
            return {
              ...item,
              quantity_shipped: newShippedQuantity
            };
          }
          
          if (item.quantity_shipped < item.quantity_ordered) {
            allItemsShipped = false;
          }
        }
        return item;
      });
      
      localStorage.setItem('sales_order_items', JSON.stringify(updatedItems));
      
      // Update order status
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status: allItemsShipped ? 'shipped' : 'partial_shipment',
        actual_ship_date: allItemsShipped ? new Date().toISOString().split('T')[0] : existingOrders[orderIndex].actual_ship_date,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('sales_orders', JSON.stringify(existingOrders));
      
      // Update inventory levels (reduce stock)
      for (const shippedItem of shippedItems) {
        await this.updateInventoryLevel(
          shippedItem.sku_id,
          1, // Main warehouse
          -shippedItem.quantity_shipped,
          'shipment',
          orderId
        );
      }
      
      // Emit shipment event
      this.emit('sales_order_shipped', {
        order_id: orderId,
        shipped_items: shippedItems,
        fully_shipped: allItemsShipped
      });
      
    } catch (error) {
      console.error('Error processing sales order shipment:', error);
      throw error;
    }
  }

  // Get sales orders
  async getSalesOrders(): Promise<any[]> {
    const orders = localStorage.getItem('sales_orders');
    return orders ? JSON.parse(orders) : [];
  }

  // Get sales order items
  async getSalesOrderItems(): Promise<any[]> {
    const items = localStorage.getItem('sales_order_items');
    return items ? JSON.parse(items) : [];
  }

  // Production Job Order workflow methods
  async createProductionJobOrder(orderData: {
    sku_id: number;
    warehouse_id: number;
    quantity_planned: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    planned_start_date: string;
    planned_completion_date: string;
    shift: 'day' | 'evening' | 'night';
    supervisor?: string;
    notes?: string;
    material_requirements?: Array<{
      material_id: number;
      quantity_required: number;
    }>;
  }): Promise<any> {
    try {
      // Check material availability if requirements provided
      let materialCheckResults = [];
      if (orderData.material_requirements) {
        const inventory = await this.dataService.getInventory();
        for (const requirement of orderData.material_requirements) {
          const materialInventory = inventory.find(inv => inv.sku_id === requirement.material_id);
          materialCheckResults.push({
            material_id: requirement.material_id,
            required: requirement.quantity_required,
            available: materialInventory?.quantity_available || 0,
            sufficient: (materialInventory?.quantity_available || 0) >= requirement.quantity_required
          });
        }
      }
      
      // Create the production job order
      const orders = localStorage.getItem('production_job_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const newId = Math.max(0, ...existingOrders.map((o: any) => o.id)) + 1;
      const orderNumber = `PJO-${new Date().getFullYear()}-${newId.toString().padStart(4, '0')}`;
      
      const newOrder = {
        id: newId,
        order_number: orderNumber,
        sku_id: orderData.sku_id,
        warehouse_id: orderData.warehouse_id,
        quantity_planned: orderData.quantity_planned,
        quantity_completed: 0,
        quantity_scrapped: 0,
        status: 'scheduled',
        priority: orderData.priority,
        planned_start_date: orderData.planned_start_date,
        planned_completion_date: orderData.planned_completion_date,
        actual_start_date: null,
        actual_completion_date: null,
        shift: orderData.shift,
        supervisor: orderData.supervisor,
        notes: orderData.notes,
        material_requirements: orderData.material_requirements || [],
        material_check_results: materialCheckResults,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      existingOrders.push(newOrder);
      localStorage.setItem('production_job_orders', JSON.stringify(existingOrders));
      
      // Create alerts for insufficient materials
      const insufficientMaterials = materialCheckResults.filter(m => !m.sufficient);
      if (insufficientMaterials.length > 0) {
        for (const material of insufficientMaterials) {
          await this.createAlert({
            alert_type: 'insufficient_materials_for_production',
            title: 'Insufficient Materials for Production',
            message: `Insufficient materials for production order ${orderNumber}. Material ID ${material.material_id}: Required ${material.required}, Available ${material.available}`,
            severity: 'high',
            entity_type: 'production_order',
            entity_id: newId
          });
        }
      }
      
      // Emit production order created event
      this.emit('production_job_order_created', {
        order: newOrder,
        material_warnings: insufficientMaterials
      });
      
      return {
        order: newOrder,
        material_warnings: insufficientMaterials
      };
      
    } catch (error) {
      console.error('Error creating production job order:', error);
      throw error;
    }
  }

  // Start production job order
  async startProductionJobOrder(orderId: number): Promise<void> {
    try {
      const orders = localStorage.getItem('production_job_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Production job order ${orderId} not found`);
      }
      
      // Update order status
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status: 'in_progress',
        actual_start_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('production_job_orders', JSON.stringify(existingOrders));
      
      // Reserve materials if specified
      const order = existingOrders[orderIndex];
      if (order.material_requirements && order.material_requirements.length > 0) {
        await this.reserveMaterialsForProduction(orderId, order.material_requirements);
      }
      
      // Emit production started event
      this.emit('production_job_order_started', {
        order_id: orderId,
        start_date: existingOrders[orderIndex].actual_start_date
      });
      
    } catch (error) {
      console.error('Error starting production job order:', error);
      throw error;
    }
  }

  // Complete production job order
  async completeProductionJobOrder(orderId: number, completionData: {
    quantity_completed: number;
    quantity_scrapped?: number;
    notes?: string;
  }): Promise<void> {
    try {
      const orders = localStorage.getItem('production_job_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Production job order ${orderId} not found`);
      }
      
      const order = existingOrders[orderIndex];
      
      // Update order status
      existingOrders[orderIndex] = {
        ...order,
        quantity_completed: completionData.quantity_completed,
        quantity_scrapped: completionData.quantity_scrapped || 0,
        status: 'completed',
        actual_completion_date: new Date().toISOString().split('T')[0],
        notes: completionData.notes ? `${order.notes || ''}\n${completionData.notes}` : order.notes,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('production_job_orders', JSON.stringify(existingOrders));
      
      // Add completed quantity to inventory
      if (completionData.quantity_completed > 0) {
        await this.updateInventoryLevel(
          order.sku_id,
          order.warehouse_id,
          completionData.quantity_completed,
          'production',
          orderId
        );
      }
      
      // Consume materials if specified
      if (order.material_requirements && order.material_requirements.length > 0) {
        await this.consumeMaterialsForProduction(orderId, order.material_requirements);
      }
      
      // Emit production completed event
      this.emit('production_job_order_completed', {
        order_id: orderId,
        quantity_completed: completionData.quantity_completed,
        quantity_scrapped: completionData.quantity_scrapped || 0,
        completion_date: existingOrders[orderIndex].actual_completion_date
      });
      
    } catch (error) {
      console.error('Error completing production job order:', error);
      throw error;
    }
  }

  // Reserve materials for production
  async reserveMaterialsForProduction(orderId: number, materialRequirements: any[]): Promise<void> {
    try {
      const inventory = localStorage.getItem('inventory');
      const existingInventory = inventory ? JSON.parse(inventory) : [];
      
      const updatedInventory = existingInventory.map((inv: any) => {
        const requirement = materialRequirements.find(req => req.material_id === inv.sku_id);
        if (requirement) {
          const reserveQuantity = Math.min(requirement.quantity_required, inv.quantity_on_hand - inv.quantity_reserved);
          return {
            ...inv,
            quantity_reserved: inv.quantity_reserved + reserveQuantity,
            quantity_available: inv.quantity_on_hand - (inv.quantity_reserved + reserveQuantity),
            updated_at: new Date().toISOString()
          };
        }
        return inv;
      });
      
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      // Create reservation transactions
      for (const requirement of materialRequirements) {
        const inventoryRecord = updatedInventory.find((inv: any) => inv.sku_id === requirement.material_id);
        if (inventoryRecord) {
          const reservedQuantity = Math.min(requirement.quantity_required, inventoryRecord.quantity_on_hand);
          if (reservedQuantity > 0) {
            await this.createInventoryTransaction({
              sku_id: requirement.material_id,
              warehouse_id: 1, // Main warehouse
              transaction_type: 'adjustment',
              quantity: -reservedQuantity, // Negative for reservation
              reference_id: orderId,
              notes: `Materials reserved for production order ${orderId}`
            });
          }
        }
      }
      
    } catch (error) {
      console.error('Error reserving materials for production:', error);
      throw error;
    }
  }

  // Consume materials for production
  async consumeMaterialsForProduction(orderId: number, materialRequirements: any[]): Promise<void> {
    try {
      // Reduce material inventory levels
      for (const requirement of materialRequirements) {
        await this.updateInventoryLevel(
          requirement.material_id,
          1, // Main warehouse
          -requirement.quantity_required,
          'production',
          orderId
        );
      }
      
      // Emit materials consumed event
      this.emit('materials_consumed_for_production', {
        order_id: orderId,
        materials: materialRequirements
      });
      
    } catch (error) {
      console.error('Error consuming materials for production:', error);
      throw error;
    }
  }

  // Get production job orders
  async getProductionJobOrders(): Promise<any[]> {
    const orders = localStorage.getItem('production_job_orders');
    return orders ? JSON.parse(orders) : [];
  }

  // Update production job order status
  async updateProductionJobOrderStatus(orderId: number, status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'cancelled'): Promise<void> {
    try {
      const orders = localStorage.getItem('production_job_orders');
      const existingOrders = orders ? JSON.parse(orders) : [];
      
      const orderIndex = existingOrders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) {
        throw new Error(`Production job order ${orderId} not found`);
      }
      
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        status: status,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('production_job_orders', JSON.stringify(existingOrders));
      
      // Emit status update event
      this.emit('production_job_order_status_updated', {
        order_id: orderId,
        new_status: status
      });
      
    } catch (error) {
      console.error('Error updating production job order status:', error);
      throw error;
    }
  }

  // Delete SKU and related data
  async deleteSKU(skuId: number): Promise<void> {
    try {
      // Remove SKU from SKUs list
      const skus = await this.getSKUs();
      const filteredSKUs = skus.filter(sku => sku.id !== skuId);
      localStorage.setItem('skus', JSON.stringify(filteredSKUs));

      // Remove associated inventory records
      const inventory = await this.getInventory();
      const filteredInventory = inventory.filter(inv => inv.sku_id !== skuId);
      localStorage.setItem('inventory', JSON.stringify(filteredInventory));

      // Remove SKU components if it's a kit SKU
      const components = localStorage.getItem('sku_components');
      if (components) {
        const parsedComponents = JSON.parse(components);
        const filteredComponents = parsedComponents.filter((comp: any) => comp.kit_sku_id !== skuId && comp.component_sku_id !== skuId);
        localStorage.setItem('sku_components', JSON.stringify(filteredComponents));
      }

      // Remove related customer order items
      const orderItems = localStorage.getItem('customer_order_items');
      if (orderItems) {
        const parsedOrderItems = JSON.parse(orderItems);
        const filteredOrderItems = parsedOrderItems.filter((item: any) => item.sku_id !== skuId);
        localStorage.setItem('customer_order_items', JSON.stringify(filteredOrderItems));
      }

      console.log(`SKU ${skuId} and related data deleted successfully`);
    } catch (error) {
      console.error('Error deleting SKU:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
export const inventoryManager = InventoryManager.getInstance();
