import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Lock, Key, X, AlertCircle, Eye, EyeOff, Scissors, UserCheck, ShieldAlert } from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    isAdminLoginOpen, 
    closeAdminLogin, 
    loginAdmin, 
    loginStylist, 
    tenant, 
    stylists,
    adminLoginInitialRole
  } = useBooking();

  const [authRole, setAuthRole] = useState(adminLoginInitialRole || 'manager');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedStylistId, setSelectedStylistId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (adminLoginInitialRole) {
      setAuthRole(adminLoginInitialRole);
      setPasswordInput('');
      setErrorMsg('');
      if (adminLoginInitialRole === 'stylist' && stylists.length > 0) {
        setSelectedStylistId(stylists[0].id);
      }
    }
  }, [adminLoginInitialRole, isAdminLoginOpen]);

  if (!isAdminLoginOpen) return null;

  const expectedPassword = tenant?.adminPassword || 'LuxeCut@2026';
  const expectedPin = tenant?.adminPin || '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authRole === 'manager') {
      const success = loginAdmin(passwordInput);
      if (success) {
        setPasswordInput('');
      } else {
        setErrorMsg(`Access Denied: Incorrect password for ${tenant.name}. Each salon requires their own distinct password.`);
      }
    } else {
      // Stylist Chair Station Login
      const success = loginStylist(passwordInput, selectedStylistId || null);
      if (success) {
        setPasswordInput('');
        setSelectedStylistId('');
      } else {
        setErrorMsg(`Invalid PIN: Stylist chair station access denied. Please verify your 4-digit PIN.`);
      }
    }
  };

  const handleQuickPin = (digit) => {
    setPasswordInput(prev => prev + digit);
  };

  const handleClear = () => {
    setPasswordInput('');
    setErrorMsg('');
  };

  return (
    <div className="modal-overlay animate-fade-in z-[100]">
      <div className="modal-content max-w-md w-full p-4 sm:p-6 bg-[#12141f] border border-purple-500/30 rounded-2xl relative space-y-4 sm:space-y-5 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={closeAdminLogin}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 sm:space-y-2 pt-1">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30">
            {authRole === 'manager' ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> : <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          <div className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--gold-primary)] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
            {tenant.fullName}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            {authRole === 'manager' ? 'Salon Manager Portal' : 'Stylist Chair Station'}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 font-light max-w-xs mx-auto">
            {authRole === 'manager'
              ? `Full operational access for ${tenant.name} managers & owners.`
              : `Private chair terminal. Total salon revenue & other stylists' records are strictly hidden.`}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-black/50 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setAuthRole('manager');
              setPasswordInput('');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'manager'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Salon Manager</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthRole('stylist');
              setPasswordInput('');
              setErrorMsg('');
              if (stylists.length > 0 && !selectedStylistId) {
                setSelectedStylistId(stylists[0].id);
              }
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'stylist'
                ? 'bg-[var(--gold-primary)] text-black shadow font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Stylist Chair (PIN)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Stylist Selector if Stylist Mode */}
          {authRole === 'stylist' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                Select Your Chair / Station
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {stylists.map(s => {
                  const isSelected = selectedStylistId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStylistId(s.id);
                        setErrorMsg('');
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--gold-primary)] bg-[rgba(212,175,55,0.15)] text-white'
                          : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-gray-200'
                      }`}
                    >
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-white">{s.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">PIN: {s.pin || '1001'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Password / PIN Input Display */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 text-center uppercase tracking-wider">
              {authRole === 'manager' ? 'Enter Manager Password or PIN' : 'Enter 4-Digit Stylist PIN'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={authRole === 'manager' ? 'Enter salon password or PIN' : 'Enter 4-digit PIN'}
                autoFocus
                className={`w-full bg-black/60 border rounded-xl py-3 pl-4 pr-11 text-center text-lg font-mono tracking-wider focus:outline-none shadow-inner ${
                  authRole === 'manager'
                    ? 'border-purple-500/40 text-amber-400 focus:border-purple-400'
                    : 'border-[var(--gold-primary)] text-[var(--gold-primary)] focus:border-amber-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Keypad for PIN entry with 44px min touch targets */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Quick Keypad</div>
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => handleQuickPin(num)}
                  className="h-11 sm:h-12 min-h-[44px] rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-white font-bold text-base transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-11 sm:h-12 min-h-[44px] rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs transition-all flex items-center justify-center cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleQuickPin('0')}
                className="h-11 sm:h-12 min-h-[44px] rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-white font-bold text-base transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="submit"
                className={`h-11 sm:h-12 min-h-[44px] rounded-xl font-bold text-xs transition-all shadow flex items-center justify-center cursor-pointer ${
                  authRole === 'manager'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-[var(--gold-primary)] text-black hover:bg-amber-400 font-extrabold'
                }`}
              >
                Enter
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="submit"
              className={`w-full justify-center text-xs py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                authRole === 'manager'
                  ? 'btn-primary bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-[var(--gold-primary)] text-black hover:bg-amber-400 font-extrabold'
              }`}
            >
              {authRole === 'manager' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock {tenant.name} Manager Admin</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Unlock Stylist Chair Station</span>
                </>
              )}
            </button>
            
            {authRole === 'manager' ? (
              <div className="text-[11px] text-gray-400 text-center space-y-0.5">
                <div>Default Password: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono">{expectedPassword}</code></div>
                <div className="text-[10px] text-gray-500">or PIN: <code className="bg-white/10 px-1 py-0.5 rounded text-amber-300 font-mono">{expectedPin}</code></div>
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Salon Financial Data & Other Chairs are Hidden</span>
                </div>
                <div className="text-[10px] text-gray-500">
                  Stylist PINs: {stylists.slice(0, 3).map(s => `${s.name.split(' ')[0]} (${s.pin})`).join(', ')}
                </div>
              </div>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
