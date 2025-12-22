-- Create body_metrics table for tracking weight, muscle mass, body fat, etc.
CREATE TABLE public.body_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  weight_kg NUMERIC(5,2),
  body_fat_percentage NUMERIC(4,2),
  muscle_mass_kg NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nutrition_profile table for user's nutrition goals and settings
CREATE TABLE public.nutrition_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  sex TEXT CHECK (sex IN ('M', 'F')),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
  goal TEXT NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain')),
  goal_rate_kg_per_week NUMERIC(3,2) DEFAULT 0.5,
  meals_per_day INTEGER DEFAULT 3 CHECK (meals_per_day BETWEEN 3 AND 5),
  diet_type TEXT CHECK (diet_type IN ('balanced', 'high_protein', 'low_carb', 'keto', 'custom')),
  protein_g_per_kg NUMERIC(3,2) DEFAULT 1.8,
  fat_g_per_kg NUMERIC(3,2) DEFAULT 1.0,
  bmr_method TEXT DEFAULT 'mifflin' CHECK (bmr_method IN ('mifflin', 'harris')),
  calculated_bmr NUMERIC(6,2),
  calculated_tdee NUMERIC(6,2),
  target_calories NUMERIC(6,2),
  target_protein_g NUMERIC(5,1),
  target_fat_g NUMERIC(5,1),
  target_carbs_g NUMERIC(5,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for body_metrics
CREATE POLICY "Users can view their own body metrics"
ON public.body_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body metrics"
ON public.body_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics"
ON public.body_metrics FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics"
ON public.body_metrics FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for nutrition_profile
CREATE POLICY "Users can view their own nutrition profile"
ON public.nutrition_profile FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition profile"
ON public.nutrition_profile FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition profile"
ON public.nutrition_profile FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition profile"
ON public.nutrition_profile FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating nutrition_profile updated_at
CREATE TRIGGER update_nutrition_profile_updated_at
BEFORE UPDATE ON public.nutrition_profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();