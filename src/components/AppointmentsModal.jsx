import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { TIME_SLOTS } from '../data/mockData';
import { Calendar, Clock, User, QrCode, XCircle, AlertCircle, Sparkles, CheckCircle2, RefreshCw, X, Search, Lock, ShieldCheck } from 'lucide-react';

export const AppointmentsModal = () => {
  const { myGuestBookings, cancelBooking, rescheduleBooking, setActivePassBooking, openBookingWizard, claimBookingToSession } = useBooking();
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border-glass)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Guest Session Storage (Private & Contactless)
          </div>
          <h2 className="text-3xl font-serif font-bold text-white">
            My Scheduled <span className="gold-gradient-text">Appointments</span>
          </h2>
        </div>

        {/* Track Booking Lookup Bar */}
        <form onSubmit={handleLookupSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track by Booking Ref (BK-XXXX) or Phone..."
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              className="w-full bg-black/60 border border-[var(--border-gold)] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-outline-gold text-xs py-2 px-3 whitespace-nowrap"
          >
            Find Booking
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Showing <strong className="text-amber-400">{filteredBookings.length}</strong> appointment(s) saved to this device.
        </div>

        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] p-1.5 rounded-2xl border border-[var(--border-glass)]">
          {['all', 'confirmed', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
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
        <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-xl font-serif text-white font-bold">No Guest Appointments Found</h3>
          <p className="text-sm text-gray-400 font-light">
            You don't have any saved appointments under "{filter}" on this device.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openBookingWizard()}
              className="btn-primary"
            >
              <Sparkles className="w-4 h-4 fill-black" />
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
                  <span className="text-amber-400 font-extrabold">Rs. {b.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setActivePassBooking(b)}
                  className="btn-outline-gold text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pass</span>
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
