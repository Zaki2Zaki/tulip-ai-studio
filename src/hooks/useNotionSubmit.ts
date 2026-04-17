import { useState } from 'react';

interface QuoteSubmission {
  selectedServices: string[];
  studioScale: string;
  contactName: string;
  contactEmail: string;
  contactCompany: string;
  source: string;
}

export const useNotionSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitToNotion = async (data: QuoteSubmission): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/notion/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitToNotion, isSubmitting, error };
};
