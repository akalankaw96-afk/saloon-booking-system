import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { TIME_SLOTS } from '../data/mockData';
import { 
  Scissors, Clock, CheckCircle, AlertCircle, LogOut, UserCheck, 
  UserPlus, Coffee, Play, Check, X, ShieldAlert, Sparkles, Plus, 
  Calendar, Phone, FileText, ChevronRight, Edit3, Save, User, Briefcase, Trash2
} from 'lucide-react';

export const StylistStation = () => {
  const {
    activeStylist,
    logoutStylist,
    stylists,
    services,
    bookings,
    updateStylistLiveStatus,
    updateStylist,
    seatWalkIn,
    holdSlotForQueue,
    completeChairBooking,
    updateBookingStatus,
    tenant,
    formatPrice,
    showToast,
    getStylistSlotsForDate,
    addStylistSlot,
    removeStylistSlot,
    customSlots
  } = useBooking();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [stationTab, setStationTab] = useState('timetable'); // 'timetable' | 'profile'

  // Walk-in modal state
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    customerName: '',
    serviceId: services[0]?.id || '',
    time: TIME_SLOTS[0],
    notes: ''
  });

  // Queue hold modal state
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [queueForm, setQueueForm] = useState({
    time: TIME_SLOTS[0],
    queueLabel: 'Waiting Queue Guest #1'
  });

  // Timetable View Mode: 'grid' or 'bookings'
  const [timetableViewMode, setTimetableViewMode] = useState('grid'); // 'grid' | 'bookings'

  // Add Custom Slot / Booking Modal state
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [addSlotForm, setAddSlotForm] = useState({
    date: todayStr,
    time: '07:00 PM',
    customTime: '',
    slotType: 'appointment', // 'appointment' | 'walk-in' | 'open' | 'queue-hold'
    customerName: '',
    phone: '',
    serviceId: services[0]?.id || '',
    notes: ''
  });

  if (!activeStylist) return null;

  // Find latest stylist details from state
  const currentStylist = stylists.find(s => s.id === activeStylist.id) || activeStylist;

  // Particular Stylist Profile State
  const [profileForm, setProfileForm] = useState({
    name: currentStylist.name || '',
    role: currentStylist.role || '',
    bio: currentStylist.bio || '',
    experience: currentStylist.experience || '',
    shiftStart: currentStylist.shiftStart || '09:00 AM',
    shiftEnd: currentStylist.shiftEnd || '06:00 PM',
    breakStart: currentStylist.breakStart || '01:00 PM',
    breakEnd: currentStylist.breakEnd || '02:00 PM',
    availableDays: currentStylist.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    specialties: currentStylist.specialties || []
  });

  useEffect(() => {
    if (currentStylist) {
      setProfileForm({
        name: currentStylist.name || '',
        role: currentStylist.role || '',
        bio: currentStylist.bio || '',
        experience: currentStylist.experience || '',
        shiftStart: currentStylist.shiftStart || '09:00 AM',
        shiftEnd: currentStylist.shiftEnd || '06:00 PM',
        breakStart: currentStylist.breakStart || '01:00 PM',
        breakEnd: currentStylist.breakEnd || '02:00 PM',
        availableDays: currentStylist.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        specialties: currentStylist.specialties || []
      });
    }
  }, [currentStylist]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateStylist(currentStylist.id, profileForm);
    showToast('Profile Saved', 'Your stylist profile & timetable preferences have been updated.', 'success');
  };

  const toggleWorkingDay = (day) => {
    setProfileForm(prev => {
      const days = prev.availableDays || [];
      const updated = days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day];
      return { ...prev, availableDays: updated };
    });
  };

  // STRICT PRIVACY: Filter ONLY bookings belonging to THIS stylist and THIS salon
  const mySalonBookings = bookings.filter(b => 
    (b.tenantId || 'luxecut') === tenant.id &&
    (b.stylistId === currentStylist.id) &&
    b.status !== 'cancelled'
  );

  const myDateBookings = mySalonBookings.filter(b => b.date === selectedDate);

  // Today's personal stats for this stylist (NO SALON REVENUE VISIBLE)
  const todayBookings = mySalonBookings.filter(b => b.date === todayStr);
  const completedTodayCount = todayBookings.filter(b => b.status === 'completed').length;
  const walkInsTodayCount = todayBookings.filter(b => b.bookingType === 'walk-in').length;
  const activeBookingsCount = todayBookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length;

  const handleOpenSeatModal = (timeSlot) => {
    setWalkInForm({
      customerName: '',
      serviceId: services[0]?.id || '',
      time: timeSlot,
      notes: ''
    });
    setIsSeatModalOpen(true);
  };

  const handleOpenQueueModal = (timeSlot) => {
    const queueNumber = mySalonBookings.filter(b => b.date === selectedDate && b.bookingType === 'queue-hold').length + 1;
    setQueueForm({
      time: timeSlot,
      queueLabel: `Waiting Queue Guest #${queueNumber}`
    });
    setIsQueueModalOpen(true);
  };

  const handleSeatWalkInSubmit = (e) => {
    e.preventDefault();
    if (!walkInForm.time) return;

    seatWalkIn({
      stylistId: currentStylist.id,
      customerName: walkInForm.customerName || 'Walk-in Guest',
      serviceId: walkInForm.serviceId,
      time: walkInForm.time,
      date: selectedDate,
      notes: walkInForm.notes || 'Physical walk-in client'
    });

    setIsSeatModalOpen(false);
  };

  const handleHoldQueueSubmit = (e) => {
    e.preventDefault();
    if (!queueForm.time) return;

    holdSlotForQueue({
      stylistId: currentStylist.id,
      time: queueForm.time,
      date: selectedDate,
      queueLabel: queueForm.queueLabel || 'Waiting Queue Guest'
    });

    setIsQueueModalOpen(false);
  };

  // Day slots dynamically retrieved from context (including standard + stylist-added custom slots)
  const daySlots = getStylistSlotsForDate ? getStylistSlotsForDate(currentStylist.id, selectedDate) : TIME_SLOTS;

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    const finalTime = addSlotForm.customTime.trim() || addSlotForm.time;
    if (!finalTime) return;

    addStylistSlot({
      stylistId: currentStylist.id,
      date: addSlotForm.date || selectedDate,
      time: finalTime,
      slotType: addSlotForm.slotType,
      customerName: addSlotForm.customerName,
      phone: addSlotForm.phone,
      serviceId: addSlotForm.serviceId,
      notes: addSlotForm.notes
    });

    setIsAddSlotModalOpen(false);
    setAddSlotForm({
      date: selectedDate,
      time: '07:00 PM',
      customTime: '',
      slotType: 'appointment',
      customerName: '',
      phone: '',
      serviceId: services[0]?.id || '',
      notes: ''
    });
  };

  const handleQuickHoldNextSlot = () => {
    const occupiedSlotTimes = myDateBookings.map(b => b.time);
    const nextFree = daySlots.find(t => !occupiedSlotTimes.includes(t));
    if (!nextFree) {
      showToast('All Slots Occupied', `All chair slots for ${selectedDate} are currently taken.`, 'info');
      return;
    }
    const queueNum = myDateBookings.filter(b => b.bookingType === 'queue-hold').length + 1;
    holdSlotForQueue({
      stylistId: currentStylist.id,
      time: nextFree,
      date: selectedDate,
      queueLabel: `Waiting Queue Guest #${queueNum}`
    });
  };

  const statusConfig = {
    'available': {
      label: 'Available & Ready',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-400'
    },
    'in-chair': {
      label: 'In-Chair (Currently Working)',
      color: 'bg-red-500/20 text-red-300 border-red-500/40',
      dot: 'bg-red-500'
    },
    'walk-in': {
      label: 'Serving Walk-in',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400'
    },
    'on-break': {
      label: 'On Break',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dot: 'bg-blue-400'
    }
  };

  const currentStatus = statusConfig[currentStylist.liveStatus] || statusConfig['available'];

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Station Header & Stylist Identity */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--gold-primary)]/30 bg-gradient-to-r from-black/80 via-[#141624] to-black/80 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-primary)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative shrink-0">
            <img 
              src={currentStylist.image} 
              alt={currentStylist.name} 
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[var(--gold-primary)] shadow-lg shadow-black/50"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-black flex items-center justify-center ${currentStatus.dot}`}>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--gold-primary)] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 truncate max-w-[150px] sm:max-w-none">
                {tenant.fullName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                Stylist Chair
              </span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2 truncate">
              <span>{currentStylist.name}</span>
            </h2>

            <p className="text-xs text-gray-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>{currentStylist.role}</span>
              <span>•</span>
              <span>PIN: <strong className="text-amber-400 font-mono">{currentStylist.pin || '1001'}</strong></span>
            </p>
          </div>
        </div>

        {/* Chair Live Status Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          
          <div className="space-y-1 w-full sm:w-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between sm:justify-start">
              <span>Working Status</span>
              <span className="sm:hidden text-[9px] text-amber-300 font-mono">Tap to switch</span>
            </div>
            <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => updateStylistLiveStatus(currentStylist.id, 'available')}
                className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                  currentStylist.liveStatus === 'available'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Chair is empty and ready for next client"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">Available</span>
              </button>

              <button
                type="button"
                onClick={() => updateStylistLiveStatus(currentStylist.id, 'in-chair')}
                className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                  currentStylist.liveStatus === 'in-chair'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Currently working with client"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span className="truncate">In-Chair</span>
              </button>

              <button
                type="button"
                onClick={() => updateStylistLiveStatus(currentStylist.id, 'on-break')}
                className={`px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                  currentStylist.liveStatus === 'on-break'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Stepping away for a short break"
              >
                <Coffee className="w-3 h-3 text-blue-300 shrink-0" />
                <span className="truncate">Break</span>
              </button>
            </div>
          </div>

          <button
            onClick={logoutStylist}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Lock & Exit Stylist Station"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Lock Station</span>
          </button>

        </div>

      </div>

      {/* CONFIDENTIALITY GUARD NOTICE */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-emerald-300 uppercase tracking-wider flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>Station Confidentiality Guard Active</span>
              <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full">
                🔒 Privacy Protected
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 leading-relaxed">
              Only your station's chair schedule, profile, and walk-in queue are visible. Salon revenue & other stylists' records are completely hidden.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {stationTab === 'timetable' && (
            <button
              type="button"
              onClick={handleQuickHoldNextSlot}
              className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
              title="Instantly lock next available slot for a waiting walk-in guest"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+ Hold Next Slot for Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Station Navigation Tab Switcher */}
      <div className="grid grid-cols-2 sm:flex bg-black/60 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setStationTab('timetable')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            stationTab === 'timetable'
              ? 'bg-[var(--gold-primary)] text-black font-extrabold shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Timetable & Walk-ins</span>
        </button>

        <button
          type="button"
          onClick={() => setStationTab('profile')}
          className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            stationTab === 'profile'
              ? 'bg-[var(--gold-primary)] text-black font-extrabold shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">My Profile & Shifts</span>
        </button>
      </div>

      {/* TAB 1: TIMETABLE & WALK-IN MATRIX */}
      {stationTab === 'timetable' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Personal Station Metrics Row (NO SALON REVENUE) - 2 columns on mobile so all 4 fit on screen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            
            <div className="glass-panel p-3.5 sm:p-5 border-l-4 border-l-[var(--gold-primary)] space-y-0.5 sm:space-y-1 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate block">
                Active Today
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeBookingsCount}
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 hidden xs:block truncate">
                Scheduled for chair
              </p>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 border-l-4 border-l-amber-500 space-y-0.5 sm:space-y-1 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400 truncate block">
                Walk-ins Seated
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-200">
                {walkInsTodayCount}
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 hidden xs:block truncate">
                Physical guests served
              </p>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 border-l-4 border-l-emerald-500 space-y-0.5 sm:space-y-1 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400 truncate block">
                Completed
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                {completedTodayCount}
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 hidden xs:block truncate">
                Chair freed today
              </p>
            </div>

            <div className="glass-panel p-3.5 sm:p-5 border-l-4 border-l-purple-500 space-y-0.5 sm:space-y-1 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-400 truncate block">
                Working State
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border truncate ${currentStatus.color}`}>
                  {currentStatus.label.split(' ')[0]}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 hidden xs:block truncate mt-0.5 sm:mt-1 font-mono">
                {currentStylist.shiftStart || '09:00 AM'} - {currentStylist.shiftEnd || '06:00 PM'}
              </p>
            </div>

          </div>

          {/* Date Switcher & Timetable Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>Chair Timetable & Bookings</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 font-light mt-0.5">
                Maintain your daily chair slots. Add custom slots, seat walk-in guests, or view confirmed bookings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setAddSlotForm(prev => ({ ...prev, date: selectedDate }));
                  setIsAddSlotModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--gold-primary)] hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer shrink-0"
                title="Add a custom slot, appointment, or walk-in"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Add Slot / Booking</span>
              </button>

              <div className="flex items-center gap-1.5 bg-black/60 border border-[var(--gold-primary)]/40 rounded-xl px-2.5 py-1">
                <span className="text-[11px] text-gray-400 shrink-0">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none"
                />
              </div>

              {selectedDate !== todayStr && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 text-xs text-gray-300 hover:text-white cursor-pointer shrink-0"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* Sub-view switcher: Timetable Grid vs Bookings List */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setTimetableViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  timetableViewMode === 'grid'
                    ? 'bg-white/15 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Timetable Grid ({daySlots.length} Slots)</span>
              </button>
              <button
                type="button"
                onClick={() => setTimetableViewMode('bookings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  timetableViewMode === 'bookings'
                    ? 'bg-[var(--gold-primary)] text-black font-extrabold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Bookings ({myDateBookings.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Showing schedule for <strong className="text-white">{selectedDate}</strong>
            </span>
          </div>

          {/* VIEW A: Interactive Chair Time Slots Grid */}
          {timetableViewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {daySlots.map(timeSlot => {
              const slotBooking = myDateBookings.find(b => b.time === timeSlot);
              const isSlotOccupied = !!slotBooking;
              const isWalkIn = slotBooking?.bookingType === 'walk-in';
              const isQueueHold = slotBooking?.bookingType === 'queue-hold';
              const isCompleted = slotBooking?.status === 'completed';
              const isCustomSlot = !TIME_SLOTS.includes(timeSlot);

              return (
                <div 
                  key={timeSlot}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    !isSlotOccupied
                      ? 'bg-black/30 border-white/10 hover:border-emerald-500/40'
                      : isCompleted
                      ? 'bg-white/5 border-white/10 opacity-70'
                      : isWalkIn
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : isQueueHold
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/20'
                      : 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  }`}
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                      {timeSlot}
                    </span>

                    {/* Status Chip */}
                    {!isSlotOccupied ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        🟢 Free Slot
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/10">
                        ✓ Completed
                      </span>
                    ) : isWalkIn ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🚶 In-Chair Walk-in
                      </span>
                    ) : isQueueHold ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ⏳ Queue Hold
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        📅 Pre-Booked
                      </span>
                    )}
                  </div>

                  {/* Slot Body Details */}
                  <div className="space-y-1.5 flex-1 py-1">
                    {!isSlotOccupied ? (
                      <div className="text-xs text-gray-500 italic py-2">
                        Chair slot is open. Available for online bookings or physical walk-ins.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-white truncate">
                          {slotBooking.customerName}
                        </div>
                        <div className="text-xs text-[var(--gold-primary)] truncate font-medium">
                          {slotBooking.serviceName}
                        </div>
                        {slotBooking.phone && slotBooking.phone !== 'Walk-in Guest' && (
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span>{slotBooking.phone}</span>
                          </div>
                        )}
                        {slotBooking.notes && (
                          <div className="text-[10px] text-gray-400 bg-black/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                            "{slotBooking.notes}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                    {/* Slot Actions */}
                  <div className="pt-2 border-t border-white/10">
                    {!isSlotOccupied ? (
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenSeatModal(timeSlot)}
                            className="min-h-[40px] py-2 px-2 rounded-lg bg-[var(--gold-primary)] hover:bg-amber-400 text-black font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                            title="Seat a walk-in guest right now"
                          >
                            <UserPlus className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Seat Walk-in</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenQueueModal(timeSlot)}
                            className="min-h-[40px] py-2 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Hold this slot for someone in waiting queue"
                          >
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Queue Hold</span>
                          </button>
                        </div>

                        {isCustomSlot && (
                          <button
                            type="button"
                            onClick={() => removeStylistSlot(currentStylist.id, selectedDate, timeSlot)}
                            className="w-full text-[10px] text-gray-500 hover:text-red-400 py-1 transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Custom Slot</span>
                          </button>
                        )}
                      </div>
                    ) : isCompleted ? (
                      <div className="text-center text-[10px] text-gray-500 py-2 font-mono">
                        Ref: #{slotBooking.id} • Completed
                      </div>
                    ) : isQueueHold ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenSeatModal(timeSlot)}
                          className="min-h-[40px] py-2 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                        >
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Seat Guest</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(slotBooking.id, 'cancelled')}
                          className="min-h-[40px] py-2 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Release slot back to empty"
                        >
                          <X className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Release</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {slotBooking.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => {
                              updateBookingStatus(slotBooking.id, 'in-progress');
                              updateStylistLiveStatus(currentStylist.id, 'in-chair');
                            }}
                            className="w-full min-h-[40px] py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 shrink-0" />
                            <span>Start Service & Seat in Chair</span>
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => completeChairBooking(slotBooking.id, currentStylist.id)}
                          className="w-full min-h-[40px] py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3] shrink-0" />
                          <span>Complete & Free Chair</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
          )}

          {/* VIEW B: Dedicated Station Bookings List */}
          {timetableViewMode === 'bookings' && (
            <div className="space-y-4">
              {myDateBookings.length === 0 ? (
                <div className="glass-panel p-8 text-center text-gray-400 space-y-3 rounded-2xl border border-white/10">
                  <Clock className="w-10 h-10 text-[var(--gold-primary)] mx-auto opacity-50" />
                  <h4 className="text-white font-bold text-sm">No Bookings Scheduled for {selectedDate}</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    No active appointments or walk-ins for your chair on this date. You can add a direct booking or custom slot below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAddSlotForm(prev => ({ ...prev, date: selectedDate }));
                      setIsAddSlotModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--gold-primary)] hover:bg-amber-400 text-black text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    + Add New Booking or Slot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myDateBookings.map(b => (
                    <div
                      key={b.id}
                      className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 shadow-lg bg-gradient-to-br from-black/60 to-[#121422] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">#{b.id}</span>
                          {b.bookingType === 'walk-in' ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              🚶 Walk-in
                            </span>
                          ) : b.bookingType === 'queue-hold' ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              ⏳ Queue Hold
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              📅 Confirmed
                            </span>
                          )}
                        </div>

                        <span className="font-mono font-bold text-white text-xs bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                          {b.time}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="font-bold text-white text-sm truncate">{b.customerName}</div>
                        <div className="text-[var(--gold-primary)] font-medium truncate">{b.serviceName}</div>
                        {b.phone && b.phone !== 'Walk-in Guest' && (
                          <div className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span>{b.phone}</span>
                          </div>
                        )}
                        {b.notes && (
                          <div className="text-[10px] text-gray-400 bg-black/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                            "{b.notes}"
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        <span className="font-extrabold text-[var(--gold-primary)] text-xs">
                          {formatPrice(b.totalPrice)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {b.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateBookingStatus(b.id, 'in-progress');
                                updateStylistLiveStatus(currentStylist.id, 'in-chair');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Seat in Chair
                            </button>
                          )}
                          {b.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => completeChairBooking(b.id, currentStylist.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {b.bookingType === 'queue-hold' && (
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] transition-all cursor-pointer"
                            >
                              Release
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MY PARTICULAR PROFILE & SHIFTS */}
      {stationTab === 'profile' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 animate-fade-in max-w-4xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[var(--gold-primary)]" />
              <span>Maintain My Stylist Profile & Work Shifts</span>
            </h3>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Update your biography, specialties, daily shift timings, and working days.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Stylist Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.role}
                  onChange={e => setProfileForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <input
                  type="text"
                  value={profileForm.experience}
                  onChange={e => setProfileForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Station Access PIN (4 Digits)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentStylist.pin || '1001'}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono focus:outline-none cursor-not-allowed opacity-80"
                />
                <span className="text-[10px] text-gray-500">PIN managed by salon administrator</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Biography / Professional Summary
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)] resize-none"
              />
            </div>

            {/* Shift & Break Hours */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div className="text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Shift Schedule & Break Times</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Shift Start</label>
                  <input
                    type="text"
                    value={profileForm.shiftStart}
                    onChange={e => setProfileForm(prev => ({ ...prev, shiftStart: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Shift End</label>
                  <input
                    type="text"
                    value={profileForm.shiftEnd}
                    onChange={e => setProfileForm(prev => ({ ...prev, shiftEnd: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Break Start</label>
                  <input
                    type="text"
                    value={profileForm.breakStart}
                    onChange={e => setProfileForm(prev => ({ ...prev, breakStart: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Break End</label>
                  <input
                    type="text"
                    value={profileForm.breakEnd}
                    onChange={e => setProfileForm(prev => ({ ...prev, breakEnd: e.target.value }))}
                    className="w-full bg-black/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Working Days Selector */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-2">Available Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const isAvailable = profileForm.availableDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isAvailable
                            ? 'bg-[var(--gold-primary)] text-black font-extrabold shadow'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
              <span className="text-[11px] sm:text-xs text-gray-400 text-center sm:text-left">
                Changes are saved to your profile and reflected in online booking immediately.
              </span>
              <button
                type="submit"
                className="btn-primary text-xs py-3 sm:py-2.5 px-6 flex items-center justify-center gap-2 cursor-pointer font-extrabold w-full sm:w-auto shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* MODAL: SEAT WALK-IN GUEST */}
      {isSeatModalOpen && (
        <div className="modal-overlay animate-fade-in z-[110]">
          <div className="modal-content max-w-md w-full p-4 sm:p-6 bg-[#141624] border border-[var(--gold-primary)]/40 rounded-2xl relative space-y-4 sm:space-y-5 shadow-2xl">
            <button
              onClick={() => setIsSeatModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white">Seat Walk-in Guest</h4>
                <p className="text-xs text-gray-400">
                  Assign in-person guest to chair at <strong className="text-amber-400 font-mono">{walkInForm.time}</strong>.
                </p>
              </div>
            </div>

            <form onSubmit={handleSeatWalkInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Guest Name or Queue Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Guest in blue jacket or Samantha"
                  value={walkInForm.customerName}
                  onChange={e => setWalkInForm(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Requested Treatment / Service
                </label>
                <select
                  value={walkInForm.serviceId}
                  onChange={e => setWalkInForm(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                      {s.name} (~{s.duration} mins - {formatPrice(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Time Slot
                </label>
                <select
                  value={walkInForm.time}
                  onChange={e => setWalkInForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t} className="bg-gray-900 text-white font-mono">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Stylist Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Low fade skin taper, hot lather shave"
                  value={walkInForm.notes}
                  onChange={e => setWalkInForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Instantly sets chair to <strong>🔴 In-Chair (Currently Working)</strong> and locks this slot so online customers cannot double-book.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSeatModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--gold-primary)] hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg cursor-pointer"
                >
                  Confirm & Seat in Chair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HOLD FOR QUEUE */}
      {isQueueModalOpen && (
        <div className="modal-overlay animate-fade-in z-[110]">
          <div className="modal-content max-w-md w-full p-4 sm:p-6 bg-[#141624] border border-purple-500/40 rounded-2xl relative space-y-4 sm:space-y-5 shadow-2xl">
            <button
              onClick={() => setIsQueueModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white">Hold Slot for Waiting Queue</h4>
                <p className="text-xs text-gray-400">
                  Block online booking for slot <strong className="text-purple-300 font-mono">{queueForm.time}</strong> for lounge guests.
                </p>
              </div>
            </div>

            <form onSubmit={handleHoldQueueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Queue Placeholder Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waiting Queue Guest #1 (Lounge)"
                  value={queueForm.queueLabel}
                  onChange={e => setQueueForm(prev => ({ ...prev, queueLabel: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Slot to Hold
                </label>
                <select
                  value={queueForm.time}
                  onChange={e => setQueueForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t} className="bg-gray-900 text-white font-mono">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-[11px] text-purple-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-purple-400" />
                <span>
                  Protects in-salon queue guests from losing slots to online bookings.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQueueModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  Hold Slot for Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SLOT / BOOKING */}
      {isAddSlotModalOpen && (
        <div className="modal-overlay animate-fade-in z-[115]">
          <div className="modal-content max-w-lg w-full p-4 sm:p-6 bg-[#141624] border border-[var(--gold-primary)]/40 rounded-2xl relative space-y-4 sm:space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddSlotModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-primary)]/20 border border-[var(--gold-primary)]/40 text-[var(--gold-primary)] flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white">Add Timetable Slot & Booking</h4>
                <p className="text-xs text-gray-400">
                  Station: <strong className="text-white">{currentStylist.name}</strong> • Available to show in Bookings
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              
              {/* Slot Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  What would you like to add?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddSlotForm(prev => ({ ...prev, slotType: 'appointment' }))}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      addSlotForm.slotType === 'appointment'
                        ? 'border-[var(--gold-primary)] bg-[rgba(212,175,55,0.15)] text-white font-bold'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Direct Booking</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Add client reservation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddSlotForm(prev => ({ ...prev, slotType: 'walk-in' }))}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      addSlotForm.slotType === 'walk-in'
                        ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Seat Walk-in</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Seat guest right now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddSlotForm(prev => ({ ...prev, slotType: 'open' }))}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      addSlotForm.slotType === 'open'
                        ? 'border-blue-500 bg-blue-500/15 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Open Slot</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Free slot on timetable</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddSlotForm(prev => ({ ...prev, slotType: 'queue-hold' }))}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      addSlotForm.slotType === 'queue-hold'
                        ? 'border-purple-500 bg-purple-500/15 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Queue Hold</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Block slot for queue</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={addSlotForm.date}
                    onChange={e => setAddSlotForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Slot Time
                  </label>
                  <select
                    value={addSlotForm.time}
                    onChange={e => setAddSlotForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  >
                    {['08:00 AM', '08:30 AM', '09:00 AM', '10:00 AM', '11:15 AM', '12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:45 PM', '05:00 PM', '06:00 PM', '06:15 PM', '07:00 PM', '07:30 PM', '08:00 PM'].map(t => (
                      <option key={t} value={t} className="bg-gray-900 text-white font-mono">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Or type custom time */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  Or enter specific custom time (optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07:15 PM or 08:45 AM"
                  value={addSlotForm.customTime}
                  onChange={e => setAddSlotForm(prev => ({ ...prev, customTime: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              {/* Conditional Client Fields if not 'open' */}
              {addSlotForm.slotType !== 'open' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[11px] font-bold text-[var(--gold-primary)] uppercase tracking-wider">
                    {addSlotForm.slotType === 'queue-hold' ? 'Queue Information' : 'Client & Treatment Details (Shown in Bookings)'}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">
                      {addSlotForm.slotType === 'queue-hold' ? 'Queue Label' : 'Guest Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={addSlotForm.slotType === 'queue-hold' ? 'Waiting Queue Guest #2' : 'e.g. Samantha Fernando'}
                      value={addSlotForm.customerName}
                      onChange={e => setAddSlotForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                    />
                  </div>

                  {addSlotForm.slotType === 'appointment' && (
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Guest Phone Number</label>
                      <input
                        type="text"
                        placeholder="+94 77 123 4567"
                        value={addSlotForm.phone}
                        onChange={e => setAddSlotForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}

                  {addSlotForm.slotType !== 'queue-hold' && (
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Treatment / Service</label>
                      <select
                        value={addSlotForm.serviceId || services[0]?.id}
                        onChange={e => setAddSlotForm(prev => ({ ...prev, serviceId: e.target.value }))}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                            {s.name} ({formatPrice(s.price)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Requested low fade, skin taper"
                      value={addSlotForm.notes}
                      onChange={e => setAddSlotForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Informative Help Banner */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {addSlotForm.slotType === 'open'
                    ? 'Adds this slot to your timetable. Online customers or walk-ins can take this slot.'
                    : 'This slot and guest will immediately show in both your Station Bookings and the Manager Master Schedule!'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--gold-primary)] hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {addSlotForm.slotType === 'open' ? 'Add Open Slot' : 'Confirm & Add to Bookings'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
