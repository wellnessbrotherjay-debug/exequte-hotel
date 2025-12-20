-- Update Schema V2: Nutrition Suite Additions

-- 1. Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  total_calories DECIMAL,
  total_protein_g DECIMAL,
  total_carbs_g DECIMAL,
  total_fat_g DECIMAL,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Recipe Ingredients Table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  calories DECIMAL,
  protein_g DECIMAL,
  carbs_g DECIMAL,
  fat_g DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Daily Journal Table
CREATE TABLE IF NOT EXISTS public.daily_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'bad', 'awful')),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  notes TEXT,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);

-- 4. Ingredients/Food Items Table (For reuse in search)
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  serving_size DECIMAL,
  serving_unit TEXT,
  calories DECIMAL NOT NULL,
  protein_g DECIMAL DEFAULT 0,
  carbs_g DECIMAL DEFAULT 0,
  fat_g DECIMAL DEFAULT 0,
  fiber_g DECIMAL DEFAULT 0,
  sugar_g DECIMAL DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_by UUID, -- NULL for system foods
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Policies

-- Recipes
DROP POLICY IF EXISTS "Users can manage own recipes" ON public.recipes;
CREATE POLICY "Users can manage own recipes" ON public.recipes
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read public recipes" ON public.recipes;
CREATE POLICY "Users can read public recipes" ON public.recipes
  FOR SELECT USING (is_public = true);

-- Recipe Ingredients
DROP POLICY IF EXISTS "Users can manage own recipe ingredients" ON public.recipe_ingredients;
CREATE POLICY "Users can manage own recipe ingredients" ON public.recipe_ingredients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE public.recipes.id = public.recipe_ingredients.recipe_id
      AND public.recipes.user_id = auth.uid()
    )
  );
  
-- Public recipe ingredients read access needed? Yes, if recipe is public.
DROP POLICY IF EXISTS "Users can read public recipe ingredients" ON public.recipe_ingredients;
CREATE POLICY "Users can read public recipe ingredients" ON public.recipe_ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE public.recipes.id = public.recipe_ingredients.recipe_id
      AND public.recipes.is_public = true
    )
  );

-- Daily Journal
DROP POLICY IF EXISTS "Users can manage own journal" ON public.daily_journal;
CREATE POLICY "Users can manage own journal" ON public.daily_journal
  FOR ALL USING (auth.uid() = user_id);

-- Food Items
DROP POLICY IF EXISTS "Anyone can read verified foods" ON public.food_items;
CREATE POLICY "Anyone can read verified foods" ON public.food_items
  FOR SELECT USING (is_verified = true OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can manage own custom foods" ON public.food_items;
CREATE POLICY "Users can manage own custom foods" ON public.food_items
  FOR ALL USING (created_by = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipes_user ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON public.daily_journal(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON public.food_items USING gin(to_tsvector('english', name));   -- Create nutrition_profile table
CREATE TABLE IF NOT EXISTS public.nutrition_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  sex TEXT CHECK (sex IN ('M', 'F')),
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
  goal TEXT NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain')),
  goal_rate_kg_per_week DECIMAL(3,2) DEFAULT 0.5,
  meals_per_day INTEGER DEFAULT 3 CHECK (meals_per_day BETWEEN 3 AND 5),
  diet_type TEXT CHECK (diet_type IN ('balanced', 'high_protein', 'low_carb', 'keto', 'custom')),
  protein_g_per_kg DECIMAL(3,2) DEFAULT 1.8,
  fat_g_per_kg DECIMAL(3,2) DEFAULT 1.0,
  bmr_method TEXT DEFAULT 'mifflin' CHECK (bmr_method IN ('mifflin', 'harris')),
  calculated_bmr DECIMAL(6,2),
  calculated_tdee DECIMAL(6,2),
  target_calories DECIMAL(6,2),
  target_protein_g DECIMAL(5,1),
  target_fat_g DECIMAL(5,1),
  target_carbs_g DECIMAL(5,1),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create body_metrics table
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create food_logs table (if not exists)
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  meal_name TEXT NOT NULL,
  calories DECIMAL NOT NULL,
  protein_g DECIMAL NOT NULL,
  carbs_g DECIMAL NOT NULL,
  fat_g DECIMAL NOT NULL,
  meal_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create food_diaries table (if not exists)
CREATE TABLE IF NOT EXISTS public.food_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  diary_date DATE NOT NULL,
  total_calories DECIMAL DEFAULT 0,
  total_protein_g DECIMAL DEFAULT 0,
  total_carbs_g DECIMAL DEFAULT 0,
  total_fat_g DECIMAL DEFAULT 0,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, diary_date)
);

-- Enable RLS
ALTER TABLE public.nutrition_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_diaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nutrition_profile
DROP POLICY IF EXISTS "Users manage own nutrition profile" ON public.nutrition_profile;
CREATE POLICY "Users manage own nutrition profile" 
ON public.nutrition_profile FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for body_metrics
DROP POLICY IF EXISTS "Users manage own body metrics" ON public.body_metrics;
CREATE POLICY "Users manage own body metrics" 
ON public.body_metrics FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for food_logs
DROP POLICY IF EXISTS "Users manage own food logs" ON public.food_logs;
CREATE POLICY "Users manage own food logs" 
ON public.food_logs FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for food_diaries
DROP POLICY IF EXISTS "Users manage own food diaries" ON public.food_diaries;
CREATE POLICY "Users manage own food diaries" 
ON public.food_diaries FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_body_metrics_user_date ON public.body_metrics(user_id, recorded_at DESC);
