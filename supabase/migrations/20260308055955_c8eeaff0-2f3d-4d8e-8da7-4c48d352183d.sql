-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections" ON public.collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own collections" ON public.collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own collections" ON public.collections FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Saved papers table
CREATE TABLE public.saved_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  paper_id TEXT NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[],
  year INTEGER,
  url TEXT,
  source TEXT,
  citation_count INTEGER,
  venue TEXT,
  ai_label TEXT,
  ai_flag TEXT,
  vote TEXT CHECK (vote IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, paper_id)
);

ALTER TABLE public.saved_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved papers" ON public.saved_papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save papers" ON public.saved_papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their saved papers" ON public.saved_papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved papers" ON public.saved_papers FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_saved_papers_collection ON public.saved_papers(collection_id);
CREATE INDEX idx_saved_papers_user ON public.saved_papers(user_id);