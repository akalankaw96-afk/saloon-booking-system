import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Lock, Key, X, AlertCircle } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isAdminLoginOpen, closeAdminLogin, loginAdmin } = useBooking();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(pin);
    if (success) {
      setPin('');
    } else {
      setErrorMsg('Invalid Manager PIN. Default demo PIN is 1234.');
    }
  };

  const handleQuickPin = (digit) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay animate-fade-in z-[100]">
      <div className="modal-content max-w-md w-full p-6 bg-[#12141f] border border-purple-500/30 rounded-2xl relative space-y-6 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={closeAdminLogin}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Manager Access Authentication
          </h3>
          <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
            This area is restricted to salon management and staff. Enter your manager security PIN to proceed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* PIN Input Display */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 text-center uppercase tracking-wider">
              Enter 4-Digit Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="• • • •"
                autoFocus
                className="w-full bg-black/60 border border-purple-500/40 rounded-xl py-3 px-4 text-center text-2xl font-mono tracking-widest text-amber-400 focus:outline-none focus:border-purple-400 shadow-inner"
              />
              <Key className="w-5 h-5 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 opacity-70" />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                type="button"
                key={num}
                onClick={() => handleQuickPin(num)}
                className="py-2.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-white font-bold text-base transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearPin}
              className="py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleQuickPin('0')}
              className="py-2.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-white font-bold text-base transition-all active:scale-95"
            >
              0
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow"
            >
              Enter
            </button>
          </div>

          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="submit"
              className="btn-primary w-full justify-center text-xs py-3"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Operations</span>
            </button>
            
            <p className="text-[11px] text-gray-500">
              Demo PIN: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono">1234</code>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
