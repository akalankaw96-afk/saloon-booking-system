import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Sparkles, Star, Scissors, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const HeroSection = () => {
  const { openBookingWizard, setActiveTab, tenant } = useBooking();

  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-glass)]">
      
      {/* Background Image with Ambient Glow Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tenant.hero?.image || "/assets/hero.jpg"} 
          alt={`${tenant.name} Ambiance`} 
          className="w-full h-full object-cover object-center opacity-30 scale-105 filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-[rgba(11,12,16,0.75)] to-transparent" />
        <div className="absolute inset-0 bg-radial-glow opacity-50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[rgba(255,255,255,0.06)] border border-[var(--border-gold)] backdrop-blur-md shadow-[0_0_20px_var(--gold-glow)]">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)] shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)]">
            {tenant.hero?.badge || "Voted Top Rated Salon 2026"}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
          {tenant.hero?.titlePrefix || "Where Elegance Meets"} <br />
          <span className="gold-gradient-text">{tenant.hero?.titleHighlight || "Precision Craftsmanship"}</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-300 font-light leading-relaxed px-2">
          {tenant.hero?.subtitle || tenant.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => openBookingWizard()}
            className="w-full sm:w-auto btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center shadow-[0_0_30px_var(--gold-glow)]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            <span>Book Appointment Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {tenant.features.hasPortfolio ? (
            <button
              onClick={() => setActiveTab('portfolio')}
              className="w-full sm:w-auto btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center backdrop-blur-md hover:border-[var(--gold-primary)]"
            >
              <span>View Lookbook Gallery</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const menuEl = document.getElementById('services-menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center backdrop-blur-md hover:border-[var(--gold-primary)]"
            >
              <span>View Service Menu</span>
            </button>
          )}
        </div>

        {/* Feature Pill Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-10 max-w-4xl mx-auto text-left">
          {(tenant.stats || []).map((stat, idx) => (
            <div key={idx} className="glass-panel p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                {idx === 0 && <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />}
                {idx === 1 && <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />}
                {idx === 2 && <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />}
                {idx === 3 && <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold-primary)]" />}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">{stat.label}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
