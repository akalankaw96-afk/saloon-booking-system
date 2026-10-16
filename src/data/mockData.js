export const SERVICES = [
  {
    id: 'cut-style',
    name: 'Signature Haircut & Styling',
    category: 'haircut',
    price: 2800,
    duration: 45,
    description: 'Precision haircut customized to your face shape, followed by a scalp wash, hot towel finish, and custom styling.',
    popular: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'scalp-massage', name: '15-Min Organic Scalp Massage', price: 1200 },
      { id: 'beard-touchup', name: 'Quick Beard Line-up', price: 950 },
      { id: 'styling-product', name: 'Take-home Matte Styling Clay', price: 1800 }
    ]
  },
  {
    id: 'hair-color',
    name: 'Balayage & Couture Color',
    category: 'coloring',
    price: 16500,
    duration: 120,
    description: 'Hand-painted dimensional color highlights, custom gloss toner, and bond-reinforcing hair restoration therapy.',
    popular: true,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'keratin-gloss', name: 'Glossing & Tone Seal Treatment', price: 2500 },
      { id: 'deep-condition', name: 'Olaplex Bond Rebuilder', price: 3200 }
    ]
  },
  {
    id: 'beard-grooming',
    name: 'Royale Beard Sculpt & Hot Towel',
    category: 'grooming',
    price: 1800,
    duration: 35,
    description: 'Precision straight razor beard shaping, essential oil hot towel steam treatment, and botanical beard conditioning.',
    popular: false,
    badge: 'Barber Choice',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'charcoal-mask', name: 'Exfoliating Charcoal Strip', price: 750 },
      { id: 'beard-oil', name: 'Argan & Sandalwood Beard Elixir', price: 1400 }
    ]
  },
  {
    id: 'hydra-facial',
    name: 'Luxe Glow HydraFacial',
    category: 'skincare',
    price: 12500,
    duration: 60,
    description: 'Deep pore cleansing, ultrasonic extraction, hyaluronic acid hydration infusion, and LED light skin rejuvenator.',
    popular: true,
    badge: 'Popular Spa',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'eye-therapy', name: 'De-puffing Gold Eye Mask', price: 1200 },
      { id: 'neck-lift', name: 'Firming Neck & Décolleté Wrap', price: 1800 }
    ]
  },
  {
    id: 'deep-spa',
    name: 'Zen Aromatherapy Scalp & Hair Spa',
    category: 'spa',
    price: 7500,
    duration: 50,
    description: 'Japanese-style head spa routine with detoxifying scalp scrub, pressure-point neck massage, and herbal steam ring shower.',
    popular: false,
    badge: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'steam-eye', name: 'Warm Herbal Eye Compress', price: 850 },
      { id: 'hand-massage', name: 'Hydrating Hand & Arm Massage', price: 1500 }
    ]
  },
  {
    id: 'luxe-mani',
    name: 'Velvet Gel Manicure & Hand Care',
    category: 'skincare',
    price: 4200,
    duration: 40,
    description: 'Nail shaping, cuticle restoration, paraffin wax hydration, and long-lasting non-toxic gel polish application.',
    popular: false,
    badge: 'Grooming',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'nail-art', name: 'Custom Accent Nail Art (2 nails)', price: 950 },
      { id: 'french-tip', name: 'Classic French Tip Finish', price: 750 }
    ]
  }
];

