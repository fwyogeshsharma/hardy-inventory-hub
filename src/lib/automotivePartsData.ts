import { dataService } from './database';

export interface AutomotivePart {
  sku_code: string;
  sku_name: string;
  brand_name: string;
  category_name: string;
  part_type_name: string;
  make_name: string;
  model_compatibility: string[];
  year_from: number;
  year_to: number;
  oem_part_number: string;
  manufacturer: string;
  unit_cost: number;
  unit_price: number;
  barcode: string;
  description: string;
  warranty_months: number;
  unit_of_measure: string;
  status: 'active' | 'upcoming' | 'discontinued';
  // Inventory data
  initial_stock: number;
  safety_stock: number;
  reorder_point: number;
  max_stock: number;
}

export const automotivePartsData: AutomotivePart[] = [
  // Engine Parts
  {
    sku_code: 'ENG001',
    sku_name: 'Toyota Camry Oil Filter',
    brand_name: 'Toyota',
    category_name: 'Engine',
    part_type_name: 'Oil Filter',
    make_name: 'Toyota',
    model_compatibility: ['Camry', 'Corolla', 'RAV4'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '90915-YZZD2',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 8.50,
    unit_price: 15.99,
    barcode: '123456789001',
    description: 'Genuine Toyota oil filter for 2.5L 4-cylinder engines',
    warranty_months: 6,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 150,
    safety_stock: 25,
    reorder_point: 50,
    max_stock: 300
  },
  {
    sku_code: 'ENG002',
    sku_name: 'Honda Civic Air Filter',
    brand_name: 'Honda',
    category_name: 'Engine',
    part_type_name: 'Air Filter',
    make_name: 'Honda',
    model_compatibility: ['Civic', 'Accord', 'CR-V'],
    year_from: 2016,
    year_to: 2023,
    oem_part_number: '17220-R1A-A01',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 12.75,
    unit_price: 24.99,
    barcode: '123456789002',
    description: 'High-performance air filter for Honda 1.5L turbo engines',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 20,
    reorder_point: 40,
    max_stock: 200
  },
  {
    sku_code: 'ENG003',
    sku_name: 'Ford F-150 Spark Plug Set',
    brand_name: 'Motorcraft',
    category_name: 'Engine',
    part_type_name: 'Spark Plug',
    make_name: 'Ford',
    model_compatibility: ['F-150', 'Mustang', 'Explorer'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: 'SP-546',
    manufacturer: 'Ford Motor Company',
    unit_cost: 45.00,
    unit_price: 89.99,
    barcode: '123456789003',
    description: 'Iridium spark plug set for Ford 5.0L V8 Coyote engine',
    warranty_months: 24,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 8, // Low stock
    safety_stock: 15,
    reorder_point: 30,
    max_stock: 100
  },
  {
    sku_code: 'ENG004',
    sku_name: 'BMW 3 Series Water Pump',
    brand_name: 'BMW',
    category_name: 'Engine',
    part_type_name: 'Water Pump',
    make_name: 'BMW',
    model_compatibility: ['3 Series', '4 Series', 'X3'],
    year_from: 2012,
    year_to: 2022,
    oem_part_number: '11517586925',
    manufacturer: 'BMW AG',
    unit_cost: 185.00,
    unit_price: 349.99,
    barcode: '123456789004',
    description: 'Electric water pump for BMW N20/N26 engines',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 25,
    safety_stock: 5,
    reorder_point: 10,
    max_stock: 50
  },
  {
    sku_code: 'ENG005',
    sku_name: 'Chevrolet Silverado Fuel Pump',
    brand_name: 'AC Delco',
    category_name: 'Engine',
    part_type_name: 'Fuel Pump',
    make_name: 'Chevrolet',
    model_compatibility: ['Silverado', 'Sierra', 'Tahoe'],
    year_from: 2014,
    year_to: 2023,
    oem_part_number: 'E3768M',
    manufacturer: 'General Motors',
    unit_cost: 125.00,
    unit_price: 249.99,
    barcode: '123456789005',
    description: 'Electric fuel pump assembly for GM 5.3L V8',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 15,
    safety_stock: 8,
    reorder_point: 15,
    max_stock: 60
  },

  // Brake Parts
  {
    sku_code: 'BRK001',
    sku_name: 'Toyota Prius Brake Pad Set Front',
    brand_name: 'Toyota',
    category_name: 'Brakes',
    part_type_name: 'Brake Pad',
    make_name: 'Toyota',
    model_compatibility: ['Prius', 'Prius V', 'Prius C'],
    year_from: 2010,
    year_to: 2024,
    oem_part_number: '04465-47080',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 35.00,
    unit_price: 69.99,
    barcode: '123456789006',
    description: 'Ceramic brake pads for Toyota Prius hybrid braking system',
    warranty_months: 12,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 45,
    safety_stock: 10,
    reorder_point: 20,
    max_stock: 100
  },
  {
    sku_code: 'BRK002',
    sku_name: 'Honda Accord Brake Rotor Front',
    brand_name: 'Honda',
    category_name: 'Brakes',
    part_type_name: 'Brake Rotor',
    make_name: 'Honda',
    model_compatibility: ['Accord', 'Pilot', 'Ridgeline'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '45251-TLA-A00',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 65.00,
    unit_price: 129.99,
    barcode: '123456789007',
    description: 'Vented brake rotor for Honda Accord 10th generation',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 80
  },
  {
    sku_code: 'BRK003',
    sku_name: 'Ford Mustang Brake Caliper Rear',
    brand_name: 'Motorcraft',
    category_name: 'Brakes',
    part_type_name: 'Brake Caliper',
    make_name: 'Ford',
    model_compatibility: ['Mustang', 'Mustang GT'],
    year_from: 2015,
    year_to: 2023,
    oem_part_number: 'BR-3Z-2552-B',
    manufacturer: 'Ford Motor Company',
    unit_cost: 145.00,
    unit_price: 289.99,
    barcode: '123456789008',
    description: 'Rear brake caliper for Ford Mustang performance package',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 12,
    safety_stock: 4,
    reorder_point: 8,
    max_stock: 40
  },

  // Suspension Parts
  {
    sku_code: 'SUS001',
    sku_name: 'BMW X5 Shock Absorber Front',
    brand_name: 'BMW',
    category_name: 'Suspension',
    part_type_name: 'Shock Absorber',
    make_name: 'BMW',
    model_compatibility: ['X5', 'X6'],
    year_from: 2014,
    year_to: 2023,
    oem_part_number: '37116790082',
    manufacturer: 'BMW AG',
    unit_cost: 285.00,
    unit_price: 549.99,
    barcode: '123456789009',
    description: 'Adaptive suspension shock absorber for BMW X5/X6',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 18,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 30
  },
  {
    sku_code: 'SUS002',
    sku_name: 'Honda CR-V Strut Assembly Front',
    brand_name: 'Honda',
    category_name: 'Suspension',
    part_type_name: 'Strut Assembly',
    make_name: 'Honda',
    model_compatibility: ['CR-V', 'HR-V', 'Passport'],
    year_from: 2017,
    year_to: 2024,
    oem_part_number: '51601-TLA-A03',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 165.00,
    unit_price: 319.99,
    barcode: '123456789010',
    description: 'Complete strut assembly for Honda CR-V 5th generation',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 22,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 60
  },

  // Electrical Parts
  {
    sku_code: 'ELE001',
    sku_name: 'Universal Car Battery 12V',
    brand_name: 'Interstate',
    category_name: 'Electrical',
    part_type_name: 'Battery',
    make_name: 'Universal',
    model_compatibility: ['Most Vehicles'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'MTP-24F',
    manufacturer: 'Interstate Batteries',
    unit_cost: 85.00,
    unit_price: 159.99,
    barcode: '123456789011',
    description: '12V automotive battery with 600 CCA rating',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 35,
    safety_stock: 10,
    reorder_point: 20,
    max_stock: 80
  },
  {
    sku_code: 'ELE002',
    sku_name: 'LED Headlight Bulb H11',
    brand_name: 'Philips',
    category_name: 'Electrical',
    part_type_name: 'Headlight Bulb',
    make_name: 'Universal',
    model_compatibility: ['Various Models'],
    year_from: 2005,
    year_to: 2024,
    oem_part_number: 'H11-LED-6000K',
    manufacturer: 'Philips Lighting',
    unit_cost: 25.00,
    unit_price: 49.99,
    barcode: '123456789012',
    description: 'High-intensity LED headlight bulb 6000K white',
    warranty_months: 6,
    unit_of_measure: 'Pair',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 15,
    reorder_point: 30,
    max_stock: 120
  },

  // Transmission Parts
  {
    sku_code: 'TRN001',
    sku_name: 'Toyota Corolla CVT Transmission Filter',
    brand_name: 'Toyota',
    category_name: 'Transmission',
    part_type_name: 'Transmission Filter',
    make_name: 'Toyota',
    model_compatibility: ['Corolla', 'Camry', 'C-HR'],
    year_from: 2019,
    year_to: 2024,
    oem_part_number: '35330-0W040',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 22.00,
    unit_price: 42.99,
    barcode: '123456789013',
    description: 'CVT transmission filter for Toyota Direct Shift CVT',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 28,
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 80
  },
  {
    sku_code: 'TRN002',
    sku_name: 'Honda Civic Manual Clutch Kit',
    brand_name: 'Honda',
    category_name: 'Transmission',
    part_type_name: 'Clutch Kit',
    make_name: 'Honda',
    model_compatibility: ['Civic Si', 'Civic Type R'],
    year_from: 2017,
    year_to: 2024,
    oem_part_number: '22300-RSP-000',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 285.00,
    unit_price: 549.99,
    barcode: '123456789014',
    description: 'Complete clutch kit for Honda Civic Si manual transmission',
    warranty_months: 36,
    unit_of_measure: 'Kit',
    status: 'active',
    initial_stock: 8,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 25
  },

  // Body Parts
  {
    sku_code: 'BOD001',
    sku_name: 'Ford F-150 Front Bumper',
    brand_name: 'Ford',
    category_name: 'Body',
    part_type_name: 'Bumper',
    make_name: 'Ford',
    model_compatibility: ['F-150'],
    year_from: 2021,
    year_to: 2024,
    oem_part_number: 'ML3Z-17D957-BA',
    manufacturer: 'Ford Motor Company',
    unit_cost: 425.00,
    unit_price: 849.99,
    barcode: '123456789015',
    description: 'Front bumper cover for Ford F-150 14th generation',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 6,
    safety_stock: 2,
    reorder_point: 4,
    max_stock: 20
  },
  {
    sku_code: 'BOD002',
    sku_name: 'Toyota Camry Side Mirror Left',
    brand_name: 'Toyota',
    category_name: 'Body',
    part_type_name: 'Mirror',
    make_name: 'Toyota',
    model_compatibility: ['Camry'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '87940-06290',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 145.00,
    unit_price: 289.99,
    barcode: '123456789016',
    description: 'Left side power mirror with turn signal for Toyota Camry',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 4,
    reorder_point: 8,
    max_stock: 30
  },

  // Cooling System Parts
  {
    sku_code: 'COL001',
    sku_name: 'Honda Accord Radiator',
    brand_name: 'Honda',
    category_name: 'Cooling',
    part_type_name: 'Radiator',
    make_name: 'Honda',
    model_compatibility: ['Accord', 'TLX'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '19010-5A2-A51',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 185.00,
    unit_price: 369.99,
    barcode: '123456789017',
    description: 'Aluminum radiator for Honda Accord 10th generation',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 14,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 35
  },
  {
    sku_code: 'COL002',
    sku_name: 'BMW 3 Series Thermostat',
    brand_name: 'BMW',
    category_name: 'Cooling',
    part_type_name: 'Thermostat',
    make_name: 'BMW',
    model_compatibility: ['3 Series', '4 Series', 'X3', 'X4'],
    year_from: 2012,
    year_to: 2023,
    oem_part_number: '11537549476',
    manufacturer: 'BMW AG',
    unit_cost: 45.00,
    unit_price: 89.99,
    barcode: '123456789018',
    description: 'Engine thermostat for BMW N20/N26 turbo engines',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 32,
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 80
  },

  // Exhaust Parts
  {
    sku_code: 'EXH001',
    sku_name: 'Toyota Prius Catalytic Converter',
    brand_name: 'Toyota',
    category_name: 'Exhaust',
    part_type_name: 'Catalytic Converter',
    make_name: 'Toyota',
    model_compatibility: ['Prius', 'Prius V'],
    year_from: 2010,
    year_to: 2022,
    oem_part_number: '25051-37170',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 1250.00,
    unit_price: 2499.99,
    barcode: '123456789019',
    description: 'OEM catalytic converter for Toyota Prius hybrid system',
    warranty_months: 60,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 3,
    safety_stock: 1,
    reorder_point: 2,
    max_stock: 10
  },
  {
    sku_code: 'EXH002',
    sku_name: 'Ford Mustang GT Muffler',
    brand_name: 'Borla',
    category_name: 'Exhaust',
    part_type_name: 'Muffler',
    make_name: 'Ford',
    model_compatibility: ['Mustang GT'],
    year_from: 2015,
    year_to: 2023,
    oem_part_number: '140669',
    manufacturer: 'Borla Performance',
    unit_cost: 385.00,
    unit_price: 749.99,
    barcode: '123456789020',
    description: 'ATAK cat-back exhaust system for Ford Mustang GT',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 5,
    safety_stock: 2,
    reorder_point: 4,
    max_stock: 15
  },

  // Fuel System Parts
  {
    sku_code: 'FUE001',
    sku_name: 'Honda Civic Fuel Filter',
    brand_name: 'Honda',
    category_name: 'Fuel System',
    part_type_name: 'Fuel Filter',
    make_name: 'Honda',
    model_compatibility: ['Civic', 'Accord', 'CR-V'],
    year_from: 2016,
    year_to: 2024,
    oem_part_number: '16010-RBB-000',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 18.50,
    unit_price: 36.99,
    barcode: '123456789021',
    description: 'In-tank fuel filter for Honda direct injection engines',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 45,
    safety_stock: 12,
    reorder_point: 24,
    max_stock: 100
  },
  {
    sku_code: 'FUE002',
    sku_name: 'BMW 335i Fuel Injector',
    brand_name: 'BMW',
    category_name: 'Fuel System',
    part_type_name: 'Fuel Injector',
    make_name: 'BMW',
    model_compatibility: ['335i', '435i', 'X3', 'X4'],
    year_from: 2012,
    year_to: 2016,
    oem_part_number: '13537585261',
    manufacturer: 'BMW AG',
    unit_cost: 145.00,
    unit_price: 289.99,
    barcode: '123456789022',
    description: 'Direct injection fuel injector for BMW N55 engine',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 24,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 60
  },

  // Interior Parts
  {
    sku_code: 'INT001',
    sku_name: 'Universal Leather Seat Covers',
    brand_name: 'WeatherTech',
    category_name: 'Interior',
    part_type_name: 'Seat Cover',
    make_name: 'Universal',
    model_compatibility: ['Most Vehicles'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'SC-LEATHER-BLK',
    manufacturer: 'WeatherTech',
    unit_cost: 125.00,
    unit_price: 249.99,
    barcode: '123456789023',
    description: 'Premium leather seat covers - universal fit',
    warranty_months: 12,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 18,
    safety_stock: 5,
    reorder_point: 10,
    max_stock: 40
  },
  {
    sku_code: 'INT002',
    sku_name: 'Toyota Camry Floor Mats',
    brand_name: 'Toyota',
    category_name: 'Interior',
    part_type_name: 'Floor Mat',
    make_name: 'Toyota',
    model_compatibility: ['Camry'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: 'PT908-03180-20',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 65.00,
    unit_price: 129.99,
    barcode: '123456789024',
    description: 'All-weather floor mats for Toyota Camry',
    warranty_months: 12,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 50
  },

  // HVAC Parts
  {
    sku_code: 'HVA001',
    sku_name: 'Honda Accord Cabin Air Filter',
    brand_name: 'Honda',
    category_name: 'HVAC',
    part_type_name: 'Cabin Filter',
    make_name: 'Honda',
    model_compatibility: ['Accord', 'Pilot', 'Ridgeline'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '80292-TGS-A41',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 15.50,
    unit_price: 29.99,
    barcode: '123456789025',
    description: 'Premium cabin air filter with activated carbon',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 65,
    safety_stock: 15,
    reorder_point: 30,
    max_stock: 150
  },
  {
    sku_code: 'HVA002',
    sku_name: 'BMW X5 A/C Compressor',
    brand_name: 'BMW',
    category_name: 'HVAC',
    part_type_name: 'A/C Compressor',
    make_name: 'BMW',
    model_compatibility: ['X5', 'X6'],
    year_from: 2014,
    year_to: 2023,
    oem_part_number: '64526987862',
    manufacturer: 'BMW AG',
    unit_cost: 685.00,
    unit_price: 1349.99,
    barcode: '123456789026',
    description: 'A/C compressor for BMW X5/X6 climate control system',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 4,
    safety_stock: 1,
    reorder_point: 2,
    max_stock: 12
  },

  // Tires and Wheels
  {
    sku_code: 'TIR001',
    sku_name: 'Michelin Pilot Sport 4S 245/40R18',
    brand_name: 'Michelin',
    category_name: 'Tires',
    part_type_name: 'Performance Tire',
    make_name: 'Universal',
    model_compatibility: ['Sports Cars', 'Performance Sedans'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'MIC-245-40-18-PS4S',
    manufacturer: 'Michelin North America',
    unit_cost: 185.00,
    unit_price: 369.99,
    barcode: '123456789027',
    description: 'Ultra-high performance summer tire 245/40R18',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 32,
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 80
  },
  {
    sku_code: 'TIR002',
    sku_name: 'Bridgestone Blizzak WS90 215/60R16',
    brand_name: 'Bridgestone',
    category_name: 'Tires',
    part_type_name: 'Winter Tire',
    make_name: 'Universal',
    model_compatibility: ['Sedans', 'SUVs'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'BRI-215-60-16-WS90',
    manufacturer: 'Bridgestone Americas',
    unit_cost: 125.00,
    unit_price: 249.99,
    barcode: '123456789028',
    description: 'Premium winter tire with advanced tread compound',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 48,
    safety_stock: 12,
    reorder_point: 24,
    max_stock: 120
  },

  // Tools and Equipment
  {
    sku_code: 'TOO001',
    sku_name: 'Snap-on 3/8" Drive Socket Set',
    brand_name: 'Snap-on',
    category_name: 'Tools',
    part_type_name: 'Socket Set',
    make_name: 'Universal',
    model_compatibility: ['All Vehicles'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: '238SFRM',
    manufacturer: 'Snap-on Incorporated',
    unit_cost: 385.00,
    unit_price: 749.99,
    barcode: '123456789029',
    description: 'Professional 3/8" drive socket set with ratchet',
    warranty_months: 120,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 8,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 25
  },
  {
    sku_code: 'TOO002',
    sku_name: 'OBD2 Diagnostic Scanner',
    brand_name: 'Launch',
    category_name: 'Tools',
    part_type_name: 'Diagnostic Tool',
    make_name: 'Universal',
    model_compatibility: ['All OBD2 Vehicles'],
    year_from: 1996,
    year_to: 2024,
    oem_part_number: 'CRP129X',
    manufacturer: 'Launch Tech Co.',
    unit_cost: 145.00,
    unit_price: 289.99,
    barcode: '123456789030',
    description: 'Professional OBD2 diagnostic scanner with live data',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 12,
    safety_stock: 4,
    reorder_point: 8,
    max_stock: 30
  },

  // Fluids and Chemicals
  {
    sku_code: 'FLU001',
    sku_name: 'Mobil 1 Full Synthetic 5W-30',
    brand_name: 'Mobil 1',
    category_name: 'Fluids',
    part_type_name: 'Motor Oil',
    make_name: 'Universal',
    model_compatibility: ['Most Vehicles'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'MOB1-5W30-5QT',
    manufacturer: 'ExxonMobil',
    unit_cost: 22.50,
    unit_price: 44.99,
    barcode: '123456789031',
    description: 'Advanced full synthetic motor oil 5W-30 - 5 quart',
    warranty_months: 12,
    unit_of_measure: 'Bottle',
    status: 'active',
    initial_stock: 85,
    safety_stock: 20,
    reorder_point: 40,
    max_stock: 200
  },
  {
    sku_code: 'FLU002',
    sku_name: 'Prestone Extended Life Coolant',
    brand_name: 'Prestone',
    category_name: 'Fluids',
    part_type_name: 'Coolant',
    make_name: 'Universal',
    model_compatibility: ['Most Vehicles'],
    year_from: 2000,
    year_to: 2024,
    oem_part_number: 'PRES-ELC-1GAL',
    manufacturer: 'Prestone Products Corp',
    unit_cost: 12.75,
    unit_price: 24.99,
    barcode: '123456789032',
    description: 'Extended life antifreeze/coolant - 1 gallon',
    warranty_months: 60,
    unit_of_measure: 'Gallon',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 15,
    reorder_point: 30,
    max_stock: 100
  },

  // Additional parts to reach 100+
  {
    sku_code: 'ENG006',
    sku_name: 'Mercedes-Benz C-Class Timing Chain',
    brand_name: 'Mercedes-Benz',
    category_name: 'Engine',
    part_type_name: 'Timing Chain',
    make_name: 'Mercedes-Benz',
    model_compatibility: ['C-Class', 'E-Class', 'GLC'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '2710500900',
    manufacturer: 'Mercedes-Benz AG',
    unit_cost: 125.00,
    unit_price: 249.99,
    barcode: '123456789033',
    description: 'Timing chain for Mercedes-Benz M274 engine',
    warranty_months: 60,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 15,
    safety_stock: 5,
    reorder_point: 10,
    max_stock: 40
  },
  {
    sku_code: 'ENG007',
    sku_name: 'Audi A4 Turbocharger',
    brand_name: 'Audi',
    category_name: 'Engine',
    part_type_name: 'Turbocharger',
    make_name: 'Audi',
    model_compatibility: ['A4', 'A5', 'Q5'],
    year_from: 2017,
    year_to: 2024,
    oem_part_number: '06K145874H',
    manufacturer: 'Audi AG',
    unit_cost: 1450.00,
    unit_price: 2899.99,
    barcode: '123456789034',
    description: 'Turbocharger assembly for Audi 2.0T EA888 engine',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 3,
    safety_stock: 1,
    reorder_point: 2,
    max_stock: 8
  },
  {
    sku_code: 'ENG008',
    sku_name: 'Subaru Impreza Head Gasket Set',
    brand_name: 'Subaru',
    category_name: 'Engine',
    part_type_name: 'Head Gasket',
    make_name: 'Subaru',
    model_compatibility: ['Impreza', 'Forester', 'Legacy'],
    year_from: 2012,
    year_to: 2024,
    oem_part_number: '10105AA770',
    manufacturer: 'Subaru Corporation',
    unit_cost: 85.00,
    unit_price: 169.99,
    barcode: '123456789035',
    description: 'Complete head gasket set for Subaru FB20 engine',
    warranty_months: 36,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 18,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 50
  },
  {
    sku_code: 'BRK004',
    sku_name: 'Porsche 911 Brake Pad Set Performance',
    brand_name: 'Porsche',
    category_name: 'Brakes',
    part_type_name: 'Brake Pad',
    make_name: 'Porsche',
    model_compatibility: ['911', 'Boxster', 'Cayman'],
    year_from: 2012,
    year_to: 2024,
    oem_part_number: '99135194900',
    manufacturer: 'Porsche AG',
    unit_cost: 185.00,
    unit_price: 369.99,
    barcode: '123456789036',
    description: 'High-performance brake pads for Porsche 911',
    warranty_months: 12,
    unit_of_measure: 'Set',
    status: 'active',
    initial_stock: 8,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 25
  },
  {
    sku_code: 'BRK005',
    sku_name: 'Tesla Model 3 Brake Rotor Front',
    brand_name: 'Tesla',
    category_name: 'Brakes',
    part_type_name: 'Brake Rotor',
    make_name: 'Tesla',
    model_compatibility: ['Model 3', 'Model Y'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '1044228-00-B',
    manufacturer: 'Tesla Inc.',
    unit_cost: 145.00,
    unit_price: 289.99,
    barcode: '123456789037',
    description: 'Front brake rotor for Tesla Model 3/Y',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 12,
    safety_stock: 4,
    reorder_point: 8,
    max_stock: 30
  },
  {
    sku_code: 'SUS003',
    sku_name: 'Jeep Wrangler Coil Spring Front',
    brand_name: 'Jeep',
    category_name: 'Suspension',
    part_type_name: 'Coil Spring',
    make_name: 'Jeep',
    model_compatibility: ['Wrangler', 'Gladiator'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '68302735AA',
    manufacturer: 'Stellantis',
    unit_cost: 65.00,
    unit_price: 129.99,
    barcode: '123456789038',
    description: 'Front coil spring for Jeep Wrangler JL',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 16,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 40
  },
  {
    sku_code: 'SUS004',
    sku_name: 'Range Rover Air Suspension Strut',
    brand_name: 'Land Rover',
    category_name: 'Suspension',
    part_type_name: 'Air Strut',
    make_name: 'Land Rover',
    model_compatibility: ['Range Rover', 'Range Rover Sport'],
    year_from: 2013,
    year_to: 2024,
    oem_part_number: 'LR061663',
    manufacturer: 'Jaguar Land Rover',
    unit_cost: 685.00,
    unit_price: 1349.99,
    barcode: '123456789039',
    description: 'Front air suspension strut for Range Rover',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 4,
    safety_stock: 2,
    reorder_point: 4,
    max_stock: 15
  },
  {
    sku_code: 'ELE003',
    sku_name: 'Mazda CX-5 Alternator',
    brand_name: 'Mazda',
    category_name: 'Electrical',
    part_type_name: 'Alternator',
    make_name: 'Mazda',
    model_compatibility: ['CX-5', 'CX-9', 'Mazda6'],
    year_from: 2017,
    year_to: 2024,
    oem_part_number: 'PE0118300A',
    manufacturer: 'Mazda Motor Corporation',
    unit_cost: 245.00,
    unit_price: 489.99,
    barcode: '123456789040',
    description: '140A alternator for Mazda SkyActiv engines',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 4,
    reorder_point: 8,
    max_stock: 25
  },
  {
    sku_code: 'ELE004',
    sku_name: 'Volkswagen GTI Ignition Coil',
    brand_name: 'Volkswagen',
    category_name: 'Electrical',
    part_type_name: 'Ignition Coil',
    make_name: 'Volkswagen',
    model_compatibility: ['Golf GTI', 'Jetta GLI', 'Passat'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '06K905115G',
    manufacturer: 'Volkswagen AG',
    unit_cost: 65.00,
    unit_price: 129.99,
    barcode: '123456789041',
    description: 'Ignition coil for VW 2.0T EA888 engine',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 28,
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 60
  },
  {
    sku_code: 'TRN003',
    sku_name: 'Ford Mustang Driveshaft',
    brand_name: 'Ford',
    category_name: 'Transmission',
    part_type_name: 'Driveshaft',
    make_name: 'Ford',
    model_compatibility: ['Mustang', 'Mustang GT'],
    year_from: 2015,
    year_to: 2023,
    oem_part_number: 'FR3Z-4602-A',
    manufacturer: 'Ford Motor Company',
    unit_cost: 385.00,
    unit_price: 749.99,
    barcode: '123456789042',
    description: 'Rear driveshaft assembly for Ford Mustang',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 6,
    safety_stock: 2,
    reorder_point: 4,
    max_stock: 15
  },
  {
    sku_code: 'TRN004',
    sku_name: 'Acura TLX Transmission Mount',
    brand_name: 'Acura',
    category_name: 'Transmission',
    part_type_name: 'Transmission Mount',
    make_name: 'Acura',
    model_compatibility: ['TLX', 'Accord'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '50810-TZ5-A01',
    manufacturer: 'Honda Motor Co.',
    unit_cost: 85.00,
    unit_price: 169.99,
    barcode: '123456789043',
    description: 'Transmission mount for Acura TLX V6',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 22,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 50
  },
  {
    sku_code: 'BOD003',
    sku_name: 'Chevrolet Camaro Hood',
    brand_name: 'Chevrolet',
    category_name: 'Body',
    part_type_name: 'Hood',
    make_name: 'Chevrolet',
    model_compatibility: ['Camaro'],
    year_from: 2016,
    year_to: 2024,
    oem_part_number: '84135309',
    manufacturer: 'General Motors',
    unit_cost: 525.00,
    unit_price: 1049.99,
    barcode: '123456789044',
    description: 'Steel hood for Chevrolet Camaro 6th generation',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 3,
    safety_stock: 1,
    reorder_point: 2,
    max_stock: 8
  },
  {
    sku_code: 'BOD004',
    sku_name: 'Infiniti Q50 Grille Assembly',
    brand_name: 'Infiniti',
    category_name: 'Body',
    part_type_name: 'Grille',
    make_name: 'Infiniti',
    model_compatibility: ['Q50', 'Q60'],
    year_from: 2018,
    year_to: 2024,
    oem_part_number: '62310-4GA0A',
    manufacturer: 'Nissan Motor Co.',
    unit_cost: 185.00,
    unit_price: 369.99,
    barcode: '123456789045',
    description: 'Front grille assembly for Infiniti Q50',
    warranty_months: 12,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 8,
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 20
  },
  {
    sku_code: 'COL003',
    sku_name: 'Lexus RX Cooling Fan Assembly',
    brand_name: 'Lexus',
    category_name: 'Cooling',
    part_type_name: 'Cooling Fan',
    make_name: 'Lexus',
    model_compatibility: ['RX 350', 'RX 450h', 'Highlander'],
    year_from: 2016,
    year_to: 2024,
    oem_part_number: '16711-0P180',
    manufacturer: 'Toyota Motor Corporation',
    unit_cost: 285.00,
    unit_price: 569.99,
    barcode: '123456789046',
    description: 'Dual cooling fan assembly for Lexus RX',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 0, // Out of stock
    safety_stock: 3,
    reorder_point: 6,
    max_stock: 20
  },
  {
    sku_code: 'COL004',
    sku_name: 'Cadillac Escalade Radiator Hose Upper',
    brand_name: 'Cadillac',
    category_name: 'Cooling',
    part_type_name: 'Coolant Hose',
    make_name: 'Cadillac',
    model_compatibility: ['Escalade', 'Tahoe', 'Yukon'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '23434865',
    manufacturer: 'General Motors',
    unit_cost: 45.00,
    unit_price: 89.99,
    barcode: '123456789047',
    description: 'Upper radiator hose for GM 6.2L V8 engine',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 35,
    safety_stock: 8,
    reorder_point: 16,
    max_stock: 80
  },
  {
    sku_code: 'EXH003',
    sku_name: 'Subaru WRX Exhaust Header',
    brand_name: 'Subaru',
    category_name: 'Exhaust',
    part_type_name: 'Header',
    make_name: 'Subaru',
    model_compatibility: ['WRX', 'WRX STI'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '44011AA671',
    manufacturer: 'Subaru Corporation',
    unit_cost: 445.00,
    unit_price: 889.99,
    barcode: '123456789048',
    description: 'Performance exhaust header for Subaru FA20DIT',
    warranty_months: 36,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 5,
    safety_stock: 2,
    reorder_point: 4,
    max_stock: 15
  },
  {
    sku_code: 'EXH004',
    sku_name: 'Dodge Challenger Oxygen Sensor',
    brand_name: 'Mopar',
    category_name: 'Exhaust',
    part_type_name: 'Oxygen Sensor',
    make_name: 'Dodge',
    model_compatibility: ['Challenger', 'Charger', 'Durango'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '68365035AA',
    manufacturer: 'Stellantis',
    unit_cost: 85.00,
    unit_price: 169.99,
    barcode: '123456789049',
    description: 'Downstream oxygen sensor for Dodge 6.4L HEMI',
    warranty_months: 24,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 18,
    safety_stock: 6,
    reorder_point: 12,
    max_stock: 50
  },
  {
    sku_code: 'FUE003',
    sku_name: 'Hyundai Sonata Fuel Tank',
    brand_name: 'Hyundai',
    category_name: 'Fuel System',
    part_type_name: 'Fuel Tank',
    make_name: 'Hyundai',
    model_compatibility: ['Sonata', 'Optima'],
    year_from: 2015,
    year_to: 2024,
    oem_part_number: '31150-C1000',
    manufacturer: 'Hyundai Motor Company',
    unit_cost: 485.00,
    unit_price: 969.99,
    barcode: '123456789050',
    description: 'Fuel tank assembly for Hyundai Sonata',
    warranty_months: 60,
    unit_of_measure: 'Each',
    status: 'active',
    initial_stock: 3,
    safety_stock: 1,
    reorder_point: 2,
    max_stock: 10
  },
];

// Function to initialize automotive parts data
export const initializeAutomotivePartsData = async () => {
  try {
    console.log('🚀 Initializing automotive parts database...');
    
    // First, ensure the database is initialized
    await dataService.initialize();
    
    // Create/update brands
    const brands = [...new Set(automotivePartsData.map(part => part.brand_name))];
    for (const brandName of brands) {
      await dataService.addBrand({
        name: brandName,
        description: `${brandName} automotive parts`,
        is_active: true
      });
    }
    
    // Create part categories (mapped from existing flavors table structure)
    const categories = [...new Set(automotivePartsData.map(part => part.category_name))];
    for (const categoryName of categories) {
      await dataService.addFlavor({
        name: categoryName,
        description: `${categoryName} automotive parts category`,
        is_active: true
      });
    }
    
    // Create part types (mapped from existing pack_sizes table structure)
    const partTypes = [...new Set(automotivePartsData.map(part => part.part_type_name))];
    for (const partTypeName of partTypes) {
      await dataService.addPackSize({
        name: partTypeName,
        volume_ml: 0, // Not applicable for auto parts
        unit_count: 1,
        description: `${partTypeName} automotive part type`,
        is_active: true
      });
    }
    
    // Get the created entities for reference
    const brandEntities = await dataService.getBrands();
    const categoryEntities = await dataService.getFlavors(); // Using flavors as categories
    const partTypeEntities = await dataService.getPackSizes(); // Using pack sizes as part types
    const warehouses = await dataService.getWarehouses();
    
    // Ensure we have at least one warehouse
    if (warehouses.length === 0) {
      await dataService.addWarehouse({
        name: 'Main Distribution Center',
        code: 'MDC',
        address: '1500 Industrial Blvd',
        city: 'Houston',
        state: 'TX',
        zip_code: '77001',
        country: 'USA',
        is_active: true
      });
    }
    
    const updatedWarehouses = await dataService.getWarehouses();
    const mainWarehouse = updatedWarehouses[0];
    
    // Create SKUs and inventory records
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const partData of automotivePartsData) {
      try {
        // Find brand, category, and part type IDs
        const brand = brandEntities.find(b => b.name === partData.brand_name);
        const category = categoryEntities.find(c => c.name === partData.category_name);
        const partType = partTypeEntities.find(pt => pt.name === partData.part_type_name);
        
        // Check if SKU already exists
        const existingSKUs = await dataService.getSKUs();
        const existingSKU = existingSKUs.find(sku => sku.sku_code === partData.sku_code);
        
        if (existingSKU) {
          skippedCount++;
          continue;
        }
        
        // Create SKU
        const skuResult = await dataService.addSKU({
          sku_code: partData.sku_code,
          sku_name: partData.sku_name,
          brand_id: brand?.id || null,
          flavor_id: category?.id || null, // Using flavor as category
          pack_size_id: partType?.id || null, // Using pack size as part type
          sku_type: 'single',
          status: partData.status,
          barcode: partData.barcode,
          unit_of_measure: partData.unit_of_measure,
          unit_cost: partData.unit_cost,
          unit_price: partData.unit_price,
          description: partData.description,
          launch_date: new Date().toISOString().split('T')[0]
        });
        
        // Create inventory record
        await dataService.addInventoryRecord({
          sku_id: skuResult.id,
          warehouse_id: mainWarehouse.id,
          quantity_on_hand: partData.initial_stock,
          quantity_reserved: 0,
          safety_stock_level: partData.safety_stock,
          reorder_point: partData.reorder_point,
          max_stock_level: partData.max_stock,
          unit_cost: partData.unit_cost
        });
        
        createdCount++;
        
        // Add some variety to stock levels for demonstration
        if (Math.random() > 0.8) {
          // 20% chance to add some transaction history
          await dataService.addInventoryTransaction({
            sku_id: skuResult.id,
            warehouse_id: mainWarehouse.id,
            transaction_type: 'receipt',
            quantity: Math.floor(Math.random() * 50) + 10,
            reference_type: 'adjustment',
            unit_cost: partData.unit_cost,
            notes: 'Initial stock adjustment'
          });
        }
        
      } catch (error) {
        console.error(`Error creating part ${partData.sku_code}:`, error);
        skippedCount++;
      }
    }
    
    console.log(`✅ Automotive parts initialization complete!`);
    console.log(`📦 Created: ${createdCount} new parts`);
    console.log(`⏭️ Skipped: ${skippedCount} existing parts`);
    console.log(`🏭 Total parts in database: ${createdCount + skippedCount}`);
    
    // Create Kit SKUs for BOM functionality
    console.log('🔧 Creating Kit SKUs for BOM system...');
    
    const kitSKUs = [
      {
        sku_code: 'KIT001',
        sku_name: 'Complete Engine Maintenance Kit - Toyota Camry',
        brand_name: 'Toyota',
        category_name: 'Engine',
        part_type_name: 'Maintenance Kit',
        make_name: 'Toyota',
        model_compatibility: ['Camry'],
        sku_type: 'kit',
        unit_cost: 45.00,
        unit_price: 89.99,
        description: 'Complete engine maintenance kit including oil filter, air filter, spark plugs, and PCV valve',
        initial_stock: 25,
        safety_stock: 5,
        reorder_point: 10,
        max_stock: 100,
      },
      {
        sku_code: 'KIT002',
        sku_name: 'Brake Service Kit - Honda Civic',
        brand_name: 'Honda',
        category_name: 'Brakes',
        part_type_name: 'Service Kit',
        make_name: 'Honda',
        model_compatibility: ['Civic'],
        sku_type: 'kit',
        unit_cost: 85.00,
        unit_price: 149.99,
        description: 'Complete brake service kit with pads, rotors, and brake fluid',
        initial_stock: 15,
        safety_stock: 3,
        reorder_point: 8,
        max_stock: 50,
      },
      {
        sku_code: 'KIT003',
        sku_name: 'Suspension Repair Kit - Ford F-150',
        brand_name: 'Ford',
        category_name: 'Suspension',
        part_type_name: 'Repair Kit',
        make_name: 'Ford',
        model_compatibility: ['F-150'],
        sku_type: 'kit',
        unit_cost: 120.00,
        unit_price: 199.99,
        description: 'Front suspension repair kit including struts, springs, and mounting hardware',
        initial_stock: 10,
        safety_stock: 2,
        reorder_point: 5,
        max_stock: 30,
      }
    ];

    for (const kitData of kitSKUs) {
      try {
        await dataService.createSKU({
          sku_code: kitData.sku_code,
          sku_name: kitData.sku_name,
          brand_id: brands.find(b => b.name === kitData.brand_name)?.id || 1,
          category_id: categories.find(c => c.name === kitData.category_name)?.id || 1,
          part_type_id: partTypes.find(pt => pt.name === kitData.part_type_name)?.id || 1,
          make_id: makes.find(m => m.name === kitData.make_name)?.id || 1,
          sku_type: 'kit',
          unit_cost: kitData.unit_cost,
          unit_price: kitData.unit_price,
          barcode: `KIT${kitData.sku_code.slice(-3)}${Math.random().toString().slice(2, 8)}`,
          description: kitData.description,
          warranty_months: 12,
          unit_of_measure: 'Kit',
          status: 'active',
          launch_date: new Date().toISOString().split('T')[0]
        });

        // Create inventory record for the kit
        const createdSKUs = await dataService.getSKUs();
        const createdKitSKU = createdSKUs.find(sku => sku.sku_code === kitData.sku_code);
        
        if (createdKitSKU) {
          await dataService.updateInventoryLevel(
            createdKitSKU.id,
            1, // Main warehouse
            kitData.initial_stock,
            'initial',
            null,
            `Initial stock for kit ${kitData.sku_code}`
          );
          
          createdCount++;
        }
      } catch (error) {
        console.log(`Kit SKU ${kitData.sku_code} might already exist, skipping...`);
        skippedCount++;
      }
    }
    
    console.log('✅ Kit SKUs created successfully!');

    // Create some sample out-of-stock scenarios for workflow demonstration
    console.log('🔄 Setting up workflow demonstration scenarios...');
    
    const outOfStockSKUs = ['ENG002', 'BRK002', 'BOD002', 'ELE002', 'INT002', 'FLU002', 'ELE003', 'COL003'];
    const lowStockSKUs = ['ENG003', 'TRN002'];
    
    // Update some SKUs to be out of stock or low stock
    const allSKUs = await dataService.getSKUs();
    const allInventory = await dataService.getInventory();
    
    for (const skuCode of outOfStockSKUs) {
      const sku = allSKUs.find(s => s.sku_code === skuCode);
      if (sku) {
        const inventoryRecord = allInventory.find(inv => inv.sku_id === sku.id);
        if (inventoryRecord) {
          await dataService.updateInventoryLevel(
            sku.id,
            inventoryRecord.warehouse_id,
            -inventoryRecord.quantity_on_hand,
            'adjustment',
            null,
            'Setting up out-of-stock scenario for workflow demo'
          );
        }
      }
    }
    
    for (const skuCode of lowStockSKUs) {
      const sku = allSKUs.find(s => s.sku_code === skuCode);
      if (sku) {
        const inventoryRecord = allInventory.find(inv => inv.sku_id === sku.id);
        if (inventoryRecord && inventoryRecord.quantity_on_hand > inventoryRecord.safety_stock_level) {
          const reduction = inventoryRecord.quantity_on_hand - Math.floor(inventoryRecord.safety_stock_level * 0.5);
          await dataService.updateInventoryLevel(
            sku.id,
            inventoryRecord.warehouse_id,
            -reduction,
            'adjustment',
            null,
            'Setting up low-stock scenario for workflow demo'
          );
        }
      }
    }
    
    console.log('✅ Workflow demonstration scenarios created!');
    console.log('🎯 Ready for workflow testing with realistic automotive data');
    
    return {
      success: true,
      created: createdCount,
      skipped: skippedCount,
      total: createdCount + skippedCount
    };
    
  } catch (error) {
    console.error('❌ Error initializing automotive parts data:', error);
    throw error;
  }
};