import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SERVICES, 
  STYLISTS, 
  INITIAL_BOOKINGS, 
  REVIEWS, 
  TIME_SLOTS,
  sortTimeSlots,
  getDefaultServicesForTenant, 
  getDefaultStylistsForTenant 
} from '../data/mockData';
import { 
  TENANT_CONFIGS, 
  getActiveTenantId, 
  formatCurrency, 
  generateWhatsAppLink,
  generateCustomerPhoneMessage,
  generateCustomerWhatsAppLink,
  generateCustomerSmsLink,
  formatPhoneForMessaging
} from '../config/tenants';
import confetti from 'canvas-confetti';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Active Client / Tenant Identifier
  const [activeTenantId, setActiveTenantId] = useState(getActiveTenantId);

  // Client configurations (with support for live customizations in Admin)
  const [customTenantConfigs, setCustomTenantConfigs] = useState(() => {
    const saved = localStorage.getItem('custom_tenant_configs');
    return saved ? JSON.parse(saved) : TENANT_CONFIGS;
  });

  const tenant = customTenantConfigs[activeTenantId] || TENANT_CONFIGS['luxecut'];

  // Dynamic Theme Colors & Document Branding Injection
  useEffect(() => {
    if (!tenant || typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--gold-primary', tenant.theme.primaryColor);
    root.style.setProperty('--gold-hover', tenant.theme.primaryHover);
    root.style.setProperty('--gold-glow', tenant.theme.primaryGlow);
    root.style.setProperty('--bg-dark', tenant.theme.bgDark);
    root.style.setProperty('--bg-card', tenant.theme.bgCard);
    root.style.setProperty('--accent-emerald', tenant.theme.accentColor);
    root.style.setProperty('--border-gold', tenant.theme.borderGold || 'rgba(255,255,255,0.15)');
    document.title = `${tenant.fullName} | Online Booking Pass`;
  }, [tenant]);

  // Services & Stylists State (Dynamically initialized per client)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem(`tenant_srv_${activeTenantId}`);
    return saved ? JSON.parse(saved) : getDefaultServicesForTenant(activeTenantId);
  });

  const [stylists, setStylists] = useState(() => {
    const defaults = getDefaultStylistsForTenant(activeTenantId);
    const saved = localStorage.getItem(`tenant_sty_${activeTenantId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((s, idx) => {
          const matchedDef = defaults.find(d => d.id === s.id) || defaults[idx] || {};
          return {
            ...s,
            status: s.status || 'active',
            liveStatus: s.liveStatus || matchedDef.liveStatus || 'available',
            pin: s.pin || matchedDef.pin || `100${idx + 1}`,
            shiftStart: s.shiftStart || '09:00 AM',
            shiftEnd: s.shiftEnd || '07:00 PM',
            breakStart: s.breakStart || '01:00 PM',
            breakEnd: s.breakEnd || '02:00 PM',
            availableDays: s.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          };
        });
      } catch (e) {
        // Fall back to defaults
      }
    }
    return defaults.map((s, idx) => ({
      ...s,
      status: s.status || 'active',
      liveStatus: s.liveStatus || 'available',
      pin: s.pin || `100${idx + 1}`,
      shiftStart: s.shiftStart || '09:00 AM',
      shiftEnd: s.shiftEnd || '07:00 PM',
      breakStart: s.breakStart || '01:00 PM',
      breakEnd: s.breakEnd || '02:00 PM',
      availableDays: s.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }));
  });

  // Save services & stylists on changes per tenant
  useEffect(() => {
    localStorage.setItem(`tenant_srv_${activeTenantId}`, JSON.stringify(services));
  }, [services, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`tenant_sty_${activeTenantId}`, JSON.stringify(stylists));
  }, [stylists, activeTenantId]);


  // Master salon bookings across all tenants
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_bookings_lkr');
    if (!saved) return INITIAL_BOOKINGS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(b => b.id));
      const missingDefaults = INITIAL_BOOKINGS.filter(b => !existingIds.has(b.id));
      return [...parsed, ...missingDefaults];
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Custom timetable slots created dynamically by stylists/managers
  const [customSlots, setCustomSlots] = useState(() => {
    const saved = localStorage.getItem('salon_custom_slots');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('salon_custom_slots', JSON.stringify(customSlots));
  }, [customSlots]);

  // Guest Device Booking IDs (Privacy separation for guests without login)
  const [myGuestBookingIds, setMyGuestBookingIds] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_my_guest_ids');
    return saved ? JSON.parse(saved) : ['BK-8901', 'BK-7010', 'BK-5010'];
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_reviews_lkr');
    if (!saved) return REVIEWS;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(r => r.id));
      const missingDefaults = REVIEWS.filter(r => !existingIds.has(r.id));
      return [...parsed, ...missingDefaults];
    } catch {
      return REVIEWS;
    }
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'portfolio' | 'reviews' | 'my-bookings' | 'admin'

  // Manager Admin Authentication State (Strictly scoped per salon)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const initId = getActiveTenantId();
    return localStorage.getItem(`salon_admin_auth_${initId}`) === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Stylist Chair Station Session (Strictly isolated to individual stylist)
  const [activeStylist, setActiveStylist] = useState(() => {
    const initId = getActiveTenantId();
    const saved = localStorage.getItem(`active_stylist_${initId}`);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Booking Wizard State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Active Pass Modal & Reschedule Modal
  const [activePassBooking, setActivePassBooking] = useState(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState(null);

  // Toast System
  const [toast, setToast] = useState(null);

  // Draft Booking object
  const todayStr = new Date().toISOString().split('T')[0];
  const [draftBooking, setDraftBooking] = useState({
    service: services[0],
    selectedAddOns: [],
    stylist: stylists[0],
    date: todayStr,
    time: '11:15 AM',
    paymentMethod: 'salon', // 'salon' | 'deposit'
    customer: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });

  // Client switcher function with URL synchronization & Session Isolation
  const switchTenant = (tenantId, updateUrl = true) => {
    if (!TENANT_CONFIGS[tenantId]) return;
    setActiveTenantId(tenantId);
    localStorage.setItem('active_tenant_id', tenantId);

    // Sync browser URL query parameter (?client=tenantId) without a full page reload
    if (updateUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('client', tenantId);
      window.history.pushState({ tenantId }, '', url.toString());
    }

    // Strict Admin Session Isolation: verify if user is authenticated for THIS salon
    const isTargetAdminAuth = localStorage.getItem(`salon_admin_auth_${tenantId}`) === 'true';
    setIsAdminAuthenticated(isTargetAdminAuth);

    // Stylist Chair Session Isolation: verify if a stylist was logged in for THIS salon
    const savedStylist = localStorage.getItem(`active_stylist_${tenantId}`);
    let targetStylist = null;
    if (savedStylist) {
      try { targetStylist = JSON.parse(savedStylist); } catch {}
    }
    setActiveStylist(targetStylist);

    if (!isTargetAdminAuth && !targetStylist && activeTab === 'admin') {
      setActiveTab('services');
    }

    const savedSrv = localStorage.getItem(`tenant_srv_${tenantId}`);
    const nextServices = savedSrv ? JSON.parse(savedSrv) : getDefaultServicesForTenant(tenantId);
    
    const savedSty = localStorage.getItem(`tenant_sty_${tenantId}`);
    const nextStylists = savedSty ? JSON.parse(savedSty) : getDefaultStylistsForTenant(tenantId);

    setServices(nextServices);
    setStylists(nextStylists);

    const today = new Date().toISOString().split('T')[0];
    setDraftBooking({
      service: nextServices[0],
      selectedAddOns: [],
      stylist: nextStylists[0],
      date: today,
      time: '11:15 AM',
      paymentMethod: 'salon',
      customer: { name: '', email: '', phone: '', notes: '' }
    });

    const targetTenant = customTenantConfigs[tenantId] || TENANT_CONFIGS[tenantId];
    if (targetTenant) {
      showToast('Salon Client Switched', `Active Salon: ${targetTenant.fullName}`, 'info');
    }
  };

  // Sync with browser Back and Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlTenant = getActiveTenantId();
      if (urlTenant && urlTenant !== activeTenantId) {
        switchTenant(urlTenant, false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTenantId]);

  // Generate direct salon booking link
  const getDirectSalonLink = (targetId = activeTenantId) => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const path = window.location.pathname;
    return `${origin}${path}?client=${targetId}`;
  };

  // Update client configuration (Theme, Photos, Contact, Features) live
  const updateTenantConfig = (updatedData) => {
    setCustomTenantConfigs(prev => {
      const current = prev[activeTenantId] || TENANT_CONFIGS[activeTenantId];
      const updated = {
        ...prev,
        [activeTenantId]: {
          ...current,
          ...updatedData,
          theme: { ...current.theme, ...(updatedData.theme || {}) },
          contact: { ...current.contact, ...(updatedData.contact || {}) },
          features: { ...current.features, ...(updatedData.features || {}) }
        }
      };
      localStorage.setItem('custom_tenant_configs', JSON.stringify(updated));
      return updated;
    });
    showToast('Branding Saved', 'Client theme and settings updated successfully.', 'success');
  };

  const formatPrice = (amount) => formatCurrency(amount, tenant);
  const getWhatsAppAlertUrl = (booking) => generateWhatsAppLink(booking, tenant);
  const getCustomerPhoneMessage = (booking = activePassBooking) => generateCustomerPhoneMessage(booking, tenant);
  const getCustomerWhatsAppUrl = (booking = activePassBooking) => generateCustomerWhatsAppLink(booking, tenant);
  const getCustomerSmsUrl = (booking = activePassBooking) => generateCustomerSmsLink(booking, tenant);


  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('luxe_salon_services_lkr', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('luxe_salon_stylists_lkr', JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem('luxe_salon_bookings_lkr', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('luxe_salon_my_guest_ids', JSON.stringify(myGuestBookingIds));
  }, [myGuestBookingIds]);

  useEffect(() => {
    localStorage.setItem('luxe_salon_reviews_lkr', JSON.stringify(reviews));
  }, [reviews]);

  const [adminLoginInitialRole, setAdminLoginInitialRole] = useState('manager'); // 'manager' | 'stylist'

  const openAdminLogin = (initialRole = 'manager') => {
    setAdminLoginInitialRole(initialRole);
    setIsAdminLoginOpen(true);
  };

  const openManagerLogin = () => openAdminLogin('manager');
  const openStylistLogin = () => openAdminLogin('stylist');

  const closeAdminLogin = () => {
    setIsAdminLoginOpen(false);
  };

  const loginAdmin = (enteredPassword) => {
    if (!enteredPassword) {
      showToast('Password Required', 'Please enter your salon admin password or PIN.', 'error');
      return false;
    }
    const cleanInput = enteredPassword.trim();
    const expectedPassword = tenant.adminPassword || '';
    const expectedPin = tenant.adminPin || '1234';

    // Strict validation: ONLY THIS salon's password or PIN works!
    if (cleanInput === expectedPassword || cleanInput === expectedPin) {
      localStorage.setItem(`salon_admin_auth_${activeTenantId}`, 'true');
      setIsAdminAuthenticated(true);
      setIsAdminLoginOpen(false);
      setActiveTab('admin');
      showToast('Manager Access Granted', `Authenticated for ${tenant.fullName}.`, 'success');
      return true;
    } else {
      showToast('Access Denied', `Invalid password for ${tenant.name}. Each salon has a different password.`, 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem(`salon_admin_auth_${activeTenantId}`);
    setIsAdminAuthenticated(false);
    setActiveTab('services');
    showToast('Manager Logged Out', 'Admin session terminated.', 'info');
  };

  // Stylist Station Authentication (Isolated Chair Access)
  const loginStylist = (pin, selectedStylistId = null) => {
    if (!pin) {
      showToast('PIN Required', 'Please enter your 4-digit stylist chair PIN.', 'error');
      return false;
    }
    const cleanPin = pin.trim();
    let matched = null;
    if (selectedStylistId) {
      matched = stylists.find(s => s.id === selectedStylistId && s.pin === cleanPin);
    } else {
      matched = stylists.find(s => s.pin === cleanPin);
    }

    if (matched) {
      setActiveStylist(matched);
      localStorage.setItem(`active_stylist_${activeTenantId}`, JSON.stringify(matched));
      // PRIVACY ENFORCEMENT: Never grant manager credentials when logged in as a stylist
      setIsAdminAuthenticated(false);
      localStorage.removeItem(`salon_admin_auth_${activeTenantId}`);
      setIsAdminLoginOpen(false);
      setActiveTab('admin');
      showToast('Station Active', `Welcome, ${matched.name}. Chair station mode unlocked.`, 'success');
      return true;
    } else {
      showToast('Invalid Stylist PIN', `No stylist with PIN "${cleanPin}" found in ${tenant.name}.`, 'error');
      return false;
    }
  };

  const logoutStylist = () => {
    localStorage.removeItem(`active_stylist_${activeTenantId}`);
    setActiveStylist(null);
    setActiveTab('services');
    showToast('Station Closed', 'Stylist chair session ended.', 'info');
  };

  // Update Stylist Real-Time Chair Status (Available / In-Chair / Walk-in / On Break)
  const updateStylistLiveStatus = (stylistId, status) => {
    setStylists(prev =>
      prev.map(s => (s.id === stylistId ? { ...s, liveStatus: status } : s))
    );
    if (activeStylist && activeStylist.id === stylistId) {
      const updated = { ...activeStylist, liveStatus: status };
      setActiveStylist(updated);
      localStorage.setItem(`active_stylist_${activeTenantId}`, JSON.stringify(updated));
    }
    const statusLabels = {
      'available': '🟢 Available & Ready',
      'in-chair': '🔴 In-Chair (Active Client)',
      'walk-in': '🚶 Serving Walk-in Guest',
      'on-break': '☕ On Short Break'
    };
    showToast('Chair Status Updated', statusLabels[status] || status, 'info');
  };

  // Seat a Walk-in Guest Immediately & Block Slot from Online Booking
  const seatWalkIn = ({ stylistId, customerName, serviceId, time, date, notes = '' }) => {
    const targetService = services.find(s => s.id === serviceId) || services[0];
    const targetStylist = stylists.find(s => s.id === stylistId) || stylists[0];
    const walkInId = `WLK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: walkInId,
      tenantId: activeTenantId,
      customerName: customerName || 'Walk-in Guest',
      email: 'walkin@salon-internal.local',
      phone: 'Walk-in Guest',
      serviceId: targetService?.id || 'service',
      serviceName: targetService?.name || 'Walk-in Service',
      stylistId: targetStylist.id,
      stylistName: targetStylist.name,
      date: date || new Date().toISOString().split('T')[0],
      time: time,
      totalPrice: targetService?.price || 0,
      paymentMethod: 'salon',
      depositPaid: 0,
      addOns: [],
      status: 'in-progress',
      bookingType: 'walk-in',
      notes: notes || 'Walk-in client seated in chair',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    updateStylistLiveStatus(targetStylist.id, 'in-chair');

    showToast('Walk-in Seated!', `${customerName || 'Walk-in Guest'} seated for ${targetService?.name} at ${time}. Slot locked!`, 'success');
    return newBooking;
  };

  // Hold a Time Slot for Physical Queue / Waiting Lounge
  const holdSlotForQueue = ({ stylistId, time, date, queueLabel = 'Waiting Queue Guest' }) => {
    const targetStylist = stylists.find(s => s.id === stylistId) || stylists[0];
    const holdId = `QUE-${Math.floor(1000 + Math.random() * 9000)}`;

    const newHold = {
      id: holdId,
      tenantId: activeTenantId,
      customerName: queueLabel,
      email: 'queue@salon-internal.local',
      phone: 'In Salon Queue',
      serviceId: services[0]?.id || 'general',
      serviceName: 'Queue Hold (Waiting in Salon)',
      stylistId: targetStylist.id,
      stylistName: targetStylist.name,
      date: date || new Date().toISOString().split('T')[0],
      time: time,
      totalPrice: 0,
      paymentMethod: 'salon',
      depositPaid: 0,
      addOns: [],
      status: 'confirmed',
      bookingType: 'queue-hold',
      notes: 'Reserved for walk-in waiting list in salon.',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newHold, ...prev]);
    showToast('Slot Reserved for Queue', `Slot ${time} reserved for walk-in waiting queue. Online booking locked out.`, 'info');
    return newHold;
  };

  // Complete a service and free up the chair
  const completeChairBooking = (bookingId, stylistId) => {
    updateBookingStatus(bookingId, 'completed');
    if (stylistId) {
      updateStylistLiveStatus(stylistId, 'available');
    }
    showToast('Service Finished', 'Chair freed and available for the next client.', 'success');
  };

  // Get all merged and chronologically sorted slots for a given stylist on a particular date
  const getStylistSlotsForDate = (stylistId, date) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const activeStylistCustomSlots = customSlots
      .filter(s => (s.tenantId || 'luxecut') === activeTenantId && (!stylistId || s.stylistId === stylistId) && s.date === targetDate)
      .map(s => s.time);
    
    const bookingTimes = bookings
      .filter(b => (b.tenantId || 'luxecut') === activeTenantId && (!stylistId || b.stylistId === stylistId || b.stylistId === 'any') && b.date === targetDate && b.status !== 'cancelled')
      .map(b => b.time);

    const merged = Array.from(new Set([...TIME_SLOTS, ...activeStylistCustomSlots, ...bookingTimes]));
    return sortTimeSlots(merged);
  };

  // Stylist adds a slot, which can be an open timetable slot, a walk-in, a phone reservation, or queue hold
  const addStylistSlot = ({
    stylistId,
    date,
    time,
    slotType = 'appointment', // 'appointment' | 'walk-in' | 'open' | 'queue-hold'
    customerName = '',
    phone = '',
    serviceId = '',
    notes = ''
  }) => {
    const targetStylist = stylists.find(s => s.id === stylistId) || activeStylist || stylists[0];
    const targetService = services.find(s => s.id === serviceId) || services[0];
    const cleanTime = (time || '09:00 AM').trim();
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Register this time in customSlots so it stays visible in timetable even if empty
    const newSlotId = `slot-${Date.now()}`;
    const newCustomSlot = {
      id: newSlotId,
      tenantId: activeTenantId,
      stylistId: targetStylist.id,
      date: targetDate,
      time: cleanTime,
      status: slotType === 'open' ? 'open' : 'booked',
      createdAt: new Date().toISOString()
    };

    setCustomSlots(prev => [
      ...prev.filter(s => !(s.stylistId === targetStylist.id && s.date === targetDate && s.time === cleanTime)),
      newCustomSlot
    ]);

    let createdBooking = null;

    if (slotType === 'walk-in') {
      createdBooking = seatWalkIn({
        stylistId: targetStylist.id,
        customerName: customerName || 'Walk-in Guest',
        serviceId: targetService?.id,
        time: cleanTime,
        date: targetDate,
        notes: notes || 'Physical walk-in client seated in chair'
      });
    } else if (slotType === 'queue-hold') {
      createdBooking = holdSlotForQueue({
        stylistId: targetStylist.id,
        time: cleanTime,
        date: targetDate,
        queueLabel: customerName || 'Waiting Queue Guest'
      });
    } else if (slotType === 'appointment') {
      const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      createdBooking = {
        id: newBookingId,
        tenantId: activeTenantId,
        customerName: customerName || 'Reserved Guest',
        email: 'direct@salon-guest.local',
        phone: phone || '+94 77 000 0000',
        serviceId: targetService?.id || 'service',
        serviceName: targetService?.name || 'Styling Treatment',
        stylistId: targetStylist.id,
        stylistName: targetStylist.name,
        date: targetDate,
        time: cleanTime,
        totalPrice: targetService?.price || 0,
        paymentMethod: 'salon',
        depositPaid: 0,
        addOns: [],
        status: 'confirmed',
        bookingType: 'stylist-booking',
        notes: notes || 'Booked directly by stylist at chair station',
        createdAt: new Date().toISOString()
      };

      setBookings(prev => [createdBooking, ...prev]);
      setMyGuestBookingIds(prev => [newBookingId, ...prev]);
      showToast('Appointment Added!', `Booking #${newBookingId} for ${createdBooking.customerName} on ${targetDate} at ${cleanTime} added to Bookings!`, 'success');
    } else {
      showToast('Slot Added!', `New slot ${cleanTime} added to ${targetStylist.name}'s timetable on ${targetDate}. Open for bookings!`, 'success');
    }

    return { customSlot: newCustomSlot, booking: createdBooking };
  };

  const removeStylistSlot = (stylistId, date, time) => {
    setCustomSlots(prev => prev.filter(s => !(s.stylistId === stylistId && s.date === date && s.time === time)));
    showToast('Slot Removed', `Slot ${time} removed from timetable.`, 'info');
  };

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openBookingWizard = (service = null, stylist = null) => {
    setDraftBooking(prev => ({
      ...prev,
      service: service || prev.service || services[0],
      selectedAddOns: [],
      stylist: stylist || prev.stylist || stylists[0],
      date: todayStr,
      time: '11:15 AM',
      paymentMethod: 'salon'
    }));
    setCurrentStep(1);
    setIsBookingOpen(true);
  };

  const closeBookingWizard = () => {
    setIsBookingOpen(false);
  };

  const toggleAddOn = (addon) => {
    setDraftBooking(prev => {
      const exists = prev.selectedAddOns.some(a => a.id === addon.id);
      if (exists) {
        return {
          ...prev,
          selectedAddOns: prev.selectedAddOns.filter(a => a.id !== addon.id)
        };
      } else {
        return {
          ...prev,
          selectedAddOns: [...prev.selectedAddOns, addon]
        };
      }
    });
  };

  const calculateTotal = (service, addOns = []) => {
    const base = service ? service.price : 0;
    const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0);
    return base + addOnsTotal;
  };

  const confirmBooking = () => {
    const total = calculateTotal(draftBooking.service, draftBooking.selectedAddOns);
    const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: newBookingId,
      tenantId: activeTenantId,
      customerName: draftBooking.customer.name || 'Valued Guest',
      email: draftBooking.customer.email || 'guest@example.lk',
      phone: draftBooking.customer.phone || '+94 (77) 000-0000',
      serviceId: draftBooking.service.id,
      serviceName: draftBooking.service.name,
      stylistId: draftBooking.stylist ? draftBooking.stylist.id : 'any',
      stylistName: draftBooking.stylist ? draftBooking.stylist.name : 'First Available Specialist',
      date: draftBooking.date,
      time: draftBooking.time,
      totalPrice: total,
      paymentMethod: draftBooking.paymentMethod,
      depositPaid: draftBooking.paymentMethod === 'deposit' ? 1500 : 0,
      addOns: draftBooking.selectedAddOns.map(a => a.name),
      status: 'confirmed',
      notes: draftBooking.customer.notes || '',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setMyGuestBookingIds(prev => [newBookingId, ...prev]);

    setIsBookingOpen(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }

    showToast('Booking Confirmed!', `Your appointment #${newBooking.id} is scheduled for ${newBooking.date} at ${newBooking.time}.`, 'success');
    
    // Open digital pass
    setActivePassBooking(newBooking);
  };

  const claimBookingToSession = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return false;

    const matched = bookings.filter(b =>
      ((b.tenantId || 'luxecut') === activeTenantId) &&
      (b.id.toLowerCase() === q || b.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')))
    );

    if (matched.length > 0) {
      const newIds = matched.map(b => b.id);
      setMyGuestBookingIds(prev => Array.from(new Set([...prev, ...newIds])));
      showToast('Found!', `Retrieved ${matched.length} appointment(s) for your session.`, 'success');
      return true;
    } else {
      showToast('Not Found', 'No appointment found matching that Booking Ref or Phone Number for this salon.', 'info');
      return false;
    }
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast('Status Updated', `Appointment ${bookingId} marked as ${newStatus}.`, 'info');
  };

  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const rescheduleBooking = (bookingId, newDate, newTime) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, date: newDate, time: newTime, status: 'confirmed' } : b))
    );
    setRescheduleBookingTarget(null);
    showToast('Rescheduled!', `Appointment ${bookingId} has been moved to ${newDate} at ${newTime}.`, 'success');
  };

  const addService = (newSrv) => {
    const srvObj = {
      id: `srv-${Date.now()}`,
      name: newSrv.name,
      category: newSrv.category || 'haircut',
      price: Number(newSrv.price) || 3500,
      duration: Number(newSrv.duration) || 45,
      description: newSrv.description,
      popular: false,
      badge: newSrv.badge || 'New Service',
      image: newSrv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      addOns: []
    };
    setServices(prev => [srvObj, ...prev]);
    showToast('Service Added', `New service "${srvObj.name}" added to catalog.`, 'success');
  };

  const deleteService = (serviceId) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    showToast('Service Deleted', 'Service removed from catalog.', 'info');
  };

  const updateService = (id, updatedData) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            ...updatedData,
            price: Number(updatedData.price) || s.price,
            duration: Number(updatedData.duration) || s.duration
          };
        }
        return s;
      })
    );
    showToast('Service Updated', 'Service details and photo updated.', 'success');
  };

  const deleteStylist = (stylistId) => {
    setStylists(prev => prev.filter(s => s.id !== stylistId));
    showToast('Stylist Deleted', 'Stylist removed from team roster.', 'info');
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast('Appointment Removed', `Booking #${bookingId} deleted.`, 'info');
  };

  // Stylist Management Functions
  const addStylist = (newStylist) => {
    const stylistObj = {
      id: `st-${Date.now()}`,
      name: newStylist.name,
      role: newStylist.role || 'Hair Specialist',
      bio: newStylist.bio || 'Expert stylist providing personalized grooming services.',
      experience: newStylist.experience || '5+ Years Exp.',
      rating: 5.0,
      reviewsCount: 1,
      image: newStylist.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      specialties: newStylist.specialties || ['cut-style'],
      status: 'active',
      shiftStart: newStylist.shiftStart || '09:00 AM',
      shiftEnd: newStylist.shiftEnd || '06:00 PM',
      breakStart: newStylist.breakStart || '01:00 PM',
      breakEnd: newStylist.breakEnd || '02:00 PM',
      availableDays: newStylist.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };

    setStylists(prev => [...prev, stylistObj]);
    showToast('Stylist Added', `Added ${stylistObj.name} to team roster.`, 'success');
  };

  const updateStylist = (id, updatedData) => {
    setStylists(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...updatedData };
          if (activeStylist && activeStylist.id === id) {
            setActiveStylist(updated);
            localStorage.setItem(`active_stylist_${activeTenantId}`, JSON.stringify(updated));
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Profile Updated', 'Stylist profile & timetable preferences saved.', 'success');
  };

  const toggleStylistDuty = (id) => {
    setStylists(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'on-leave' : 'active';
          showToast('Duty Status', `${s.name} status set to ${nextStatus}.`, 'info');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const addReview = (newReview) => {
    const reviewObj = {
      id: `r-${Date.now()}`,
      tenantId: activeTenantId,
      author: newReview.author || 'Anonymous Guest',
      rating: Number(newReview.rating) || 5,
      date: 'Just now',
      service: newReview.service || 'Salon & Spa Service',
      comment: newReview.comment,
      verified: true
    };
    setReviews(prev => [reviewObj, ...prev]);
    showToast('Thank You!', 'Your review has been submitted successfully.', 'success');
  };

  // Only return bookings that belong to this guest device session AND current salon
  const myGuestBookings = bookings.filter(b => 
    myGuestBookingIds.includes(b.id) && (b.tenantId || 'luxecut') === activeTenantId
  );

  // Tenant-scoped reviews for front-facing display
  const tenantReviews = reviews.filter(r => (r.tenantId || 'luxecut') === activeTenantId);

  // Tenant-scoped bookings for admin calculations
  const tenantBookings = bookings.filter(b => (b.tenantId || 'luxecut') === activeTenantId);

  return (
    <BookingContext.Provider
      value={{
        services,
        stylists,
        bookings,
        allBookings: bookings,
        tenantBookings,
        myGuestBookings,
        myGuestBookingIds,
        claimBookingToSession,
        reviews: tenantReviews,
        allReviews: reviews,
        activeTab,
        setActiveTab,
        isAdminAuthenticated,
        isAdminLoginOpen,
        adminLoginInitialRole,
        openAdminLogin,
        openManagerLogin,
        openStylistLogin,
        closeAdminLogin,
        loginAdmin,
        logoutAdmin,
        isBookingOpen,
        openBookingWizard,
        closeBookingWizard,
        currentStep,
        setCurrentStep,
        draftBooking,
        setDraftBooking,
        toggleAddOn,
        calculateTotal,
        confirmBooking,
        updateBookingStatus,
        cancelBooking,
        deleteBooking,
        rescheduleBooking,
        rescheduleBookingTarget,
        setRescheduleBookingTarget,
        addService,
        updateService,
        deleteService,
        addStylist,
        deleteStylist,
        updateStylist,
        toggleStylistDuty,
        activePassBooking,
        setActivePassBooking,
        addReview,
        toast,
        showToast,
        activeStylist,
        loginStylist,
        logoutStylist,
        updateStylistLiveStatus,
        seatWalkIn,
        holdSlotForQueue,
        completeChairBooking,
        customSlots,
        getStylistSlotsForDate,
        addStylistSlot,
        removeStylistSlot,
        tenant,
        activeTenantId,
        switchTenant,
        updateTenantConfig,
        formatPrice,
        getWhatsAppAlertUrl,
        getCustomerPhoneMessage,
        getCustomerWhatsAppUrl,
        getCustomerSmsUrl,
        getDirectSalonLink,
        availableTenants: Object.values(customTenantConfigs)
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
