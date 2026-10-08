import React from 'react';
import { SERVICES } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';
import { Check, Plus, Clock, Sparkles } from 'lucide-react';

export const StepServices = () => {
  const { draftBooking, setDraftBooking, toggleAddOn, calculateTotal } = useBooking();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <span>Step 1: Choose Your Primary Treatment & Add-ons</span>
        </h3>
        <p className="text-sm text-gray-400 font-light mt-1">
          Select a service and add any luxury enhancements to your session.
        </p>
      </div>

      {/* Primary Services Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-1">
        {SERVICES.map(srv => {
          const isSelected = draftBooking.service?.id === srv.id;
          return (
            <div
              key={srv.id}
              onClick={() => setDraftBooking(prev => ({ ...prev, service: srv, selectedAddOns: [] }))}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                isSelected
                  ? 'bg-amber-500/10 border-[var(--gold-primary)] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-glass)] hover:border-white/20'
              }`}
            >
              <img
                src={srv.image}
                alt={srv.name}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white truncate">{srv.name}</h4>
                  <span className="text-sm font-extrabold text-[var(--gold-primary)] ml-2">Rs. {srv.price.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{srv.duration} mins</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-light">{srv.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add-ons Enhancements */}
      {draftBooking.service?.addOns && draftBooking.service.addOns.length > 0 && (
        <div className="space-y-3 border-t border-[var(--border-glass)] pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Optional Enhancements & Add-ons
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {draftBooking.service.addOns.map(addon => {
              const isAdded = draftBooking.selectedAddOns.some(a => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition-all ${
                    isAdded
                      ? 'bg-amber-400/20 border-[var(--gold-primary)] text-white'
                      : 'bg-black/40 border-white/10 text-gray-300 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${isAdded ? 'bg-[var(--gold-primary)] border-transparent' : 'border-gray-500'}`}>
                      {isAdded && <Check className="w-3 h-3 text-black font-extrabold" />}
                    </div>
                    <span>{addon.name}</span>
                  </div>
                  <span className="font-bold text-amber-400">+Rs. {addon.price.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Footer bar */}
      <div className="bg-black/50 p-4 rounded-xl border border-[var(--border-glass)] flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Selected: <strong className="text-white">{draftBooking.service?.name}</strong> ({draftBooking.selectedAddOns.length} Add-ons)
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400 block">Total Est.</span>
          <span className="text-xl font-extrabold text-[var(--gold-primary)]">
            Rs. {calculateTotal(draftBooking.service, draftBooking.selectedAddOns).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
