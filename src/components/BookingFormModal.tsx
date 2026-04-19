import React, { useState } from 'react';
import { useServiceSelection } from '@/context/ServiceSelectionContext';
import { useNotionSubmit } from '@/hooks/useNotionSubmit';

const CALENDLY_URL = 'https://calendly.com/youki-tuliptechlabs/30min';

interface BookingFormModalProps {
  open: boolean;
  onClose: () => void;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({ open, onClose }) => {
  const { selectedServices, studioScale, setContactInfo } = useServiceSelection();
  const { submitToNotion, isSubmitting } = useNotionSubmit();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setContactInfo({ name, email, company });

    try {
      await submitToNotion({
        selectedServices,
        studioScale,
        contactName: name,
        contactEmail: email,
        contactCompany: company,
        source: 'calendly-booking',
      });
    } catch {
      // Still open Calendly even if Notion fails
    }

    const url = `${CALENDLY_URL}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&a1=${encodeURIComponent(selectedServices.join(', '))}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-md relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>

        <h2 className="font-display text-2xl font-bold text-white mb-2">Before we connect</h2>
        <p className="text-gray-400 text-sm mb-6">We'll save your details and open Calendly to book your time.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Company / Studio</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your studio name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-4 rounded-full font-display font-semibold text-lg text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(to right, #F97794, #F5A4C7, #E5B4E2)' }}
          >
            {isSubmitting ? 'Saving...' : 'Continue to Calendly →'}
          </button>

          <p className="text-center text-gray-500 text-xs">No obligation. The discovery meeting is complimentary.</p>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
