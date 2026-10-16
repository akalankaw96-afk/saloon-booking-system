// Multi-tenant and Client Configuration Engine
// Allows 100% white-labeling: dynamic themes, photos, menus, currencies & feature toggles

export const TENANT_CONFIGS = {
  // Client 1: Luxury Salon & Spa (Current flagship theme)
  "luxecut": {
    id: "luxecut",
    name: "LUXECUT",
    subName: "Salon & Spa Studio",
    fullName: "LUXECUT STUDIO",
    tagline: "Premier luxury salon and wellness spa in Colombo, Sri Lanka. Dedicated to bespoke hairdressing, dimensional color artistry, and restorative scalp therapy.",
    currency: {
      symbol: "Rs.",
      code: "LKR"
    },
    theme: {
      primaryColor: "#d4af37",      // Gold
      primaryHover: "#f3c644",
      primaryGlow: "rgba(212, 175, 55, 0.25)",
      bgDark: "#0b0c10",
      bgCard: "rgba(22, 25, 37, 0.75)",
      accentColor: "#10b981",       // Emerald
      borderGold: "rgba(212, 175, 55, 0.3)"
    },
    hero: {
      badge: "Voted #1 Luxury Salon & Spa Studio 2026",
      titlePrefix: "Where Elegance Meets",
      titleHighlight: "Precision Craftsmanship",
      subtitle: "Indulge in bespoke hairdressing, dimensional balayage coloring, razor beard sculpts, and restorative scalp spa treatments tailored exclusively to you.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80"
    },
    stats: [
      { label: "4.98 / 5.0 Rating", sub: "500+ Verified Guests" },
      { label: "Master Stylists", sub: "10+ Years Expert Team" },
      { label: "Zero Wait Guarantee", sub: "Punctual Appointments" },
      { label: "Phone Alerts", sub: "Instant WhatsApp & SMS" }
    ],
    contact: {
      phone: "+94 (11) 255-LUXE",
      whatsapp: "94771234567",
      email: "concierge@luxecut.lk",
      address: "280 Galle Road, Kollupitiya, Colombo 03, Sri Lanka",
      hours: "Mon – Sat: 9:00 AM – 7:00 PM (Sun: 10:00 AM – 5:00 PM)"
    },
    features: {
      hasStylists: true,
      hasPortfolio: true,
      hasReviews: true,
      allowOnlineDeposit: true,
      whatsappAlert: true
    },
    adminPin: "1234",
    adminPassword: "LuxeCut@2026"
  },

  // Client 2: Modern Urban Barbershop (Masculine, Red/Charcoal, Precision Grooming)
  "urban-barber": {
    id: "urban-barber",
    name: "URBAN BLADE",
    subName: "Gentlemen's Barbershop",
    fullName: "URBAN BLADE BARBER CO.",
    tagline: "Raw craft, precision tapers, skin fades and hot towel straight razor shaves. Old-school service with modern edge.",
    currency: {
      symbol: "Rs.",
      code: "LKR"
    },
    theme: {
      primaryColor: "#ef4444",      // Crimson Red
      primaryHover: "#f87171",
      primaryGlow: "rgba(239, 68, 68, 0.28)",
      bgDark: "#0c0d10",
      bgCard: "rgba(24, 25, 30, 0.8)",
      accentColor: "#3b82f6",       // Cobalt Blue
      borderGold: "rgba(239, 68, 68, 0.35)"
    },
    hero: {
      badge: "Colombo's Elite Grooming Lounge",
      titlePrefix: "Crafting Timeless",
      titleHighlight: "Gentlemen's Grooming",
      subtitle: "Sharp skin fades, bespoke beard shaping, essential oil hot towel steams, and complimentary espresso on every chair.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80"
    },
    stats: [
      { label: "4.95 Star Barbers", sub: "Over 1,200 Fades Done" },
      { label: "Hot Towel Shave", sub: "Straight Razor Mastery" },
      { label: "Express Chairs", sub: "Walk-ins & Fast Booking" },
      { label: "Craft Coffee Bar", sub: "Complimentary Brews" }
    ],
    contact: {
      phone: "+94 (11) 789-FADE",
      whatsapp: "94779876543",
      email: "chair@urbanblade.lk",
      address: "18 Flower Road, Colombo 07, Sri Lanka",
      hours: "Tue – Sun: 10:00 AM – 9:00 PM (Mon Closed)"
    },
    features: {
      hasStylists: true,
      hasPortfolio: true,
      hasReviews: false,           // Barbershop doesn't need public reviews tab
      allowOnlineDeposit: false,   // Cash & Card at counter only
      whatsappAlert: true          // Ping Barber immediately via WhatsApp
    },
    adminPin: "2024",
    adminPassword: "UrbanBlade@2026"
  },

  // Client 3: Zen Lotus Wellness & Ayurvedic Spa (Serene Emerald Green theme)
  "zen-wellness": {
    id: "zen-wellness",
    name: "ZEN LOTUS",
    subName: "Ayurveda & Scalp Spa",
    fullName: "ZEN LOTUS WELLNESS OASIS",
    tagline: "Holistic sanctuary dedicated to organic head spa rituals, herbal steam therapies, and botanical skin rejuvenation.",
    currency: {
      symbol: "Rs.",
      code: "LKR"
    },
    theme: {
      primaryColor: "#10b981",      // Emerald / Sage Green
      primaryHover: "#34d399",
      primaryGlow: "rgba(16, 185, 129, 0.25)",
      bgDark: "#08100d",
      bgCard: "rgba(12, 27, 21, 0.8)",
      accentColor: "#f59e0b",       // Warm Amber
      borderGold: "rgba(16, 185, 129, 0.3)"
    },
    hero: {
      badge: "Holistic Scalp & Mind Sanctuary",
      titlePrefix: "Restore Harmony to",
      titleHighlight: "Body & Soul",
      subtitle: "Japanese head spa water rings, traditional Ceylon herbal infusions, warm oil massages, and mindful tranquility.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
    },
    stats: [
      { label: "Organic Herbs", sub: "100% Botanical Extracts" },
      { label: "Head Spa Waterfall", sub: "Hydrotherapy Relaxation" },
      { label: "Private Suites", sub: "Soundproof Aromatherapy" },
      { label: "Certified Healers", sub: "Ayurvedic Practitioners" }
    ],
    contact: {
      phone: "+94 (11) 456-HEAL",
      whatsapp: "94765432109",
      email: "namaste@zenlotus.lk",
      address: "55 Barnes Place, Cinnamon Gardens, Colombo 07",
      hours: "Daily: 9:00 AM – 8:00 PM"
    },
    features: {
      hasStylists: true,
      hasPortfolio: false,         // Quiet spa does not showcase photo models
      hasReviews: true,
      allowOnlineDeposit: true,
      whatsappAlert: true
    },
    adminPin: "7777",
    adminPassword: "ZenLotus@2026"
  }
};

