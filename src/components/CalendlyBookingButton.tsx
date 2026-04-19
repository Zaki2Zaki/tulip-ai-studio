import React, { useState } from 'react';
import BookingFormModal from './BookingFormModal';

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
  const [modalOpen, setModalOpen] = useState(false);

  const defaultClass = `${sizeClasses[size]} rounded-full font-display font-semibold transition-opacity hover:opacity-90 text-white`;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={className ?? defaultClass}
        style={className ? undefined : {
          background: 'linear-gradient(to right, #F97794, #F5A4C7, #E5B4E2)',
        }}
      >
        {label}
      </button>

      <BookingFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CalendlyBookingButton;
