import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceSelectionContextType {
  selectedServices: string[];
  studioScale: string;
  contactInfo: {
    name: string;
    email: string;
    company: string;
  };
  addService: (service: string) => void;
  removeService: (service: string) => void;
  setStudioScale: (scale: string) => void;
  setContactInfo: (info: Partial<ServiceSelectionContextType['contactInfo']>) => void;
  clearSelections: () => void;
}

const ServiceSelectionContext = createContext<ServiceSelectionContextType | undefined>(undefined);

export const ServiceSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [studioScale, setStudioScaleState] = useState<string>('');
  const [contactInfo, setContactInfoState] = useState({
    name: '',
    email: '',
    company: ''
  });

  const addService = (service: string) => {
    setSelectedServices(prev => [...new Set([...prev, service])]);
  };

  const removeService = (service: string) => {
    setSelectedServices(prev => prev.filter(s => s !== service));
  };

  const setStudioScale = (scale: string) => {
    setStudioScaleState(scale);
  };

  const setContactInfo = (info: Partial<typeof contactInfo>) => {
    setContactInfoState(prev => ({ ...prev, ...info }));
  };

  const clearSelections = () => {
    setSelectedServices([]);
    setStudioScaleState('');
    setContactInfoState({ name: '', email: '', company: '' });
  };

  return (
    <ServiceSelectionContext.Provider
      value={{
        selectedServices,
        studioScale,
        contactInfo,
        addService,
        removeService,
        setStudioScale,
        setContactInfo,
        clearSelections
      }}
    >
      {children}
    </ServiceSelectionContext.Provider>
  );
};

export const useServiceSelection = () => {
  const context = useContext(ServiceSelectionContext);
  if (!context) {
    throw new Error('useServiceSelection must be used within ServiceSelectionProvider');
  }
  return context;
};
