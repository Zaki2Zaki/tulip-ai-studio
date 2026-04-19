import React, { useState } from 'react';
import { useServiceSelection } from '@/context/ServiceSelectionContext';
import { useNotionSubmit } from '@/hooks/useNotionSubmit';

const CALENDLY_URL = 'https://calendly.com/youki-tuliptechlabs/30min';

interface CalendlyBookingButtonProps {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-6 py-2.5 text-sm min-h-[40px]',
  md: 'px-10 py-5 text-xl min-h-[64px]',
  lg: 'px-16 py-9 text-3xl min-h-[96px]',
};

const CalendlyBookingButton: React.FC<CalendlyBookingButtonProps> = ({
  className,
  label = '📅 Book a Call',
  size = 'md',
}) => {
  const { selectedServices, studioScale, contactInfo } = useServiceSelection();
  const { submitToNotion, isSubmitting } = useNotionSubmit();
  const [loading, setLoading] = useState(false);
  const [notionStatus, setNotionStatus] = useState<'idle' | 'ok' | 'fail'>('idle');

  const handleBookCall = async () => {
    setLoading(true);
    setNotionStatus('idle');

    const payload = {
      selectedServices,
      studioScale,
      contactName: contactInfo.name || 'Website Visitor',
      contactEmail: contactInfo.email,
      contactCompany: contactInfo.company,
      source: 'calendly-booking',
    };

    // Debug: log what we're sending
    console.log('[CalendlyBookingButton] Submitting to Notion:', payload);

    try {
      await submitToNotion(payload);
      setNotionStatus('ok');
      console.log('[CalendlyBookingButton] Notion submission success');
    } catch (err) {
      setNotionStatus('fail');
      console.error('[CalendlyBookingButton] Notion submission failed:', err);
      // Still open Calendly even if Notion fails
    } finally {
      setLoading(false);
    }

    const url = `${CALENDLY_URL}?name=${encodeURIComponent(contactInfo.name)}&email=${encodeURIComponent(contactInfo.email)}&a1=${encodeURIComponent(selectedServices.join(', '))}`;
    window.open(url, '_blank');
  };

  const busy = isSubmitting || loading;

  const defaultClass = `${sizeClasses[size]} rounded-full font-display font-semibold transition-opacity hover:opacity-90 text-white disabled:opacity-60`;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleBookCall}
        disabled={busy}
        className={className ?? defaultClass}
        style={className ? undefined : {
          background: 'linear-gradient(to right, #F97794, #F5A4C7, #E5B4E2)',
        }}
      >
        {busy ? 'Processing...' : label}
      </button>

      {/* Debug status — remove once confirmed working */}
      {notionStatus === 'ok' && (
        <p className="text-green-400 text-xs">✓ Saved to Notion</p>
      )}
      {notionStatus === 'fail' && (
        <p className="text-red-400 text-xs">⚠ Notion save failed — check console</p>
      )}
    </div>
  );
};

export default CalendlyBookingButton;
