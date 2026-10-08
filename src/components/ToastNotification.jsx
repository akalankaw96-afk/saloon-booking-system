import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';

export const ToastNotification = () => {
  const { toast } = useBooking();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
      <div className="glass-panel p-4 rounded-2xl border border-[var(--gold-primary)] bg-gradient-to-r from-[#1a1710] to-[#12141f] shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-[var(--gold-primary)] flex items-center justify-center shrink-0">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5 text-purple-400" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white font-serif">{toast.title}</h4>
          <p className="text-xs text-gray-300 font-light mt-0.5 leading-snug">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};
