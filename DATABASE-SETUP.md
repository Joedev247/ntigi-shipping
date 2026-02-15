# NTIGI Shipping - Supabase Database Setup Guide

This guide walks you through setting up the complete Supabase database for the NTIGI Shipping application.

## Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- VS Code with the application workspace open
- Environment variables already configured in `.env.local`

## Step 1: Access Your Supabase Project

1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tjhlvzyhyskgysblgkqk`
3. Navigate to **SQL Editor** in the left sidebar

## Step 2: Create Database Tables

### Option A: Using Automatic SQL Import

1. In the **SQL Editor**, click **New Query**
2. Open the file `database.sql` in your text editor
3. Copy the entire content
4. Paste into the SQL Editor
5. Click **Run** button

### Option B: Manual Table Creation (If Import Fails)

Copy and paste each section below into SQL Editor and run individually.

#### 1.1 Create Agencies Table
```sql
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
```

#### 1.2 Create Branches Table
```sql
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
```

#### 1.3 Create Clients Table
```sql
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
```

**Continue with remaining tables from `database.sql` file...**

## Step 3: Enable Row Level Security (RLS)

RLS protects data by enforcing database policies. For a shipping app:

### Enable RLS on Tables

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. For each table, click the table name and enable RLS
3. Create policies (examples below):

### Example Policy for Clients

```sql
-- Allow users to view only their own client records
CREATE POLICY "Users see own clients"
  ON clients
  FOR SELECT
  USING (agency_id = auth.jwt() ->> 'agency_id');

-- Allow users to create clients in their agency
CREATE POLICY "Agency staff create clients"
  ON clients
  FOR INSERT
  WITH CHECK (agency_id = auth.jwt() ->> 'agency_id');
```

## Step 4: Create Storage Buckets

For shipment photos, create storage buckets:

1. Go to **Storage** in Supabase dashboard
2. Click **Create a new bucket**
3. Name: `shipment-photos`
4. Set to **Private** (requires authentication)
5. Repeat for: `receipts`, `reports`

### Upload Policy Example

```sql
-- Allow authenticated users to upload shipment photos
CREATE POLICY "Users can upload shipment photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'shipment-photos' 
    AND auth.role() = 'authenticated'
  );
```

## Step 5: Insert Sample Data (Optional)

### Add Test Agency

```sql
INSERT INTO agencies (name, tax_id, email, phone, address, city, country)
VALUES (
  'NTIGI Logistics',
  'TAX001',
  'info@ntigi-shipping.cm',
  '+237670000000',
  '123 Main Street',
  'Yaoundé',
  'Cameroon'
) RETURNING agency_id;
```

### Add Test Branch

```sql
INSERT INTO branches (agency_id, name, city, region, country, address, phone, email, latitude, longitude)
VALUES (
  'YOUR_AGENCY_ID', -- Replace with actual ID from above
  'Downtown Branch',
  'Yaoundé',
  'Central Region',
  'Cameroon',
  '456 Commerce Ave',
  '+237670111111',
  'downtown@ntigi-shipping.cm',
  3.8667,
  11.5167
);
```

## Step 6: Verify Tables in App

Run this test query in SQL Editor to confirm all tables are created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output should list all 16 tables:
- agencies
- branches
- clients
- users
- vehicles
- package_types
- shipments
- manifests
- manifest_items
- tracking_logs
- shipment_photos
- transactions
- expenses
- notification_preferences
- notification_logs
- reports

## Step 7: Test Connection from App

### Add this test component to verify Supabase works:

```typescript
// pages/test-db.tsx
'use client';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function test() {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.from('agencies').select('*').limit(1);
        
        if (error) {
          setStatus(`❌ Error: ${error.message}`);
        } else {
          setStatus(`✅ Connected! Found ${data?.length || 0} agencies`);
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err}`);
      }
    }
    test();
  }, []);

  return <div className="p-4"><h1>{status}</h1></div>;
}
```

## Step 8: Using Services in Your App

### Example: Create a Shipment

```typescript
import { shipmentService } from '@/services/shipmentService';

async function createTestShipment() {
  try {
    const shipment = await shipmentService.createShipment({
      agency_id: 'your_agency_id',
      sender_id: 'sender_client_id',
      receiver_id: 'receiver_client_id',
      origin_id: 'origin_branch_id',
      destination_id: 'dest_branch_id',
      package_type_id: 'package_type_id',
      quantity: 1,
      weight_kg: 5,
      contents_description: 'Test package',
      status: 'PENDING',
      total_cost: 5000
    });
    console.log('Shipment created:', shipment);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Example: Send Notification

```typescript
import { sendNotification } from '@/services/notificationService';

async function notifyCustomer() {
  await sendNotification({
    recipient: {
      phone: '+237670000000',
      name: 'John Doe',
      type: 'SMS'
    },
    messageType: 'SHIPMENT_CREATED',
    data: {
      trackingNumber: 'TRK123456',
      senderName: 'Alice',
      receiverName: 'Bob',
      packageWeight: 5,
      estimatedDelivery: '2026-02-18'
    }
  });
}
```

## Step 9: Enable Real-time Subscriptions (Optional)

For live tracking updates:

```typescript
import { getSupabaseClient } from '@/lib/supabase';

const client = getSupabaseClient();

// Subscribe to shipment updates
client
  .channel('shipment_changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'shipments' },
    (payload) => {
      console.log('Shipment updated:', payload);
    }
  )
  .subscribe();
```

## Troubleshooting

### Issue: "Cannot find module '@/lib/supabase'"

**Solution:** Verify `.env.local` file exists in project root with:
```
NEXT_PUBLIC_SUPABASE_URL=https://tjhlvzyhyskgysblgkqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7gyZEG7oM4bvOKHoCZIm5A_TYELcmQJ
```

### Issue: "Relation does not exist"

**Solution:** Run all table creation SQL again, check for errors in SQL Editor

### Issue: "Permission denied" or RLS errors

**Solution:** 
1. Go to Authentication settings
2. Temporarily disable RLS for testing
3. Implement proper policies (see Step 3)

### Issue: "Twilio credentials missing" for notifications

**Solution:** Add Twilio config to environment or initialize before sending:
```typescript
import { initializeNotifications } from '@/services/notificationService';

initializeNotifications({
  twilioAccountSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_TOKEN,
  twilioPhoneNumber: '+xxxxx',
  twilioWhatsAppNumber: 'whatsapp:+xxxxx',
  enableSMS: true,
  enableWhatsApp: true
});
```

## Database Backup

### Automatic Backups
- Supabase automatically backs up daily
- Access in Settings → Backups

### Manual Exports

1. Go to **SQL Editor**
2. Click **Download** button
3. Save as `.sql` file for version control

## Next Steps

1. ✅ Tables created
2. ✅ Environment variables configured
3. 📋 Add RLS policies (recommended for production)
4. 📋 Configure Twilio for notifications
5. 📋 Set up automated backups
6. 📋 Add custom indexes for performance
7. 📋 Configure webhooks for real-time updates

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT & Auth Helpers](https://supabase.com/docs/guides/auth/jwt)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [NTIGI Shipping README](./README.md)
