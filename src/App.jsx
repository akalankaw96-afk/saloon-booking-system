import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { BookingWizardModal } from './components/BookingWizard/BookingWizardModal';
import { BookingPassModal } from './components/BookingPassModal';
import { AppointmentsModal } from './components/AppointmentsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StylistPortfolio } from './components/StylistPortfolio';
import { CustomerReviews } from './components/CustomerReviews';
import { ToastNotification } from './components/ToastNotification';
import { Scissors, MapPin, Phone, Mail, Clock, Globe, Share2, Sparkles, MessageSquare, Lock, ShieldCheck } from 'lucide-react';

const MainContent = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openBookingWizard, 
    isAdminAuthenticated, 
    openManagerLogin, 
    openStylistLogin, 
    activeStylist,
    tenant 
  } = useBooking();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-dark)] text-gray-100 selection:bg-[var(--gold-primary)] selection:text-black">
      
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'services' && (
          <>
            <HeroSection />
            <ServiceCatalog />
          </>
        )}

        {activeTab === 'portfolio' && tenant.features.hasPortfolio && <StylistPortfolio />}
        {activeTab === 'reviews' && tenant.features.hasReviews && <CustomerReviews />}
        {activeTab === 'my-bookings' && <AppointmentsModal />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals & Overlay Toast */}
      <BookingWizardModal />
      <BookingPassModal />
      <AdminLoginModal />
      <ToastNotification />

      {/* Footer */}
      <footer className="border-t border-[var(--border-glass)] bg-[#07080b] py-14 px-4 sm:px-6 lg:px-8 mt-20 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--gold-primary)] to-amber-500 flex items-center justify-center shadow-[0_0_15px_var(--gold-glow)]">
                <Scissors className="w-5 h-5 text-black transform -rotate-45" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                {tenant.fullName}
              </span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              {tenant.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[var(--gold-primary)]">
              Navigation
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                  Services & Menu
                </button>
              </li>
              {tenant.features.hasPortfolio && (
                <li>
                  <button onClick={() => setActiveTab('portfolio')} className="hover:text-white transition-colors">
                    Lookbook Gallery
                  </button>
                </li>
              )}
              {tenant.features.hasReviews && (
                <li>
                  <button onClick={() => setActiveTab('reviews')} className="hover:text-white transition-colors">
                    Verified Reviews
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => setActiveTab('my-bookings')} className="hover:text-white transition-colors">
                  My Bookings Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Salon Hours & Location */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[var(--gold-primary)]">
              Hours & Location
            </h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--gold-primary)] shrink-0 mt-0.5" />
                <span className="leading-snug">{tenant.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                <span>{tenant.contact.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                <span>{tenant.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Instant CTA & Socials */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[var(--gold-primary)]">
              Reserve Experience
            </h4>
            <p className="text-gray-400 font-light">
              Ready for your appointment? Reserve your spot online in under 60 seconds.
            </p>
            <button
              onClick={() => openBookingWizard()}
              className="btn-primary w-full justify-center text-xs py-3"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Book Appointment</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 sm:mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-center sm:text-left">
          <p>© 2026 {tenant.fullName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-4 text-gray-400">
            {/* Stylist Chair Access */}
            <button
              onClick={() => activeStylist ? setActiveTab('admin') : openStylistLogin()}
              className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              title="Stylist Chair Station & Personal Timetable"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{activeStylist ? `Station: ${activeStylist.name.split(' ')[0]}` : 'Stylist Access'}</span>
            </button>

            <span className="text-gray-700 hidden xs:inline">|</span>

            {/* Staff / Manager Access */}
            <button
              onClick={() => isAdminAuthenticated ? setActiveTab('admin') : openManagerLogin()}
              className="flex items-center gap-1.5 text-[11px] text-purple-400 hover:text-purple-300 transition-colors font-medium cursor-pointer"
              title="Salon Manager & Revenue Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminAuthenticated ? 'Manager Admin' : 'Staff / Manager Access'}</span>
            </button>
            <span className="text-gray-700 hidden xs:inline">|</span>
            <Globe className="w-4 h-4 hover:text-[var(--gold-primary)] cursor-pointer" />
            <Share2 className="w-4 h-4 hover:text-[var(--gold-primary)] cursor-pointer" />
            <MessageSquare className="w-4 h-4 hover:text-[var(--gold-primary)] cursor-pointer" />
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <BookingProvider>
      <MainContent />
    </BookingProvider>
  );
}

export default App;