export const STYLISTS = [
  {
    id: 'alex',
    name: 'Alex Vance',
    role: 'Master Stylist & Creative Director',
    bio: '12+ years crafting bespoke hair architecture for runway shows and discerning clientele. Specialist in modern textured cuts and precision scissor work.',
    experience: '12 Years Exp.',
    rating: 4.95,
    reviewsCount: 142,
    image: '/assets/stylist-alex.jpg',
    pin: '1001',
    liveStatus: 'available',
    specialties: ['cut-style', 'deep-spa'],
    workingHours: '09:00 AM - 07:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Hair Color Specialist',
    bio: 'Renowned colorist trained in Paris and London. Master of sun-kissed balayage, vivid pastel transformations, and color correction wizardry.',
    experience: '9 Years Exp.',
    rating: 4.98,
    reviewsCount: 189,
    image: '/assets/stylist-elena.jpg',
    pin: '1002',
    liveStatus: 'in-chair',
    specialties: ['hair-color', 'cut-style'],
    workingHours: '10:00 AM - 06:00 PM',
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'Master Barber & Grooming Specialist',
    bio: 'Traditional craftsmanship meets modern urban aesthetics. Famous for razor-sharp beard alignments, traditional hot towel shaves, and skin fades.',
    experience: '10 Years Exp.',
    rating: 4.92,
    reviewsCount: 116,
    image: '/assets/stylist-marcus.jpg',
    pin: '1003',
    liveStatus: 'available',
    specialties: ['beard-grooming', 'cut-style'],
    workingHours: '08:30 AM - 05:30 PM',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'sophia',
    name: 'Sophia Chen',
    role: 'Lead Aesthetician & Spa Therapist',
    bio: 'Certified holistic skincare practitioner specializing in advanced facial rejuvenation, botanical scalp detox, and therapeutic touch therapy.',
    experience: '8 Years Exp.',
    rating: 4.99,
    reviewsCount: 204,
    image: '/assets/stylist-sophia.jpg',
    pin: '1004',
    liveStatus: 'available',
    specialties: ['hydra-facial', 'deep-spa', 'luxe-mani'],
    workingHours: '09:30 AM - 06:30 PM',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat']
  }
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:15 AM', '01:00 PM', 
  '02:30 PM', '03:45 PM', '05:00 PM', '06:15 PM'
];

