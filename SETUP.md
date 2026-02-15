# Ntigi Shipping - Serverless Courier Management System

Complete Next.js + Supabase serverless application for professional shipping and courier management, designed for African markets.

## 🚀 Features

### Core Functionality
- **Smart Shipment Management** - Dynamic pricing, package classification, automatic cost calculation
- **Real-Time GPS Tracking** - Live vehicle tracking with milestone-based status updates
- **Fleet Management** - Complete vehicle registration, driver assignment, capacity tracking
- **Branch Configuration** - Multi-location support with specific city/neighborhood hubs
- **Photo Verification** - Intake and delivery photo capture for dispute resolution
- **7-Digit Tracking Numbers** - Simple, memorable tracking codes (e.g., TRK892L)
- **Thermal Receipt Printing** - Optimized for 58mm and 80mm thermal printers with QR codes
- **Payment Processing** - Support for Cash, Mobile Money, and Wallet payments
- **Revenue Reporting** - Dashboard, analytics, and tax-compliant reports
- **Multi-Language Support** - English, French, Swahili, and local currency handling

### Technical
- ✅ Fully serverless (no backend infrastructure needed)
- ✅ Real-time database with Supabase PostgreSQL
- ✅ Authentication built-in (Supabase Auth)
- ✅ File storage for shipment photos
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Reusable component architecture
- ✅ Mobile-friendly interface

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Git

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd ntigi-shipping
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy your project URL and API key from the dashboard

### 3. Set Up Database

1. Go to SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy all content from `database.sql`
4. Paste into the SQL editor and run
5. This creates all tables with sample data

### 4. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ntigi-shipping/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset/page.tsx
│   ├── dashboard/                # Main dashboard
│   ├── shipments/                # Shipment management
│   │   ├── create/page.tsx       # Create new shipment
│   │   └── page.tsx              # List shipments
│   ├── tracking/                 # Public & internal tracking
│   │   ├── page.tsx              # Public tracking page
│   │   └── [id]/page.tsx         # Detailed tracking
│   ├── admin/                    # Admin functions
│   │   ├── branches/page.tsx     # Manage branches
│   │   ├── vehicles/page.tsx     # Fleet management
│   │   ├── manifests/page.tsx    # Route monitoring
│   │   ├── reports/page.tsx      # Analytics & reports
│   │   └── settings/page.tsx     # System settings
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # Reusable React components
│   ├── Layout.tsx                # Page layouts
│   ├── Button.tsx                # Button component
│   ├── Card.tsx                  # Card component
│   ├── Form.tsx                  # Form inputs
│   ├── Table.tsx                 # Data tables
│   ├── Alert.tsx                 # Alerts & badges
│   ├── ShipmentComponents.tsx    # Shipment UI
│   └── MapComponents.tsx         # Map & photos
│
├── services/                     # Business logic & API layer
│   ├── agencyService.ts          # Agency management
│   ├── branchService.ts          # Branch CRUD
│   ├── shipmentService.ts        # Shipment handling
│   ├── clientService.ts          # Customer management
│   ├── userService.ts            # User & auth
│   ├── vehicleService.ts         # Fleet management
│   ├── manifestService.ts        # Route management
│   ├── trackingService.ts        # Tracking & payments
│   └── packageTypeService.ts     # Package types
│
├── lib/                          # Utilities
│   └── supabase.ts               # Supabase client
│
├── types/                        # TypeScript types
│   └── index.ts                  # All interfaces
│
├── utils/                        # Helper functions
│   ├── trackingUtils.ts          # Tracking number generation
│   ├── receiptUtils.ts           # Receipt generation
│   └── formatUtils.ts            # Formatting helpers
│
├── public/                       # Static assets
├── database.sql                  # Database schema
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎯 Main Pages & Features

### Public Pages
- **Home** - Landing page with features and CTA
- **Tracking** - Public shipment tracking by tracking number
- **Auth** - Sign in, sign up, password reset

### Agent Dashboard
- **Dashboard** - Overview, recent shipments, stats
- **Create Shipment** - New shipment form with cost calculation
- **Shipments List** - View all shipments with filters
- **Tracking Details** - Full shipment tracking with map

### Admin Features
- **Branches** - Add and manage pickup/delivery locations
- **Vehicles** - Register vehicles with GPS tracking
- **Manifests** - Create and monitor shipping routes
- **Reports** - Revenue, transactions, analytics
- **Settings** - Agency info, localization, notifications

## 💻 API Integration Points

All services are pre-configured to work with Supabase:

```typescript
import { shipmentService } from '@/services/shipmentService';

// Create shipment
const shipment = await shipmentService.createShipment({...});

// Track shipment
const tracking = await shipmentService.getShipmentByTracking('TRK892L');

// Calculate cost
const cost = await shipmentService.calculateShipmentCost(typeId, quantity, weight, volume);

// Upload photo
await shipmentService.uploadShipmentPhoto(trackingNo, file, 'INTAKE');
```

## 🗄️ Database Schema Overview

**Key Tables:**
- `agencies` - Courier company info
- `branches` - Pickup/delivery locations
- `users` - Staff members (Agents, Drivers, Managers)
- `clients` - Customers (Senders/Receivers)
- `shipments` - Main shipment records
- `vehicles` - Fleet/transportation assets
- `manifests` - Route assignments
- `tracking_logs` - GPS coordinates
- `transactions` - Payment records
- `package_types` - Pricing categories
- `shipment_photos` - Photo records
- `localization_settings` - i18n
- `receipt_templates` - Printer layouts

## 🔐 Security Notes

- All API keys are in environment variables (never commit `.env.local`)
- Supabase handles authentication and authorization
- Database has Row Level Security (RLS) ready for implementation
- Use Supabase Auth for role-based access control

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables in Vercel settings
4. Vercel auto-deploys on push

### Environment Setup for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones (iOS/Android)

For native mobile apps, consider using React Native or Flutter with the same Supabase backend.

## 🛠️ Customization

### Add New Features

1. Create service in `services/` folder
2. Add types in `types/index.ts`
3. Create components in `components/`
4. Add pages in `app/`

### Modify Styling

Edit `tailwind.config.ts` or update CSS classes in components.

### Add New Database Tables

1. Write SQL in `database.sql`
2. Run in Supabase SQL Editor
3. Create corresponding service
4. Add TypeScript types

## 📞 Support & Contact

For issues or questions about Ntigi Shipping:
- Documentation: See comments in service files
- Database Guide: Check `database.sql`
- Component Examples: See `components/` folder

## 📄 License

All rights reserved - Ntigi Shipping System

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ for African logistics**
