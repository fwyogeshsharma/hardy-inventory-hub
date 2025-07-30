// Comprehensive automotive parts sample data with 100+ SKUs
import { dataService } from './database';

interface SKUData {
  sku_name: string;
  brand_id: number;
  category_id: number;
  part_type_id: number;
  sku_type: 'single' | 'kit';
  status: 'active' | 'upcoming' | 'discontinued';
  barcode: string;
  unit_of_measure: string;
  launch_date: string;
  components?: { component_sku_id: number; quantity: number }[];
}

// Generate comprehensive automotive parts data
export const generateComprehensiveSampleData = (): SKUData[] => {
  const sampleSKUs: SKUData[] = [
    // Engine Components (30+ items)
    { sku_name: "ACDelco Professional Oil Filter", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "ACO001", unit_of_measure: "Each", launch_date: "2024-01-15" },
    { sku_name: "Bosch Premium Spark Plugs Set", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "BSP002", unit_of_measure: "Set", launch_date: "2024-01-20" },
    { sku_name: "Motorcraft Synthetic Oil 5W-30", brand_id: 3, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "MSO003", unit_of_measure: "Quart", launch_date: "2024-02-01" },
    { sku_name: "Denso Air Filter Element", brand_id: 4, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "DAF004", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "NGK Iridium Spark Plugs V6", brand_id: 5, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "NIS005", unit_of_measure: "Set", launch_date: "2024-02-15" },
    { sku_name: "ACDelco Fuel Injector Set", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "AFI006", unit_of_measure: "Set", launch_date: "2024-03-01" },
    { sku_name: "Bosch Mass Airflow Sensor", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "BMA007", unit_of_measure: "Each", launch_date: "2024-03-05" },
    { sku_name: "Motorcraft Throttle Body", brand_id: 3, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "MTB008", unit_of_measure: "Each", launch_date: "2024-03-10" },
    { sku_name: "Denso Oxygen Sensor Upstream", brand_id: 4, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "DOS009", unit_of_measure: "Each", launch_date: "2024-03-15" },
    { sku_name: "Champion Engine Coolant", brand_id: 6, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "CEC010", unit_of_measure: "Gallon", launch_date: "2024-03-20" },
    { sku_name: "ACDelco Timing Belt Kit", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'kit', status: 'active', barcode: "ATB011", unit_of_measure: "Kit", launch_date: "2024-04-01" },
    { sku_name: "Bosch Fuel Pump Assembly", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "BFP012", unit_of_measure: "Each", launch_date: "2024-04-05" },
    { sku_name: "Motorcraft PCV Valve", brand_id: 3, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "MPC013", unit_of_measure: "Each", launch_date: "2024-04-10" },
    { sku_name: "Denso Radiator Assembly", brand_id: 4, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "DRA014", unit_of_measure: "Each", launch_date: "2024-04-15" },
    { sku_name: "NGK Ignition Coil Pack", brand_id: 5, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "NIC015", unit_of_measure: "Each", launch_date: "2024-04-20" },
    { sku_name: "Champion Water Pump", brand_id: 6, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "CWP016", unit_of_measure: "Each", launch_date: "2024-05-01" },
    { sku_name: "ACDelco Thermostat Housing", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "ATH017", unit_of_measure: "Each", launch_date: "2024-05-05" },
    { sku_name: "Bosch Engine Mount Set", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'set', status: 'active', barcode: "BEM018", unit_of_measure: "Set", launch_date: "2024-05-10" },
    { sku_name: "Motorcraft Intake Manifold", brand_id: 3, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "MIM019", unit_of_measure: "Each", launch_date: "2024-05-15" },
    { sku_name: "Denso Crankshaft Position Sensor", brand_id: 4, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "DCP020", unit_of_measure: "Each", launch_date: "2024-05-20" },
    { sku_name: "NGK Camshaft Position Sensor", brand_id: 5, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "NCP021", unit_of_measure: "Each", launch_date: "2024-06-01" },
    { sku_name: "Champion Serpentine Belt", brand_id: 6, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "CSB022", unit_of_measure: "Each", launch_date: "2024-06-05" },
    { sku_name: "ACDelco Valve Cover Gasket", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "AVG023", unit_of_measure: "Each", launch_date: "2024-06-10" },
    { sku_name: "Bosch Head Gasket Set", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'set', status: 'active', barcode: "BHG024", unit_of_measure: "Set", launch_date: "2024-06-15" },
    { sku_name: "Motorcraft Oil Pan Gasket", brand_id: 3, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "MOG025", unit_of_measure: "Each", launch_date: "2024-06-20" },
    { sku_name: "Denso EGR Valve", brand_id: 4, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "DEG026", unit_of_measure: "Each", launch_date: "2024-07-01" },
    { sku_name: "NGK Turbocharger Assembly", brand_id: 5, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "NTA027", unit_of_measure: "Each", launch_date: "2024-07-05" },
    { sku_name: "Champion Supercharger Belt", brand_id: 6, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "CSC028", unit_of_measure: "Each", launch_date: "2024-07-10" },
    { sku_name: "ACDelco Engine Oil Cooler", brand_id: 1, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "AOC029", unit_of_measure: "Each", launch_date: "2024-07-15" },
    { sku_name: "Bosch Variable Valve Timing", brand_id: 2, category_id: 1, part_type_id: 1, sku_type: 'single', status: 'active', barcode: "BVV030", unit_of_measure: "Each", launch_date: "2024-07-20" },

    // Brake System (25+ items)
    { sku_name: "Brembo Front Brake Pads", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BFB031", unit_of_measure: "Set", launch_date: "2024-01-25" },
    { sku_name: "ACDelco Rear Brake Pads", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "ARB032", unit_of_measure: "Set", launch_date: "2024-02-01" },
    { sku_name: "Bosch Brake Rotor Front", brand_id: 2, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BBR033", unit_of_measure: "Each", launch_date: "2024-02-05" },
    { sku_name: "Motorcraft Brake Rotor Rear", brand_id: 3, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "MBR034", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "Denso Brake Caliper Assembly", brand_id: 4, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "DBC035", unit_of_measure: "Each", launch_date: "2024-02-15" },
    { sku_name: "Wagner Brake Master Cylinder", brand_id: 6, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "WBM036", unit_of_measure: "Each", launch_date: "2024-02-20" },
    { sku_name: "ACDelco Brake Fluid DOT 3", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "ABF037", unit_of_measure: "Bottle", launch_date: "2024-03-01" },
    { sku_name: "Bosch ABS Control Module", brand_id: 2, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BAB038", unit_of_measure: "Each", launch_date: "2024-03-05" },
    { sku_name: "Motorcraft Brake Booster", brand_id: 3, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "MBB039", unit_of_measure: "Each", launch_date: "2024-03-10" },
    { sku_name: "Denso Brake Line Kit", brand_id: 4, category_id: 3, part_type_id: 2, sku_type: 'kit', status: 'active', barcode: "DBL040", unit_of_measure: "Kit", launch_date: "2024-03-15" },
    { sku_name: "Wagner Parking Brake Cable", brand_id: 6, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "WPC041", unit_of_measure: "Each", launch_date: "2024-03-20" },
    { sku_name: "ACDelco Brake Shoe Set", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'set', status: 'active', barcode: "ABS042", unit_of_measure: "Set", launch_date: "2024-04-01" },
    { sku_name: "Bosch Brake Drum", brand_id: 2, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BBD043", unit_of_measure: "Each", launch_date: "2024-04-05" },
    { sku_name: "Motorcraft Wheel Cylinder", brand_id: 3, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "MWC044", unit_of_measure: "Each", launch_date: "2024-04-10" },
    { sku_name: "Denso Brake Proportioning Valve", brand_id: 4, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "DBP045", unit_of_measure: "Each", launch_date: "2024-04-15" },
    { sku_name: "Wagner Anti-Lock Brake Sensor", brand_id: 6, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "WAB046", unit_of_measure: "Each", launch_date: "2024-04-20" },
    { sku_name: "ACDelco Brake Pad Wear Sensor", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "APW047", unit_of_measure: "Each", launch_date: "2024-05-01" },
    { sku_name: "Bosch Electronic Brake Control", brand_id: 2, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BEB048", unit_of_measure: "Each", launch_date: "2024-05-05" },
    { sku_name: "Motorcraft Brake Pedal Assembly", brand_id: 3, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "MBP049", unit_of_measure: "Each", launch_date: "2024-05-10" },
    { sku_name: "Denso Brake Light Switch", brand_id: 4, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "DBS050", unit_of_measure: "Each", launch_date: "2024-05-15" },
    { sku_name: "Wagner Brake Hardware Kit", brand_id: 6, category_id: 3, part_type_id: 2, sku_type: 'kit', status: 'active', barcode: "WBH051", unit_of_measure: "Kit", launch_date: "2024-05-20" },
    { sku_name: "ACDelco Brake Hose Set", brand_id: 1, category_id: 3, part_type_id: 2, sku_type: 'set', status: 'active', barcode: "ABH052", unit_of_measure: "Set", launch_date: "2024-06-01" },
    { sku_name: "Bosch Vacuum Brake Booster", brand_id: 2, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "BVB053", unit_of_measure: "Each", launch_date: "2024-06-05" },
    { sku_name: "Motorcraft Brake Reservoir", brand_id: 3, category_id: 3, part_type_id: 2, sku_type: 'single', status: 'active', barcode: "MBR054", unit_of_measure: "Each", launch_date: "2024-06-10" },
    { sku_name: "Denso Complete Brake System Kit", brand_id: 4, category_id: 3, part_type_id: 2, sku_type: 'kit', status: 'active', barcode: "DCB055", unit_of_measure: "Kit", launch_date: "2024-06-15" },

    // Electrical System (20+ items)
    { sku_name: "Delco Car Battery 12V", brand_id: 1, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "DCB056", unit_of_measure: "Each", launch_date: "2024-01-30" },
    { sku_name: "Bosch Alternator 140A", brand_id: 2, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "BAL057", unit_of_measure: "Each", launch_date: "2024-02-05" },
    { sku_name: "Motorcraft Starter Motor", brand_id: 3, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "MSM058", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "Denso Voltage Regulator", brand_id: 4, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "DVR059", unit_of_measure: "Each", launch_date: "2024-02-15" },
    { sku_name: "NGK Ignition Switch", brand_id: 5, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "NIS060", unit_of_measure: "Each", launch_date: "2024-02-20" },
    { sku_name: "Champion Headlight Assembly", brand_id: 6, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "CHA061", unit_of_measure: "Each", launch_date: "2024-03-01" },
    { sku_name: "ACDelco Taillight LED", brand_id: 1, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "ATL062", unit_of_measure: "Each", launch_date: "2024-03-05" },
    { sku_name: "Bosch Wiring Harness", brand_id: 2, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "BWH063", unit_of_measure: "Each", launch_date: "2024-03-10" },
    { sku_name: "Motorcraft Fuse Box", brand_id: 3, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "MFB064", unit_of_measure: "Each", launch_date: "2024-03-15" },
    { sku_name: "Denso Horn Assembly", brand_id: 4, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "DHA065", unit_of_measure: "Each", launch_date: "2024-03-20" },
    { sku_name: "NGK Window Motor", brand_id: 5, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "NWM066", unit_of_measure: "Each", launch_date: "2024-04-01" },
    { sku_name: "Champion Radio Antenna", brand_id: 6, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "CRA067", unit_of_measure: "Each", launch_date: "2024-04-05" },
    { sku_name: "ACDelco ECU Module", brand_id: 1, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "AEM068", unit_of_measure: "Each", launch_date: "2024-04-10" },
    { sku_name: "Bosch Relay Switch Set", brand_id: 2, category_id: 4, part_type_id: 3, sku_type: 'set', status: 'active', barcode: "BRS069", unit_of_measure: "Set", launch_date: "2024-04-15" },
    { sku_name: "Motorcraft Turn Signal Switch", brand_id: 3, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "MTS070", unit_of_measure: "Each", launch_date: "2024-04-20" },
    { sku_name: "Denso Windshield Wiper Motor", brand_id: 4, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "DWM071", unit_of_measure: "Each", launch_date: "2024-05-01" },
    { sku_name: "NGK Distributor Cap", brand_id: 5, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "NDC072", unit_of_measure: "Each", launch_date: "2024-05-05" },
    { sku_name: "Champion Rotor Button", brand_id: 6, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "CRB073", unit_of_measure: "Each", launch_date: "2024-05-10" },
    { sku_name: "ACDelco Power Window Switch", brand_id: 1, category_id: 4, part_type_id: 3, sku_type: 'single', status: 'active', barcode: "APW074", unit_of_measure: "Each", launch_date: "2024-05-15" },
    { sku_name: "Bosch Central Locking System", brand_id: 2, category_id: 4, part_type_id: 3, sku_type: 'system', status: 'active', barcode: "BCL075", unit_of_measure: "System", launch_date: "2024-05-20" },

    // Suspension System (15+ items)
    { sku_name: "Monroe Shock Absorber Front", brand_id: 6, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "MSA076", unit_of_measure: "Each", launch_date: "2024-02-01" },
    { sku_name: "ACDelco Shock Absorber Rear", brand_id: 1, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "ASA077", unit_of_measure: "Each", launch_date: "2024-02-05" },
    { sku_name: "Bosch Strut Assembly", brand_id: 2, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "BSA078", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "Motorcraft Coil Spring", brand_id: 3, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "MCS079", unit_of_measure: "Each", launch_date: "2024-02-15" },
    { sku_name: "Denso Stabilizer Bar", brand_id: 4, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "DSB080", unit_of_measure: "Each", launch_date: "2024-02-20" },
    { sku_name: "Monroe Ball Joint Set", brand_id: 6, category_id: 5, part_type_id: 4, sku_type: 'set', status: 'active', barcode: "MBJ081", unit_of_measure: "Set", launch_date: "2024-03-01" },
    { sku_name: "ACDelco Control Arm", brand_id: 1, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "ACA082", unit_of_measure: "Each", launch_date: "2024-03-05" },
    { sku_name: "Bosch Tie Rod End", brand_id: 2, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "BTE083", unit_of_measure: "Each", launch_date: "2024-03-10" },
    { sku_name: "Motorcraft Sway Bar Link", brand_id: 3, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "MSL084", unit_of_measure: "Each", launch_date: "2024-03-15" },
    { sku_name: "Denso Bushing Kit", brand_id: 4, category_id: 5, part_type_id: 4, sku_type: 'kit', status: 'active', barcode: "DBK085", unit_of_measure: "Kit", launch_date: "2024-03-20" },
    { sku_name: "Monroe Strut Mount", brand_id: 6, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "MSM086", unit_of_measure: "Each", launch_date: "2024-04-01" },
    { sku_name: "ACDelco Shock Mount", brand_id: 1, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "ASM087", unit_of_measure: "Each", launch_date: "2024-04-05" },
    { sku_name: "Bosch Air Suspension Compressor", brand_id: 2, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "BAS088", unit_of_measure: "Each", launch_date: "2024-04-10" },
    { sku_name: "Motorcraft Leaf Spring", brand_id: 3, category_id: 5, part_type_id: 4, sku_type: 'single', status: 'active', barcode: "MLS089", unit_of_measure: "Each", launch_date: "2024-04-15" },
    { sku_name: "Denso Complete Suspension Kit", brand_id: 4, category_id: 5, part_type_id: 4, sku_type: 'kit', status: 'active', barcode: "DCS090", unit_of_measure: "Kit", launch_date: "2024-04-20" },

    // Transmission System (10+ items)
    { sku_name: "Motorcraft ATF Fluid", brand_id: 3, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "MAF091", unit_of_measure: "Quart", launch_date: "2024-01-25" },
    { sku_name: "ACDelco Transmission Filter", brand_id: 1, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "ATF092", unit_of_measure: "Each", launch_date: "2024-02-01" },
    { sku_name: "Bosch CVT Belt", brand_id: 2, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "BCB093", unit_of_measure: "Each", launch_date: "2024-02-05" },
    { sku_name: "Denso Clutch Assembly", brand_id: 4, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "DCA094", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "Motorcraft Torque Converter", brand_id: 3, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "MTC095", unit_of_measure: "Each", launch_date: "2024-02-15" },
    { sku_name: "ACDelco Drive Shaft", brand_id: 1, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "ADS096", unit_of_measure: "Each", launch_date: "2024-02-20" },
    { sku_name: "Bosch CV Joint", brand_id: 2, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "BCV097", unit_of_measure: "Each", launch_date: "2024-03-01" },
    { sku_name: "Denso Differential Assembly", brand_id: 4, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "DDA098", unit_of_measure: "Each", launch_date: "2024-03-05" },
    { sku_name: "Motorcraft U-Joint", brand_id: 3, category_id: 2, part_type_id: 5, sku_type: 'single', status: 'active', barcode: "MUJ099", unit_of_measure: "Each", launch_date: "2024-03-10" },
    { sku_name: "ACDelco Complete Trans Rebuild Kit", brand_id: 1, category_id: 2, part_type_id: 5, sku_type: 'kit', status: 'active', barcode: "ACT100", unit_of_measure: "Kit", launch_date: "2024-03-15" },

    // Exterior Parts (5+ items)
    { sku_name: "ACDelco Side Mirror Assembly", brand_id: 1, category_id: 6, part_type_id: 6, sku_type: 'single', status: 'active', barcode: "ASM101", unit_of_measure: "Each", launch_date: "2024-01-30" },
    { sku_name: "Bosch Windshield Wiper Blades", brand_id: 2, category_id: 6, part_type_id: 6, sku_type: 'set', status: 'active', barcode: "BWB102", unit_of_measure: "Set", launch_date: "2024-02-05" },
    { sku_name: "Motorcraft Door Handle", brand_id: 3, category_id: 6, part_type_id: 6, sku_type: 'single', status: 'active', barcode: "MDH103", unit_of_measure: "Each", launch_date: "2024-02-10" },
    { sku_name: "Denso Sunroof Motor", brand_id: 4, category_id: 6, part_type_id: 6, sku_type: 'single', status: 'active', barcode: "DSM104", unit_of_measure: "Each", launch_date: "2024-02-15" },
    { sku_name: "Champion Body Panel Kit", brand_id: 6, category_id: 6, part_type_id: 6, sku_type: 'kit', status: 'active', barcode: "CBP105", unit_of_measure: "Kit", launch_date: "2024-02-20" },
  ];

  return sampleSKUs;
};

// Initialize comprehensive sample data
export const initializeComprehensiveData = async () => {
  try {
    console.log('🚀 Initializing comprehensive automotive parts database...');
    
    // Initialize basic database structure first
    await dataService.initialize();
    
    // Generate and create comprehensive SKU data
    const sampleSKUs = generateComprehensiveSampleData();
    
    console.log(`📦 Creating ${sampleSKUs.length} automotive parts...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const skuData of sampleSKUs) {
      try {
        await dataService.createSKU(skuData);
        successCount++;
        
        // Log progress every 25 items
        if (successCount % 25 === 0) {
          console.log(`✅ Created ${successCount}/${sampleSKUs.length} SKUs...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to create SKU ${skuData.sku_name}:`, error);
      }
    }
    
    console.log(`🎉 Sample data initialization complete!`);
    console.log(`✅ Successfully created: ${successCount} SKUs`);
    console.log(`❌ Failed to create: ${errorCount} SKUs`);
    console.log(`📊 Total parts in system: ${successCount}`);
    
    return { success: true, created: successCount, failed: errorCount };
  } catch (error) {
    console.error('💥 Failed to initialize comprehensive data:', error);
    return { success: false, error: error.message };
  }
};