// Helper: Detect the active client ID from query params, env, or saved storage
export const getActiveTenantId = () => {
  // 1. Check URL query param (e.g. ?client=urban-barber)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const clientParam = params.get('client');
    if (clientParam && TENANT_CONFIGS[clientParam]) {
      return clientParam;
    }
  }

  // 2. Check build-time environment variable (for individual client deployments)
  const envTenant = import.meta.env.VITE_CLIENT_ID;
  if (envTenant && TENANT_CONFIGS[envTenant]) {
    return envTenant;
  }

  // 3. Check hostname / subdomain (e.g. urban-barber.salons.lk or zen-wellness.domain.com)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    for (const key of Object.keys(TENANT_CONFIGS)) {
      if (host.includes(key)) {
        return key;
      }
    }
  }

  // 4. Check localStorage for previewed tenant
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('active_tenant_id');
    if (saved && TENANT_CONFIGS[saved]) {
      return saved;
    }
  }

  // 5. Default fallback
  return 'luxecut';
};

// Helper: Check if the application is locked to a single client (e.g. production white-label deployment)
export const isSingleClientLocked = () => {
  return Boolean(import.meta.env.VITE_CLIENT_ID);
};

// Helper to format prices according to the client currency
export const formatCurrency = (amount, tenant) => {
  const symbol = tenant?.currency?.symbol || 'Rs.';
  return `${symbol} ${Number(amount || 0).toLocaleString()}`;
};

// Helper: Clean phone number for WhatsApp and SMS delivery
export const formatPhoneForMessaging = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '94' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    cleaned = '94' + cleaned;
  }
  return cleaned;
};

// Helper: Generate comprehensive phone confirmation message with particular salon details
export const generateCustomerPhoneMessage = (booking, tenant) => {
  if (!booking) return '';
  const currencySymbol = tenant?.currency?.symbol || 'Rs.';
  const salonName = tenant?.fullName || tenant?.name || 'Salon Studio';
  const salonAddress = tenant?.contact?.address || 'Colombo, Sri Lanka';
  const salonPhone = tenant?.contact?.phone || '+94 (11) 255-LUXE';

  return `✨ *APPOINTMENT CONFIRMATION* ✨
*${salonName}*

Dear ${booking.customerName || 'Valued Guest'}, your appointment has been confirmed!

📋 *Reservation Details:*
• Booking Ref: #${booking.id}
• Treatment: ${booking.serviceName}
• Specialist: ${booking.stylistName}
• Date: ${booking.date}
• Time: ${booking.time}
• Total Amount: ${currencySymbol} ${Number(booking.totalPrice || 0).toLocaleString()}
• Payment: ${booking.paymentMethod === 'deposit' ? 'Deposit Paid' : 'Pay at Venue'}
${booking.notes ? `• Special Requests: "${booking.notes}"\n` : ''}
📍 *Salon Location:*
${salonAddress}
📞 Reception Contact: ${salonPhone}

_Please arrive 5 minutes prior to your scheduled time. We look forward to welcoming you at ${tenant?.name || 'our salon'}!_`;
};

