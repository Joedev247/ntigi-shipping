// Agency/Company Model
export interface Agency {
  agency_id: string;
  name: string;
  tax_id: string;
  logo_url: string;
  base_currency: string;
  fiscal_address: string;
  created_at: string;
}

// Branch/Stop Model
export interface Branch {
  stop_id: string;
  agency_id: string;
  stop_name: string;
  city: string;
  latitude: number;
  longitude: number;
  printer_type: 'THERMAL_58MM' | 'THERMAL_80MM';
  contact_person?: string;
  created_at: string;
}

// User/Agent Model
export interface AppUser {
  user_id: string;
  branch_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'AGENT' | 'DRIVER';
  is_active: boolean;
  created_at: string;
}

// Client/Customer Model
export interface Client {
  client_id: string;
  phone_number: string;
  full_name: string;
  email?: string;
  is_verified: boolean;
  created_at: string;
}

// Package Type Model
export interface PackageType {
  type_id: string;
  agency_id: string;
  label: string;
  unit_type: 'WEIGHT' | 'VOLUME' | 'FLAT_RATE' | 'ITEM_COUNT';
  price_per_unit: number;
  handling_notes?: string;
  created_at: string;
}

// Shipment Model
export interface Shipment {
  tracking_no: string;
  sender_id: string;
  receiver_id: string;
  origin_id: string;
  dest_id: string;
  package_type_id: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED';
  total_weight?: number;
  total_volume?: number;
  quantity?: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
  description: string;
}

// Shipment Photo Model
export interface ShipmentPhoto {
  photo_id: string;
  shipment_id: string;
  image_url: string;
  captured_at: string;
  stage: 'INTAKE' | 'DELIVERY';
  created_at: string;
}

// Vehicle/Fleet Model
export interface Vehicle {
  vehicle_id: string;
  agency_id: string;
  plate_number: string;
  vehicle_type: 'BIKE' | 'VAN' | 'BUS' | 'TRUCK';
  capacity_kg?: number;
  is_trackable: boolean;
  created_at: string;
}

// Manifest Model
export interface Manifest {
  manifest_id: string;
  vehicle_id: string;
  driver_id: string;
  origin_id: string;
  dest_id: string;
  departure_time: string;
  arrival_time?: string;
  created_at: string;
}

// Manifest Item (links shipments to manifests)
export interface ManifestItem {
  manifest_item_id: string;
  manifest_id: string;
  shipment_id: string;
  created_at: string;
}

// Tracking Log Model
export interface TrackingLog {
  log_id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  created_at: string;
}

// Transaction/Payment Model
export interface Transaction {
  txn_id: string;
  shipment_id: string;
  method: 'CASH' | 'MOBILE_MONEY' | 'WALLET';
  amount: number;
  tax_amount: number;
  created_at: string;
}

// Localization Settings
export interface LocalizationSettings {
  lang_id: string;
  iso_code: string;
  translation_json: Record<string, any>;
  agency_id?: string;
  created_at: string;
}

// Receipt Template
export interface ReceiptTemplate {
  template_id: string;
  agency_id: string;
  header_text: string;
  footer_text: string;
  show_qr_code: boolean;
  created_at: string;
}
