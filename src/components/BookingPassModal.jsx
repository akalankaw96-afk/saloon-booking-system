import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, MessageSquare, Phone, CheckCircle2, Copy, Check, 
  Send, Sparkles, MapPin, Calendar, Clock, User, Scissors, ExternalLink 
} from 'lucide-react';

export const BookingPassModal = () => {
  const { 
    activePassBooking, 
    setActivePassBooking, 
    formatPrice, 
    getCustomerPhoneMessage, 
    getCustomerWhatsAppUrl, 
    getCustomerSmsUrl, 
    getWhatsAppAlertUrl, 
    tenant,
    showToast 
  } = useBooking();

  const [copied, setCopied] = useState(false);

  if (!activePassBooking) return null;

  const phoneMessage = getCustomerPhoneMessage(activePassBooking);
  const customerWhatsAppUrl = getCustomerWhatsAppUrl(activePassBooking);
  const customerSmsUrl = getCustomerSmsUrl(activePassBooking);
  const salonWhatsAppUrl = getWhatsAppAlertUrl(activePassBooking);

  const handleCopyMessage = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phoneMessage);
      setCopied(true);
      showToast('Message Copied!', 'Appointment confirmation copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in p-3 sm:p-4 z-[120]">
      <div className="modal-content max-w-lg w-full bg-[#0d0e14] border-2 border-[var(--gold-primary)] rounded-3xl p-5 sm:p-6 relative shadow-[0_0_50px_var(--gold-glow)] space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setActivePassBooking(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 border-b border-white/10 pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {tenant.fullName}
          </h3>
          <p className="text-xs text-[var(--gold-primary)] uppercase tracking-wider font-bold">
            Appointment Confirmed & Phone Confirmation
          </p>
        </div>

        {/* Phone Delivery Status Badge */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-black/60 to-emerald-950/40 p-3.5 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span>Direct Phone Message Prepared</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>
            <p className="text-[11px] text-gray-300 truncate mt-0.5">
              Ready to send to: <strong className="text-white font-mono">{activePassBooking.phone || 'Your Phone'}</strong>
            </p>
          </div>
        </div>

        {/* Structured Appointment Details */}
        <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Booking Ref:</span>
            <span className="font-mono text-amber-400 font-extrabold text-sm">#{activePassBooking.id}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2">
            <span className="text-gray-400">Guest Name:</span>
            <span className="font-bold text-white">{activePassBooking.customerName}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2">
            <span className="text-gray-400">Treatment:</span>
            <span className="font-bold text-white text-right">{activePassBooking.serviceName}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2">
            <span className="text-gray-400">Assigned Specialist:</span>
            <span className="text-amber-300 font-semibold">{activePassBooking.stylistName}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2">
            <span className="text-gray-400">Scheduled Time:</span>
            <span className="text-white font-bold">{activePassBooking.date} @ {activePassBooking.time}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-2 text-sm">
            <span className="text-gray-400">Total Price:</span>
            <span className="font-extrabold text-[var(--gold-primary)]">{formatPrice(activePassBooking.totalPrice)}</span>
          </div>
        </div>

        {/* Message Preview Box (The exact message for this particular salon) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Confirmation Message for Your Phone</span>
            </label>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="bg-black/80 p-3.5 rounded-2xl border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto selection:bg-amber-500/30">
            {phoneMessage}
          </div>
        </div>

        {/* Direct Phone Sending Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          
          {/* Primary Action: Open WhatsApp directly to send to customer phone */}
          <a
            href={customerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.01] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Send Confirmation to My WhatsApp ({activePassBooking.phone})</span>
          </a>

          {/* Secondary Action: Native SMS / Text Message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={customerSmsUrl}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold text-xs transition-colors text-center"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via SMS</span>
            </a>

            {salonWhatsAppUrl && (
              <a
                href={salonWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold text-xs transition-colors text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Notify Salon Reception</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Done Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setActivePassBooking(null)}
            className="w-full btn-secondary text-xs py-2.5 rounded-xl cursor-pointer"
          >
            Close & View Appointments
          </button>
        </div>

      </div>
    </div>
  );
};
