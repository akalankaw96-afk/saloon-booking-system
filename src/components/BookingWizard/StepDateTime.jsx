import React from 'react';
import { TIME_SLOTS } from '../../data/mockData';
import { useBooking } from '../../context/BookingContext';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';

export const StepDateTime = () => {
  const { draftBooking, setDraftBooking, bookings } = useBooking();

  // Today ISO date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Generate next 7 days for quick date selector
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days.push({ dateStr, dayName, monthDay });
  }

  // Check existing bookings to mark taken slots
  const selectedDateBookings = bookings.filter(b => b.date === draftBooking.date && b.status !== 'cancelled');
  const occupiedTimes = selectedDateBookings.map(b => b.time);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <span>Step 3: Choose Date & Available Time Slot</span>
        </h3>
        <p className="text-sm text-gray-400 font-light mt-1">
          Select your preferred appointment date and time slot.
        </p>
      </div>

      {/* Date Selection Header & Custom Calendar Picker */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Select Appointment Date
          </label>
          
          {/* Custom Date Input for Any Future Month */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Pick any date:</span>
            <input
              type="date"
              min={todayStr}
              value={draftBooking.date}
              onChange={e => setDraftBooking(prev => ({ ...prev, date: e.target.value }))}
              className="bg-black/60 border border-[var(--border-gold)] rounded-xl px-3 py-1 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Date Selector Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {days.map(day => {
            const isSelected = draftBooking.date === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setDraftBooking(prev => ({ ...prev, date: day.dateStr }))}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[var(--gold-primary)] text-black border-[var(--gold-primary)] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-black/40 border-[var(--border-glass)] text-gray-300 hover:border-white/20'
                }`}
              >
                <span className="block text-[11px] uppercase tracking-wider font-semibold opacity-80">
                  {day.dayName}
                </span>
                <span className="block text-sm font-extrabold mt-0.5">
                  {day.monthDay}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Chips Grid */}
      <div className="space-y-2 border-t border-[var(--border-glass)] pt-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold-primary)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Available Time Slots ({draftBooking.date})
          </label>
          <span className="text-xs text-gray-400">Duration: ~{draftBooking.service?.duration || 45} mins</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {TIME_SLOTS.map(time => {
            const isTaken = occupiedTimes.includes(time);
            const isSelected = draftBooking.time === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isTaken}
                onClick={() => setDraftBooking(prev => ({ ...prev, time }))}
                className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  isTaken
                    ? 'bg-red-950/20 border-red-900/30 text-gray-600 cursor-not-allowed line-through opacity-60'
                    : isSelected
                    ? 'bg-amber-500/20 border-[var(--gold-primary)] text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-black/30 border-[var(--border-glass)] text-gray-200 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span>{time}</span>
                {isTaken ? (
                  <span className="text-[10px] text-red-400 no-underline font-normal uppercase">Booked</span>
                ) : isSelected ? (
                  <Check className="w-4 h-4 text-[var(--gold-primary)] font-bold" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Confirmation Ribbon */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--gold-primary)]" />
          <span>Scheduled for <strong>{draftBooking.date}</strong> at <strong>{draftBooking.time}</strong></span>
        </div>
        <span className="text-gray-400">With {draftBooking.stylist?.name}</span>
      </div>

    </div>
  );
};
