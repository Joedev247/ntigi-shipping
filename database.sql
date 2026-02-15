-- NTIGI Shipping Management System - Database Schema
-- PostgreSQL/Supabase | Copy-Paste Ready ✅

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. AGENCIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS agencies (
  agency_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  tax_id VARCHAR(50),
  email TEXT,
  phone TEXT,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  logo_url TEXT,
  base_currency CHAR(3) DEFAULT 'XAF',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. BRANCHES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS branches (
  branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region TEXT,
  country VARCHAR(100),
  address TEXT,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  manager_name VARCHAR(255),
  printer_type VARCHAR(20) DEFAULT 'THERMAL_80MM',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_branch_per_agency UNIQUE(agency_id, name, city)
);

-- ========================================
-- 3. USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(branch_id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email TEXT UNIQUE,
  role VARCHAR(20) DEFAULT 'AGENT',
  password_hash TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_role CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'DRIVER', 'AGENT', 'ACCOUNTANT'))
);

-- ========================================
-- 4. CLIENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS clients (
  client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(agency_id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email TEXT,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  shipping_count INT DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  preferred_contact VARCHAR(20) DEFAULT 'SMS',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_phone UNIQUE(phone_number)
);

-- ========================================
-- 5. VEHICLES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(branch_id) ON DELETE SET NULL,
  plate_number VARCHAR(20) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  make VARCHAR(50),
  model VARCHAR(50),
  year INT,
  capacity_kg DECIMAL(8, 2),
  mileage INT DEFAULT 0,
  insurance_expiry DATE,
  last_service_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  fuel_type VARCHAR(20) DEFAULT 'DIESEL',
  gps_device_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_plate UNIQUE(plate_number),
  CONSTRAINT valid_vehicle_type CHECK (vehicle_type IN ('MOTORCYCLE', 'CAR', 'TRUCK', 'VAN', 'LORRY'))
);

-- ========================================
-- 6. PACKAGE TYPES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS package_types (
  type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  unit_type VARCHAR(20) NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_package_type UNIQUE(agency_id, label),
  CONSTRAINT valid_unit CHECK (unit_type IN ('KG', 'UNIT', 'BOX', 'PALLET'))
);

-- ========================================
-- 7. SHIPMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS shipments (
  shipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  tracking_no VARCHAR(50) NOT NULL,
  sender_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
  receiver_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE RESTRICT,
  origin_id UUID REFERENCES branches(branch_id),
  destination_id UUID REFERENCES branches(branch_id),
  package_type_id UUID REFERENCES package_types(type_id),
  quantity DECIMAL(10, 2),
  weight_kg DECIMAL(8, 2),
  contents_description TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  priority VARCHAR(20) DEFAULT 'NORMAL',
  total_cost DECIMAL(10, 2),
  payment_method VARCHAR(50),
  is_paid BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_tracking UNIQUE(tracking_no),
  CONSTRAINT valid_status CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'DELAYED', 'CANCELLED')),
  CONSTRAINT valid_priority CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
);

-- ========================================
-- 8. MANIFESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS manifests (
  manifest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  origin_id UUID REFERENCES branches(branch_id),
  destination_id UUID REFERENCES branches(branch_id),
  status VARCHAR(50) DEFAULT 'PENDING',
  departure_time TIMESTAMP WITH TIME ZONE,
  arrival_time TIMESTAMP WITH TIME ZONE,
  total_items INT DEFAULT 0,
  total_weight DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_manifest_status CHECK (status IN ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'))
);

-- ========================================
-- 9. MANIFEST ITEMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS manifest_items (
  manifest_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_id UUID NOT NULL REFERENCES manifests(manifest_id) ON DELETE CASCADE,
  shipment_id UUID NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  sequence_no INT,
  status VARCHAR(50) DEFAULT 'IN_MANIFEST',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_manifest_shipment UNIQUE(manifest_id, shipment_id)
);

-- ========================================
-- 10. TRACKING LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS tracking_logs (
  tracking_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(vehicle_id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_name TEXT,
  status VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 11. SHIPMENT PHOTOS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS shipment_photos (
  photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  stage VARCHAR(50) NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_stage CHECK (stage IN ('INTAKE', 'TRANSIT', 'DELIVERY', 'DAMAGE', 'OTHER'))
);

-- ========================================
-- 12. TRANSACTIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  method VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  reference_no VARCHAR(100),
  status VARCHAR(50) DEFAULT 'COMPLETED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_payment_method CHECK (method IN ('CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD', 'CHEQUE'))
);

-- ========================================
-- 13. EXPENSES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS expenses (
  expense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(vehicle_id),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_category CHECK (category IN ('FUEL', 'MAINTENANCE', 'INSURANCE', 'REPAIR', 'TOLL', 'OTHER'))
);

-- ========================================
-- 14. NOTIFICATION PREFERENCES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  sms_enabled BOOLEAN DEFAULT TRUE,
  whatsapp_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  phone_call_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_client_preference UNIQUE(client_id)
);

-- ========================================
-- 15. NOTIFICATION LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notification_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(client_id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(shipment_id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  phone_to VARCHAR(20),
  message_content TEXT,
  status VARCHAR(50) DEFAULT 'SENT',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_channel CHECK (channel IN ('SMS', 'WHATSAPP', 'EMAIL', 'PHONE_CALL'))
);

-- ========================================
-- 16. REPORTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(agency_id) ON DELETE CASCADE,
  report_type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  start_date DATE,
  end_date DATE,
  data JSONB,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_no ON shipments(tracking_no);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_agency_id ON shipments(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency ON vehicles(agency_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_manifests_vehicle ON manifests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_manifests_driver ON manifests(driver_id);
CREATE INDEX IF NOT EXISTS idx_tracking_logs_shipment ON tracking_logs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_logs_timestamp ON tracking_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_branches_agency ON branches(agency_id);
CREATE INDEX IF NOT EXISTS idx_branches_city ON branches(city);
CREATE INDEX IF NOT EXISTS idx_users_agency ON users(agency_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_transactions_shipment ON transactions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_shipment ON notification_logs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_client ON notification_logs(client_id);
