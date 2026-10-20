export interface VehicleModification {
  id: string;
  engine: string;
  powerHp: number;
  transmission: string;
  drivetrain: string;
  trim: string;
}

export interface VehicleGeneration {
  id: string;
  name: string;
  years: string;
  bodyStyle: 'sedan' | 'suv' | 'hatchback' | 'coupe';
  modifications: VehicleModification[];
}

export interface VehicleModel {
  id: string;
  name: string;
  generations: VehicleGeneration[];
}

export interface VehicleBrand {
  id: string;
  name: string;
  country: string;
  models: VehicleModel[];
}

export interface SelectedVehicle {
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  generationId: string;
  generationName: string;
  years: string;
  bodyStyle: 'sedan' | 'suv' | 'hatchback' | 'coupe';
  modificationId: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  trim: string;
}

export type SystemCategoryId =
  | 'engine'
  | 'suspension'
  | 'brakes'
  | 'steering'
  | 'transmission'
  | 'body'
  | 'interior'
  | 'electrical'
  | 'cooling'
  | 'exhaust'
  | 'wheels'
  | 'maintenance';

export interface Subcategory {
  id: string;
  name: string;
  systemId: SystemCategoryId;
  description: string;
}

export interface SystemCategory {
  id: SystemCategoryId;
  name: string;
  shortName: string;
  description: string;
  hotspotPosition: [number, number, number]; // 3D coordinates on the vehicle
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  svgCoords: { x: number; y: number }; // 2D schematic coordinates (0-100%)
  subcategories: Subcategory[];
}

export interface PartSpec {
  label: string;
  value: string;
}

export interface PartCompatibilityRule {
  brandId: string;
  modelId: string;
  generationId?: string; // If omitted, compatible with only brand/model -> triggers "requires verification"
  modificationIds?: string[]; // Exact modification match -> "confirmed compatibility"
  notes?: string;
}

export interface AutoPart {
  id: string;
  sku: string;
  oemNumbers: string[];
  name: string;
  brand: string;
  isOriginal: boolean;
  systemId: SystemCategoryId;
  subcategoryId: string;
  price: number;
  oldPrice?: number;
  stockCount: number;
  deliveryDays: number; // 0 = Today in stock
  popularity: number; // 1-100 for sorting
  warrantyMonths: number;
  illustrationType:
    | 'shock_absorber'
    | 'control_arm'
    | 'wheel_hub'
    | 'brake_disc'
    | 'brake_pads'
    | 'timing_belt'
    | 'spark_plug'
    | 'oil_filter'
    | 'motor_oil'
    | 'radiator'
    | 'exhaust_muffler'
    | 'headlight'
    | 'steering_rack'
    | 'clutch_kit'
    | 'bumper'
    | 'cabin_mat'
    | 'alloy_wheel';
  specs: PartSpec[];
  description: string;
  compatibility: PartCompatibilityRule[];
  analogPartIds: string[];
}

export type CompatibilityStatus =
  | 'compatible'      // Exact match including generation & modification
  | 'verify_required' // Partial match (e.g. brand/model matches, or no modification selected)
  | 'incompatible'    // Does not match selected vehicle
  | 'no_vehicle';     // No vehicle selected in garage

export interface CartItem {
  partId: string;
  quantity: number;
  vehicleContext?: string; // Snapshot of selected vehicle when added
}

export interface OrderDetails {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: string;
  comment: string;
  items: {
    part: AutoPart;
    quantity: number;
    vehicleContext?: string;
  }[];
  totalAmount: number;
}
