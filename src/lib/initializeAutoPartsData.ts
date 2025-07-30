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
    brand_id: 1,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "123456789012",
    unit_of_measure: "Set",
    launch_date: "2024-01-15"
  },
  {
    sku_name: "Ceramic Brake Pads Rear Set",
    brand_id: 2,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "987654321098",
    unit_of_measure: "Set",
    launch_date: "2024-02-10"
  },
  {
    sku_name: "High Performance Air Filter",
    brand_id: 3,
    flavor_id: 1,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "456789123456",
    unit_of_measure: "Unit",
    launch_date: "2024-03-01"
  },
  {
    sku_name: "Synthetic Oil 5W-30",
    brand_id: 4,
    flavor_id: 2,
    pack_size_id: 2,
    sku_type: "single",
    status: "active",
    barcode: "789123456789",
    unit_of_measure: "Quart",
    launch_date: "2024-04-05"
  },
  {
    sku_name: "Spark Plug Set",
    brand_id: 5,
    flavor_id: 4,
    pack_size_id: 4,
    sku_type: "single",
    status: "active",
    barcode: "321654987123",
    unit_of_measure: "Set",
    launch_date: "2024-05-20"
  },
  {
    sku_name: "Front Wiper Blades Pair",
    brand_id: 1,
    flavor_id: 5,
    pack_size_id: 5,
    sku_type: "single",
    status: "active",
    barcode: "654321987654",
    unit_of_measure: "Pair",
    launch_date: "2024-06-15"
  },
  {
    sku_name: "Cabin Air Filter",
    brand_id: 2,
    flavor_id: 1,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "147258369012",
    unit_of_measure: "Unit",
    launch_date: "2024-07-10"
  },
  {
    sku_name: "Brake Rotor Front",
    brand_id: 3,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "258369147025",
    unit_of_measure: "Unit",
    launch_date: "2024-08-01"
  },
  {
    sku_name: "Alternator 120A",
    brand_id: 4,
    flavor_id: 6,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "369258147036",
    unit_of_measure: "Unit",
    launch_date: "2024-09-05"
  },
  {
    sku_name: "Battery 650CCA",
    brand_id: 5,
    flavor_id: 7,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "741852963014",
    unit_of_measure: "Unit",
    launch_date: "2024-10-10"
  },
  {
    sku_name: "Oil Filter Standard",
    brand_id: 1,
    flavor_id: 2,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "852963741085",
    unit_of_measure: "Unit",
    launch_date: "2024-11-01"
  },
  {
    sku_name: "Rear Shock Absorber",
    brand_id: 2,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "963741852096",
    unit_of_measure: "Unit",
    launch_date: "2024-12-05"
  },
  {
    sku_name: "Timing Belt Kit",
    brand_id: 3,
    flavor_id: 9,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "159753486201",
    unit_of_measure: "Set",
    launch_date: "2025-01-15"
  },
  {
    sku_name: "Fuel Pump Assembly",
    brand_id: 4,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753159486207",
    unit_of_measure: "Unit",
    launch_date: "2025-02-10"
  },
  {
    sku_name: "Clutch Kit",
    brand_id: 5,
    flavor_id: 11,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "486207159753",
    unit_of_measure: "Set",
    launch_date: "2025-03-01"
  },
  {
    sku_name: "Radiator Standard",
    brand_id: 1,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753486",
    unit_of_measure: "Unit",
    launch_date: "2025-04-05"
  },
  {
    sku_name: "Brake Caliper Front",
    brand_id: 2,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486208",
    unit_of_measure: "Unit",
    launch_date: "2025-05-10"
  },
  {
    sku_name: "Ignition Coil",
    brand_id: 3,
    flavor_id: 4,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207159",
    unit_of_measure: "Unit",
    launch_date: "2025-06-15"
  },
  {
    sku_name: "Water Pump",
    brand_id: 4,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159754",
    unit_of_measure: "Unit",
    launch_date: "2025-07-01"
  },
  {
    sku_name: "Thermostat 180F",
    brand_id: 5,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753487",
    unit_of_measure: "Unit",
    launch_date: "2025-07-20"
  },
  {
    sku_name: "Brake Fluid 16oz",
    brand_id: 1,
    flavor_id: 3,
    pack_size_id: 2,
    sku_type: "single",
    status: "active",
    barcode: "159753486209",
    unit_of_measure: "Bottle",
    launch_date: "2025-01-20"
  },
  {
    sku_name: "Air Intake Hose",
    brand_id: 2,
    flavor_id: 1,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207160",
    unit_of_measure: "Unit",
    launch_date: "2025-02-15"
  },
  {
    sku_name: "Serpentine Belt",
    brand_id: 3,
    flavor_id: 9,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159755",
    unit_of_measure: "Unit",
    launch_date: "2025-03-10"
  },
  {
    sku_name: "Oxygen Sensor",
    brand_id: 4,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753488",
    unit_of_measure: "Unit",
    launch_date: "2025-04-01"
  },
  {
    sku_name: "Control Arm Front",
    brand_id: 5,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486210",
    unit_of_measure: "Unit",
    launch_date: "2025-05-05"
  },
  {
    sku_name: "Wheel Bearing Front",
    brand_id: 1,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207161",
    unit_of_measure: "Unit",
    launch_date: "2025-06-10"
  },
  {
    sku_name: "Headlight Bulb H7",
    brand_id: 2,
    flavor_id: 13,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159756",
    unit_of_measure: "Unit",
    launch_date: "2025-07-15"
  },
  {
    sku_name: "Tail Light Assembly",
    brand_id: 3,
    flavor_id: 13,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753489",
    unit_of_measure: "Unit",
    launch_date: "2025-01-25"
  },
  {
    sku_name: "Brake Master Cylinder",
    brand_id: 4,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486211",
    unit_of_measure: "Unit",
    launch_date: "2025-02-20"
  },
  {
    sku_name: "Fuel Filter",
    brand_id: 5,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207162",
    unit_of_measure: "Unit",
    launch_date: "2025-03-15"
  },
  {
    sku_name: "Power Steering Pump",
    brand_id: 1,
    flavor_id: 14,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159757",
    unit_of_measure: "Unit",
    launch_date: "2025-04-10"
  },
  {
    sku_name: "Radiator Hose Upper",
    brand_id: 2,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753490",
    unit_of_measure: "Unit",
    launch_date: "2025-05-01"
  },
  {
    sku_name: "Distributor Cap",
    brand_id: 3,
    flavor_id: 4,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486212",
    unit_of_measure: "Unit",
    launch_date: "2025-06-05"
  },
  {
    sku_name: "Brake Pad Sensor",
    brand_id: 4,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207163",
    unit_of_measure: "Unit",
    launch_date: "2025-07-10"
  },
  {
    sku_name: "Engine Mount",
    brand_id: 5,
    flavor_id: 15,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159758",
    unit_of_measure: "Unit",
    launch_date: "2025-01-30"
  },
  {
    sku_name: "Transmission Filter",
    brand_id: 1,
    flavor_id: 16,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753491",
    unit_of_measure: "Unit",
    launch_date: "2025-02-25"
  },
  {
    sku_name: "CV Joint Kit",
    brand_id: 2,
    flavor_id: 17,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "159753486213",
    unit_of_measure: "Set",
    launch_date: "2025-03-20"
  },
  {
    sku_name: "Starter Motor",
    brand_id: 3,
    flavor_id: 7,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207164",
    unit_of_measure: "Unit",
    launch_date: "2025-04-15"
  },
  {
    sku_name: "Brake Shoe Set",
    brand_id: 4,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "486207159759",
    unit_of_measure: "Set",
    launch_date: "2025-05-10"
  },
  {
    sku_name: "Mass Air Flow Sensor",
    brand_id: 5,
    flavor_id: 1,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753492",
    unit_of_measure: "Unit",
    launch_date: "2025-06-01"
  },
  {
    sku_name: "Fuel Injector",
    brand_id: 1,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486214",
    unit_of_measure: "Unit",
    launch_date: "2025-07-05"
  },
  {
    sku_name: "Thermostat Gasket",
    brand_id: 2,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207165",
    unit_of_measure: "Unit",
    launch_date: "2025-01-10"
  },
  {
    sku_name: "Brake Hose Front",
    brand_id: 3,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159760",
    unit_of_measure: "Unit",
    launch_date: "2025-02-05"
  },
  {
    sku_name: "Valve Cover Gasket",
    brand_id: 4,
    flavor_id: 15,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753493",
    unit_of_measure: "Unit",
    launch_date: "2025-03-01"
  },
  {
    sku_name: "Wheel Hub Assembly",
    brand_id: 5,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486215",
    unit_of_measure: "Unit",
    launch_date: "2025-04-05"
  },
  {
    sku_name: "Ignition Switch",
    brand_id: 1,
    flavor_id: 4,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207166",
    unit_of_measure: "Unit",
    launch_date: "2025-05-10"
  },
  {
    sku_name: "Radiator Fan",
    brand_id: 2,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159761",
    unit_of_measure: "Unit",
    launch_date: "2025-06-15"
  },
  {
    sku_name: "Brake Light Switch",
    brand_id: 3,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753494",
    unit_of_measure: "Unit",
    launch_date: "2025-07-01"
  },
  {
    sku_name: "PCV Valve",
    brand_id: 4,
    flavor_id: 15,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486216",
    unit_of_measure: "Unit",
    launch_date: "2025-01-15"
  },
  {
    sku_name: "EGR Valve",
    brand_id: 5,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207167",
    unit_of_measure: "Unit",
    launch_date: "2025-02-10"
  },
  {
    sku_name: "Power Steering Fluid 12oz",
    brand_id: 1,
    flavor_id: 14,
    pack_size_id: 2,
    sku_type: "single",
    status: "active",
    barcode: "486207159762",
    unit_of_measure: "Bottle",
    launch_date: "2025-03-05"
  },
  {
    sku_name: "Brake Caliper Rear",
    brand_id: 2,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753495",
    unit_of_measure: "Unit",
    launch_date: "2025-04-01"
  },
  {
    sku_name: "Fuel Pressure Regulator",
    brand_id: 3,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486217",
    unit_of_measure: "Unit",
    launch_date: "2025-05-05"
  },
  {
    sku_name: "Alternator Belt",
    brand_id: 4,
    flavor_id: 9,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207168",
    unit_of_measure: "Unit",
    launch_date: "2025-06-10"
  },
  {
    sku_name: "Oil Pressure Sensor",
    brand_id: 5,
    flavor_id: 2,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159763",
    unit_of_measure: "Unit",
    launch_date: "2025-07-15"
  },
  {
    sku_name: "Brake Drum Rear",
    brand_id: 1,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753496",
    unit_of_measure: "Unit",
    launch_date: "2025-01-20"
  },
  {
    sku_name: "Coolant Reservoir",
    brand_id: 2,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486218",
    unit_of_measure: "Unit",
    launch_date: "2025-02-15"
  },
  {
    sku_name: "Throttle Position Sensor",
    brand_id: 3,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207169",
    unit_of_measure: "Unit",
    launch_date: "2025-03-10"
  },
  {
    sku_name: "Camshaft Position Sensor",
    brand_id: 4,
    flavor_id: 15,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159764",
    unit_of_measure: "Unit",
    launch_date: "2025-04-05"
  },
  {
    sku_name: "Crankshaft Position Sensor",
    brand_id: 5,
    flavor_id: 15,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753497",
    unit_of_measure: "Unit",
    launch_date: "2025-05-01"
  },
  {
    sku_name: "Brake Booster",
    brand_id: 1,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486219",
    unit_of_measure: "Unit",
    launch_date: "2025-06-05"
  },
  {
    sku_name: "Intake Manifold Gasket",
    brand_id: 2,
    flavor_id: 1,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207170",
    unit_of_measure: "Unit",
    launch_date: "2025-07-10"
  },
  {
    sku_name: "Oil Pan Gasket",
    brand_id: 3,
    flavor_id: 2,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159765",
    unit_of_measure: "Unit",
    launch_date: "2025-01-15"
  },
  {
    sku_name: "Steering Rack",
    brand_id: 4,
    flavor_id: 14,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753498",
    unit_of_measure: "Unit",
    launch_date: "2025-02-10"
  },
  {
    sku_name: "Brake Pad Clips",
    brand_id: 5,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "159753486220",
    unit_of_measure: "Set",
    launch_date: "2025-03-05"
  },
  {
    sku_name: "Fuel Tank Cap",
    brand_id: 1,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207171",
    unit_of_measure: "Unit",
    launch_date: "2025-04-01"
  },
  {
    sku_name: "Hood Strut",
    brand_id: 2,
    flavor_id: 18,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159766",
    unit_of_measure: "Unit",
    launch_date: "2025-05-05"
  },
  {
    sku_name: "Window Regulator",
    brand_id: 3,
    flavor_id: 19,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753499",
    unit_of_measure: "Unit",
    launch_date: "2025-06-10"
  },
  {
    sku_name: "Door Lock Actuator",
    brand_id: 4,
    flavor_id: 19,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486221",
    unit_of_measure: "Unit",
    launch_date: "2025-07-15"
  },
  {
    sku_name: "Brake Caliper Bolt",
    brand_id: 5,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "753486207172",
    unit_of_measure: "Set",
    launch_date: "2025-01-20"
  },
  {
    sku_name: "Oil Cooler",
    brand_id: 1,
    flavor_id: 2,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159767",
    unit_of_measure: "Unit",
    launch_date: "2025-02-15"
  },
  {
    sku_name: "Exhaust Gasket",
    brand_id: 2,
    flavor_id: 20,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753500",
    unit_of_measure: "Unit",
    launch_date: "2025-03-10"
  },
  {
    sku_name: "Catalytic Converter",
    brand_id: 3,
    flavor_id: 20,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486222",
    unit_of_measure: "Unit",
    launch_date: "2025-04-05"
  },
  {
    sku_name: "Muffler Assembly",
    brand_id: 4,
    flavor_id: 20,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207173",
    unit_of_measure: "Unit",
    launch_date: "2025-05-01"
  },
  {
    sku_name: "Brake Line Kit",
    brand_id: 5,
    flavor_id: 3,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "486207159768",
    unit_of_measure: "Set",
    launch_date: "2025-06-05"
  },
  {
    sku_name: "Fuel Pump Relay",
    brand_id: 1,
    flavor_id: 10,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753501",
    unit_of_measure: "Unit",
    launch_date: "2025-07-10"
  },
  {
    sku_name: "Ignition Control Module",
    brand_id: 2,
    flavor_id: 4,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486223",
    unit_of_measure: "Unit",
    launch_date: "2025-01-15"
  },
  {
    sku_name: "Coolant Temperature Sensor",
    brand_id: 3,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207174",
    unit_of_measure: "Unit",
    launch_date: "2025-02-10"
  },
  {
    sku_name: "Brake Pad Wear Sensor",
    brand_id: 4,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159769",
    unit_of_measure: "Unit",
    launch_date: "2025-03-05"
  },
  {
    sku_name: "Transmission Mount",
    brand_id: 5,
    flavor_id: 16,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753502",
    unit_of_measure: "Unit",
    launch_date: "2025-04-01"
  },
  {
    sku_name: "Wheel Speed Sensor",
    brand_id: 1,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486224",
    unit_of_measure: "Unit",
    launch_date: "2025-05-05"
  },
  {
    sku_name: "Air Suspension Compressor",
    brand_id: 2,
    flavor_id: 8,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207175",
    unit_of_measure: "Unit",
    launch_date: "2025-06-10"
  },
  {
    sku_name: "Brake Rotor Rear",
    brand_id: 3,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159770",
    unit_of_measure: "Unit",
    launch_date: "2025-07-15"
  },
  {
    sku_name: "Power Window Switch",
    brand_id: 4,
    flavor_id: 19,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "207159753503",
    unit_of_measure: "Unit",
    launch_date: "2025-01-20"
  },
  {
    sku_name: "Clutch Master Cylinder",
    brand_id: 5,
    flavor_id: 11,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486225",
    unit_of_measure: "Unit",
    launch_date: "2025-02-15"
  },
  {
    sku_name: "Radiator Hose Lower",
    brand_id: 1,
    flavor_id: 12,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207176",
    unit_of_measure: "Unit",
    launch_date: "2025-03-10"
  },
  {
    sku_name: "Brake Caliper Bracket",
    brand_id: 2,
    flavor_id: 3,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "486207159771",
    unit_of_measure: "Unit",
    launch_date: "2025-04-05"
  },
  {
    sku_name: "Fuel Tank Strap",
    brand_id: 3,
    flavor_id: 10,
    pack_size_id: 3,
    sku_type: "single",
    status: "active",
    barcode: "207159753504",
    unit_of_measure: "Set",
    launch_date: "2025-05-01"
  },
  {
    sku_name: "Exhaust Manifold",
    brand_id: 4,
    flavor_id: 20,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "159753486226",
    unit_of_measure: "Unit",
    launch_date: "2025-06-05"
  },
  {
    sku_name: "Oil Drain Plug",
    brand_id: 5,
    flavor_id: 2,
    pack_size_id: 1,
    sku_type: "single",
    status: "active",
    barcode: "753486207177",
    unit_of_measure: "Unit",
    launch_date: "2025-07-10"
  }
];



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