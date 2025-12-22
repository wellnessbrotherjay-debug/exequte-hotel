-- Create mindset_entries table for tracking mental training
CREATE TABLE IF NOT EXISTS public.mindset_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state_of_mind text,
  completed_exercises text[],
  journal_entry jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mindset_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mindset entries"
ON public.mindset_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mindset entries"
ON public.mindset_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mindset entries"
ON public.mindset_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mindset entries"
ON public.mindset_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_mindset_entries_user_id ON public.mindset_entries(user_id);
CREATE INDEX idx_mindset_entries_created_at ON public.mindset_entries(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_mindset_entries_updated_at
BEFORE UPDATE ON public.mindset_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();