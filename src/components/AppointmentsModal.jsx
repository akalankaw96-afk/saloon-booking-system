import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { TIME_SLOTS } from '../data/mockData';
import { Calendar, Clock, User, MessageSquare, XCircle, AlertCircle, Sparkles, CheckCircle2, RefreshCw, X, Search, Lock, ShieldCheck } from 'lucide-react';

export const AppointmentsModal = () => {
  const { myGuestBookings, cancelBooking, rescheduleBooking, setActivePassBooking, openBookingWizard, claimBookingToSession, formatPrice } = useBooking();
  const [filter, setFilter] = useState('all'); // 'all' | 'confirmed' | 'completed' | 'cancelled'
  const [lookupQuery, setLookupQuery] = useState('');
  
  // Reschedule State
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('01:00 PM');

  const filteredBookings = filter === 'all'
    ? myGuestBookings
    : myGuestBookings.filter(b => b.status === filter);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupQuery) return;
    claimBookingToSession(lookupQuery);
    setLookupQuery('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>;
      case 'pending':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'completed':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleOpenReschedule = (b) => {
    setRescheduleTarget(b);
    setNewDate(b.date);
    setNewTime(b.time);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget) return;
    rescheduleBooking(rescheduleTarget.id, newDate, newTime);
    setRescheduleTarget(null);
  };

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-[var(--border-glass)] pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-1 sm:mb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Guest Session Storage (Private & Contactless)
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            My Scheduled <span className="gold-gradient-text">Appointments</span>
          </h2>
        </div>

        {/* Track Booking Lookup Bar */}
        <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track by Booking Ref or Phone..."
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              className="w-full bg-black/60 border border-[var(--border-gold)] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-outline-gold text-xs py-2 px-3 whitespace-nowrap cursor-pointer shrink-0"
          >
            Find Booking
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-gray-400">
          Showing <strong className="text-amber-400">{filteredBookings.length}</strong> appointment(s) saved to this device.
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-1.5 bg-[rgba(255,255,255,0.03)] p-1.5 rounded-xl border border-[var(--border-glass)] w-full sm:w-auto whitespace-nowrap">
          {['all', 'confirmed', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[var(--gold-primary)] text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredBookings.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[var(--gold-primary)] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white font-bold mb-1">No Saved Bookings on This Device</h3>
            <p className="text-xs text-gray-400 font-light max-w-sm mx-auto">
              Bookings are kept private per device. If you booked from another device or browser, enter your <strong>Phone Number</strong> or <strong>Booking Ref</strong> below to retrieve your tickets.
            </p>
          </div>

          {/* Quick Lookup Box inside empty state */}
          <form onSubmit={handleLookupSubmit} className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10 text-left">
            <label className="block text-xs font-semibold text-gray-300">
              Lookup Your Existing Appointment:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Phone Number or BK-XXXX..."
                value={lookupQuery}
                onChange={e => setLookupQuery(e.target.value)}
                className="flex-1 bg-black/60 border border-[var(--border-gold)] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
              >
                Find My Booking
              </button>
            </div>
          </form>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => openBookingWizard()}
              className="btn-outline-gold text-xs py-2 px-5"
            >
              <Sparkles className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>Book New Appointment</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className="glass-panel p-6 space-y-4 hover:border-[var(--gold-primary)] transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold block mb-1">
                    #{b.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {b.serviceName}
                  </h3>
                </div>
                {getStatusBadge(b.status)}
              </div>

              {/* Details Grid */}
              <div className="bg-black/40 p-4 rounded-xl space-y-2 text-xs border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stylist / Specialist:</span>
                  <span className="text-amber-300 font-semibold">{b.stylistName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-white font-bold">{b.date} @ {b.time}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Guest Name:</span>
                  <span className="text-gray-200">{b.customerName} ({b.phone})</span>
                </div>

                {b.addOns && b.addOns.length > 0 && (
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-gray-400">Add-ons:</span>
                    <span className="text-gray-300 text-right">{b.addOns.join(', ')}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="text-gray-300 font-semibold">Total Price:</span>
                  <span className="text-[var(--gold-primary)] font-extrabold">{formatPrice(b.totalPrice)}</span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setActivePassBooking(b)}
                  className="btn-outline-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                  title="View and send confirmation message to phone"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Phone Message</span>
                </button>

                {b.status === 'confirmed' || b.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReschedule(b)}
                      className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 py-1.5 px-3 bg-amber-950/40 border border-amber-800/40 rounded-xl transition-colors font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 py-1.5 px-2.5 hover:bg-red-950/30 rounded-xl transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : null}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-md p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-5">
            <button
              onClick={() => setRescheduleTarget(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[var(--gold-primary)]" />
              <span>Reschedule Appointment</span>
            </h3>

            <div className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
              <div>Ref: <strong className="text-amber-400">{rescheduleTarget.id}</strong></div>
              <div>Treatment: <strong className="text-white">{rescheduleTarget.serviceName}</strong></div>
              <div>Stylist: <strong className="text-amber-300">{rescheduleTarget.stylistName}</strong></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Select New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Select New Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTime(t)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        newTime === t
                          ? 'bg-amber-500/20 border-[var(--gold-primary)] text-white'
                          : 'bg-black/30 border-white/10 text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setRescheduleTarget(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="btn-primary text-xs py-2.5 px-6"
              >
                Confirm Reschedule
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
