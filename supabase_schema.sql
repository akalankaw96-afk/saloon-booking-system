-- ==============================================================================
-- SALON BOOKING SYSTEM - SUPABASE SCHEMA & REALTIME SETUP
-- Copy and run this script in your Supabase Project:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Services Catalog Table
CREATE TABLE IF NOT EXISTS public.salon_services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'luxecut',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'haircut',
  price NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 45,
  description TEXT DEFAULT '',
  popular BOOLEAN DEFAULT false,
  badge TEXT DEFAULT '',
  image TEXT DEFAULT '',
  add_ons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Stylists & Team Table
CREATE TABLE IF NOT EXISTS public.salon_stylists (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'luxecut',
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Hair Specialist',
  bio TEXT DEFAULT '',
  experience TEXT DEFAULT '5+ Years Exp.',
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  image TEXT DEFAULT '',
  pin TEXT DEFAULT '1234',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  live_status TEXT DEFAULT 'available',
  specialties JSONB DEFAULT '[]'::jsonb,
  working_hours TEXT DEFAULT '09:00 AM - 07:00 PM',
  shift_start TEXT DEFAULT '09:00 AM',
  shift_end TEXT DEFAULT '07:00 PM',
  break_start TEXT DEFAULT '01:00 PM',
  break_end TEXT DEFAULT '02:00 PM',
  available_days JSONB DEFAULT '["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Salon Appointments & Bookings Table
CREATE TABLE IF NOT EXISTS public.salon_bookings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'luxecut',
  customer_name TEXT NOT NULL DEFAULT 'Guest',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  service_id TEXT,
  service_name TEXT NOT NULL,
  stylist_id TEXT DEFAULT 'any',
  stylist_name TEXT DEFAULT 'First Available Specialist',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 45,
  total_price NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'salon',
  deposit_paid NUMERIC DEFAULT 0,
  add_ons JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'confirmed',
  booking_type TEXT DEFAULT 'online',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Custom Timetable Slots (Stylist slot blocking, chair locks)
CREATE TABLE IF NOT EXISTS public.salon_custom_slots (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'luxecut',
  stylist_id TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'booked',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.salon_reviews (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'luxecut',
  author TEXT NOT NULL DEFAULT 'Anonymous Guest',
  rating NUMERIC DEFAULT 5,
  date TEXT DEFAULT 'Just now',
  service TEXT DEFAULT 'Salon & Spa Service',
  comment TEXT DEFAULT '',
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_custom_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read and write for the salon booking SPA
DROP POLICY IF EXISTS "Public access to salon_services" ON public.salon_services;
CREATE POLICY "Public access to salon_services" ON public.salon_services
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to salon_stylists" ON public.salon_stylists;
CREATE POLICY "Public access to salon_stylists" ON public.salon_stylists
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to salon_bookings" ON public.salon_bookings;
CREATE POLICY "Public access to salon_bookings" ON public.salon_bookings
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to salon_custom_slots" ON public.salon_custom_slots;
CREATE POLICY "Public access to salon_custom_slots" ON public.salon_custom_slots
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to salon_reviews" ON public.salon_reviews;
CREATE POLICY "Public access to salon_reviews" ON public.salon_reviews
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for instant synchronization across all browsers & devices
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.salon_services, 
  public.salon_stylists, 
  public.salon_bookings, 
  public.salon_custom_slots, 
  public.salon_reviews;
