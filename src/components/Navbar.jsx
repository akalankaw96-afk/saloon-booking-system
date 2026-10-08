import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Scissors, Calendar, ShieldCheck, Sparkles, Star, UserCheck, Menu, X, Camera, MessageSquare } from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, openBookingWizard, bookings, isAdminAuthenticated, logoutAdmin } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAppointmentsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-opacity-90 bg-[#0b0c10] border-b border-[var(--border-glass)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('services')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#f59e0b] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform shrink-0">
            <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-black transform -rotate-45" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[var(--gold-primary)] transition-colors">
              LUXECUT
            </span>
            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--gold-primary)] font-semibold -mt-1">
              Salon & Spa Studio
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
            Services & Spa
          </button>
          
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
              <span>Admin Mode</span>
            </button>
          )}
        </nav>

        {/* Right Action & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
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
          <button
            onClick={() => handleNavClick('services')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'services' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>Services & Treatments</span>
            <Scissors className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavClick('portfolio')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'portfolio' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>Lookbook Showcase</span>
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavClick('reviews')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeTab === 'reviews' ? 'bg-[var(--gold-primary)] text-black font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>Guest Reviews</span>
            <MessageSquare className="w-4 h-4" />
          </button>

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
        </div>
      )}
    </header>
  );
};
