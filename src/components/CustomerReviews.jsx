import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Star, MessageSquare, CheckCircle2, Plus, X, Sparkles } from 'lucide-react';

export const CustomerReviews = () => {
  const { reviews, addReview, services, tenant } = useBooking();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const defaultServiceName = services[0]?.name || 'Specialist Treatment';
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    service: defaultServiceName,
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.comment) return;
    addReview(formData);
    setFormData({ author: '', rating: 5, service: defaultServiceName, comment: '' });
    setIsFormOpen(false);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--border-glass)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold-primary)] uppercase tracking-wider mb-2">
            <MessageSquare className="w-4 h-4" />
            Guest Testimonials
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            What Our <span className="gold-gradient-text">Guests Say</span>
          </h2>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary py-3 px-6 text-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Summary Score Card */}
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border-gold)] bg-gradient-to-r from-[#171510] via-[#1c1810] to-[#171510] flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left">
        <div className="flex items-center gap-6">
          <div className="text-5xl font-extrabold text-[var(--gold-primary)] font-serif">4.98</div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white block mt-1">Based on 500+ Salon & Spa Visits</span>
            <span className="text-xs text-gray-400">100% Verified Customer Experience</span>
          </div>
        </div>

        <div className="h-12 w-px bg-white/10 hidden md:block" />

        <div className="space-y-1 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Punctual Scheduling & No Wait Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Complimentary Artisan Beverages & Cappuccinos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Highest Sanitation & Premium Organic Products</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className="glass-panel p-6 space-y-4 hover:border-[var(--gold-primary)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">{rev.date}</span>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-200 font-light italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">{rev.author}</span>
                <span className="text-[10px] text-amber-400">{rev.service}</span>
              </div>
              {rev.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal Form */}
      {isFormOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content max-w-lg p-6 relative bg-[#12141f] border border-[var(--border-gold)] rounded-2xl">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Share Your Salon Experience
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Your feedback helps us continuously elevate our service standards.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica T."
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Service Experienced</label>
                <select
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)]"
                >
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Rating Score</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(score => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => setFormData({ ...formData, rating: score })}
                      className={`px-3 py-1.5 rounded-lg border font-bold ${
                        formData.rating === score
                          ? 'bg-[var(--gold-primary)] text-black border-[var(--gold-primary)]'
                          : 'bg-black/40 text-gray-400 border-white/10'
                      }`}
                    >
                      {score} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the atmosphere, stylist expertise, and results..."
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--gold-primary)] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-6"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