export const INITIAL_BOOKINGS = [
  // LuxeCut Studio Bookings
  {
    id: 'BK-8901',
    tenantId: 'luxecut',
    customerName: 'Kavindi Perera',
    email: 'kavindi.p@example.lk',
    phone: '+94 77 123 4567',
    serviceId: 'hair-color',
    serviceName: 'Balayage & Couture Color',
    stylistId: 'elena',
    stylistName: 'Elena Rostova',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    totalPrice: 19000,
    addOns: ['Glossing & Tone Seal Treatment'],
    status: 'confirmed',
    notes: 'Prefers cool ash blonde tones.',
    createdAt: '2026-10-04T10:15:00Z'
  },
  {
    id: 'BK-8903',
    tenantId: 'luxecut',
    customerName: 'Nimmi Fernando',
    email: 'nimmi.f@example.lk',
    phone: '+94 76 345 6789',
    serviceId: 'hydra-facial',
    serviceName: 'Luxe Glow HydraFacial',
    stylistId: 'sophia',
    stylistName: 'Sophia Chen',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:15 AM',
    totalPrice: 13700,
    addOns: ['De-puffing Gold Eye Mask'],
    status: 'confirmed',
    notes: 'Wedding preparation next week.',
    createdAt: '2026-10-03T14:20:00Z'
  },
  {
    id: 'BK-8899',
    tenantId: 'luxecut',
    customerName: 'Kasun Rajapaksha',
    email: 'kasun.r@example.lk',
    phone: '+94 70 901 2345',
    serviceId: 'cut-style',
    serviceName: 'Signature Haircut & Styling',
    stylistId: 'alex',
    stylistName: 'Alex Vance',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '05:00 PM',
    totalPrice: 4000,
    addOns: ['15-Min Organic Scalp Massage'],
    status: 'completed',
    notes: 'Regular client.',
    createdAt: '2026-10-02T11:00:00Z'
  },

  // Urban Blade Barber Co. Bookings
  {
    id: 'BK-7010',
    tenantId: 'urban-barber',
    customerName: 'Danushka Alwis',
    email: 'danushka@example.lk',
    phone: '+94 77 444 8899',
    serviceId: 'ub-fade',
    serviceName: 'Executive Skin Fade & Texture Cut',
    stylistId: 'marcus',
    stylistName: 'Marcus "Blade" Thorne',
    date: new Date().toISOString().split('T')[0],
    time: '11:15 AM',
    totalPrice: 2850,
    addOns: ['Nose & Forehead Charcoal Strip'],
    status: 'confirmed',
    notes: 'Low fade with drop taper.',
    createdAt: '2026-10-06T10:00:00Z'
  },
  {
    id: 'BK-7011',
    tenantId: 'urban-barber',
    customerName: 'Dilshan Silva',
    email: 'dilshan.s@example.lk',
    phone: '+94 71 876 5432',
    serviceId: 'ub-beard',
    serviceName: 'Straight Razor Beard Sculpt & Hot Towel',
    stylistId: 'marcus',
    stylistName: 'Marcus "Blade" Thorne',
    date: new Date().toISOString().split('T')[0],
    time: '02:30 PM',
    totalPrice: 2800,
    addOns: ['Sandalwood Growth Elixir Drop'],
    status: 'pending',
    notes: 'Sensitive skin. Extra eucalyptus steam.',
    createdAt: '2026-10-05T08:30:00Z'
  },
  {
    id: 'BK-7012',
    tenantId: 'urban-barber',
    customerName: 'Kevin Fernando',
    email: 'kevin.f@example.lk',
    phone: '+94 72 333 4455',
    serviceId: 'ub-combo',
    serviceName: 'The Full Gentleman (Cut + Shave + Wash)',
    stylistId: 'leo',
    stylistName: 'Leo Santos',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '04:00 PM',
    totalPrice: 4300,
    addOns: ['10-Min Shoulder Vibration Massage'],
    status: 'confirmed',
    notes: 'Executive styling.',
    createdAt: '2026-10-06T12:00:00Z'
  },

  // Zen Lotus Wellness Oasis Bookings
  {
    id: 'BK-5010',
    tenantId: 'zen-wellness',
    customerName: 'Chamari Atapattu',
    email: 'chamari@example.lk',
    phone: '+94 77 999 1234',
    serviceId: 'zen-headspa',
    serviceName: 'Japanese Herbal Waterfall Head Spa',
    stylistId: 'sophia',
    stylistName: 'Sophia Chen',
    date: new Date().toISOString().split('T')[0],
    time: '01:00 PM',
    totalPrice: 10000,
    addOns: ['Warm Brahmi Oil Infusion'],
    status: 'confirmed',
    notes: 'Tension relief and lavender aromatherapy.',
    createdAt: '2026-10-06T09:00:00Z'
  },
  {
    id: 'BK-5011',
    tenantId: 'zen-wellness',
    customerName: 'Michelle De Kauwe',
    email: 'michelle@example.lk',
    phone: '+94 76 888 7766',
    serviceId: 'zen-shirodhara',
    serviceName: 'Traditional Shirodhara & Scalp Rejuvenation',
    stylistId: 'ananya',
    stylistName: 'Ananya Sen',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    totalPrice: 15300,
    addOns: ['Herbal Detox Tea Ceremony'],
    status: 'confirmed',
    notes: 'First Shirodhara session.',
    createdAt: '2026-10-05T14:30:00Z'
  }
];

