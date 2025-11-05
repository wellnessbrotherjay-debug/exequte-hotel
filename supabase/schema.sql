-- Hotel Room Workout System Database Schema
-- Complete schema for hotel fitness ecosystem with nutrition integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROOMS & SESSIONS
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL,
  name text NOT NULL,
  qr_slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid, -- nullable guest
  status text CHECK (status IN ('idle','testing','ready','running','paused','done')) DEFAULT 'idle',
  template_slug text,
  current_block int DEFAULT 0,
  current_exercise int DEFAULT 0,
  adaptations jsonb DEFAULT '{}',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- USER PROFILE & TESTING
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  display_name text,
  dob date,
  sex text CHECK (sex IN ('male','female','other')),
  height_cm numeric,
  weight_kg numeric,
  body_fat_pct numeric,
  activity_factor numeric DEFAULT 1.4,  -- sedentary 1.2 → athlete 1.9
  goal text CHECK (goal IN ('maintain','lose','gain')) DEFAULT 'maintain',
  meals_per_day int DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE fitness_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE,
  age int NOT NULL,
  height_cm numeric NOT NULL,
  weight_kg numeric NOT NULL,
  body_fat_pct numeric,
  level_self text CHECK (level_self IN ('beginner','intermediate','advanced')),
  -- performance inputs
  max_pushups int,           -- in 1 set
  squats_60s int,            -- count in 60 sec
  plank_hold_sec int,
  step_test_hr int,          -- 1-min recovery HR
  computed_level numeric,    -- 0..100
  mapped_band text CHECK (mapped_band IN ('easy','medium','hard')),
  created_at timestamptz DEFAULT now()
);

-- WORKOUT LIBRARY
CREATE TABLE workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,       -- 'bodyweight','functional','legs','hip','pilates','yoga','stretch','core','cardio','fullbody'
  level text CHECK (level IN ('easy','medium','hard')) NOT NULL,
  duration_min int NOT NULL,    -- default suggestion
  blocks jsonb NOT NULL,        -- array of blocks with exercises, work/rest, progression rules
  video_pack text,              -- CDN key for assets
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- EXERCISES
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  cues text,
  demo_url text,       -- mp4/webm
  type text CHECK (type IN ('strength','mobility','yoga','pilates','conditioning')) NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- EQUIPMENT
CREATE TABLE equipment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  display_name text NOT NULL,
  category_id uuid REFERENCES equipment_categories(id) ON DELETE SET NULL,
  brand text,
  model text,
  level text CHECK (level IN ('bodyweight','entry','standard','premium')) DEFAULT 'entry',
  footprint text,
  weight_capacity numeric,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE exercise_equipment (
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  usage text CHECK (usage IN ('required','optional','variation')) DEFAULT 'required',
  notes text,
  PRIMARY KEY (exercise_id, equipment_id)
);

CREATE TABLE room_equipment (
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE,
  quantity int CHECK (quantity >= 0) DEFAULT 1,
  notes text,
  PRIMARY KEY (room_id, equipment_id)
);

-- SESSION RUN DATA
CREATE TABLE session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES workout_sessions(id) ON DELETE CASCADE,
  ts timestamptz DEFAULT now(),
  event text NOT NULL,          -- 'start','pause','resume','skip','harder','easier','complete_block','rep_log'
  payload jsonb DEFAULT '{}'
);

CREATE TABLE workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES workout_sessions(id) ON DELETE SET NULL,
  template_slug text,
  duration_sec int,
  total_reps int,
  rpe int CHECK (rpe >= 1 AND rpe <= 10),             -- 1..10
  notes text,
  metrics jsonb DEFAULT '{}',       -- e.g. per-exercise reps/time/heart rate if available
  created_at timestamptz DEFAULT now()
);

