import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, MessageSquare, Phone, CheckCircle2, Copy, Check, 
  Send, Sparkles, MapPin, Calendar, Clock, User, Scissors, 
  ExternalLink, ShieldCheck, Building2, ChevronRight, CheckCheck
} from 'lucide-react';

export const BookingPassModal = () => {
  const { 
    activePassBooking, 
    setActivePassBooking, 
    formatPrice, 
    getCustomerPhoneMessage, 
    getCustomerWhatsAppUrl, 
    getCustomerSmsUrl, 
    getAdminWhatsAppUrl,
    getAdminWhatsAppMessage,
    getStylistWhatsAppUrl,
    getStylistWhatsAppMessage,
    stylists,
    tenant,
    showToast 
  } = useBooking();

  const [activeMessageTab, setActiveMessageTab] = useState('admin'); // 'admin' | 'stylist' | 'customer'
  const [copiedType, setCopiedType] = useState(null);
  const [sentTracking, setSentTracking] = useState({});

  if (!activePassBooking) return null;

  // Retrieve message texts & URLs for all 3 parties
  const adminMessage = getAdminWhatsAppMessage(activePassBooking);
  const adminWhatsAppUrl = getAdminWhatsAppUrl(activePassBooking);

  const stylistMessage = getStylistWhatsAppMessage(activePassBooking);
  const stylistWhatsAppUrl = getStylistWhatsAppUrl(activePassBooking);

  const customerMessage = getCustomerPhoneMessage(activePassBooking);
  const customerWhatsAppUrl = getCustomerWhatsAppUrl(activePassBooking);
  const customerSmsUrl = getCustomerSmsUrl(activePassBooking);

  // Identify assigned stylist details
  const matchedStylist = (stylists || []).find(s => s.id === activePassBooking.stylistId);
  const stylistPhone = matchedStylist?.phone || matchedStylist?.whatsapp || '+94 77 111 2233';
  const adminPhone = tenant.contact.phone || tenant.contact.whatsapp || '+94 11 255 5893';

  const handleCopy = (text, typeLabel) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      showToast(`${typeLabel} Copied!`, 'Message text copied to clipboard.', 'success');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const markAsSent = (targetKey) => {
    setSentTracking(prev => ({ ...prev, [targetKey]: true }));
    showToast('WhatsApp Dispatched', `WhatsApp message opened for ${targetKey}.`, 'info');
  };

  const currentPreviewMessage = 
    activeMessageTab === 'admin' 
      ? adminMessage 
      : activeMessageTab === 'stylist' 
      ? stylistMessage 
      : customerMessage;

  return (
    <div className="modal-overlay animate-fade-in p-3 sm:p-4 z-[120]">
      <div className="modal-content max-w-xl w-full bg-[#0d0e14] border-2 border-[var(--gold-primary)] rounded-3xl p-4 sm:p-6 relative shadow-[0_0_50px_var(--gold-glow)] space-y-5 max-h-[94vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setActivePassBooking(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 border-b border-white/10 pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {tenant.fullName}
          </h3>
          <p className="text-xs text-[var(--gold-primary)] uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[var(--gold-primary)]" />
            <span>Booking Confirmed & WhatsApp Dispatch Hub</span>
          </p>
        </div>

        {/* Structured Appointment Summary */}
        <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Booking Reference:</span>
            <span className="font-mono text-amber-400 font-extrabold text-sm">#{activePassBooking.id}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
            <span className="text-gray-400">Guest Name & Phone:</span>
            <span className="font-bold text-white text-right">
              {activePassBooking.customerName} <span className="text-gray-400 font-normal">({activePassBooking.phone})</span>
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
            <span className="text-gray-400">Treatment:</span>
            <span className="font-bold text-white text-right">{activePassBooking.serviceName}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
            <span className="text-gray-400">Assigned Specialist:</span>
            <span className="text-amber-300 font-semibold">{activePassBooking.stylistName}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
            <span className="text-gray-400">Scheduled Slot:</span>
            <span className="text-white font-bold">{activePassBooking.date} @ {activePassBooking.time}</span>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-1.5 text-sm">
            <span className="text-gray-400">Total Price:</span>
            <span className="font-extrabold text-[var(--gold-primary)]">{formatPrice(activePassBooking.totalPrice)}</span>
          </div>
        </div>

        {/* Instant WhatsApp Dispatch Action Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Instant WhatsApp Alerts</span>
            </label>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              3 Channels Ready
            </span>
          </div>

          {/* 1. Salon Admin WhatsApp Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-black/50 to-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Salon Admin / Reception</span>
                  {sentTracking.admin && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                      <CheckCheck className="w-3 h-3" /> Dispatched
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  Admin Hotline: <strong className="text-gray-200 font-mono">{adminPhone}</strong>
                </div>
              </div>
            </div>

            <a
              href={adminWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markAsSent('admin')}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all shrink-0 cursor-pointer text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Send Admin WhatsApp</span>
            </a>
          </div>

          {/* 2. Stylist WhatsApp Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-black/50 to-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Stylist: {activePassBooking.stylistName}</span>
                  {sentTracking.stylist && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                      <CheckCheck className="w-3 h-3" /> Dispatched
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  Chair WhatsApp: <strong className="text-gray-200 font-mono">{stylistPhone}</strong>
                </div>
              </div>
            </div>

            <a
              href={stylistWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markAsSent('stylist')}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all shrink-0 cursor-pointer text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Send Stylist WhatsApp</span>
            </a>
          </div>

          {/* 3. Customer WhatsApp Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-black/50 to-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Customer Phone Confirmation</span>
                  {sentTracking.customer && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                      <CheckCheck className="w-3 h-3" /> Dispatched
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  Guest Phone: <strong className="text-gray-200 font-mono">{activePassBooking.phone}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={customerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markAsSent('customer')}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all cursor-pointer text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Customer WhatsApp</span>
              </a>

              <a
                href={customerSmsUrl}
                onClick={() => markAsSent('sms')}
                className="p-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 transition-colors cursor-pointer"
                title="Send via Native SMS"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Message Preview Tabs (Admin / Stylist / Customer) */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
              Message Text Preview:
            </span>

            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveMessageTab('admin')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeMessageTab === 'admin'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🏢 Admin Alert
              </button>
              <button
                type="button"
                onClick={() => setActiveMessageTab('stylist')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeMessageTab === 'stylist'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✂️ Stylist Alert
              </button>
              <button
                type="button"
                onClick={() => setActiveMessageTab('customer')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeMessageTab === 'customer'
                    ? 'bg-[var(--gold-primary)] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📱 Customer Pass
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-black/80 p-3.5 rounded-2xl border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto selection:bg-amber-500/30">
              {currentPreviewMessage}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentPreviewMessage, activeMessageTab)}
              className="absolute top-2.5 right-2.5 text-[10px] text-gray-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-colors cursor-pointer backdrop-blur-md"
            >
              {copiedType === activeMessageTab ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Done Footer */}
        <div className="pt-2 text-center border-t border-white/10">
          <button
            onClick={() => setActivePassBooking(null)}
            className="w-full btn-secondary text-xs py-2.5 rounded-xl cursor-pointer"
          >
            Close & Return to Salon
          </button>
        </div>

      </div>
    </div>
  );
};