export const PORTFOLIO = [
  {
    id: 'p1',
    tenantId: 'luxecut',
    title: 'Platinum Dimension Balayage',
    category: 'coloring',
    stylist: 'Elena Rostova',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    description: 'Custom seamless blend from dark root tap to ice platinum ends.'
  },
  {
    id: 'p2',
    tenantId: 'urban-barber',
    title: 'Textured Crop Fade & Sharp Line-Up',
    category: 'haircut',
    stylist: 'Marcus "Blade" Thorne',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    description: 'Mid razor fade paired with natural matte forward texture.'
  },
  {
    id: 'p3',
    tenantId: 'luxecut',
    title: 'Glass Skin Facial Restoration',
    category: 'skincare',
    stylist: 'Sophia Chen',
    image: 'https://images.unsplash.com/photo-1512290900673-7002004117b9?auto=format&fit=crop&w=800&q=80',
    description: 'Post HydraFacial radiance with deep botanical moisture lock.'
  },
  {
    id: 'p4',
    tenantId: 'urban-barber',
    title: 'Executive Pompadour & Beard Sculpt',
    category: 'grooming',
    stylist: 'Marcus "Blade" Thorne',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    description: 'Classic high sheen pompadour paired with razor contoured beard.'
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    tenantId: 'luxecut',
    author: 'Jessica Taylor',
    rating: 5,
    date: '2 days ago',
    service: 'Balayage & Couture Color',
    comment: 'Elena is an absolute wizard! My hair color looks better than it ever has. The salon ambiance is unbelievable — gold accents, delicious Ceylon tea, and zero wait time!',
    verified: true
  },
  {
    id: 'r2',
    tenantId: 'urban-barber',
    author: 'Rohan De Silva',
    rating: 5,
    date: '1 week ago',
    service: 'Straight Razor Beard Sculpt & Hot Towel',
    comment: 'Marcus provides the best beard trim in Colombo. The hot towel steam with essential oils was pure relaxation. Will definitely be returning as a regular.',
    verified: true
  },
  {
    id: 'r3',
    tenantId: 'zen-wellness',
    author: 'Anusha Jayawardena',
    rating: 5,
    date: '2 weeks ago',
    service: 'Japanese Herbal Waterfall Head Spa',
    comment: 'Sophia’s scalp care rituals are unmatched. My scalp felt revitalized and refreshed for days after the session. Truly a tranquil oasis.',
    verified: true
  }
];

// Presets for Modern Urban Barbershop Client
export const URBAN_BARBER_SERVICES = [
  {
    id: 'ub-fade',
    name: 'Executive Skin Fade & Texture Cut',
    category: 'haircut',
    price: 2200,
    duration: 35,
    description: 'Foil shaver low/mid/high skin fade, clipper shear blending, razor perimeter outline, and matte styling.',
    popular: true,
    badge: 'Signature Cut',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ub-charcoal', name: 'Nose & Forehead Charcoal Strip', price: 650 },
      { id: 'ub-clay', name: 'Craft Pomade Take-home Tin', price: 1500 }
    ]
  },
  {
    id: 'ub-beard',
    name: 'Straight Razor Beard Sculpt & Hot Towel',
    category: 'grooming',
    price: 1600,
    duration: 30,
    description: 'Freehand beard geometry trim, dual hot towel eucalyptus steam, Japanese feather razor finish, and organic beard oil.',
    popular: true,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ub-oil', name: 'Sandalwood Growth Elixir Drop', price: 1200 },
      { id: 'ub-eye', name: 'Cold Compress Eye Relief', price: 500 }
    ]
  },
  {
    id: 'ub-combo',
    name: 'The Full Gentleman (Cut + Shave + Wash)',
    category: 'haircut',
    price: 3500,
    duration: 60,
    description: 'Complete grooming service: custom haircut, hot towel straight razor shave, mint scalp shampoo, and complimentary espresso.',
    popular: true,
    badge: 'Best Value',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ub-massage', name: '10-Min Shoulder Vibration Massage', price: 800 }
    ]
  }
];

export const URBAN_BARBER_STYLISTS = [
  {
    id: 'marcus',
    name: 'Marcus "Blade" Thorne',
    role: 'Lead Barber & Shop Founder',
    bio: '10+ years specializing in razor tapers, sharp line-ups, and traditional barbershop culture.',
    experience: '10 Years Exp.',
    rating: 4.96,
    reviewsCount: 310,
    image: '/assets/stylist-marcus.jpg',
    pin: '2001',
    liveStatus: 'available',
    specialties: ['ub-fade', 'ub-beard', 'ub-combo'],
    workingHours: '10:00 AM - 08:00 PM',
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'leo',
    name: 'Leo Santos',
    role: 'Senior Taper & Fade Craftsman',
    bio: 'Renowned for razor-sharp contours, beard symmetry, and modern textured crop cuts.',
    experience: '7 Years Exp.',
    rating: 4.92,
    reviewsCount: 198,
    image: '/assets/stylist-alex.jpg',
    pin: '2002',
    liveStatus: 'in-chair',
    specialties: ['ub-fade', 'ub-beard'],
    workingHours: '10:00 AM - 07:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat']
  }
];

