import React, { useState } from 'react';
import { PORTFOLIO } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { Sparkles, Camera, Eye, Scissors } from 'lucide-react';

export const StylistPortfolio = () => {
  const { openBookingWizard, tenant } = useBooking();
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'coloring', label: 'Balayage & Color' },
    { id: 'haircut', label: 'Precision Cuts' },
    { id: 'grooming', label: 'Barber Grooming' },
    { id: 'skincare', label: 'Spa & Skincare' }
  ];

  const items = filter === 'all'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.category === filter);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-glass)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-2">
            <Camera className="w-4 h-4" />
            Style Showcase
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            The {tenant.name} <span className="gold-gradient-text">Lookbook</span>
          </h2>
          <p className="text-gray-400 mt-2 max-w-xl font-light">
            Explore recent transformations crafted by our specialists. Tap any style to request it in your booking!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-[rgba(255,255,255,0.03)] p-1.5 rounded-2xl border border-[var(--border-glass)]">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === c.id
                  ? 'bg-[var(--gold-primary)] text-black font-bold shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Masonry/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="glass-panel group relative rounded-2xl overflow-hidden hover:border-[var(--gold-primary)] transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Stylist Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-amber-300 font-bold">
                By {item.stylist}
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[var(--gold-primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 font-light line-clamp-2">
                  {item.description}
                </p>

                <button
                  onClick={() => openBookingWizard()}
                  className="w-full btn-primary justify-center text-xs py-2 mt-2 opacity-90 group-hover:opacity-100"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>Book This Style</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
