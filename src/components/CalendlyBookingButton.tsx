import React, { useState } from 'react';
import { useServiceSelection } from '@/context/ServiceSelectionContext';
import { useNotionSubmit } from '@/hooks/useNotionSubmit';

const CALENDLY_URL = 'https://calendly.com/youki-harada/30min';

interface CalendlyBookingButtonProps {
  className?: string;
  label?: string;
}

const CalendlyBookingButton: React.FC<CalendlyBookingButtonProps> = ({
  className = '',
  label = '📅 Book a Call',
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

  return (
    <button
      onClick={handleBookCall}
      disabled={busy}
      className={className}
    >
      {busy ? 'Processing...' : label}
    </button>
  );
};

export default CalendlyBookingButton;
