import React, { useState } from 'react';
import { useServiceSelection } from '@/context/ServiceSelectionContext';
import { useNotionSubmit } from '@/hooks/useNotionSubmit';

const CALENDLY_URL = 'https://calendly.com/youki-harada/30min';

interface CalendlyBookingButtonProps {
  /** Override all Tailwind classes (default gradient style is applied when omitted) */
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

  const handleBookCall = async () => {
    setLoading(true);

    try {
      await submitToNotion({
        selectedServices,
        studioScale,
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        contactCompany: contactInfo.company,
        source: 'calendly-booking',
      });
    } catch {
      // Still open Calendly even if Notion submission fails
    } finally {
      setLoading(false);
    }

    const params = new URLSearchParams();
    if (contactInfo.name) params.set('name', contactInfo.name);
    if (contactInfo.email) params.set('email', contactInfo.email);
    if (selectedServices.length) params.set('a1', selectedServices.join(', '));
    if (studioScale) params.set('a2', studioScale);

    const url = params.toString() ? `${CALENDLY_URL}?${params.toString()}` : CALENDLY_URL;
    window.open(url, '_blank');
  };

  const busy = isSubmitting || loading;

  const defaultClass = `${sizeClasses[size]} rounded-full font-display font-semibold transition-opacity hover:opacity-90 text-white disabled:opacity-60`;

  return (
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
  );
};

export default CalendlyBookingButton;
