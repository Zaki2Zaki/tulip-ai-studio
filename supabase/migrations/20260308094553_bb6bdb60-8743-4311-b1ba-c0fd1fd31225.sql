
CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  sources text[] NOT NULL DEFAULT '{}',
  result_counts jsonb NOT NULL DEFAULT '{}',
  total_results integer NOT NULL DEFAULT 0,
  pdf_count integer NOT NULL DEFAULT 0,
  error text,
  is_scheduled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No RLS needed - this is a system log table written by edge functions
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Allow anon/authenticated to read logs for dashboard stats
CREATE POLICY "Anyone can read search logs" ON public.search_logs
  FOR SELECT TO anon, authenticated USING (true);

-- Create index for dashboard queries
CREATE INDEX idx_search_logs_created_at ON public.search_logs (created_at DESC);
CREATE INDEX idx_search_logs_is_scheduled ON public.search_logs (is_scheduled);