// Presets for Zen Lotus Wellness & Ayurvedic Spa
export const ZEN_WELLNESS_SERVICES = [
  {
    id: 'zen-headspa',
    name: 'Japanese Herbal Waterfall Head Spa',
    category: 'spa',
    price: 8500,
    duration: 60,
    description: 'Detoxifying scalp peeling scrub, continuous warm herbal waterfall ring shower, and tension release shoulder massage.',
    popular: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'zen-oil', name: 'Warm Brahmi Oil Infusion', price: 1500 },
      { id: 'zen-eyes', name: 'Organic Lavender Eye Pillow', price: 900 }
    ]
  },
  {
    id: 'zen-facial',
    name: 'Golden Lotus Hydrating Facial Therapy',
    category: 'skincare',
    price: 11000,
    duration: 60,
    description: 'Holistic deep cleanse, sandalwood honey mask, lymphatic drainage jade roll massage, and peptide serum lock.',
    popular: true,
    badge: 'Radiance Glow',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'zen-gold', name: '24K Gold Foil Sheet Booster', price: 2500 }
    ]
  },
  {
    id: 'zen-shirodhara',
    name: 'Traditional Shirodhara & Scalp Rejuvenation',
    category: 'spa',
    price: 14500,
    duration: 75,
    description: 'Continuous warm herbal oil stream over the third eye brow center, paired with calming scalp acupressure for deep relaxation.',
    popular: false,
    badge: 'Ayurvedic Ritual',
    image: 'https://images.unsplash.com/photo-1512290900673-7002004117b9?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'zen-tea', name: 'Herbal Detox Tea Ceremony', price: 800 }
    ]
  }
];

export const ZEN_WELLNESS_STYLISTS = [
  {
    id: 'sophia',
    name: 'Sophia Chen',
    role: 'Lead Spa Therapist & Aesthetician',
    bio: 'Trained in Tokyo and Bali head spas. Dedicated to holistic healing touch and rejuvenating botanical rituals.',
    experience: '8 Years Exp.',
    rating: 4.99,
    reviewsCount: 240,
    image: '/assets/stylist-sophia.jpg',
    pin: '3001',
    liveStatus: 'available',
    specialties: ['zen-headspa', 'zen-facial', 'zen-shirodhara'],
    workingHours: '09:00 AM - 06:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'ananya',
    name: 'Ananya Sen',
    role: 'Ayurvedic Practitioner & Scalp Specialist',
    bio: 'Specialist in authentic Shirodhara stream therapy, stress release pressure points, and herbal scalp detox.',
    experience: '11 Years Exp.',
    rating: 4.97,
    reviewsCount: 175,
    image: '/assets/stylist-elena.jpg',
    pin: '3002',
    liveStatus: 'in-chair',
    specialties: ['zen-headspa', 'zen-shirodhara'],
    workingHours: '09:30 AM - 06:30 PM',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat']
  }
];

export const getDefaultServicesForTenant = (tenantId) => {
  if (tenantId === 'urban-barber') return URBAN_BARBER_SERVICES;
  if (tenantId === 'zen-wellness') return ZEN_WELLNESS_SERVICES;
  return SERVICES;
};

export const getDefaultStylistsForTenant = (tenantId) => {
  if (tenantId === 'urban-barber') return URBAN_BARBER_STYLISTS;
  if (tenantId === 'zen-wellness') return ZEN_WELLNESS_STYLISTS;
  return STYLISTS;
};

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const sortTimeSlots = (slots) => {
  return [...slots].sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
};

