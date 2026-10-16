import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { isSingleClientLocked } from '../config/tenants';
import { Scissors, Calendar, ShieldCheck, Sparkles, Star, UserCheck, Menu, X, Camera, MessageSquare, Palette, ChevronDown, Copy, Check } from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openBookingWizard, 
    myGuestBookings, 
    isAdminAuthenticated, 
    logoutAdmin,
    tenant,
    activeTenantId,
    switchTenant,
    availableTenants,
    getDirectSalonLink,
    activeStylist,
    openManagerLogin,
    openStylistLogin
  } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Strictly isolated to current salon's guest appointments
  const activeAppointmentsCount = myGuestBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  const handleCopyLink = (e, tenantId) => {
    e.stopPropagation();
    const link = getDirectSalonLink(tenantId);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    }
    setCopiedId(tenantId);
    showToast('Direct Link Copied', `URL copied: ${link}`, 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-opacity-90 bg-[#0b0c10] border-b border-[var(--border-glass)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('services')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[var(--gold-primary)] to-amber-500 flex items-center justify-center shadow-[0_0_15px_var(--gold-glow)] group-hover:scale-105 transition-transform shrink-0">
            <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-black transform -rotate-45" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[var(--gold-primary)] transition-colors">
              {tenant.name}
            </span>
            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--gold-primary)] font-semibold -mt-1">
              {tenant.subName}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[rgba(255,255,255,0.03)] p-1.5 rounded-full border border-[var(--border-glass)]">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-[var(--gold-primary)] text-black shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
          >
            Services & Menu
          </button>
          
          {tenant.features.hasPortfolio && (
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              Lookbook
            </button>
          )}

          {tenant.features.hasReviews && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[var(--gold-primary)] text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              Guest Reviews
            </button>
          )}

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my-bookings'
                ? 'bg-[var(--gold-primary)] text-black shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Bookings
            {activeAppointmentsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center">
                {activeAppointmentsCount}
              </span>
            )}
          </button>

          {activeStylist && !isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border shadow-sm ${
                activeTab === 'admin'
                  ? 'bg-[var(--gold-primary)] text-black border-[var(--gold-primary)] font-extrabold'
                  : 'bg-black/60 text-[var(--gold-primary)] border-[var(--gold-primary)]/40 hover:bg-black/80'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeStylist.liveStatus === 'in-chair' ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
              <span>Chair: {activeStylist.name.split(' ')[0]}</span>
            </button>
          )}

          {isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Manager Admin</span>
            </button>
          )}

          {!activeStylist && !isAdminAuthenticated && (
            <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => openStylistLogin()}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                title="Stylist Chair Login (Personal Timetable)"
              >
                <Scissors className="w-3 h-3 text-[var(--gold-primary)]" />
                <span>Stylist Access</span>
              </button>
              <span className="text-gray-600 text-[10px]">•</span>
              <button
                type="button"
                onClick={() => openManagerLogin()}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                title="Salon Manager Login (All Data & Revenue)"
              >
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Manager</span>
              </button>
            </div>
          )}
        </nav>

        {/* Right Action & Client Switcher & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Client Preset Selector (Agency Demo & Multi-Salon Switcher) */}
          {!isSingleClientLocked() && (
            <div className="relative">
              <button
                onClick={() => setClientPickerOpen(!clientPickerOpen)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Switch Client Salon Demo"
              >
                <Palette className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span className="max-w-[110px] truncate">{tenant.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {clientPickerOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#161925] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 border-b border-white/10 flex items-center justify-between">
                    <span>Agency Salon Switcher</span>
                    <span className="text-[9px] text-[var(--gold-primary)] lowercase font-mono">?client=id</span>
                  </div>
                  {availableTenants.map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setClientPickerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer group ${
                        activeTenantId === t.id
                          ? 'bg-[var(--gold-primary)] text-black font-bold'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30" 
                          style={{ backgroundColor: t.theme.primaryColor }}
                        />
                        <span className="truncate">{t.fullName}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, t.id)}
                        className={`p-1 rounded-md transition-colors ${
                          activeTenantId === t.id
                            ? 'hover:bg-black/20 text-black/80'
                            : 'hover:bg-white/20 text-gray-400 hover:text-white'
                        }`}
                        title="Copy direct salon link"
                      >
                        {copiedId === t.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => openBookingWizard()}
            className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span className="hidden xs:inline">Book Now</span>
            <span className="xs:hidden">Book</span>
          </button>

          {/* Hamburger Mobile Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12141f] border-b border-[var(--border-gold)] p-4 space-y-2 animate-fade-in shadow-2xl">
          
          {/* Mobile Client Switcher (Agency Demo Mode) */}
          {!isSingleClientLocked() && (
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--gold-primary)]">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Agency Salon Switcher
                </span>
                <span className="text-gray-400 font-mono lowercase">?client=id</span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {availableTenants.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      switchTenant(t.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                      activeTenantId === t.id ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.theme.primaryColor }} />
                      <span>{t.fullName}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, t.id)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Copy link"
                    >
                      {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => handleNavClick('services')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'services' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>Services & Treatments</span>
            <Scissors className="w-4 h-4" />
          </button>

          {tenant.features.hasPortfolio && (
            <button
              onClick={() => handleNavClick('portfolio')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === 'portfolio' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              <span>Lookbook Showcase</span>
              <Camera className="w-4 h-4" />
            </button>
          )}

          {tenant.features.hasReviews && (
            <button
              onClick={() => handleNavClick('reviews')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === 'reviews' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
              }`}
            >
              <span>Guest Reviews</span>
              <MessageSquare className="w-4 h-4" />
            </button>
          )}


          <button
            onClick={() => handleNavClick('my-bookings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'my-bookings' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              My Bookings
              {activeAppointmentsCount > 0 && (
                <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeAppointmentsCount}
                </span>
              )}
            </span>
            <Calendar className="w-4 h-4" />
          </button>

          {activeStylist && !isAdminAuthenticated && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === 'admin' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-[var(--gold-primary)] hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeStylist.liveStatus === 'in-chair' ? 'bg-red-500' : 'bg-emerald-400'}`} />
                <span>Stylist Station ({activeStylist.name.split(' ')[0]})</span>
              </span>
              <Scissors className="w-4 h-4" />
            </button>
          )}

          {isAdminAuthenticated && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeTab === 'admin' ? 'bg-purple-600 text-white font-bold' : 'text-purple-300 hover:bg-purple-950/40'
              }`}
            >
              <span>Manager Portal (Admin Mode)</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </button>
          )}

          {!activeStylist && !isAdminAuthenticated && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openStylistLogin();
                }}
                className="py-2.5 px-3 rounded-xl bg-[rgba(212,175,55,0.15)] border border-[var(--gold-primary)]/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                <span>Stylist Access</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openManagerLogin();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Manager</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
