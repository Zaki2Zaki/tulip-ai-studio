
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  industry TEXT,
  team_size TEXT,
  lead_type TEXT NOT NULL DEFAULT 'assessment',
  selected_services TEXT[],
  assessment_results JSONB,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts to leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads of own leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);