-- MEALS / MENU / ORDERS
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,         -- 'breakfast','pre','post','lunch','dinner','snack'
  name text NOT NULL,
  base_kcal int NOT NULL,
  protein_g numeric NOT NULL,
  carbs_g numeric NOT NULL,
  fat_g numeric NOT NULL,
  price_cents int NOT NULL,
  options jsonb DEFAULT '{}',          -- e.g. size multipliers, swaps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE meal_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  session_id uuid REFERENCES workout_sessions(id) ON DELETE SET NULL,
  status text CHECK (status IN ('queued','in_kitchen','ready','delivered','cancelled')) DEFAULT 'queued',
  total_cents int DEFAULT 0,
  macros jsonb DEFAULT '{}',          -- target/day & per-meal allocations
  items jsonb DEFAULT '[]',           -- [{menu_item_id, qty, size, kcal, p,c,f, line_cents}]
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- INDEXES for performance
CREATE INDEX idx_rooms_qr_slug ON rooms(qr_slug);
CREATE INDEX idx_workout_sessions_room_id ON workout_sessions(room_id);
CREATE INDEX idx_workout_sessions_status ON workout_sessions(status);
CREATE INDEX idx_session_events_session_id ON session_events(session_id);
CREATE INDEX idx_session_events_ts ON session_events(ts);
CREATE INDEX idx_meal_orders_status ON meal_orders(status);
CREATE INDEX idx_meal_orders_created_at ON meal_orders(created_at);
CREATE INDEX idx_workout_templates_level ON workout_templates(level);
CREATE INDEX idx_workout_templates_category ON workout_templates(category);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_exercise_equipment_equipment ON exercise_equipment(equipment_id);
CREATE INDEX idx_room_equipment_room ON room_equipment(room_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);

-- Realtime channels (Supabase Realtime listens on these tables)
ALTER TABLE session_events REPLICA IDENTITY FULL;
ALTER TABLE meal_orders REPLICA IDENTITY FULL;
ALTER TABLE workout_sessions REPLICA IDENTITY FULL;

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_timestamp_rooms BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workout_sessions BEFORE UPDATE ON workout_sessions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_user_profiles BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workout_templates BEFORE UPDATE ON workout_templates FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_exercises BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_equipment_categories BEFORE UPDATE ON equipment_categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_equipment BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_menu_items BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_meal_orders BEFORE UPDATE ON meal_orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Sample data for development

-- Insert demo hotel rooms
INSERT INTO rooms (hotel_id, name, qr_slug) VALUES
  (gen_random_uuid(), 'Executive Suite 1201', 'room-1201'),
  (gen_random_uuid(), 'Deluxe Room 805', 'room-805'),
  (gen_random_uuid(), 'Presidential Suite 1501', 'room-1501'),
  (gen_random_uuid(), 'Standard Room 304', 'room-304'),
  (gen_random_uuid(), 'Family Suite 912', 'room-912');

-- Insert sample exercises
INSERT INTO exercises (slug, name, cues, demo_url, type, tags) VALUES
  ('air_squat', 'Air Squat', 'Feet hip-width, knees track toes, full hip extension', '/videos/public/air-squat.mp4', 'strength', ARRAY['legs', 'glutes', 'bodyweight']),
  ('pushup', 'Push-up', 'Hands under shoulders, straight line head to heels, elbows 45°', '/videos/public/pushup.mp4', 'strength', ARRAY['chest', 'triceps', 'core']),
  ('plank', 'Plank', 'Forearms down, straight line, breathe normally', '/videos/public/plank.mp4', 'strength', ARRAY['core', 'stability']),
  ('glute_bridge', 'Glute Bridge', 'Drive through heels, squeeze glutes at top', '/videos/public/glute-bridge.mp4', 'strength', ARRAY['glutes', 'hamstrings']),
  ('mountain_climber', 'Mountain Climber', 'Plank position, alternate knee drives', '/videos/public/mountain-climber.mp4', 'conditioning', ARRAY['cardio', 'core']),
  ('reverse_lunge', 'Reverse Lunge', 'Step back, 90° angles, drive through front heel', '/videos/public/reverse-lunge.mp4', 'strength', ARRAY['legs', 'glutes']),
  ('superman', 'Superman', 'Lie prone, lift chest and legs, hold', '/videos/public/superman.mp4', 'strength', ARRAY['back', 'glutes']),
  ('side_plank', 'Side Plank', 'Straight line, stack shoulders, breathe', '/videos/public/side-plank.mp4', 'strength', ARRAY['core', 'obliques']),
  ('deadbug', 'Dead Bug', 'Back flat, opposite arm/leg, control', '/videos/public/deadbug.mp4', 'mobility', ARRAY['core', 'stability']),
  ('bird_dog', 'Bird Dog', 'Opposite arm/leg reach, hold balance', '/videos/public/bird-dog.mp4', 'mobility', ARRAY['core', 'back']);

