-- Ntigi Shipping Database Schema
-- PostgreSQL/Supabase Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agencies (Root entity for courier brands)
CREATE TABLE agencies (
  agency_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  tax_id VARCHAR(50) NOT NULL UNIQUE,
  logo_url TEXT,
  base_currency CHAR(3) NOT NULL DEFAULT 'XAF',
  fiscal_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Branches/Stops (Specific physical locations)
CREATE TABLE branches (
  stop_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  stop_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  printer_type VARCHAR(20) DEFAULT 'THERMAL_80MM' CHECK (printer_type IN ('THERMAL_58MM', 'THERMAL_80MM')),
  contact_person VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agency_id, stop_name, city)
);

-- Users/Agents (Internal staff)
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(stop_id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'AGENT' CHECK (role IN ('SUPER_ADMIN', 'MANAGER', 'AGENT', 'DRIVER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients/Customers (Senders and Receivers)
CREATE TABLE clients (
  client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Package Types (Classification and pricing)
CREATE TABLE package_types (
  type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  unit_type VARCHAR(20) NOT NULL CHECK (unit_type IN ('WEIGHT', 'VOLUME', 'FLAT_RATE', 'ITEM_COUNT')),
  price_per_unit DECIMAL(12, 2) NOT NULL,
  handling_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agency_id, label)
);

-- Shipments (Core transaction records)
CREATE TABLE shipments (
  tracking_no CHAR(7) PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
  receiver_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
  origin_id UUID NOT NULL REFERENCES branches(stop_id) ON DELETE RESTRICT,
  dest_id UUID NOT NULL REFERENCES branches(stop_id) ON DELETE RESTRICT,
  package_type_id UUID NOT NULL REFERENCES package_types(type_id) ON DELETE RESTRICT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED', 'CANCELLED')),
  total_weight DECIMAL(10, 2),
  total_volume DECIMAL(10, 4),
  quantity INTEGER DEFAULT 1,
  total_cost DECIMAL(12, 2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipment Photos (Visual verification)
CREATE TABLE shipment_photos (
  photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id CHAR(7) NOT NULL REFERENCES shipments(tracking_no) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE,
  stage VARCHAR(20) CHECK (stage IN ('INTAKE', 'DELIVERY')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fleet/Vehicles (Transportation assets)
CREATE TABLE vehicles (
  vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  plate_number VARCHAR(50) NOT NULL UNIQUE,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('BIKE', 'VAN', 'BUS', 'TRUCK')),
  capacity_kg DECIMAL(10, 2),
  is_trackable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manifests (Loading lists/trips)
CREATE TABLE manifests (
  manifest_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  origin_id UUID NOT NULL REFERENCES branches(stop_id),
  dest_id UUID NOT NULL REFERENCES branches(stop_id),
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manifest Items (Links shipments to manifests)
CREATE TABLE manifest_items (
  manifest_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_id UUID NOT NULL REFERENCES manifests(manifest_id) ON DELETE CASCADE,
  shipment_id CHAR(7) NOT NULL REFERENCES shipments(tracking_no) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(manifest_id, shipment_id)
);

-- Tracking Logs (High-frequency location data)
CREATE TABLE tracking_logs (
  log_id BIGSERIAL PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEX ON tracking_logs FOR FASTER QUERIES
CREATE INDEX idx_tracking_logs_vehicle_timestamp ON tracking_logs(vehicle_id, timestamp DESC);

-- Transactions/Payments (Financial records)
CREATE TABLE transactions (
  txn_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id CHAR(7) NOT NULL REFERENCES shipments(tracking_no) ON DELETE CASCADE,
  method VARCHAR(20) NOT NULL CHECK (method IN ('CASH', 'MOBILE_MONEY', 'WALLET')),
  amount DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Localization Settings (i18n)
CREATE TABLE localization_settings (
  lang_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iso_code VARCHAR(10) NOT NULL UNIQUE,
  translation_json JSONB,
  agency_id UUID REFERENCES agencies(agency_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Receipt Templates (Thermal printer layouts)
CREATE TABLE receipt_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  header_text TEXT,
  footer_text TEXT,
  show_qr_code BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR COMMON QUERIES
CREATE INDEX idx_shipments_tracking ON shipments(tracking_no);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_sender ON shipments(sender_id);
CREATE INDEX idx_shipments_receiver ON shipments(receiver_id);
CREATE INDEX idx_shipments_created ON shipments(created_at DESC);
CREATE INDEX idx_branches_agency ON branches(agency_id);
CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_vehicles_agency ON vehicles(agency_id);
CREATE INDEX idx_manifests_vehicle ON manifests(vehicle_id);
CREATE INDEX idx_manifests_created ON manifests(created_at DESC);
CREATE INDEX idx_manifest_items_manifest ON manifest_items(manifest_id);
CREATE INDEX idx_transactions_shipment ON transactions(shipment_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_package_types_agency ON package_types(agency_id);

-- SAMPLE DATA (Optional - for testing)
-- Insert sample agency
INSERT INTO agencies (name, tax_id, logo_url, base_currency, fiscal_address)
VALUES ('Ntigi Shipping Demo', 'XX-XXXXXX', 'https://example.com/logo.png', 'XAF', 'Yaoundé, Cameroon')
ON CONFLICT DO NOTHING;

-- Insert sample branches
INSERT INTO branches (agency_id, stop_name, city, latitude, longitude, printer_type)
SELECT agency_id, 'Mvan Station', 'Yaoundé', 3.8480, 11.5021, 'THERMAL_80MM'
FROM agencies WHERE name = 'Ntigi Shipping Demo'
ON CONFLICT DO NOTHING;

INSERT INTO branches (agency_id, stop_name, city, latitude, longitude, printer_type)
SELECT agency_id, 'Akwa Hub', 'Douala', 4.0511, 9.7697, 'THERMAL_80MM'
FROM agencies WHERE name = 'Ntigi Shipping Demo'
ON CONFLICT DO NOTHING;

-- Insert sample package types
INSERT INTO package_types (agency_id, label, unit_type, price_per_unit, handling_notes)
SELECT agency_id, 'Documents', 'FLAT_RATE', 2000, 'Standard letter/document rate'
FROM agencies WHERE name = 'Ntigi Shipping Demo'
ON CONFLICT DO NOTHING;

INSERT INTO package_types (agency_id, label, unit_type, price_per_unit, handling_notes)
SELECT agency_id, 'Electronics', 'WEIGHT', 500, 'Fragile - Handle with care'
FROM agencies WHERE name = 'Ntigi Shipping Demo'
ON CONFLICT DO NOTHING;

INSERT INTO package_types (agency_id, label, unit_type, price_per_unit, handling_notes)
SELECT agency_id, 'Perishables', 'FLAT_RATE', 5000, 'Keep refrigerated'
FROM agencies WHERE name = 'Ntigi Shipping Demo'
ON CONFLICT DO NOTHING;
