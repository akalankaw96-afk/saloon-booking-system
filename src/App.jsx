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
  const { activeTab, setActiveTab, openBookingWizard, isAdminAuthenticated, openAdminLogin } = useBooking();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0c10] text-gray-100 selection:bg-[var(--gold-primary)] selection:text-black">
      
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

        {activeTab === 'portfolio' && <StylistPortfolio />}
        {activeTab === 'reviews' && <CustomerReviews />}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#f59e0b] flex items-center justify-center">
                <Scissors className="w-5 h-5 text-black transform -rotate-45" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                LUXECUT STUDIO
              </span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              Premier luxury salon and wellness spa in Colombo, Sri Lanka. Dedicated to bespoke hairdressing, dimensional color artistry, and restorative scalp therapy.
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
              <li>
                <button onClick={() => setActiveTab('portfolio')} className="hover:text-white transition-colors">
                  Lookbook Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reviews')} className="hover:text-white transition-colors">
                  Verified Reviews
                </button>
              </li>
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
                <span>280 Galle Road, Kollupitiya<br />Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />
                <span>+94 (11) 255-LUXE</span>
              </div>
            </div>
          </div>

          {/* Instant CTA & Socials */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[var(--gold-primary)]">
              Reserve Experience
            </h4>
            <p className="text-gray-400 font-light">
              Ready for your transformation? Reserve your appointment online in under 60 seconds.
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

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <p>© 2026 LuxeCut Salon & Spa Studio (Sri Lanka). All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={() => isAdminAuthenticated ? setActiveTab('admin') : openAdminLogin()}
              className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-purple-400 transition-colors"
              title="Staff & Management Access Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Access</span>
            </button>
            <span className="text-gray-700">|</span>
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
