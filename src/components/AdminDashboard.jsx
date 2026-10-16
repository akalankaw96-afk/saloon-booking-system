import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { StylistStation } from './StylistStation';
import { TIME_SLOTS } from '../data/mockData';
import { 
  ShieldCheck, DollarSign, Calendar, Users, Clock, Search, Filter, 
  CheckCircle, XCircle, AlertCircle, RefreshCw, Download, Plus, X, 
  Edit3, UserCheck, UserX, Scissors, Lock, LogOut, Key, Palette, 
  Sparkles, MessageSquare, MapPin, Phone, Copy, Check, Eye, EyeOff,
  UploadCloud, Image as ImageIcon, Trash2, Camera, UserPlus, Play, Coffee
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    bookings, 
    stylists, 
    services,
    deleteService,
    updateService,
    deleteStylist,
    updateBookingStatus, 
    deleteBooking,
    addService, 
    addStylist, 
    updateStylist, 
    toggleStylistDuty, 
    showToast, 
    isAdminAuthenticated, 
    logoutAdmin, 
    loginAdmin, 
    setActiveTab,
    tenant,
    activeTenantId,
    switchTenant,
    updateTenantConfig,
    availableTenants,
    formatPrice,
    getDirectSalonLink,
    activeStylist,
    loginStylist,
    logoutStylist,
    updateStylistLiveStatus,
    seatWalkIn,
    holdSlotForQueue,
    completeChairBooking,
    getStylistSlotsForDate,
    isSupabaseConfigured,
    cloudSyncStatus,
    isCloudSyncing,
    syncWithCloud
  } = useBooking();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [loginRoleTab, setLoginRoleTab] = useState('manager'); // 'manager' | 'stylist'
  const [selectedStylistPinId, setSelectedStylistPinId] = useState('');
  const [showInlinePassword, setShowInlinePassword] = useState(false);
  const [showSettingPassword, setShowSettingPassword] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [adminTab, setAdminTab] = useState('appointments'); // 'appointments' | 'timetable' | 'services' | 'stylists' | 'branding'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Manager Walk-in & Queue modal state
  const [managerWalkInTarget, setManagerWalkInTarget] = useState(null); // { stylistId, time }
  const [managerWalkInForm, setManagerWalkInForm] = useState({
    customerName: '',
    serviceId: '',
    notes: ''
  });

  // Branding Customization Form State
  const [brandingForm, setBrandingForm] = useState({
    name: tenant.name || '',
    subName: tenant.subName || '',
    fullName: tenant.fullName || '',
    tagline: tenant.tagline || '',
    heroBadge: tenant.hero?.badge || '',
    heroTitlePrefix: tenant.hero?.titlePrefix || '',
    heroTitleHighlight: tenant.hero?.titleHighlight || '',
    heroSubtitle: tenant.hero?.subtitle || '',
    heroImage: tenant.hero?.image || '',
    primaryColor: tenant.theme?.primaryColor || '#d4af37',
    bgDark: tenant.theme?.bgDark || '#0b0c10',
    phone: tenant.contact?.phone || '',
    whatsapp: tenant.contact?.whatsapp || '',
    address: tenant.contact?.address || '',
    hours: tenant.contact?.hours || '',
    hasPortfolio: tenant.features?.hasPortfolio ?? true,
    hasReviews: tenant.features?.hasReviews ?? true,
    allowOnlineDeposit: tenant.features?.allowOnlineDeposit ?? true,
    whatsappAlert: tenant.features?.whatsappAlert ?? true,
    adminPin: tenant.adminPin || '1234',
    adminPassword: tenant.adminPassword || 'LuxeCut@2026'
  });

  // Keep form in sync when active tenant switches
  useEffect(() => {
    if (tenant) {
      setBrandingForm({
        name: tenant.name || '',
        subName: tenant.subName || '',
        fullName: tenant.fullName || '',
        tagline: tenant.tagline || '',
        heroBadge: tenant.hero?.badge || '',
        heroTitlePrefix: tenant.hero?.titlePrefix || '',
        heroTitleHighlight: tenant.hero?.titleHighlight || '',
        heroSubtitle: tenant.hero?.subtitle || '',
        heroImage: tenant.hero?.image || '',
        primaryColor: tenant.theme?.primaryColor || '#d4af37',
        bgDark: tenant.theme?.bgDark || '#0b0c10',
        phone: tenant.contact?.phone || '',
        whatsapp: tenant.contact?.whatsapp || '',
        address: tenant.contact?.address || '',
        hours: tenant.contact?.hours || '',
        hasPortfolio: tenant.features?.hasPortfolio ?? true,
        hasReviews: tenant.features?.hasReviews ?? true,
        allowOnlineDeposit: tenant.features?.allowOnlineDeposit ?? true,
        whatsappAlert: tenant.features?.whatsappAlert ?? true,
        adminPin: tenant.adminPin || '1234',
        adminPassword: tenant.adminPassword || 'LuxeCut@2026'
      });
    }
  }, [tenant]);


  // Add Service Modal state
  const [isAddSrvOpen, setIsAddSrvOpen] = useState(false);
  const [newSrvForm, setNewSrvForm] = useState({
    name: '', 
    category: 'haircut', 
    price: '', 
    duration: '45', 
    badge: 'Signature', 
    description: '',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
  });

  // Add Stylist Modal state
  const [isAddStylistOpen, setIsAddStylistOpen] = useState(false);
  const [newStylistForm, setNewStylistForm] = useState({
    name: '', 
    role: 'Master Stylist', 
    experience: '5+ Years Exp.', 
    bio: '', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    shiftStart: '09:00 AM', 
    shiftEnd: '06:00 PM', 
    breakStart: '01:00 PM', 
    breakEnd: '02:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  });

  // Edit Stylist Modal state
  const [editingStylist, setEditingStylist] = useState(null);

  // Edit Service Modal state
  const [editingService, setEditingService] = useState(null);

  // Helper to compress uploaded device photos to max 800px & ~50KB so they sync instantly over cloud
  const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // File Upload Handlers (Auto-resizes & compresses camera photos)
  const handleEditServicePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setEditingService(prev => ({ ...prev, image: compressed }));
      showToast('Photo Loaded', 'Service photo optimized & ready.', 'success');
    } catch {
      showToast('Photo Error', 'Could not process selected image.', 'error');
    }
  };

  const handleServicePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setNewSrvForm(prev => ({ ...prev, image: compressed }));
      showToast('Photo Loaded', 'Service photo optimized & attached.', 'success');
    } catch {
      showToast('Photo Error', 'Could not process selected image.', 'error');
    }
  };

  const handleStylistPhotoUpload = async (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      if (isEditing) {
        setEditingStylist(prev => ({ ...prev, image: compressed }));
      } else {
        setNewStylistForm(prev => ({ ...prev, image: compressed }));
      }
      showToast('Portrait Loaded', 'Stylist photo optimized & updated.', 'success');
    } catch {
      showToast('Photo Error', 'Could not process selected image.', 'error');
    }
  };

  // STRICT CLIENT DATA ISOLATION:
  // Each salon admin only sees appointments, revenue, and clients for THEIR salon
  const scopedBookings = bookings.filter(b => (b.tenantId || 'luxecut') === activeTenantId);

  // Calculated Metrics (strictly for this salon)
  const totalRevenue = scopedBookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const todaysBookings = scopedBookings.filter(b => b.date === selectedDate);
  const pendingCount = scopedBookings.filter(b => b.status === 'pending').length;
  const activeStylistsCount = stylists.filter(s => s.status !== 'on-leave').length;

  const filteredBookings = scopedBookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      showToast('No Data', `No bookings available to export for ${tenant.name}.`, 'info');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Stylist', 'Date', 'Time', `Total Price (${tenant.currency.code})`, 'Status'];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      `"${b.serviceName}"`,
      `"${b.stylistName}"`,
      b.date,
      b.time,
      `"${formatPrice(b.totalPrice)}"`,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tenant.name.replace(/\s+/g, '_')}_Schedule_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported!', `Appointments exported to CSV for ${tenant.name}.`, 'success');
  };

  const handleAddServiceSubmit = (e) => {
    e.preventDefault();
    if (!newSrvForm.name || !newSrvForm.price) return;
    addService(newSrvForm);
    setNewSrvForm({
      name: '', 
      category: 'haircut', 
      price: '', 
      duration: '45', 
      badge: 'Signature', 
      description: '',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    });
    setIsAddSrvOpen(false);
  };

  const handleAddStylistSubmit = (e) => {
    e.preventDefault();
    if (!newStylistForm.name) return;
    addStylist(newStylistForm);
    setNewStylistForm({
      name: '', 
      role: 'Master Stylist', 
      experience: '5+ Years Exp.', 
      bio: '', 
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      shiftStart: '09:00 AM', 
      shiftEnd: '06:00 PM', 
      breakStart: '01:00 PM', 
      breakEnd: '02:00 PM',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });
    setIsAddStylistOpen(false);
  };

  const handleEditStylistSubmit = (e) => {
    e.preventDefault();
    if (!editingStylist) return;
    updateStylist(editingStylist.id, editingStylist);
    setEditingStylist(null);
  };

  const handleEditServiceSubmit = (e) => {
    e.preventDefault();
    if (!editingService || !editingService.name || !editingService.price) return;
    updateService(editingService.id, editingService);
    setEditingService(null);
  };

  const toggleDaySelection = (day, formState, setFormState) => {
    const days = formState.availableDays || [];
    const updated = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    setFormState({ ...formState, availableDays: updated });
  };

  // If a stylist is logged in to their chair station, render StylistStation (HIDING ALL SALON FINANCIAL & OTHER STYLIST DATA)
  if (activeStylist && !isAdminAuthenticated) {
    return <StylistStation />;
  }

  if (!isAdminAuthenticated) {
    const expectedPassword = tenant?.adminPassword || 'LuxeCut@2026';
    const expectedPin = tenant?.adminPin || '1234';

    const handleLockScreenSubmit = (e) => {
      e.preventDefault();
      setPinError('');
      if (loginRoleTab === 'manager') {
        const ok = loginAdmin(pinInput);
        if (!ok) setPinError(`Access Denied: Incorrect password for ${tenant.name}. Each salon requires their own distinct password.`);
      } else {
        const ok = loginStylist(pinInput, selectedStylistPinId || null);
        if (!ok) setPinError(`Invalid Stylist PIN: Unable to unlock chair station.`);
      }
    };

    return (
      <section className="py-16 px-4 max-w-md mx-auto animate-fade-in text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-xl shadow-purple-950/40">
          {loginRoleTab === 'manager' ? <Lock className="w-8 h-8" /> : <Scissors className="w-8 h-8" />}
        </div>
        <div>
          <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[var(--gold-primary)] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 mb-2">
            {tenant.fullName}
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            {loginRoleTab === 'manager' ? 'Manager Access Portal' : 'Stylist Chair Terminal'}
          </h2>
          <p className="text-xs text-gray-400 font-light">
            {loginRoleTab === 'manager'
              ? `Operational metrics, revenue, and master timetables for ${tenant.name} are strictly confidential.`
              : `Private chair station for stylists. Salon financial revenue & other staff schedules are hidden.`}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setLoginRoleTab('manager');
              setPinInput('');
              setPinError('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginRoleTab === 'manager'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Salon Manager</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginRoleTab('stylist');
              setPinInput('');
              setPinError('');
              if (stylists.length > 0 && !selectedStylistPinId) {
                setSelectedStylistPinId(stylists[0].id);
              }
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginRoleTab === 'stylist'
                ? 'bg-[var(--gold-primary)] text-black shadow font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Stylist Chair (PIN)</span>
          </button>
        </div>

        <form onSubmit={handleLockScreenSubmit} className="glass-panel p-6 space-y-4">
          
          {loginRoleTab === 'stylist' && (
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                Select Your Chair / Station
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                {stylists.map(s => {
                  const isSelected = selectedStylistPinId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStylistPinId(s.id);
                        setPinError('');
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--gold-primary)] bg-[rgba(212,175,55,0.15)] text-white'
                          : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <img src={s.image} alt={s.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-white">{s.name}</div>
                        <div className="text-[10px] text-gray-400">PIN: {s.pin || '1001'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {loginRoleTab === 'manager' ? 'Enter Admin Password or PIN' : 'Enter 4-Digit Stylist PIN'}
            </label>
            <div className="relative">
              <input
                type={showInlinePassword ? 'text' : 'password'}
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder={loginRoleTab === 'manager' ? 'Enter password or PIN' : 'Enter 4-digit PIN'}
                className="w-full bg-black/70 border border-purple-500/40 rounded-xl py-3 pl-4 pr-11 text-center text-lg font-mono text-amber-400 focus:outline-none focus:border-purple-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowInlinePassword(!showInlinePassword)}
                className="text-gray-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                title={showInlinePassword ? 'Hide password' : 'Show password'}
              >
                {showInlinePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {pinError && (
            <p className="text-xs text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20 animate-shake">
              {pinError}
            </p>
          )}

          <button 
            type="submit" 
            className={`w-full justify-center text-xs py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
              loginRoleTab === 'manager'
                ? 'btn-primary'
                : 'bg-[var(--gold-primary)] text-black hover:bg-amber-400 font-extrabold'
            }`}
          >
            {loginRoleTab === 'manager' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate as {tenant.name} Manager</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Unlock Stylist Chair Station</span>
              </>
            )}
          </button>

          {loginRoleTab === 'manager' ? (
            <div className="text-[11px] text-gray-400 text-center space-y-0.5 pt-1">
              <div>Default Password: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono">{expectedPassword}</code></div>
              <div className="text-[10px] text-gray-500">or PIN: <code className="bg-white/10 px-1 py-0.5 rounded text-amber-300 font-mono">{expectedPin}</code></div>
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 text-center space-y-0.5 pt-1">
              <div className="text-emerald-400 font-semibold">🔒 Total Salon Data is Hidden from Stylist</div>
              <div className="text-[10px] text-gray-500">
                PINs: {stylists.slice(0, 3).map(s => `${s.name.split(' ')[0]} (${s.pin})`).join(', ')}
              </div>
            </div>
          )}
        </form>

        <button
          onClick={() => setActiveTab('services')}
          className="text-xs text-gray-400 hover:text-white transition-colors underline"
        >
          ← Return to Salon Services
        </button>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 sm:mb-2">
            <ShieldCheck className="w-4 h-4" />
            Salon Operations & Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Manager <span className="gold-gradient-text">Admin Dashboard</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {cloudSyncStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync (Supabase Active)
              </span>
            ) : cloudSyncStatus === 'connecting' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                Connecting Cloud...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Add Supabase credentials to sync across phones and computers in real time">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Local Storage Mode (Supabase not connected)
              </span>
            )}

            <button
              onClick={() => syncWithCloud(false)}
              disabled={isCloudSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors disabled:opacity-50"
              title="Force sync database with Supabase cloud"
            >
              <RefreshCw className={`w-3 h-3 ${isCloudSyncing ? 'animate-spin text-amber-400' : ''}`} />
              {isCloudSyncing ? 'Syncing...' : 'Sync Database'}
            </button>
          </div>
        </div>

        {/* Tab Buttons & Date Selector */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          
          {/* Scrollable tab bar on mobile */}
          <div className="flex overflow-x-auto no-scrollbar gap-1 w-full sm:w-auto bg-[rgba(255,255,255,0.03)] p-1 rounded-xl border border-[var(--border-glass)] whitespace-nowrap">
            <button
              onClick={() => setAdminTab('appointments')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                adminTab === 'appointments'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Master Schedule
            </button>
            <button
              onClick={() => setAdminTab('timetable')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                adminTab === 'timetable'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Chairs & Queue ({stylists.length})</span>
            </button>
            <button
              onClick={() => setAdminTab('services')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                adminTab === 'services'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Services ({services.length})</span>
            </button>
            <button
              onClick={() => setAdminTab('stylists')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                adminTab === 'stylists'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team ({stylists.length})
            </button>
            <button
              onClick={() => setAdminTab('branding')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                adminTab === 'branding'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Branding</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {adminTab === 'appointments' && (
              <button
                onClick={exportToCSV}
                className="btn-secondary py-2 px-3 text-xs"
              >
                <Download className="w-4 h-4 text-[var(--gold-primary)]" />
                <span>Export CSV</span>
              </button>
            )}

            {adminTab === 'services' && (
              <button
                onClick={() => setIsAddSrvOpen(true)}
                className="btn-primary py-2 px-4 text-xs font-bold"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Service</span>
              </button>
            )}

            {adminTab === 'stylists' && (
              <button
                onClick={() => setIsAddStylistOpen(true)}
                className="btn-primary py-2 px-4 text-xs font-bold"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Stylist</span>
              </button>
            )}

            {(adminTab === 'appointments' || adminTab === 'timetable') && (
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-black/60 border border-[var(--border-gold)] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none flex-1 sm:flex-initial"
              />
            )}

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:bg-red-500/20 hover:border-red-500/40 text-purple-300 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock & Logout Manager Session"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLIENT DATA ISOLATION & CONFIDENTIALITY BANNER */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border-gold)] bg-gradient-to-r from-purple-950/40 via-black/50 to-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Salon Client Data Guard
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-semibold bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                🔒 Strictly Isolated to {tenant.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Confidentiality Protocol Active: Only customer appointments, staff timetables, and revenue for <strong className="text-white">{tenant.fullName}</strong> are accessible.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              const url = getDirectSalonLink();
              if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(url);
              }
              setCopiedUrl(true);
              showToast('Link Copied', `Direct customer booking URL copied: ${url}`, 'success');
              setTimeout(() => setCopiedUrl(false), 2500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition-colors cursor-pointer"
            title="Copy this salon's direct booking link"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied Link!' : 'Copy Direct Salon Link'}</span>
          </button>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID: <strong className="text-white">{tenant.id}</strong></span>
            <span className="text-gray-600">•</span>
            <span>PIN Protected</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 border-l-4 border-l-[var(--gold-primary)] space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Estimated Revenue ({tenant.currency.code})
            </span>
            <span className="text-xs font-bold text-[var(--gold-primary)] font-mono">
              {tenant.currency.code}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatPrice(totalRevenue)}
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <span>+18% vs last week</span>
            <span className="text-[11px] text-gray-400 font-normal">
              • {tenant.name} verified appointments
            </span>
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bookings ({selectedDate})</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{todaysBookings.length}</div>
          <p className="text-xs text-gray-400 font-light">
            Scheduled for {tenant.name}
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-purple-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
            <AlertCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingCount}</div>
          <p className="text-xs text-purple-300 font-semibold">
            Requires receptionist approval
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active On Duty</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{activeStylistsCount} / {stylists.length}</div>
          <p className="text-xs text-emerald-400 font-semibold">
            {tenant.name} roster staff
          </p>
        </div>

      </div>

      {/* VIEW TAB 1: MASTER SCHEDULE & APPOINTMENTS TABLE */}
      {adminTab === 'appointments' && (
        <div className="glass-panel p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>
                  {tenant.fullName} Schedule — {selectedDate}
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Showing {filteredBookings.length} appointment(s) exclusively for {tenant.name}.
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsAddSrvOpen(true)}
                className="btn-outline-gold text-xs py-2 px-3 whitespace-nowrap"
              >
                + Add Service
              </button>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest or booking ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)] w-full"
                />
              </div>
            </div>
          </div>

          {/* MOBILE CARD VIEW: Under md screens (360px - 767px) */}
          <div className="block md:hidden space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No appointments found for {tenant.name} matching this date or search.
              </div>
            ) : (
              filteredBookings.map(b => (
                <div key={b.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 shadow-md">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          #{b.id}
                        </span>
                        {b.bookingType === 'walk-in' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🚶 Walk-in
                          </span>
                        )}
                        {b.bookingType === 'queue-hold' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            ⏳ Queue
                          </span>
                        )}
                        {b.bookingType === 'stylist-booking' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            ✂️ Stylist Station
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-white text-sm mt-0.5">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400">{b.phone}</div>
                    </div>

                    <select
                      value={b.status}
                      onChange={e => updateBookingStatus(b.id, e.target.value)}
                      className={`bg-black/80 border rounded-lg px-2 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                        b.status === 'confirmed'
                          ? 'text-emerald-400 border-emerald-500/40'
                          : b.status === 'pending'
                          ? 'text-amber-400 border-amber-500/40'
                          : b.status === 'completed'
                          ? 'text-purple-400 border-purple-500/40'
                          : 'text-red-400 border-red-500/40'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Treatment</span>
                      <span className="font-semibold text-white">{b.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Specialist</span>
                      <span className="font-medium text-amber-300">{b.stylistName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Date & Time</span>
                      <span className="text-white font-mono">{b.time} ({b.date})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Amount</span>
                      <span className="font-extrabold text-[var(--gold-primary)]">{formatPrice(b.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        const next = b.status === 'confirmed' ? 'completed' : 'confirmed';
                        updateBookingStatus(b.id, next);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors text-center"
                    >
                      Advance Status
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Permanently delete appointment #${b.id} for ${b.customerName}?`)) {
                          deleteBooking(b.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                      title="Delete appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP TABLE VIEW: md+ screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider bg-black/40">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Info</th>
                  <th className="py-3 px-4">Treatment</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No appointments found for {tenant.name} matching this date or search.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        <div>#{b.id}</div>
                        {b.bookingType === 'walk-in' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mt-0.5">
                            🚶 Walk-in
                          </span>
                        )}
                        {b.bookingType === 'queue-hold' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block mt-0.5">
                            ⏳ Queue
                          </span>
                        )}
                        {b.bookingType === 'stylist-booking' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block mt-0.5">
                            ✂️ Stylist Station
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-gray-400">{b.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{b.serviceName}</div>
                        {b.addOns && b.addOns.length > 0 && (
                          <div className="text-[10px] text-gray-400">{b.addOns.join(', ')}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-medium text-amber-300">
                        {b.stylistName}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{b.time}</div>
                        <div className="text-[10px] text-gray-400">{b.date}</div>
                      </td>

                      <td className="py-3 px-4 font-extrabold text-[var(--gold-primary)]">
                        {formatPrice(b.totalPrice)}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={b.status}
                          onChange={e => updateBookingStatus(b.id, e.target.value)}
                          className={`bg-black/60 border rounded-lg px-2.5 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                            b.status === 'confirmed'
                              ? 'text-emerald-400 border-emerald-500/40'
                              : b.status === 'pending'
                              ? 'text-amber-400 border-amber-500/40'
                              : b.status === 'completed'
                              ? 'text-purple-400 border-purple-500/40'
                              : 'text-red-400 border-red-500/40'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const next = b.status === 'confirmed' ? 'completed' : 'confirmed';
                              updateBookingStatus(b.id, next);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] border border-amber-500/30 transition-colors"
                          >
                            Advance Status
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete appointment #${b.id} for ${b.customerName}?`)) {
                                deleteBooking(b.id);
                              }
                            }}
                            className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                            title="Delete appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB: MASTER CHAIRS & PHYSICAL QUEUE BOARD */}
      {adminTab === 'timetable' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>Station Monitoring & Physical Queue Board — {selectedDate}</span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Real-time chair matrix across all {stylists.length} stations in {tenant.name}. Seat walk-in guests directly or hold slots for waiting queue.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                Today's Bookings: <strong className="text-white">{todaysBookings.length}</strong>
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-amber-400">
                Walk-ins: <strong className="text-amber-300">{todaysBookings.filter(b => b.bookingType === 'walk-in').length}</strong>
              </span>
            </div>
          </div>

          {/* Chair Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stylists.map(stylist => {
              const stylistBookings = scopedBookings.filter(b => 
                b.stylistId === stylist.id && 
                b.date === selectedDate && 
                b.status !== 'cancelled'
              );

              const statusBadgeConfig = {
                'available': { label: 'Available', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
                'in-chair': { label: 'In-Chair', color: 'bg-red-500/20 text-red-300 border-red-500/30', dot: 'bg-red-500' },
                'walk-in': { label: 'Walk-in', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
                'on-break': { label: 'Break', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' }
              };
              const badge = statusBadgeConfig[stylist.liveStatus] || statusBadgeConfig['available'];

              return (
                <div key={stylist.id} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                  
                  {/* Stylist Chair Card Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <img 
                      src={stylist.image} 
                      alt={stylist.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-[var(--gold-primary)]/40 shrink-0"
                    />
                    <div className="truncate flex-1">
                      <div className="font-bold text-sm text-white truncate">{stylist.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{stylist.role}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 ml-auto">PIN: {stylist.pin || '1001'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timetable Slots for this chair */}
                  <div className="space-y-2 flex-1">
                    {(getStylistSlotsForDate ? getStylistSlotsForDate(stylist.id, selectedDate) : TIME_SLOTS).map(time => {
                      const booking = stylistBookings.find(b => b.time === time);
                      const isOccupied = !!booking;
                      const isWalkIn = booking?.bookingType === 'walk-in';
                      const isQueueHold = booking?.bookingType === 'queue-hold';
                      const isCompleted = booking?.status === 'completed';

                      return (
                        <div 
                          key={time}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            !isOccupied 
                              ? 'bg-black/30 border-white/5 hover:border-emerald-500/30'
                              : isCompleted
                              ? 'bg-white/5 border-white/10 opacity-60'
                              : isWalkIn
                              ? 'bg-amber-950/20 border-amber-500/30'
                              : isQueueHold
                              ? 'bg-purple-950/20 border-purple-500/30'
                              : 'bg-emerald-950/20 border-emerald-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-gray-300 text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[var(--gold-primary)]" />
                              {time}
                            </span>

                            {!isOccupied ? (
                              <span className="text-[9px] uppercase font-bold text-emerald-400">
                                Open Slot
                              </span>
                            ) : isCompleted ? (
                              <span className="text-[9px] uppercase font-bold text-gray-400">
                                Completed
                              </span>
                            ) : isWalkIn ? (
                              <span className="text-[9px] uppercase font-bold text-amber-300">
                                🚶 Walk-in
                              </span>
                            ) : isQueueHold ? (
                              <span className="text-[9px] uppercase font-bold text-purple-300">
                                ⏳ Queue
                              </span>
                            ) : (
                              <span className="text-[9px] uppercase font-bold text-emerald-300">
                                📅 Booked
                              </span>
                            )}
                          </div>

                          {!isOccupied ? (
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setManagerWalkInTarget({ stylistId: stylist.id, stylistName: stylist.name, time })}
                                className="py-1 px-1.5 rounded-lg bg-[var(--gold-primary)] hover:bg-amber-400 text-black font-extrabold text-[10px] text-center"
                              >
                                + Walk-in
                              </button>
                              <button
                                type="button"
                                onClick={() => holdSlotForQueue({
                                  stylistId: stylist.id,
                                  time,
                                  date: selectedDate,
                                  queueLabel: `Queue Waiting (${stylist.name.split(' ')[0]})`
                                })}
                                className="py-1 px-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-[10px] text-center"
                              >
                                Hold Queue
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="font-bold text-white truncate text-[11px]">
                                {booking.customerName}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate">
                                {booking.serviceName}
                              </div>
                              {!isCompleted && (
                                <button
                                  type="button"
                                  onClick={() => completeChairBooking(booking.id, stylist.id)}
                                  className="w-full mt-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all text-center"
                                >
                                  ✓ Complete & Free Chair
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

          {/* MANAGER WALK-IN SEATING MODAL */}
          {managerWalkInTarget && (
            <div className="modal-overlay animate-fade-in z-[110]">
              <div className="modal-content max-w-md w-full p-6 bg-[#141624] border border-[var(--gold-primary)]/40 rounded-2xl relative space-y-4 shadow-2xl">
                <button
                  onClick={() => setManagerWalkInTarget(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-white">Seat Walk-in Guest</h4>
                    <p className="text-xs text-gray-400">
                      Chair: <strong className="text-white">{managerWalkInTarget.stylistName}</strong> at <strong className="text-amber-400 font-mono">{managerWalkInTarget.time}</strong>
                    </p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  seatWalkIn({
                    stylistId: managerWalkInTarget.stylistId,
                    customerName: managerWalkInForm.customerName || 'Walk-in Guest',
                    serviceId: managerWalkInForm.serviceId || services[0]?.id,
                    time: managerWalkInTarget.time,
                    date: selectedDate,
                    notes: managerWalkInForm.notes || 'Walk-in seated by manager'
                  });
                  setManagerWalkInTarget(null);
                  setManagerWalkInForm({ customerName: '', serviceId: '', notes: '' });
                }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Guest Name / Queue Tag
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John or Queue Guest #1"
                      value={managerWalkInForm.customerName}
                      onChange={e => setManagerWalkInForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Service / Treatment
                    </label>
                    <select
                      value={managerWalkInForm.serviceId || services[0]?.id}
                      onChange={e => setManagerWalkInForm(prev => ({ ...prev, serviceId: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                          {s.name} (~{s.duration} mins - {formatPrice(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. In queue since 10am"
                      value={managerWalkInForm.notes}
                      onChange={e => setManagerWalkInForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setManagerWalkInTarget(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[var(--gold-primary)] hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg"
                    >
                      Confirm & Seat in Chair
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW TAB: SERVICES & CATALOG MANAGER */}
      {adminTab === 'services' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>Services & Treatments Catalog ({services.length})</span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Manage hair, skin, barber, and spa treatments with custom prices, duration, and photos for {tenant.fullName}.
              </p>
            </div>

            <button
              onClick={() => setIsAddSrvOpen(true)}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Sync Status Info Banner */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            cloudSyncStatus === 'connected'
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-2.5">
              {cloudSyncStatus === 'connected' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>
                {cloudSyncStatus === 'connected' ? (
                  <><strong>Live Cloud Sync Active:</strong> Adding or editing a service here updates your phone, reception tablet, and clients in real-time.</>
                ) : (
                  <><strong>Local Browser Storage:</strong> Services added here are currently saved on this device only. Connect Supabase to sync across your phone and all browsers.</>
                )}
              </span>
            </div>
            {cloudSyncStatus !== 'connected' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                Local Only
              </span>
            )}
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400 space-y-3 max-w-md mx-auto">
              <Scissors className="w-10 h-10 text-[var(--gold-primary)] mx-auto opacity-60" />
              <h4 className="text-white font-bold font-serif text-lg">No Services in Catalog</h4>
              <p className="text-xs">Add your first haircut, styling, or spa service with a photo.</p>
              <button
                onClick={() => setIsAddSrvOpen(true)}
                className="btn-primary text-xs py-2 px-5 mx-auto"
              >
                + Add Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(srv => (
                <div
                  key={srv.id}
                  className="glass-panel overflow-hidden flex flex-col justify-between hover:border-[var(--gold-primary)] transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-black/60">
                    <img
                      src={srv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="badge-gold text-[10px]">{srv.badge || srv.category}</span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-gray-300 hover:text-white transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
                      <span className="text-[var(--gold-primary)] text-sm font-mono">{formatPrice(srv.price)}</span>
                      <span className="text-gray-300 flex items-center gap-1 font-normal text-[11px] bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {srv.duration} mins
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-white">{srv.name}</h4>
                      <p className="text-xs text-gray-400 font-light line-clamp-2 mt-1">
                        {srv.description || 'Professional styling service crafted to perfection.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Category: <strong className="text-gray-200 capitalize">{srv.category}</strong></span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active in Menu
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setEditingService(srv)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Service</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete service "${srv.name}" from catalog?`)) {
                              deleteService(srv.id);
                            }
                          }}
                          className="py-1.5 px-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 2: STYLIST TEAM & TIMETABLES MANAGER */}
      {adminTab === 'stylists' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>Stylist Team Roster & Shift Timetables</span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Manage working hours, lunch breaks, off-duty days, and team profiles.
              </p>
            </div>

            <button
              onClick={() => setIsAddStylistOpen(true)}
              className="btn-primary text-xs py-2.5 px-4"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Stylist</span>
            </button>
          </div>

          {/* Stylists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stylists.map(s => (
              <div
                key={s.id}
                className="glass-panel p-6 space-y-4 hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between relative"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={s.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={s.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--gold-primary)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-bold text-white truncate">{s.name}</h4>
                      
                      {/* Duty Toggle Button */}
                      <button
                        onClick={() => toggleStylistDuty(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                          s.status !== 'on-leave'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                        }`}
                      >
                        {s.status !== 'on-leave' ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>On Duty</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>On Leave</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-xs text-[var(--gold-primary)] font-semibold block mt-0.5">
                      {s.role}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{s.experience}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-light line-clamp-2">
                  {s.bio}
                </p>

                {/* Shift Details Box */}
                <div className="bg-black/40 p-4 rounded-xl space-y-2 text-xs border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Shift Hours:
                    </span>
                    <span className="font-bold text-white">{s.shiftStart} - {s.shiftEnd}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" /> Break Time:
                    </span>
                    <span className="font-semibold text-amber-300">{s.breakStart} - {s.breakEnd}</span>
                  </div>

                  <div className="flex justify-between items-start pt-1 border-t border-white/5">
                    <span className="text-gray-400">Working Days:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                      {(s.availableDays || []).map(day => (
                        <span key={day} className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove stylist "${s.name}" from ${tenant.name}'s team roster?`)) {
                        deleteStylist(s.id);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors flex items-center gap-1.5"
                    title="Remove Stylist from Roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <button
                    onClick={() => setEditingStylist(s)}
                    className="btn-outline-gold text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Schedule</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TAB 3: CLIENT CUSTOMIZATION & BRANDING CONTROL */}
      {adminTab === 'branding' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Dedicated Salon Profile & Credentials Banner */}
          <div className="glass-panel p-6 border-l-4 border-l-[var(--gold-primary)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dedicated Salon Environment</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {tenant.fullName} — Brand & Security Settings
                </h3>
                <p className="text-xs text-gray-400 font-light mt-1">
                  Configure your customer-facing theme, WhatsApp notification alerts, and manager access PIN code.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] bg-emerald-500/10 text-emerald-300 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
                  🔒 Isolated Account
                </span>
                <span className="text-[11px] bg-white/10 text-white font-mono font-bold px-3 py-1.5 rounded-full border border-white/20">
                  ID: {tenant.id}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Customization Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateTenantConfig({
                name: brandingForm.name,
                subName: brandingForm.subName,
                fullName: brandingForm.fullName,
                tagline: brandingForm.tagline,
                hero: {
                  badge: brandingForm.heroBadge,
                  titlePrefix: brandingForm.heroTitlePrefix,
                  titleHighlight: brandingForm.heroTitleHighlight,
                  subtitle: brandingForm.heroSubtitle,
                  image: brandingForm.heroImage
                },
                theme: {
                  primaryColor: brandingForm.primaryColor,
                  bgDark: brandingForm.bgDark
                },
                contact: {
                  phone: brandingForm.phone,
                  whatsapp: brandingForm.whatsapp,
                  address: brandingForm.address,
                  hours: brandingForm.hours
                },
                features: {
                  hasPortfolio: brandingForm.hasPortfolio,
                  hasReviews: brandingForm.hasReviews,
                  allowOnlineDeposit: brandingForm.allowOnlineDeposit,
                  whatsappAlert: brandingForm.whatsappAlert
                },
                adminPin: brandingForm.adminPin || '1234',
                adminPassword: brandingForm.adminPassword || 'LuxeCut@2026'
              });
            }}
            className="space-y-6"
          >
            {/* Section 1: Salon Identity & Hero */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="w-4 h-4" />
                <span>1. Brand Identity & Hero Banner</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Navbar Main Name</label>
                  <input
                    type="text"
                    value={brandingForm.name}
                    onChange={e => setBrandingForm({ ...brandingForm, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Header Subtitle Tag</label>
                  <input
                    type="text"
                    value={brandingForm.subName}
                    onChange={e => setBrandingForm({ ...brandingForm, subName: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Full Legal/Display Name</label>
                  <input
                    type="text"
                    value={brandingForm.fullName}
                    onChange={e => setBrandingForm({ ...brandingForm, fullName: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Salon Tagline & About Summary</label>
                <textarea
                  rows={2}
                  value={brandingForm.tagline}
                  onChange={e => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Badge</label>
                  <input
                    type="text"
                    value={brandingForm.heroBadge}
                    onChange={e => setBrandingForm({ ...brandingForm, heroBadge: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Hero Background Image URL</label>
                  <input
                    type="url"
                    value={brandingForm.heroImage}
                    onChange={e => setBrandingForm({ ...brandingForm, heroImage: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Colors & Theme */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-2 border-b border-white/10 pb-3">
                <Palette className="w-4 h-4" />
                <span>2. Visual Theme & Color Palette</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Primary Brand Color (Buttons, Accents, Highlights)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandingForm.primaryColor}
                      onChange={e => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-white/20 p-1"
                    />
                    <input
                      type="text"
                      value={brandingForm.primaryColor}
                      onChange={e => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white w-32 focus:outline-none"
                    />
                    <div 
                      className="px-4 py-2 rounded-xl text-xs font-bold text-black shadow-lg"
                      style={{ backgroundColor: brandingForm.primaryColor }}
                    >
                      Sample Button
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Dark Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandingForm.bgDark}
                      onChange={e => setBrandingForm({ ...brandingForm, bgDark: e.target.value })}
                      className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-white/20 p-1"
                    />
                    <input
                      type="text"
                      value={brandingForm.bgDark}
                      onChange={e => setBrandingForm({ ...brandingForm, bgDark: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white w-32 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Instant WhatsApp Booking Ping */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-2 border-b border-white/10 pb-3">
                <Phone className="w-4 h-4" />
                <span>3. Contact & WhatsApp Notification Number</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Public Phone Number</label>
                  <input
                    type="text"
                    value={brandingForm.phone}
                    onChange={e => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                    <span>WhatsApp Number (For Direct Booking Pings)</span>
                    <span className="text-emerald-400 text-[10px]">With Country Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 94771234567"
                    value={brandingForm.whatsapp}
                    onChange={e => setBrandingForm({ ...brandingForm, whatsapp: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={brandingForm.address}
                    onChange={e => setBrandingForm({ ...brandingForm, address: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={brandingForm.hours}
                    onChange={e => setBrandingForm({ ...brandingForm, hours: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Feature Flags (Modular Toggles) */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-2 border-b border-white/10 pb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>4. Modular Feature Flags (Enable/Disable per Client)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={brandingForm.hasPortfolio}
                    onChange={e => setBrandingForm({ ...brandingForm, hasPortfolio: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-[var(--gold-primary)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Enable Lookbook Portfolio Tab</div>
                    <div className="text-[11px] text-gray-400">Show gallery photos of hairstyles/treatments.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={brandingForm.hasReviews}
                    onChange={e => setBrandingForm({ ...brandingForm, hasReviews: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-[var(--gold-primary)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Enable Customer Reviews Tab</div>
                    <div className="text-[11px] text-gray-400">Allow customers to view and post verified feedback.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={brandingForm.allowOnlineDeposit}
                    onChange={e => setBrandingForm({ ...brandingForm, allowOnlineDeposit: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-[var(--gold-primary)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Allow Online Deposit Holds</div>
                    <div className="text-[11px] text-gray-400">Uncheck if salon only accepts cash at venue.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={brandingForm.whatsappAlert}
                    onChange={e => setBrandingForm({ ...brandingForm, whatsappAlert: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-[var(--gold-primary)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Instant WhatsApp Booking Alerts</div>
                    <div className="text-[11px] text-gray-400">Prepares a 1-tap WhatsApp message directly to salon.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 5: Salon Admin Password & PIN Settings */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-2 border-b border-white/10 pb-3">
                <Key className="w-4 h-4" />
                <span>5. Salon Admin Password & Access PIN</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Custom Admin Password ({tenant.name})
                  </label>
                  <div className="relative">
                    <input
                      type={showSettingPassword ? 'text' : 'password'}
                      value={brandingForm.adminPassword || ''}
                      onChange={e => setBrandingForm({ ...brandingForm, adminPassword: e.target.value })}
                      placeholder="e.g. SalonSecret@2026"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-3 pr-10 text-xs font-mono text-white focus:outline-none focus:border-[var(--gold-primary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSettingPassword(!showSettingPassword)}
                      className="text-gray-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      title={showSettingPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSettingPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Each salon client has a distinct password. Changing this secures your portal from other salons.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Backup 4-Digit Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={brandingForm.adminPin || ''}
                      onChange={e => setBrandingForm({ ...brandingForm, adminPin: e.target.value })}
                      placeholder="e.g. 1234"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-[var(--gold-primary)]"
                    />
                    <Lock className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Quick numeric PIN for touch tablet reception counters.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit & Export Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tenant, null, 2));
                  const dlAnchorElem = document.createElement('a');
                  dlAnchorElem.setAttribute('href', dataStr);
                  dlAnchorElem.setAttribute('download', `tenant-${activeTenantId}-config.json`);
                  dlAnchorElem.click();
                  showToast('Exported', `Downloaded client config for ${tenant.name}`, 'success');
                }}
                className="btn-secondary text-xs py-3 px-5 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Client JSON Config</span>
              </button>

              <button
                type="submit"
                className="btn-primary text-xs py-3 px-8 w-full sm:w-auto justify-center shadow-lg"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save & Apply Customizations</span>
              </button>
            </div>
          </form>

          {/* Section 5: Multi-Tenant Client Data Isolation Architecture */}
          <div className="glass-panel p-6 border-l-4 border-l-purple-500 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  How Client Data Isolation Works (Admin & Database Architecture)
                </h4>
                <p className="text-xs text-gray-400">
                  How your salon platform keeps appointments, revenue, and customer records separated client-by-client.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>1. Logical Isolation (Active Now)</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Every booking and record carries a <code className="text-amber-300">tenantId</code> tag. The Admin Dashboard scopes metrics and appointments strictly to the active client. Salon A managers cannot see Salon B appointments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>2. Subdomain / White-Label Deploy</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Deploy per client (e.g. <code className="text-blue-300">barber.yourdomain.com</code> or separate Vercel project) with <code className="text-blue-300">VITE_TENANT_ID</code>. Browser storage is 100% physically isolated per origin.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3. Cloud DB with Row-Level Security</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  When connecting Supabase or Firebase, apply Row-Level Security (RLS) rules: <code className="text-emerald-300">WHERE tenant_id = auth.jwt.tenant_id</code>. The database itself rejects cross-client queries.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ADD STYLIST MODAL */}
      {isAddStylistOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setIsAddStylistOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Add New Team Member & Shift Schedule
            </h3>

            <form onSubmit={handleAddStylistSubmit} className="space-y-4 text-xs">
              
              {/* Stylist Portrait Photo Upload */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                <label className="block text-gray-300 font-bold">Stylist Portrait Photo</label>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-[var(--gold-primary)] overflow-hidden shrink-0 shadow-[0_0_12px_var(--gold-glow)] bg-black/60">
                    <img
                      src={newStylistForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Stylist Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStylistPhotoUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      
                      <input
                        type="url"
                        placeholder="Or paste photo URL..."
                        value={newStylistForm.image}
                        onChange={e => setNewStylistForm({ ...newStylistForm, image: e.target.value })}
                        className="flex-1 min-w-[140px] bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-gray-400">Presets:</span>
                      {[
                        { label: 'Stylist A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Barber B', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Stylist C', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Barber D', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
                      ].map(p => (
                        <button
                          type="button"
                          key={p.label}
                          onClick={() => setNewStylistForm({ ...newStylistForm, image: p.url })}
                          className={`text-[9px] px-2 py-0.5 rounded-md border ${
                            newStylistForm.image === p.url
                              ? 'bg-[var(--gold-primary)] text-black font-bold'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanath Jayasinghe"
                  value={newStylistForm.name}
                  onChange={e => setNewStylistForm({ ...newStylistForm, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Colorist"
                    value={newStylistForm.role}
                    onChange={e => setNewStylistForm({ ...newStylistForm, role: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Years Exp."
                    value={newStylistForm.experience}
                    onChange={e => setNewStylistForm({ ...newStylistForm, experience: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={newStylistForm.shiftStart}
                    onChange={e => setNewStylistForm({ ...newStylistForm, shiftStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift End Time</label>
                  <input
                    type="text"
                    placeholder="06:00 PM"
                    value={newStylistForm.shiftEnd}
                    onChange={e => setNewStylistForm({ ...newStylistForm, shiftEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Lunch Break Start</label>
                  <input
                    type="text"
                    placeholder="01:00 PM"
                    value={newStylistForm.breakStart}
                    onChange={e => setNewStylistForm({ ...newStylistForm, breakStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Lunch Break End</label>
                  <input
                    type="text"
                    placeholder="02:00 PM"
                    value={newStylistForm.breakEnd}
                    onChange={e => setNewStylistForm({ ...newStylistForm, breakEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Working Days</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = (newStylistForm.availableDays || []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(day, newStylistForm, setNewStylistForm)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-[var(--gold-primary)] text-black'
                            : 'bg-black/50 border border-white/10 text-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Styling expertise & background philosophy..."
                  value={newStylistForm.bio}
                  onChange={e => setNewStylistForm({ ...newStylistForm, bio: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStylistOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STYLIST MODAL */}
      {editingStylist && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setEditingStylist(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Edit {editingStylist.name}'s Profile & Shift Schedule
            </h3>

            <form onSubmit={handleEditStylistSubmit} className="space-y-4 text-xs">
              
              {/* Stylist Portrait Photo Upload */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                <label className="block text-gray-300 font-bold">Stylist Portrait Photo</label>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-[var(--gold-primary)] overflow-hidden shrink-0 shadow-[0_0_12px_var(--gold-glow)] bg-black/60">
                    <img
                      src={editingStylist.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Stylist Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStylistPhotoUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                      
                      <input
                        type="url"
                        placeholder="Or paste photo URL..."
                        value={editingStylist.image || ''}
                        onChange={e => setEditingStylist({ ...editingStylist, image: e.target.value })}
                        className="flex-1 min-w-[140px] bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-gray-400">Presets:</span>
                      {[
                        { label: 'Stylist A', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Barber B', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Stylist C', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
                        { label: 'Barber D', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
                      ].map(p => (
                        <button
                          type="button"
                          key={p.label}
                          onClick={() => setEditingStylist({ ...editingStylist, image: p.url })}
                          className={`text-[9px] px-2 py-0.5 rounded-md border ${
                            editingStylist.image === p.url
                              ? 'bg-[var(--gold-primary)] text-black font-bold'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStylist.name}
                  onChange={e => setEditingStylist({ ...editingStylist, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Role</label>
                  <input
                    type="text"
                    value={editingStylist.role}
                    onChange={e => setEditingStylist({ ...editingStylist, role: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duty Status</label>
                  <select
                    value={editingStylist.status || 'active'}
                    onChange={e => setEditingStylist({ ...editingStylist, status: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="active">Active / On Duty</option>
                    <option value="on-leave">On Leave / Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift Start</label>
                  <input
                    type="text"
                    value={editingStylist.shiftStart || '09:00 AM'}
                    onChange={e => setEditingStylist({ ...editingStylist, shiftStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift End</label>
                  <input
                    type="text"
                    value={editingStylist.shiftEnd || '06:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, shiftEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Break Start</label>
                  <input
                    type="text"
                    value={editingStylist.breakStart || '01:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, breakStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Break End</label>
                  <input
                    type="text"
                    value={editingStylist.breakEnd || '02:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, breakEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Working Days</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = (editingStylist.availableDays || []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(day, editingStylist, setEditingStylist)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-[var(--gold-primary)] text-black'
                            : 'bg-black/50 border border-white/10 text-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editingStylist.bio}
                  onChange={e => setEditingStylist({ ...editingStylist, bio: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStylist(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {isAddSrvOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setIsAddSrvOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Add New Service to Catalog
            </h3>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Keratin Gloss Treatment"
                  value={newSrvForm.name}
                  onChange={e => setNewSrvForm({ ...newSrvForm, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category</label>
                  <select
                    value={newSrvForm.category}
                    onChange={e => setNewSrvForm({ ...newSrvForm, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="haircut">Haircuts & Styling</option>
                    <option value="coloring">Color & Highlights</option>
                    <option value="grooming">Barber Grooming</option>
                    <option value="skincare">Facials & Skincare</option>
                    <option value="spa">Scalp & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Price (LKR Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={newSrvForm.price}
                    onChange={e => setNewSrvForm({ ...newSrvForm, price: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newSrvForm.duration}
                    onChange={e => setNewSrvForm({ ...newSrvForm, duration: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newSrvForm.badge}
                    onChange={e => setNewSrvForm({ ...newSrvForm, badge: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Photo Upload & Real-Time Card Preview */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-300 font-bold">Service Photo / Card Banner *</label>
                  <span className="text-[10px] text-[var(--gold-primary)] font-semibold">Live Preview</span>
                </div>

                {/* Banner Preview */}
                <div className="relative h-32 rounded-xl overflow-hidden border border-white/20 bg-black/60 group">
                  <img
                    src={newSrvForm.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                    alt="Service Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                    <div>
                      <span className="badge-gold text-[10px]">{newSrvForm.badge || 'Signature'}</span>
                      <div className="text-white font-bold text-xs mt-0.5">{newSrvForm.name || 'Treatment Title'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--gold-primary)] font-bold text-xs font-mono">{formatPrice(newSrvForm.price || 0)}</div>
                      <div className="text-[10px] text-gray-300">{newSrvForm.duration || 45} mins</div>
                    </div>
                  </div>
                </div>

                {/* Upload Button & URL Options */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleServicePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Or paste photo URL..."
                    value={newSrvForm.image}
                    onChange={e => setNewSrvForm({ ...newSrvForm, image: e.target.value })}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Haircut', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Color & Balayage', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Barber Beard', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Facial Glow', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Scalp Spa', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' },
                    ].map(p => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setNewSrvForm({ ...newSrvForm, image: p.url })}
                        className={`text-[9px] px-2 py-0.5 rounded-md border ${
                          newSrvForm.image === p.url
                            ? 'bg-[var(--gold-primary)] text-black font-bold'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed treatment description..."
                  value={newSrvForm.description}
                  onChange={e => setNewSrvForm({ ...newSrvForm, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSrvOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Save Service
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Edit Service & Photo Banner
            </h3>

            <form onSubmit={handleEditServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category</label>
                  <select
                    value={editingService.category || 'haircut'}
                    onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="haircut">Haircuts & Styling</option>
                    <option value="coloring">Color & Highlights</option>
                    <option value="grooming">Barber Grooming</option>
                    <option value="skincare">Facials & Skincare</option>
                    <option value="spa">Scalp & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Price ({tenant.currency.code}) *</label>
                  <input
                    type="number"
                    required
                    value={editingService.price || ''}
                    onChange={e => setEditingService({ ...editingService, price: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={editingService.duration || 45}
                    onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingService.badge || ''}
                    onChange={e => setEditingService({ ...editingService, badge: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Photo Upload & Real-Time Card Preview */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-300 font-bold">Service Photo / Card Banner *</label>
                  <span className="text-[10px] text-[var(--gold-primary)] font-semibold">Live Preview</span>
                </div>

                {/* Banner Preview */}
                <div className="relative h-32 rounded-xl overflow-hidden border border-white/20 bg-black/60 group">
                  <img
                    src={editingService.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                    alt="Service Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                    <div>
                      <span className="badge-gold text-[10px]">{editingService.badge || 'Signature'}</span>
                      <div className="text-white font-bold text-xs mt-0.5">{editingService.name || 'Treatment Title'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--gold-primary)] font-bold text-xs font-mono">{formatPrice(editingService.price || 0)}</div>
                      <div className="text-[10px] text-gray-300">{editingService.duration || 45} mins</div>
                    </div>
                  </div>
                </div>

                {/* Upload Button & URL Options */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditServicePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Or paste photo URL..."
                    value={editingService.image || ''}
                    onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Haircut', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Color & Balayage', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Barber Beard', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Facial Glow', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Scalp Spa', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' },
                    ].map(p => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setEditingService({ ...editingService, image: p.url })}
                        className={`text-[9px] px-2 py-0.5 rounded-md border ${
                          editingService.image === p.url
                            ? 'bg-[var(--gold-primary)] text-black font-bold'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

