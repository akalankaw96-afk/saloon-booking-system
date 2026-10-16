import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ============================================================================
// DATA MAPPERS (CamelCase React State <-> Snake_case Postgres Schema)
// ============================================================================

export const mapServiceFromDb = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  duration: Number(row.duration),
  description: row.description || '',
  popular: Boolean(row.popular),
  badge: row.badge || '',
  image: row.image || '',
  addOns: Array.isArray(row.add_ons) ? row.add_ons : []
});

export const mapServiceToDb = (s, tenantId) => ({
  id: s.id,
  tenant_id: tenantId || s.tenantId || 'luxecut',
  name: s.name,
  category: s.category || 'haircut',
  price: Number(s.price) || 0,
  duration: Number(s.duration) || 45,
  description: s.description || '',
  popular: Boolean(s.popular),
  badge: s.badge || '',
  image: s.image || '',
  add_ons: s.addOns || []
});

export const mapStylistFromDb = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  name: row.name,
  role: row.role,
  bio: row.bio || '',
  experience: row.experience || '5+ Years Exp.',
  rating: Number(row.rating) || 5.0,
  reviewsCount: Number(row.reviews_count) || 0,
  image: row.image || '',
  pin: row.pin || '1001',
  phone: row.phone || '+94 77 111 2233',
  whatsapp: row.whatsapp || '94771112233',
  liveStatus: row.live_status || 'available',
  specialties: Array.isArray(row.specialties) ? row.specialties : ['cut-style'],
  workingHours: row.working_hours || '09:00 AM - 07:00 PM',
  shiftStart: row.shift_start || '09:00 AM',
  shiftEnd: row.shift_end || '07:00 PM',
  breakStart: row.break_start || '01:00 PM',
  breakEnd: row.break_end || '02:00 PM',
  availableDays: Array.isArray(row.available_days) ? row.available_days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  status: row.status || 'active'
});

export const mapStylistToDb = (s, tenantId) => ({
  id: s.id,
  tenant_id: tenantId || s.tenantId || 'luxecut',
  name: s.name,
  role: s.role || 'Hair Specialist',
  bio: s.bio || '',
  experience: s.experience || '5+ Years Exp.',
  rating: Number(s.rating) || 5.0,
  reviews_count: Number(s.reviewsCount) || 0,
  image: s.image || '',
  pin: s.pin || '1001',
  phone: s.phone || '',
  whatsapp: s.whatsapp || '',
  live_status: s.liveStatus || 'available',
  specialties: s.specialties || ['cut-style'],
  working_hours: s.workingHours || '09:00 AM - 07:00 PM',
  shift_start: s.shiftStart || '09:00 AM',
  shift_end: s.shiftEnd || '07:00 PM',
  break_start: s.breakStart || '01:00 PM',
  break_end: s.breakEnd || '02:00 PM',
  available_days: s.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  status: s.status || 'active'
});

export const mapBookingFromDb = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  customerName: row.customer_name,
  email: row.email,
  phone: row.phone,
  serviceId: row.service_id,
  serviceName: row.service_name,
  stylistId: row.stylist_id,
  stylistName: row.stylist_name,
  date: row.date,
  time: row.time,
  duration: Number(row.duration) || 45,
  totalPrice: Number(row.total_price) || 0,
  paymentMethod: row.payment_method || 'salon',
  depositPaid: Number(row.deposit_paid) || 0,
  addOns: Array.isArray(row.add_ons) ? row.add_ons : [],
  status: row.status || 'confirmed',
  bookingType: row.booking_type || 'online',
  notes: row.notes || '',
  createdAt: row.created_at
});

export const mapBookingToDb = (b, tenantId) => ({
  id: b.id,
  tenant_id: tenantId || b.tenantId || 'luxecut',
  customer_name: b.customerName || 'Valued Guest',
  email: b.email || '',
  phone: b.phone || '',
  service_id: b.serviceId || '',
  service_name: b.serviceName || 'Service',
  stylist_id: b.stylistId || 'any',
  stylist_name: b.stylistName || 'Specialist',
  date: b.date,
  time: b.time,
  duration: Number(b.duration) || 45,
  total_price: Number(b.totalPrice) || 0,
  payment_method: b.paymentMethod || 'salon',
  deposit_paid: Number(b.depositPaid) || 0,
  add_ons: b.addOns || [],
  status: b.status || 'confirmed',
  booking_type: b.bookingType || 'online',
  notes: b.notes || '',
  created_at: b.createdAt || new Date().toISOString()
});

export const mapCustomSlotFromDb = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  stylistId: row.stylist_id,
  date: row.date,
  time: row.time,
  status: row.status || 'booked',
  createdAt: row.created_at
});

export const mapCustomSlotToDb = (s, tenantId) => ({
  id: s.id,
  tenant_id: tenantId || s.tenantId || 'luxecut',
  stylist_id: s.stylistId,
  date: s.date,
  time: s.time,
  status: s.status || 'booked',
  created_at: s.createdAt || new Date().toISOString()
});

export const mapReviewFromDb = (row) => ({
  id: row.id,
  tenantId: row.tenant_id,
  author: row.author,
  rating: Number(row.rating) || 5,
  date: row.date || 'Just now',
  service: row.service,
  comment: row.comment,
  verified: Boolean(row.verified),
  createdAt: row.created_at
});

export const mapReviewToDb = (r, tenantId) => ({
  id: r.id,
  tenant_id: tenantId || r.tenantId || 'luxecut',
  author: r.author || 'Anonymous Guest',
  rating: Number(r.rating) || 5,
  date: r.date || 'Just now',
  service: r.service || 'Salon & Spa Service',
  comment: r.comment || '',
  verified: r.verified !== false,
  created_at: r.createdAt || new Date().toISOString()
});
