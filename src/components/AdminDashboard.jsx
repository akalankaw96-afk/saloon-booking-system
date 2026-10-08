import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { SERVICES } from '../data/mockData';
import { ShieldCheck, DollarSign, Calendar, Users, Clock, Search, Filter, CheckCircle, XCircle, AlertCircle, RefreshCw, Download, Plus, X, Edit3, UserCheck, UserX, Scissors, Lock, LogOut, Key } from 'lucide-react';

export const AdminDashboard = () => {
  const { bookings, stylists, updateBookingStatus, addService, addStylist, updateStylist, toggleStylistDuty, showToast, isAdminAuthenticated, logoutAdmin, loginAdmin, setActiveTab } = useBooking();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminTab, setAdminTab] = useState('appointments'); // 'appointments' | 'stylists'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Add Service Modal state
  const [isAddSrvOpen, setIsAddSrvOpen] = useState(false);
  const [newSrvForm, setNewSrvForm] = useState({
    name: '', category: 'haircut', price: '', duration: '45', badge: 'Premium', description: ''
  });

  // Add Stylist Modal state
  const [isAddStylistOpen, setIsAddStylistOpen] = useState(false);
  const [newStylistForm, setNewStylistForm] = useState({
    name: '', role: 'Master Stylist', experience: '5+ Years Exp.', bio: '', image: '',
    shiftStart: '09:00 AM', shiftEnd: '06:00 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  });

  // Edit Stylist Modal state
  const [editingStylist, setEditingStylist] = useState(null);

  // Calculated Metrics
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const todaysBookings = bookings.filter(b => b.date === selectedDate);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const activeStylistsCount = stylists.filter(s => s.status !== 'on-leave').length;

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      showToast('No Data', 'No bookings available to export.', 'info');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Stylist', 'Date', 'Time', 'Total Price (LKR)', 'Status'];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      `"${b.serviceName}"`,
      `"${b.stylistName}"`,
      b.date,
      b.time,
      `"Rs. ${b.totalPrice}"`,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LuxeCut_Schedule_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported!', 'Appointments exported to CSV file.', 'success');
  };

  const handleAddServiceSubmit = (e) => {
    e.preventDefault();
    if (!newSrvForm.name || !newSrvForm.price) return;
    addService(newSrvForm);
    setNewSrvForm({ name: '', category: 'haircut', price: '', duration: '45', badge: 'Premium', description: '' });
    setIsAddSrvOpen(false);
  };

  const handleAddStylistSubmit = (e) => {
    e.preventDefault();
    if (!newStylistForm.name) return;
    addStylist(newStylistForm);
    setNewStylistForm({
      name: '', role: 'Master Stylist', experience: '5+ Years Exp.', bio: '', image: '',
      shiftStart: '09:00 AM', shiftEnd: '06:00 PM', breakStart: '01:00 PM', breakEnd: '02:00 PM',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });
    setIsAddStylistOpen(false);
  };

  const handleEditStylistSubmit = (e) => {
    e.preventDefault();
    if (!editingStylist) return;
    updateStylist(editingStylist.id, editingStylist);
    setEditingStylist(null);
  };

  const toggleDaySelection = (day, formState, setFormState) => {
    const days = formState.availableDays || [];
    const updated = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    setFormState({ ...formState, availableDays: updated });
  };

  if (!isAdminAuthenticated) {
    return (
      <section className="py-16 px-4 max-w-md mx-auto animate-fade-in text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-xl shadow-purple-950/40">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Manager Access Portal</h2>
          <p className="text-xs text-gray-400 font-light">
            Salon operational metrics, bookings, and team timetables are protected. Please enter your Manager Security PIN.
          </p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const ok = loginAdmin(pinInput);
          if (!ok) setPinError('Invalid Manager PIN code. Default demo PIN is 1234.');
        }} className="glass-panel p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Enter 4-Digit Security PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={e => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              placeholder="• • • •"
              className="w-full bg-black/70 border border-purple-500/40 rounded-xl py-3 px-4 text-center text-2xl font-mono text-amber-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {pinError && (
            <p className="text-xs text-red-400 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
              {pinError}
            </p>
          )}

          <button type="submit" className="btn-primary w-full justify-center text-xs py-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate as Manager</span>
          </button>

          <p className="text-[11px] text-gray-500">
            Demo PIN: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono">1234</code>
          </p>
        </form>

        <button
          onClick={() => setActiveTab('services')}
          className="text-xs text-gray-400 hover:text-white transition-colors underline"
        >
          ← Return to Salon Services
        </button>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            Salon Operations & Management
          </div>
          <h2 className="text-3xl font-serif font-bold text-white">
            Manager <span className="gold-gradient-text">Admin Dashboard</span>
          </h2>
        </div>

        {/* Tab Buttons & Date Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[rgba(255,255,255,0.03)] p-1 rounded-xl border border-[var(--border-glass)]">
            <button
              onClick={() => setAdminTab('appointments')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                adminTab === 'appointments'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Master Schedule
            </button>
            <button
              onClick={() => setAdminTab('stylists')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                adminTab === 'stylists'
                  ? 'bg-[var(--gold-primary)] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Team & Timetables ({stylists.length})
            </button>
          </div>

          {adminTab === 'appointments' ? (
            <button
              onClick={exportToCSV}
              className="btn-secondary py-2 px-3 text-xs"
            >
              <Download className="w-4 h-4 text-[var(--gold-primary)]" />
              <span>Export CSV</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddStylistOpen(true)}
              className="btn-primary py-2 px-4 text-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Stylist</span>
            </button>
          )}

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-black/60 border border-[var(--border-gold)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />

          <button
            onClick={logoutAdmin}
            className="px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:bg-red-500/20 hover:border-red-500/40 text-purple-300 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Lock & Logout Manager Session"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 border-l-4 border-l-[var(--gold-primary)] space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Revenue (LKR)</span>
            <span className="text-xs font-bold text-[var(--gold-primary)]">LKR</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">Rs. {totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <span>+18% vs last week</span>
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Bookings ({selectedDate})</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{todaysBookings.length}</div>
          <p className="text-xs text-gray-400 font-light">
            Scheduled for selected date
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-purple-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
            <AlertCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingCount}</div>
          <p className="text-xs text-purple-300 font-semibold">
            Requires manager approval
          </p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active On Duty</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{activeStylistsCount} / {stylists.length}</div>
          <p className="text-xs text-emerald-400 font-semibold">
            Staff available for booking
          </p>
        </div>

      </div>

      {/* VIEW TAB 1: MASTER SCHEDULE & APPOINTMENTS TABLE */}
      {adminTab === 'appointments' && (
        <div className="glass-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--gold-primary)]" />
              <span>Staff Timetable Overview — {selectedDate}</span>
            </h3>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddSrvOpen(true)}
                className="btn-outline-gold text-xs py-2 px-3"
              >
                + Add Service
              </button>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest or booking ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[var(--gold-primary)] w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider bg-black/40">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Info</th>
                  <th className="py-3 px-4">Treatment</th>
                  <th className="py-3 px-4">Specialist</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount (LKR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-200">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {b.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400">{b.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.serviceName}</div>
                      {b.addOns && b.addOns.length > 0 && (
                        <div className="text-[10px] text-gray-400">{b.addOns.join(', ')}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-medium text-amber-300">
                      {b.stylistName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{b.time}</div>
                      <div className="text-[10px] text-gray-400">{b.date}</div>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-[var(--gold-primary)]">
                      Rs. {b.totalPrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={e => updateBookingStatus(b.id, e.target.value)}
                        className={`bg-black/60 border rounded-lg px-2.5 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                          b.status === 'confirmed'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : b.status === 'pending'
                            ? 'text-amber-400 border-amber-500/40'
                            : b.status === 'completed'
                            ? 'text-purple-400 border-purple-500/40'
                            : 'text-red-400 border-red-500/40'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const next = b.status === 'confirmed' ? 'completed' : 'confirmed';
                          updateBookingStatus(b.id, next);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] border border-amber-500/30 transition-colors"
                      >
                        Advance Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB 2: STYLIST TEAM & TIMETABLES MANAGER */}
      {adminTab === 'stylists' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gold-primary)]" />
                <span>Stylist Team Roster & Shift Timetables</span>
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Manage working hours, lunch breaks, off-duty days, and team profiles.
              </p>
            </div>

            <button
              onClick={() => setIsAddStylistOpen(true)}
              className="btn-primary text-xs py-2.5 px-4"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Stylist</span>
            </button>
          </div>

          {/* Stylists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stylists.map(s => (
              <div
                key={s.id}
                className="glass-panel p-6 space-y-4 hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between relative"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={s.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={s.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--gold-primary)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-bold text-white truncate">{s.name}</h4>
                      
                      {/* Duty Toggle Button */}
                      <button
                        onClick={() => toggleStylistDuty(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                          s.status !== 'on-leave'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                        }`}
                      >
                        {s.status !== 'on-leave' ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>On Duty</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>On Leave</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-xs text-[var(--gold-primary)] font-semibold block mt-0.5">
                      {s.role}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{s.experience}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-light line-clamp-2">
                  {s.bio}
                </p>

                {/* Shift Details Box */}
                <div className="bg-black/40 p-4 rounded-xl space-y-2 text-xs border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Shift Hours:
                    </span>
                    <span className="font-bold text-white">{s.shiftStart} - {s.shiftEnd}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" /> Break Time:
                    </span>
                    <span className="font-semibold text-amber-300">{s.breakStart} - {s.breakEnd}</span>
                  </div>

                  <div className="flex justify-between items-start pt-1 border-t border-white/5">
                    <span className="text-gray-400">Working Days:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                      {(s.availableDays || []).map(day => (
                        <span key={day} className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setEditingStylist(s)}
                    className="btn-outline-gold text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Schedule</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD STYLIST MODAL */}
      {isAddStylistOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setIsAddStylistOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Add New Team Member & Shift Schedule
            </h3>

            <form onSubmit={handleAddStylistSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanath Jayasinghe"
                  value={newStylistForm.name}
                  onChange={e => setNewStylistForm({ ...newStylistForm, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Colorist"
                    value={newStylistForm.role}
                    onChange={e => setNewStylistForm({ ...newStylistForm, role: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Years Exp."
                    value={newStylistForm.experience}
                    onChange={e => setNewStylistForm({ ...newStylistForm, experience: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={newStylistForm.shiftStart}
                    onChange={e => setNewStylistForm({ ...newStylistForm, shiftStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift End Time</label>
                  <input
                    type="text"
                    placeholder="06:00 PM"
                    value={newStylistForm.shiftEnd}
                    onChange={e => setNewStylistForm({ ...newStylistForm, shiftEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Lunch Break Start</label>
                  <input
                    type="text"
                    placeholder="01:00 PM"
                    value={newStylistForm.breakStart}
                    onChange={e => setNewStylistForm({ ...newStylistForm, breakStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Lunch Break End</label>
                  <input
                    type="text"
                    placeholder="02:00 PM"
                    value={newStylistForm.breakEnd}
                    onChange={e => setNewStylistForm({ ...newStylistForm, breakEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Working Days</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = (newStylistForm.availableDays || []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(day, newStylistForm, setNewStylistForm)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-[var(--gold-primary)] text-black'
                            : 'bg-black/50 border border-white/10 text-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Styling expertise & background philosophy..."
                  value={newStylistForm.bio}
                  onChange={e => setNewStylistForm({ ...newStylistForm, bio: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStylistOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STYLIST MODAL */}
      {editingStylist && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setEditingStylist(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Edit {editingStylist.name}'s Profile & Shift Schedule
            </h3>

            <form onSubmit={handleEditStylistSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStylist.name}
                  onChange={e => setEditingStylist({ ...editingStylist, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Role</label>
                  <input
                    type="text"
                    value={editingStylist.role}
                    onChange={e => setEditingStylist({ ...editingStylist, role: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duty Status</label>
                  <select
                    value={editingStylist.status || 'active'}
                    onChange={e => setEditingStylist({ ...editingStylist, status: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="active">Active / On Duty</option>
                    <option value="on-leave">On Leave / Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift Start</label>
                  <input
                    type="text"
                    value={editingStylist.shiftStart || '09:00 AM'}
                    onChange={e => setEditingStylist({ ...editingStylist, shiftStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Shift End</label>
                  <input
                    type="text"
                    value={editingStylist.shiftEnd || '06:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, shiftEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Break Start</label>
                  <input
                    type="text"
                    value={editingStylist.breakStart || '01:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, breakStart: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Break End</label>
                  <input
                    type="text"
                    value={editingStylist.breakEnd || '02:00 PM'}
                    onChange={e => setEditingStylist({ ...editingStylist, breakEnd: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Working Days</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const active = (editingStylist.availableDays || []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDaySelection(day, editingStylist, setEditingStylist)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-[var(--gold-primary)] text-black'
                            : 'bg-black/50 border border-white/10 text-gray-400'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editingStylist.bio}
                  onChange={e => setEditingStylist({ ...editingStylist, bio: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStylist(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {isAddSrvOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 bg-[#12141f] border border-[var(--border-gold)] rounded-2xl relative space-y-4">
            <button
              onClick={() => setIsAddSrvOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white">
              Add New Service to Catalog
            </h3>

            <form onSubmit={handleAddServiceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Keratin Gloss Treatment"
                  value={newSrvForm.name}
                  onChange={e => setNewSrvForm({ ...newSrvForm, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category</label>
                  <select
                    value={newSrvForm.category}
                    onChange={e => setNewSrvForm({ ...newSrvForm, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="haircut">Haircuts & Styling</option>
                    <option value="coloring">Color & Highlights</option>
                    <option value="grooming">Barber Grooming</option>
                    <option value="skincare">Facials & Skincare</option>
                    <option value="spa">Scalp & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Price (LKR Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={newSrvForm.price}
                    onChange={e => setNewSrvForm({ ...newSrvForm, price: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newSrvForm.duration}
                    onChange={e => setNewSrvForm({ ...newSrvForm, duration: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newSrvForm.badge}
                    onChange={e => setNewSrvForm({ ...newSrvForm, badge: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed treatment description..."
                  value={newSrvForm.description}
                  onChange={e => setNewSrvForm({ ...newSrvForm, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSrvOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Save Service
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

// Helper component for Coffee icon
const Coffee = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
    <line x1="6" x2="6" y1="2" y2="4"/>
    <line x1="10" x2="10" y1="2" y2="4"/>
    <line x1="14" x2="14" y1="2" y2="4"/>
  </svg>
);