// Direct WhatsApp link to customer's phone
export const generateCustomerWhatsAppLink = (booking, tenant) => {
  const cleanPhone = formatPhoneForMessaging(booking?.phone);
  const text = generateCustomerPhoneMessage(booking, tenant);
  if (!cleanPhone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

// Helper: Direct SMS link to customer's phone
export const generateCustomerSmsLink = (booking, tenant) => {
  const cleanPhone = formatPhoneForMessaging(booking?.phone);
  const text = generateCustomerPhoneMessage(booking, tenant);
  return `sms:${cleanPhone}?body=${encodeURIComponent(text)}`;
};

// Helper: Generate structured WhatsApp alert message for Salon Admin / Reception
export const generateAdminWhatsAppMessage = (booking, tenant) => {
  if (!booking) return '';
  const currencySymbol = tenant?.currency?.symbol || 'Rs.';
  const salonName = tenant?.fullName || tenant?.name || 'Salon Studio';
  
  return `🚨 *NEW APPOINTMENT ALERT - SALON ADMIN* 🚨
*${salonName}*

A new booking has just been confirmed online!

📋 *Reservation Summary:*
• Booking Ref: #${booking.id}
• Guest Name: ${booking.customerName || 'Valued Guest'}
• Contact Phone: ${booking.phone || 'N/A'}
• Treatment: ${booking.serviceName}
• Specialist Assigned: ${booking.stylistName || 'First Available'}
• Scheduled Date: ${booking.date}
• Scheduled Time: ${booking.time}
• Service Value: ${currencySymbol} ${Number(booking.totalPrice || 0).toLocaleString()}
• Payment Mode: ${booking.paymentMethod === 'deposit' ? 'Deposit Paid Online' : 'Pay at Venue / Front Desk'}
${booking.notes ? `• Guest Request / Notes: "${booking.notes}"\n` : ''}
🏢 Logged in Salon Master Timetable`;
};

// Helper: Direct WhatsApp link to Salon Admin / Reception Desk
export const generateAdminWhatsAppLink = (booking, tenant) => {
  const phone = formatPhoneForMessaging(tenant?.contact?.whatsapp || tenant?.contact?.phone);
  const text = generateAdminWhatsAppMessage(booking, tenant);
  if (!phone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// Helper: Generate structured WhatsApp alert message for the Assigned Stylist
export const generateStylistWhatsAppMessage = (booking, tenant) => {
  if (!booking) return '';
  const salonName = tenant?.fullName || tenant?.name || 'Salon Studio';
  const currencySymbol = tenant?.currency?.symbol || 'Rs.';
  const stylistName = booking.stylistName || 'Specialist';
  
  return `✂️ *NEW CLIENT APPOINTMENT ASSIGNED* ✂️
*${salonName}*

Hello ${stylistName}, a new client has been booked into your station schedule!

📋 *Client & Slot Details:*
• Booking Ref: #${booking.id}
• Guest Name: ${booking.customerName || 'Guest'}
• Guest Contact: ${booking.phone || 'N/A'}
• Service Booked: ${booking.serviceName}
• Appointment Date: ${booking.date}
• Appointment Time: ${booking.time}
• Price / Value: ${currencySymbol} ${Number(booking.totalPrice || 0).toLocaleString()}
${booking.notes ? `• Client Notes / Preferences: "${booking.notes}"\n` : ''}
Please ensure your chair & tools are prepped 5 minutes prior to the slot. Thank you!`;
};

// Helper: Direct WhatsApp link to the Assigned Stylist's phone
export const generateStylistWhatsAppLink = (booking, tenant, stylists = []) => {
  const matchedStylist = stylists.find(s => s.id === booking?.stylistId);
  const rawPhone = matchedStylist?.whatsapp || matchedStylist?.phone || (booking?.stylistId === 'any' ? (tenant?.contact?.whatsapp || tenant?.contact?.phone) : '');
  const cleanPhone = formatPhoneForMessaging(rawPhone);
  const text = generateStylistWhatsAppMessage(booking, tenant);
  
  if (!cleanPhone) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

// Legacy helper for backward compatibility
export const generateWhatsAppLink = (booking, tenant) => {
  return generateAdminWhatsAppLink(booking, tenant);
};

