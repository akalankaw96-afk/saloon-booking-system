import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Star, Check, UserCheck, Scissors, Clock, AlertTriangle } from 'lucide-react';

export const StepStylists = () => {
  const { stylists, draftBooking, setDraftBooking } = useBooking();

  const anyStylistOption = {
    id: 'any',
    name: 'First Available Specialist',
    role: 'Optimal Slot Recommendation',
    bio: 'Our system will automatically assign the best available specialist for your chosen service and time slot.',
    rating: 5.0,
    experience: 'Guaranteed Expert',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'active'
  };

  const allOptions = [anyStylistOption, ...stylists];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <span>Step 2: Select Your Preferred Stylist</span>
        </h3>
        <p className="text-sm text-gray-400 font-light mt-1">
          Choose a team member based on specialty or select First Available for maximum flexibility.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
        {allOptions.map(stylist => {
          const isSelected = draftBooking.stylist?.id === stylist.id;
          const isOnLeave = stylist.status === 'on-leave';
          const isSpecialistForService = stylist.specialties
            ? stylist.specialties.includes(draftBooking.service?.id)
            : false;

          return (
            <div
              key={stylist.id}
              onClick={() => {
                if (!isOnLeave) {
                  setDraftBooking(prev => ({ ...prev, stylist }));
                }
              }}
              className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                isOnLeave
                  ? 'bg-red-950/10 border-red-900/20 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-amber-500/10 border-[var(--gold-primary)] shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer'
                  : 'bg-[rgba(255,255,255,0.02)] border-[var(--border-glass)] hover:border-white/20 cursor-pointer'
              }`}
            >
              {/* Badges */}
              {isOnLeave ? (
                <div className="absolute top-2 right-2 bg-red-900/40 text-red-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-800/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> On Leave
                </div>
              ) : isSpecialistForService ? (
                <div className="absolute top-2 right-2 bg-amber-500/20 text-[var(--gold-primary)] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--border-gold)]">
                  Top Recommended
                </div>
              ) : null}

              <div className="flex items-start gap-4">
                <img
                  src={stylist.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={stylist.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-[var(--border-gold)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white truncate">{stylist.name}</h4>
                  </div>
                  <span className="text-xs text-[var(--gold-primary)] block font-medium">
                    {stylist.role}
                  </span>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {stylist.rating}
                    </span>
                    <span>• {stylist.experience}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-light mt-3 line-clamp-2">
                {stylist.bio}
              </p>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {stylist.shiftStart ? `Shift: ${stylist.shiftStart} - ${stylist.shiftEnd}` : 'Flexible'}
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[var(--gold-primary)] border-transparent' : 'border-gray-600'}`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-black font-extrabold" />}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
