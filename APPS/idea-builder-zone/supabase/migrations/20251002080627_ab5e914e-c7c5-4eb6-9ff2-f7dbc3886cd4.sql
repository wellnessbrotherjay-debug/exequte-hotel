-- Create exercise library table with video support
CREATE TABLE public.exercise_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  muscle_groups TEXT[],
  equipment_needed TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  default_sets INTEGER,
  default_reps TEXT,
  default_duration_seconds INTEGER,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

-- Public read access for exercise library
CREATE POLICY "Exercise library is viewable by everyone"
ON public.exercise_library FOR SELECT
USING (true);

-- Only authenticated users can insert/update exercises
CREATE POLICY "Authenticated users can insert exercises"
ON public.exercise_library FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update exercises"
ON public.exercise_library FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Add exercise_library_id to exercise_logs
ALTER TABLE public.exercise_logs 
ADD COLUMN exercise_library_id UUID REFERENCES public.exercise_library(id);

-- Add trigger for updated_at
CREATE TRIGGER update_exercise_library_updated_at
  BEFORE UPDATE ON public.exercise_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();