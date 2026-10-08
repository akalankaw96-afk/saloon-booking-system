import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { StepServices } from './StepServices';
import { StepStylists } from './StepStylists';
import { StepDateTime } from './StepDateTime';
import { StepSummary } from './StepSummary';
import { X, ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const BookingWizardModal = () => {
  const {
    isBookingOpen,
    closeBookingWizard,
    currentStep,
    setCurrentStep,
    confirmBooking,
    draftBooking
  } = useBooking();

  if (!isBookingOpen) return null;

  const steps = [
    { number: 1, title: 'Service' },
    { number: 2, title: 'Stylist' },
    { number: 3, title: 'Date & Time' },
    { number: 4, title: 'Confirm' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      confirmBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1 && !draftBooking.service) return true;
    if (currentStep === 2 && !draftBooking.stylist) return true;
    if (currentStep === 3 && (!draftBooking.date || !draftBooking.time)) return true;
    if (currentStep === 4 && (!draftBooking.customer.name || !draftBooking.customer.email || !draftBooking.customer.phone)) return true;
    return false;
  };

  return (
    <div className="modal-overlay animate-fade-in p-2 sm:p-4">
      <div className="modal-content relative flex flex-col justify-between max-h-[95vh] sm:max-h-[90vh] w-full max-w-3xl">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-glass)] flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-[var(--gold-primary)] block">
              LUXECUT Reservation
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-white">
              Appointment Booking Wizard
            </h2>
          </div>

          <button
            onClick={closeBookingWizard}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-black/40 px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-glass)]">
          <div className="flex items-center justify-between max-w-xl mx-auto relative px-2">
            
            {/* Connecting Bar Line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0" />
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--gold-primary)] z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 88}%` }}
            />

            {steps.map(step => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div key={step.number} className="relative z-10 flex flex-col items-center gap-1">
                  <div
                    onClick={() => {
                      if (step.number < currentStep) setCurrentStep(step.number);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[var(--gold-primary)] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                        : isCurrent
                        ? 'bg-amber-500 text-black ring-4 ring-amber-500/20 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[3]" /> : step.number}
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-semibold hidden xs:block ${isCurrent ? 'text-[var(--gold-primary)]' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body Step Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentStep === 1 && <StepServices />}
          {currentStep === 2 && <StepStylists />}
          {currentStep === 3 && <StepDateTime />}
          {currentStep === 4 && <StepSummary />}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-[var(--border-glass)] bg-black/60 flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`btn-secondary text-xs px-4 sm:px-5 py-2.5 sm:py-3 ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`btn-primary text-xs px-5 sm:px-7 py-2.5 sm:py-3 ${isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{currentStep === 4 ? 'Confirm Reservation' : 'Continue'}</span>
            {currentStep === 4 ? <Sparkles className="w-3.5 h-3.5 fill-black" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
