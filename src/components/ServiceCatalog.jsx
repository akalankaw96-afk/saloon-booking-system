import React, { useState } from 'react';
import { STYLISTS } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { Clock, Sparkles, Plus, Check, Star, ShieldCheck, ChevronDown, Scissors, Search } from 'lucide-react';

export const ServiceCatalog = () => {
  const { services, openBookingWizard, formatPrice, tenant } = useBooking();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAddOns, setExpandedAddOns] = useState(null);

  const categories = [
    { id: 'all', label: 'All Experiences' },
    { id: 'haircut', label: 'Haircuts & Styling' },
    { id: 'coloring', label: 'Color & Highlights' },
    { id: 'grooming', label: "Barber & Grooming" },
    { id: 'skincare', label: 'Facials & Skincare' },
    { id: 'spa', label: 'Scalp & Wellness Spa' },
  ];

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAddonList = (serviceId) => {
    setExpandedAddOns(prev => prev === serviceId ? null : serviceId);
  };

  return (
    <section id="services-menu" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-glass)] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[var(--gold-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Menu
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Signature <span className="gold-gradient-text">Services & Treatments</span>
          </h2>
          <p className="text-gray-400 mt-2 max-w-xl font-light">
            Select a service to view details, personalized enhancements, and book your appointment with {tenant.name}.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatment (e.g. balayage, beard, hydrafacial)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-black/60 border border-[var(--border-gold)] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none w-full sm:w-80 shadow-lg"
            />
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-1.5 sm:flex-wrap bg-[rgba(255,255,255,0.03)] p-1.5 rounded-2xl border border-[var(--border-glass)] whitespace-nowrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--gold-primary)] text-black shadow-lg shadow-amber-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400 space-y-2 max-w-md mx-auto">
          <p className="text-white font-bold font-serif">No Treatments Found</p>
          <p className="text-xs font-light">Try searching with a different term like "haircut" or "spa".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="glass-panel group relative flex flex-col justify-between overflow-hidden hover:border-[var(--gold-primary)] transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141f] via-transparent to-transparent opacity-90" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="badge-gold">
                    {service.badge}
                  </span>
                </div>

                {/* Price & Duration */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                    <span>{service.duration} mins</span>
                  </div>
                  <div className="bg-[var(--gold-primary)] text-black font-extrabold px-3 py-1 rounded-full text-base shadow-lg">
                    {formatPrice(service.price)}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[var(--gold-primary)] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 font-light line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Add-ons Accordion */}
                {service.addOns && service.addOns.length > 0 && (
                  <div className="border-t border-[var(--border-glass)] pt-3">
                    <button
                      onClick={() => toggleAddonList(service.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-[var(--gold-primary)] hover:underline py-1"
                    >
                      <span>{service.addOns.length} Custom Enhancements Available</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedAddOns === service.id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedAddOns === service.id && (
                      <div className="mt-2 space-y-1.5 animate-fade-in bg-black/40 p-3 rounded-xl border border-white/5">
                        {service.addOns.map(addon => (
                          <div key={addon.id} className="flex justify-between items-center text-xs text-gray-300">
                            <span className="flex items-center gap-1.5">
                              <Plus className="w-3 h-3 text-[var(--gold-primary)]" />
                              {addon.name}
                            </span>
                            <span className="font-bold text-amber-400">+{formatPrice(addon.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => openBookingWizard(service)}
                    className="w-full btn-primary justify-center text-sm py-3"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Book This Treatment</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Team Showcase Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border-gold)] bg-gradient-to-r from-[#161826] via-[#1f1a10] to-[#161826] flex flex-col lg:flex-row items-center justify-between gap-8 mt-16">
        <div className="space-y-3 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider">
            <Scissors className="w-4 h-4" />
            Dedicated Artisans
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Meet Our Master Specialists & Colorists
          </h3>
          <p className="text-gray-300 text-sm font-light">
            Every specialist at LuxeCut brings years of international experience, fine precision, and individualized consultation to bring your vision to life.
          </p>
        </div>

        {/* Stylist Avatars Row */}
        <div className="flex items-center -space-x-4">
          {STYLISTS.map(stylist => (
            <div
              key={stylist.id}
              onClick={() => openBookingWizard(null, stylist)}
              className="relative group/avatar cursor-pointer"
              title={`${stylist.name} - ${stylist.role}`}
            >
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--gold-primary)] shadow-xl group-hover/avatar:scale-115 group-hover/avatar:z-20 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 bg-black text-[var(--gold-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[var(--border-gold)]">
                ★ {stylist.rating}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
