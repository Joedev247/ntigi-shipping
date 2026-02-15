# Quick Start Guide - Ntigi Shipping

Get the Ntigi Shipping application running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

### Step 2: Create Supabase Account
1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with email or GitHub
4. Create a new project:
   - Give it a name (e.g., "ntigi-demo")
   - Set password
   - Choose a region closest to you
   - Click "Create new project"

### Step 3: Get API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy two values:
   - `Project URL` (looks like: `https://xxxxx.supabase.co`)
   - `anon public` (the public key)

### Step 4: Configure Environment
Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Set Up Database
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `database.sql` from this project
4. Copy ALL content and paste into SQL Editor
5. Click **Run**
6. ✅ Done! Database is ready with sample data

### Step 6: Run Dev Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

After database is set up, you can test with:

**Admin Login:**
- Email: `admin@demo.com`
- Password: `password123`

**Customer Tracking:**
- Just visit `/tracking` and enter any tracking number
- Sample tracking numbers will be generated as you create shipments

---

## 🧪 Test the App

### 1. Create a Shipment
- Click "Dashboard" or go directly to `/shipments/create`
- Fill in sender/receiver details
- Select origin and destination branches
- Choose package type
- Click "Create Shipment"
- Note the tracking number shown!

### 2. Track a Shipment
- Go to `/tracking` (public page)
- Enter the tracking number you created
- See shipment details, status, and route

### 3. Manage Fleet
- Go to "Manage Branches" in admin
- Add vehicles with plate numbers
- Create manifests to assign shipments to vehicles

### 4. View Reports
- Go to "Reports" in admin
- Select date range
- See revenue, transactions, and stats

---

## 📁 File Structure Quick Reference

```
ntigi-shipping/
├── 📄 .env.local           ← Your Supabase keys go here
├── 📄 database.sql         ← Database schema
├── 📄 SETUP.md             ← Full documentation
├── 📄 QUICKSTART.md        ← This file
├── 📁 app/                 ← Pages (Next.js)
├── 📁 components/          ← UI components
├── 📁 services/            ← Business logic
├── 📁 types/               ← TypeScript interfaces
└── 📁 utils/               ← Helper functions
```

---

## 🐛 Troubleshooting

### "Cannot find environment variables"
- Make sure `.env.local` exists in root directory
- Restart dev server after creating `.env.local`
- Check spelling of variable names

### "Supabase connection error"
- Verify URL and API key are correct
- Copy from Supabase dashboard **Settings** → **API**
- Make sure you're on the right project

### "Database tables not found"
- Go to Supabase SQL Editor
- Paste `database.sql` content
- Make sure to **Run** the query
- Wait a few seconds for tables to be created

### Blank pages or 404 errors
- Clear browser cache: Ctrl+Shift+Delete
- Stop dev server: Ctrl+C
- Run again: `npm run dev`

---

## 💡 Common Tasks

### Add a New Branch
```
Admin → Manage Branches → Add New Branch
```

### Register a Vehicle
```
Admin → Fleet Management → Register Vehicle
```

### Create a Shipment
```
Shipments → Create New Shipment → Fill form
```

### Track a Package
```
Click "Track" anywhere or go to /tracking
```

### View Earnings
```
Admin → Reports → Select date range
```

---

## 📚 Next Steps

1. **Customize Colors**: Edit `tailwind.config.ts`
2. **Add Your Logo**: Replace in `app/page.tsx` and apps
3. **Change Currency**: Update in `services/formatUtils.ts`
4. **Add Users**: Admin → Settings or database directly
5. **Deploy**: Read `SETUP.md` deployment section

---

## 🚀 Deployment

Ready to go live?

### Option 1: Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables in Vercel dashboard
5. Click Deploy!

### Option 2: Other Platforms
- Netlify, Railway, Render all support Next.js
- Follow their Next.js deployment guides
- Always add `.env.local` variables to platform settings

---

## 📞 Need Help?

Check these files:
- **API Usage**: Look at `services/` folder
- **Component Examples**: See `components/` folder  
- **Database Schema**: Read `database.sql`
- **Full Setup**: Read `SETUP.md`

---

## ✨ What's Included

✅ Complete UI with 10+ pages  
✅ Supabase database with 13 tables  
✅ Authentication (login, signup, reset)  
✅ Shipment creation & tracking  
✅ Fleet management  
✅ Analytics & reports  
✅ Thermal receipt generation  
✅ Photo upload for shipments  
✅ GPS tracking ready  
✅ 100% responsive design  

---

**Congratulations! You now have a fully functional shipping management system!** 🎉
