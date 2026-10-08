import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES, STYLISTS, INITIAL_BOOKINGS, REVIEWS } from '../data/mockData';
import confetti from 'canvas-confetti';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Services & Stylists State (Dynamic Admin Management)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_services_lkr');
    return saved ? JSON.parse(saved) : SERVICES;
  });

  const [stylists, setStylists] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_stylists_lkr');
    if (saved) return JSON.parse(saved);
    // Enrich default mock stylists with status and break times
    return STYLISTS.map(s => ({
      ...s,
      status: s.status || 'active', // 'active' | 'on-leave'
      shiftStart: s.shiftStart || '09:00 AM',
      shiftEnd: s.shiftEnd || '07:00 PM',
      breakStart: s.breakStart || '01:00 PM',
      breakEnd: s.breakEnd || '02:00 PM',
      availableDays: s.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }));
  });

  // All Salon Bookings (Master Data)
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_bookings_lkr');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Guest Device Booking IDs (Privacy separation for guests without login)
  const [myGuestBookingIds, setMyGuestBookingIds] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_my_guest_ids');
    return saved ? JSON.parse(saved) : ['BK-8901'];
  });

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('luxe_salon_reviews_lkr');
    return saved ? JSON.parse(saved) : REVIEWS;
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'portfolio' | 'reviews' | 'my-bookings' | 'admin'

  // Manager Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('luxe_salon_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('luxe_salon_admin_auth', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  const openAdminLogin = () => {
    setIsAdminLoginOpen(true);
  };

  const closeAdminLogin = () => {
    setIsAdminLoginOpen(false);
  };

  const loginAdmin = (pin) => {
    if (pin === '1234' || pin === 'admin') {
      setIsAdminAuthenticated(true);
      setIsAdminLoginOpen(false);
      setActiveTab('admin');
      showToast('Manager Access Granted', 'Authenticated as Salon Operations Manager.', 'success');
      return true;
    } else {
      showToast('Access Denied', 'Invalid Manager PIN code. Default is 1234.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('services');
    showToast('Manager Logged Out', 'Admin session terminated.', 'info');
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
      b.id.toLowerCase() === q || b.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
    );

    if (matched.length > 0) {
      const newIds = matched.map(b => b.id);
      setMyGuestBookingIds(prev => Array.from(new Set([...prev, ...newIds])));
      showToast('Found!', `Retrieved ${matched.length} appointment(s) for your session.`, 'success');
      return true;
    } else {
      showToast('Not Found', 'No appointment found matching that Booking Ref or Phone Number.', 'info');
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
      prev.map(s => (s.id === id ? { ...s, ...updatedData } : s))
    );
    showToast('Stylist Updated', 'Team member profile and schedule updated.', 'success');
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

  // Only return bookings that belong to this guest device session
  const myGuestBookings = bookings.filter(b => myGuestBookingIds.includes(b.id));

  return (
    <BookingContext.Provider
      value={{
        services,
        stylists,
        bookings,
        myGuestBookings,
        myGuestBookingIds,
        claimBookingToSession,
        reviews,
        activeTab,
        setActiveTab,
        isAdminAuthenticated,
        isAdminLoginOpen,
        openAdminLogin,
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
        rescheduleBooking,
        rescheduleBookingTarget,
        setRescheduleBookingTarget,
        addService,
        addStylist,
        updateStylist,
        toggleStylistDuty,
        activePassBooking,
        setActivePassBooking,
        addReview,
        toast,
        showToast
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
