import React from 'react';
import { useBooking } from '../context/BookingContext';
import { X, QrCode, Calendar, Clock, User, Scissors, Download, Share2, CheckCircle2 } from 'lucide-react';

export const BookingPassModal = () => {
  const { activePassBooking, setActivePassBooking } = useBooking();

  if (!activePassBooking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content max-w-md bg-[#0d0e14] border-2 border-[var(--gold-primary)] rounded-3xl p-6 relative shadow-[0_0_50px_rgba(212,175,55,0.3)]">
        
        {/* Close Button */}
        <button
          onClick={() => setActivePassBooking(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        <div className="text-center space-y-2 border-b border-amber-500/20 pb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-[var(--gold-primary)] mb-1">
            <Scissors className="w-6 h-6 transform -rotate-45" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
            LUXECUT DIGITAL PASS
          </h3>
          <p className="text-xs text-[var(--gold-primary)] uppercase tracking-widest font-semibold">
            Contactless Salon & Spa Check-in Ticket
          </p>
        </div>

        {/* Pass Details Body */}
        <div className="py-6 space-y-4">
          
          <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Pass Reference:</span>
              <span className="font-mono text-amber-400 font-extrabold text-sm">{activePassBooking.id}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Guest Name:</span>
              <span className="font-bold text-white">{activePassBooking.customerName}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Treatment:</span>
              <span className="font-bold text-white text-right">{activePassBooking.serviceName}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Specialist:</span>
              <span className="text-amber-300 font-semibold">{activePassBooking.stylistName}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Date & Time:</span>
              <span className="text-white font-bold">{activePassBooking.date} @ {activePassBooking.time}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-lg font-extrabold text-[var(--gold-primary)]">Rs. {activePassBooking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
            <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white" />
              <path d="M10 10h25v25H10zM15 15v15h15V15zM20 20h5v5h-5zM65 10h25v25H65zM70 15v15h15V15zM75 20h5v5h-5zM10 65h25v25H10zM15 70v15h15V70zM20 75h5v5h-5z" fill="black"/>
              <path d="M45 10h10v10H45zM40 25h15v10H40zM55 40h10v15H55zM10 45h25v10H10zM75 45h15v15H75zM40 60h25v10H40zM70 70h20v20H70zM45 80h15v10H45z" fill="black"/>
            </svg>
            <span className="text-[10px] font-mono text-gray-700 tracking-wider">
              SCAN AT FRONT DESK FOR FAST ENTRY
            </span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 border-t border-amber-500/20 pt-4">
          <button
            onClick={handlePrint}
            className="flex-1 btn-primary justify-center text-xs py-3"
          >
            <Download className="w-4 h-4 fill-black" />
            <span>Save / Print Ticket</span>
          </button>

          <button
            onClick={() => setActivePassBooking(null)}
            className="btn-secondary text-xs py-3"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
