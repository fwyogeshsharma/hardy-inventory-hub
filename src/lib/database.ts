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

export interface Flavor {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackSize {
  id: number;
  name: string;
  volume_ml?: number;
  unit_count: number;
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
  flavor_id?: number;
  pack_size_id?: number;
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
  flavor?: Flavor;
  pack_size?: PackSize;
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
        this.initializeFlavors(),
        this.initializePackSizes(),
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
          description: 'OEM and aftermarket automotive parts',
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
        }
      ];
      localStorage.setItem('brands', JSON.stringify(defaultBrands));
    }
  }

  private async initializeFlavors(): Promise<void> {
    const existing = localStorage.getItem('flavors');
    if (!existing) {
      const defaultFlavors: Flavor[] = [
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
      localStorage.setItem('flavors', JSON.stringify(defaultFlavors));
    }
  }

  private async initializePackSizes(): Promise<void> {
    const existing = localStorage.getItem('pack_sizes');
    if (!existing) {
      const defaultPackSizes: PackSize[] = [
        { id: 1, name: 'Individual', volume_ml: null, unit_count: 1, description: 'Single part or component', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: 'Set of 2', volume_ml: null, unit_count: 2, description: 'Two-piece set', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: 'Set of 4', volume_ml: null, unit_count: 4, description: 'Four-piece set (wheels, brake pads, etc.)', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 4, name: 'Kit', volume_ml: null, unit_count: 1, description: 'Complete assembly kit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 5, name: 'Pair', volume_ml: null, unit_count: 2, description: 'Matched pair (left/right)', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 6, name: 'Bulk Pack', volume_ml: null, unit_count: 10, description: 'Bulk package of 10 units', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 7, name: 'Case', volume_ml: null, unit_count: 12, description: 'Case of 12 units', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 8, name: 'Pallet', volume_ml: null, unit_count: 100, description: 'Pallet quantity', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
      localStorage.setItem('pack_sizes', JSON.stringify(defaultPackSizes));
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

  // CRUD operations for flavors
  async getFlavors(): Promise<Flavor[]> {
    const flavors = localStorage.getItem('flavors');
    return flavors ? JSON.parse(flavors) : [];
  }

  async getFlavorById(id: number): Promise<Flavor | null> {
    const flavors = await this.getFlavors();
    return flavors.find(f => f.id === id) || null;
  }

  // CRUD operations for pack sizes
  async getPackSizes(): Promise<PackSize[]> {
    const packSizes = localStorage.getItem('pack_sizes');
    return packSizes ? JSON.parse(packSizes) : [];
  }

  async getPackSizeById(id: number): Promise<PackSize | null> {
    const packSizes = await this.getPackSizes();
    return packSizes.find(ps => ps.id === id) || null;
  }

  // CRUD operations for SKUs
  async getSKUs(): Promise<SKU[]> {
    try {
      const skus = localStorage.getItem('skus_db');
      const parsedSKUs: SKU[] = skus ? JSON.parse(skus) : [];
      
      // Enrich with related data
      const [brands, flavors, packSizes] = await Promise.all([
        this.getBrands(),
        this.getFlavors(),
        this.getPackSizes()
      ]);
      
      return parsedSKUs.map(sku => ({
        ...sku,
        brand: sku.brand_id ? brands.find(b => b.id === sku.brand_id) : undefined,
        flavor: sku.flavor_id ? flavors.find(f => f.id === sku.flavor_id) : undefined,
        pack_size: sku.pack_size_id ? packSizes.find(ps => ps.id === sku.pack_size_id) : undefined
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
    flavor_id?: number;
    pack_size_id?: number;
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
      const [brand, flavor, packSize] = await Promise.all([
        skuData.brand_id ? this.getBrandById(skuData.brand_id) : null,
        skuData.flavor_id ? this.getFlavorById(skuData.flavor_id) : null,
        skuData.pack_size_id ? this.getPackSizeById(skuData.pack_size_id) : null
      ]);
      
      const skuCode = `${brand?.name || 'UNK'}-${flavor?.name || 'UNK'}-${packSize?.name || 'UNK'}-${newId.toString().padStart(3, '0')}`;
      
      const newSKU: SKU = {
        id: newId,
        sku_code: skuCode,
        sku_name: skuData.sku_name,
        brand_id: skuData.brand_id,
        flavor_id: skuData.flavor_id,
        pack_size_id: skuData.pack_size_id,
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
}

// Export singleton instance
export const dataService = DataService.getInstance();