-- Insert sample menu items
INSERT INTO menu_items (category, name, base_kcal, protein_g, carbs_g, fat_g, price_cents, options) VALUES
  ('breakfast', 'Ham & Eggs + Toast', 520, 32, 36, 26, 6500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('breakfast', 'Greek Yogurt + Oats + Berries', 450, 28, 55, 12, 6000, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('breakfast', 'Egg-White Omelette + Veg + Feta', 390, 35, 20, 18, 6200, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('post', 'Whey Smoothie (banana + oats)', 420, 32, 55, 8, 5500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('post', 'Chicken Rice Bowl', 600, 38, 70, 16, 7500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('lunch', 'Grilled Chicken, Rice, Greens', 620, 42, 70, 14, 7800, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('lunch', 'Salmon, Potato, Broccoli', 650, 38, 50, 26, 9500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('lunch', 'Tofu Stir-Fry, Rice', 580, 30, 75, 16, 7000, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('dinner', 'Grilled Steak + Sweet Potato', 720, 45, 55, 22, 11500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('dinner', 'Fish Tacos (3) + Black Beans', 580, 35, 65, 18, 8500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('snack', 'Protein Bar + Apple', 280, 20, 35, 8, 3500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}'),
  ('snack', 'Mixed Nuts (30g)', 180, 6, 6, 16, 2800, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}');

-- Create RLS policies (Row Level Security)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_orders ENABLE ROW LEVEL SECURITY;

-- Public read access for templates and exercises
CREATE POLICY "Public read workout_templates" ON workout_templates FOR SELECT USING (true);
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);

-- Session-based access for workout data
CREATE POLICY "Session access workout_sessions" ON workout_sessions FOR ALL USING (true);
CREATE POLICY "Session access session_events" ON session_events FOR ALL USING (true);
CREATE POLICY "Session access fitness_tests" ON fitness_tests FOR ALL USING (true);
CREATE POLICY "Session access workout_logs" ON workout_logs FOR ALL USING (true);
CREATE POLICY "Session access user_profiles" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Session access meal_orders" ON meal_orders FOR ALL USING (true);
-- Insert sample equipment categories
INSERT INTO equipment_categories (slug, label, description, sort_order) VALUES
  ('bodyweight', 'Bodyweight', 'Movements that require no or minimal equipment', 10),
  ('band', 'Resistance Bands', 'Elastic resistance tools', 20),
  ('strength', 'Strength Equipment', 'Weighted implements for resistance training', 30),
  ('cardio', 'Cardio', 'Cardiovascular training equipment', 40)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample equipment
INSERT INTO equipment (slug, display_name, category_id, brand, model, level, metadata)
SELECT 'yoga_mat', 'Yoga / Exercise Mat', c.id, 'Generic', NULL, 'bodyweight', '{}'::jsonb
FROM equipment_categories c
WHERE c.slug = 'bodyweight'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (slug, display_name, category_id, brand, model, level, metadata)
SELECT 'resistance_band_light', 'Resistance Band - Light', c.id, 'Generic', 'Light', 'entry', jsonb_build_object('tension_lbs', 20)
FROM equipment_categories c
WHERE c.slug = 'band'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO equipment (slug, display_name, category_id, brand, model, level, metadata)
SELECT 'adjustable_dumbbell_pair', 'Adjustable Dumbbell Pair (5-50lb)', c.id, 'Generic', 'Selectorized Pair', 'standard', jsonb_build_object('min_weight_lb', 5, 'max_weight_lb', 50)
FROM equipment_categories c
WHERE c.slug = 'strength'
ON CONFLICT (slug) DO NOTHING;

-- Map exercises to equipment
INSERT INTO exercise_equipment (exercise_id, equipment_id, usage)
SELECT e.id, eq.id, 'optional'
FROM exercises e
JOIN equipment eq ON eq.slug = 'yoga_mat'
WHERE e.slug IN ('air_squat', 'plank', 'side_plank')
ON CONFLICT DO NOTHING;

INSERT INTO exercise_equipment (exercise_id, equipment_id, usage)
SELECT e.id, eq.id, 'required'
FROM exercises e
JOIN equipment eq ON eq.slug = 'resistance_band_light'
WHERE e.slug IN ('glute_bridge', 'reverse_lunge')
ON CONFLICT DO NOTHING;

INSERT INTO exercise_equipment (exercise_id, equipment_id, usage)
SELECT e.id, eq.id, 'variation'
FROM exercises e
JOIN equipment eq ON eq.slug = 'adjustable_dumbbell_pair'
WHERE e.slug IN ('air_squat', 'reverse_lunge')
ON CONFLICT DO NOTHING;
