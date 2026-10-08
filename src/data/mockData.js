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
  {
    id: 'BK-8901',
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
    id: 'BK-8902',
    customerName: 'Dilshan Silva',
    email: 'dilshan.s@example.lk',
    phone: '+94 71 876 5432',
    serviceId: 'beard-grooming',
    serviceName: 'Royale Beard Sculpt & Hot Towel',
    stylistId: 'marcus',
    stylistName: 'Marcus Thorne',
    date: new Date().toISOString().split('T')[0],
    time: '02:30 PM',
    totalPrice: 3200,
    addOns: ['Argan & Sandalwood Beard Elixir'],
    status: 'pending',
    notes: 'First time visit. Sensitive skin.',
    createdAt: '2026-10-05T08:30:00Z'
  },
  {
    id: 'BK-8903',
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
  }
];

export const PORTFOLIO = [
  {
    id: 'p1',
    title: 'Platinum Dimension Balayage',
    category: 'coloring',
    stylist: 'Elena Rostova',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    description: 'Custom seamless blend from dark root tap to ice platinum ends.'
  },
  {
    id: 'p2',
    title: 'Textured Crop Fade & Sharp Line-Up',
    category: 'haircut',
    stylist: 'Marcus Thorne',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    description: 'Mid razor fade paired with natural matte forward texture.'
  },
  {
    id: 'p3',
    title: 'Glass Skin Facial Restoration',
    category: 'skincare',
    stylist: 'Sophia Chen',
    image: 'https://images.unsplash.com/photo-1512290900673-7002004117b9?auto=format&fit=crop&w=800&q=80',
    description: 'Post HydraFacial radiance with deep botanical moisture lock.'
  },
  {
    id: 'p4',
    title: 'Executive Pompadour & Beard Sculpt',
    category: 'grooming',
    stylist: 'Alex Vance',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    description: 'Classic high sheen pompadour paired with razor contoured beard.'
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    author: 'Jessica Taylor',
    rating: 5,
    date: '2 days ago',
    service: 'Balayage & Couture Color',
    comment: 'Elena is an absolute wizard! My hair color looks better than it ever has. The salon ambiance is unbelievable — gold accents, delicious Ceylon tea, and zero wait time!',
    verified: true
  },
  {
    id: 'r2',
    author: 'Rohan De Silva',
    rating: 5,
    date: '1 week ago',
    service: 'Royale Beard Sculpt & Hot Towel',
    comment: 'Marcus provides the best beard trim in Colombo. The hot towel steam with essential oils was pure relaxation. Will definitely be returning as a regular.',
    verified: true
  },
  {
    id: 'r3',
    author: 'Anusha Jayawardena',
    rating: 5,
    date: '2 weeks ago',
    service: 'Luxe Glow HydraFacial',
    comment: 'Sophia’s skincare knowledge is unmatched. My skin felt glowing and soft for days after the session. The online booking system was super easy to use!',
    verified: true
  }
];
