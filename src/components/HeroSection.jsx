import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Sparkles, Star, Scissors, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const HeroSection = () => {
  const { openBookingWizard, setActiveTab } = useBooking();

  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-glass)]">
      
      {/* Background Image with Ambient Glow Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero.jpg" 
          alt="Luxe Salon Background" 
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[rgba(11,12,16,0.75)] to-transparent" />
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[rgba(212,175,55,0.12)] border border-[var(--border-gold)] backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)] shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)]">
            Voted #1 Luxury Salon & Spa Studio 2026
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
          Where Elegance Meets <br />
          <span className="gold-gradient-text">Precision Craftsmanship</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-300 font-light leading-relaxed px-2">
          Indulge in bespoke hairdressing, dimensional balayage coloring, razor beard sculpts, and restorative scalp spa treatments tailored exclusively to you in Sri Lanka.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => openBookingWizard()}
            className="w-full sm:w-auto btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            <span>Book Appointment Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className="w-full sm:w-auto btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center backdrop-blur-md hover:border-[var(--gold-primary)]"
          >
            <span>View Lookbook Gallery</span>
          </button>
        </div>

        {/* Feature Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-10 max-w-4xl mx-auto text-left">
          
          <div className="glass-panel p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">4.98 / 5.0 Rating</div>
              <div className="text-[10px] sm:text-xs text-gray-400">500+ Verified Guests</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Master Stylists</div>
              <div className="text-[10px] sm:text-xs text-gray-400">10+ Years Expert Team</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Zero Wait Guarantee</div>
              <div className="text-[10px] sm:text-xs text-gray-400">Punctual Appointments</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Digital Pass</div>
              <div className="text-[10px] sm:text-xs text-gray-400">QR Contactless Entry</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
