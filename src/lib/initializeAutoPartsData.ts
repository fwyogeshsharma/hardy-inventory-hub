// Initialize AutoFlow Parts with realistic automotive data
import { dataService } from './database';

export const initializeAutoPartsData = async () => {
  try {
    // Clear existing data first
    localStorage.removeItem('brands');
    localStorage.removeItem('flavors');
    localStorage.removeItem('pack_sizes');
    localStorage.removeItem('warehouses');
    localStorage.removeItem('skus_db');
    localStorage.removeItem('inventory');
    localStorage.removeItem('sku_components');

    // Initialize fresh automotive data
    await dataService.initialize();

    // Add some sample automotive SKUs
    const sampleSKUs = [
      {
        sku_name: "Premium Brake Pads Front Set",
        brand_id: 1, // ACDelco
        flavor_id: 3, // Brake System
        pack_size_id: 3, // Set of 4
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789012",
        unit_of_measure: "Set",
        launch_date: "2024-01-15"
      },
      {
        sku_name: "High Performance Oil Filter",
        brand_id: 2, // Bosch
        flavor_id: 1, // Engine
        pack_size_id: 1, // Individual
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789013",
        unit_of_measure: "Each",
        launch_date: "2024-02-01"
      },
      {
        sku_name: "Spark Plug Set V6",
        brand_id: 5, // NGK
        flavor_id: 1, // Engine
        pack_size_id: 4, // Kit
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789014",
        unit_of_measure: "Kit",
        launch_date: "2024-01-20"
      },
      {
        sku_name: "Alternator 12V 120A",
        brand_id: 4, // Denso
        flavor_id: 4, // Electrical
        pack_size_id: 1, // Individual
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789015",
        unit_of_measure: "Each",
        launch_date: "2024-03-01"
      },
      {
        sku_name: "Shock Absorber Front Pair",
        brand_id: 6, // Monroe
        flavor_id: 5, // Suspension
        pack_size_id: 5, // Pair
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789016",
        unit_of_measure: "Pair",
        launch_date: "2024-02-15"
      },
      {
        sku_name: "Transmission Fluid ATF",
        brand_id: 3, // Motorcraft
        flavor_id: 2, // Transmission
        pack_size_id: 1, // Individual
        sku_type: 'single' as const,
        status: 'active' as const,
        barcode: "123456789017",
        unit_of_measure: "Liter",
        launch_date: "2024-01-10"
      },
      {
        sku_name: "Complete Tune-Up Kit",
        brand_id: 1, // ACDelco
        flavor_id: 1, // Engine
        pack_size_id: 4, // Kit
        sku_type: 'kit' as const,
        status: 'active' as const,
        barcode: "123456789018",
        unit_of_measure: "Kit",
        launch_date: "2024-03-15",
        components: [
          { component_sku_id: 2, quantity: 1 }, // Oil Filter
          { component_sku_id: 3, quantity: 1 }, // Spark Plugs
        ]
      }
    ];

    // Create sample SKUs
    for (const skuData of sampleSKUs) {
      try {
        await dataService.createSKU(skuData);
        console.log(`Created SKU: ${skuData.sku_name}`);
      } catch (error) {
        console.error(`Failed to create SKU ${skuData.sku_name}:`, error);
      }
    }

    console.log('AutoFlow Parts sample data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Failed to initialize AutoFlow Parts data:', error);
    return false;
  }
};