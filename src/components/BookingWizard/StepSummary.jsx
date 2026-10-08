import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { User, Mail, Phone, FileText, CheckCircle2, ShieldCheck, CreditCard, DollarSign, Lock } from 'lucide-react';

export const StepSummary = () => {
  const { draftBooking, setDraftBooking, calculateTotal } = useBooking();

  const handleInputChange = (field, value) => {
    setDraftBooking(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };

  const total = calculateTotal(draftBooking.service, draftBooking.selectedAddOns);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <span>Step 4: Contact & Payment Options</span>
        </h3>
        <p className="text-sm text-gray-400 font-light mt-1">
          Review your appointment details and complete your reservation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Guest Details Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kavindi Perera"
              value={draftBooking.customer.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="w-full bg-black/50 border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="kavindi@example.lk"
                value={draftBooking.customer.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full bg-black/50 border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+94 77 123 4567"
                value={draftBooking.customer.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                className="w-full bg-black/50 border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Payment & Hold Options
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDraftBooking(prev => ({ ...prev, paymentMethod: 'salon' }))}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  draftBooking.paymentMethod === 'salon'
                    ? 'bg-amber-500/20 border-[var(--gold-primary)] text-white'
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[var(--gold-primary)]" />
                  Pay at Salon
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Pay full amount in LKR during visit.</div>
              </button>

              <button
                type="button"
                onClick={() => setDraftBooking(prev => ({ ...prev, paymentMethod: 'deposit' }))}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  draftBooking.paymentMethod === 'deposit'
                    ? 'bg-amber-500/20 border-[var(--gold-primary)] text-white'
                    : 'bg-black/40 border-white/10 text-gray-400'
                }`}
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Pay Rs. 1,500 Deposit
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Guarantees prime slot & lock.</div>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
              Special Requests or Hair/Skin Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any hair color history, scalp sensitivities, or preferred Ceylon tea during your stay..."
              value={draftBooking.customer.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              className="w-full bg-black/50 border border-[var(--border-glass)] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)] resize-none"
            />
          </div>
        </div>

        {/* Right Column: Reservation Receipt Card */}
        <div className="lg:col-span-5 bg-black/60 p-5 rounded-2xl border border-[var(--border-gold)] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)]">
                Reservation Summary
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                {draftBooking.paymentMethod === 'deposit' ? 'Rs. 1,500 Deposit Hold' : 'Pay at Salon'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Treatment:</span>
                <span className="font-bold text-white text-right">{draftBooking.service?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Specialist:</span>
                <span className="text-amber-300 font-semibold">{draftBooking.stylist?.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Date & Time:</span>
                <span className="text-white font-semibold">{draftBooking.date} @ {draftBooking.time}</span>
              </div>
            </div>

            {draftBooking.selectedAddOns.length > 0 && (
              <div className="border-t border-white/10 pt-2 space-y-1">
                <span className="text-[11px] font-bold text-gray-300">Selected Add-ons:</span>
                {draftBooking.selectedAddOns.map(a => (
                  <div key={a.id} className="flex justify-between text-xs text-gray-400">
                    <span>+ {a.name}</span>
                    <span className="text-amber-400">+Rs. {a.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-2">
            {draftBooking.paymentMethod === 'deposit' && (
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Deposit Due Now:</span>
                <span>Rs. 1,500</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Total Treatment Value:</span>
              <span className="text-2xl font-extrabold text-[var(--gold-primary)]">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
