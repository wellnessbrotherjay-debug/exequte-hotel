-- CLEANUP SCRIPT
-- Drops all tables to ensure a clean slate for the Master Migration
-- USE WITH CAUTION: This deletes all data in these tables.

DROP TABLE IF EXISTS 
  -- HRM System
  hrm_class_recaps, hrm_user_class_recaps, hrm_session_results, hrm_session_participants, 
  hrm_session_participants, hrm_class_sessions, hrm_assignments, hrm_bookings,
  -- Booking System
  class_bookings, class_schedules, studio_classes, coaches,
  -- Core System
  kitchen_queue, brand_settings, hotel_services, facilities, venues, meal_orders, 
  menu_items, recipes, workout_logs, session_events, room_equipment, exercise_equipment, 
  equipment, equipment_categories, exercises, workout_templates, fitness_tests, 
  user_profiles, workout_sessions, workouts, rooms
CASCADE;
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
  location text, -- generic location like 'Gym Floor' or 'Studio A'
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

-- Recipe library powers kitchen + macro adjustments
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  description text,
  instructions text,
  ingredients jsonb NOT NULL DEFAULT '[]',   -- [{name, amount, unit}]
  base_macros jsonb NOT NULL DEFAULT '{}',   -- {kcal, protein_g, carbs_g, fat_g}
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,         -- 'breakfast','pre','post','lunch','dinner','snack'
  name text NOT NULL,
  description text,
  image_url text,
  base_kcal int NOT NULL,
  protein_g numeric NOT NULL,
  carbs_g numeric NOT NULL,
  fat_g numeric NOT NULL,
  price_cents int NOT NULL,
  options jsonb DEFAULT '{}',          -- e.g. size multipliers, swaps
  base_macros jsonb DEFAULT '{}',
  recipe_id uuid REFERENCES recipes(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE meal_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  session_id uuid REFERENCES workout_sessions(id) ON DELETE SET NULL,
  status text CHECK (status IN ('queued','in_kitchen','ready','delivered','cancelled')) DEFAULT 'queued',
  room_number text,
  guest_name text,
  delivery_method text DEFAULT 'room' CHECK (delivery_method in ('room','pickup','dine_in')),
  ticket_ref text,
  total_cents int DEFAULT 0,
  macros jsonb DEFAULT '{}',          -- target/day & per-meal allocations
  items jsonb DEFAULT '[]',           -- [{menu_item_id, qty, size, kcal, p,c,f, line_cents}]
  macro_adjustments jsonb DEFAULT '{}',
  recipe_snapshot jsonb DEFAULT '[]',
  special_instructions text,
  kitchen_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  country text,
  logo_url text,
  hero_image_url text,
  story text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  hours text,
  icon text,
  booking_url text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hotel_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  duration_minutes integer,
  booking_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE brand_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  background_url text,
  video_url text,
  primary_color text NOT NULL DEFAULT '#00CFFF',
  secondary_color text NOT NULL DEFAULT '#1AE6B5',
  accent_color text NOT NULL DEFAULT '#FFB400',
  font_family text NOT NULL DEFAULT 'Inter, sans-serif',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE kitchen_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_order_id uuid REFERENCES meal_orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  room_number text,
  guest_name text,
  status text NOT NULL DEFAULT 'queued',
  priority text DEFAULT 'standard',
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  duration int NOT NULL DEFAULT 45,
  workout_type text NOT NULL DEFAULT 'strength',
  thumbnail_url text,
  video_url text,
  station_lineup jsonb DEFAULT '[]',
  equipment jsonb DEFAULT '[]',
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
CREATE INDEX idx_meal_orders_room_number ON meal_orders(room_number);
CREATE INDEX idx_menu_items_recipe_id ON menu_items(recipe_id);
CREATE INDEX idx_workout_templates_level ON workout_templates(level);
CREATE INDEX idx_workout_templates_category ON workout_templates(category);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_exercise_equipment_equipment ON exercise_equipment(equipment_id);
CREATE INDEX idx_room_equipment_room ON room_equipment(room_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_kitchen_queue_status ON kitchen_queue(status);
CREATE INDEX idx_kitchen_queue_created_at ON kitchen_queue(created_at DESC);
CREATE INDEX idx_workouts_type ON workouts(workout_type);
CREATE INDEX idx_workouts_duration ON workouts(duration);
CREATE INDEX idx_workouts_slug ON workouts(slug);

-- Realtime channels (Supabase Realtime listens on these tables)
ALTER TABLE session_events REPLICA IDENTITY FULL;
ALTER TABLE meal_orders REPLICA IDENTITY FULL;
ALTER TABLE workout_sessions REPLICA IDENTITY FULL;
ALTER TABLE kitchen_queue REPLICA IDENTITY FULL;

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
CREATE TRIGGER set_timestamp_recipes BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_brand_settings BEFORE UPDATE ON brand_settings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_kitchen_queue BEFORE UPDATE ON kitchen_queue FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workouts BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_venues BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_facilities BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hotel_services BEFORE UPDATE ON hotel_services FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

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

-- Insert sample recipes
INSERT INTO recipes (slug, title, description, instructions, ingredients, base_macros) VALUES
  ('ham-eggs-toast', 'Ham & Eggs + Toast', 'Classic protein-forward breakfast', 'Grill ham, fry eggs over-easy, toast sourdough. Plate with herb butter.', '[{"name":"Ham","amount":"90","unit":"g"},{"name":"Eggs","amount":"2","unit":"each"},{"name":"Sourdough toast","amount":"2","unit":"slices"}]', '{"kcal":520,"protein_g":32,"carbs_g":36,"fat_g":26}'),
  ('greek-yogurt-bowl', 'Greek Yogurt Bowl', 'High-protein yogurt bowl with berries', 'Layer yogurt, oats, berries, finish with honey drizzle.', '[{"name":"Greek yogurt","amount":"180","unit":"g"},{"name":"Rolled oats","amount":"40","unit":"g"},{"name":"Berries","amount":"80","unit":"g"}]', '{"kcal":450,"protein_g":28,"carbs_g":55,"fat_g":12}'),
  ('chicken-rice-bowl', 'Chicken Rice Bowl', 'Post-workout carb reload', 'Grill chicken, steam jasmine rice, sauté veggies, toss with sesame dressing.', '[{"name":"Chicken breast","amount":"160","unit":"g"},{"name":"Jasmine rice","amount":"180","unit":"g"},{"name":"Veg medley","amount":"120","unit":"g"}]', '{"kcal":600,"protein_g":38,"carbs_g":70,"fat_g":16}');

-- Insert sample menu items
INSERT INTO menu_items (category, name, description, image_url, base_kcal, protein_g, carbs_g, fat_g, price_cents, options, base_macros, recipe_id) VALUES
  ('breakfast', 'Ham & Eggs + Toast', 'Protein-focused breakfast staple', '/assets/menu/ham-eggs.jpg', 520, 32, 36, 26, 6500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":520,"protein_g":32,"carbs_g":36,"fat_g":26}', (select id from recipes where slug='ham-eggs-toast')),
  ('breakfast', 'Greek Yogurt + Oats + Berries', 'Gut-friendly yogurt bowl', '/assets/menu/yogurt-bowl.jpg', 450, 28, 55, 12, 6000, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":450,"protein_g":28,"carbs_g":55,"fat_g":12}', (select id from recipes where slug='greek-yogurt-bowl')),
  ('post', 'Chicken Rice Bowl', 'Rapid carb reload after training', '/assets/menu/chicken-rice.jpg', 600, 38, 70, 16, 7500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":600,"protein_g":38,"carbs_g":70,"fat_g":16}', (select id from recipes where slug='chicken-rice-bowl')),
  ('lunch', 'Salmon, Potato, Broccoli', 'Omega-rich lunch plate', '/assets/menu/salmon-plate.jpg', 650, 38, 50, 26, 9500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":650,"protein_g":38,"carbs_g":50,"fat_g":26}', NULL),
  ('lunch', 'Tofu Stir-Fry, Rice', 'Plant-forward stir fry', '/assets/menu/tofu-stirfry.jpg', 580, 30, 75, 16, 7000, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":580,"protein_g":30,"carbs_g":75,"fat_g":16}', NULL),
  ('dinner', 'Grilled Steak + Sweet Potato', 'Charred steak with herb butter and smoked salt.', '/assets/menu/steak-sweetpotato.jpg', 720, 45, 55, 22, 11500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":720,"protein_g":45,"carbs_g":55,"fat_g":22}', NULL),
  ('dinner', 'Fish Tacos (3) + Black Beans', 'Seared mahi tacos with lime crema.', '/assets/menu/fish-tacos.jpg', 580, 35, 65, 18, 8500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":580,"protein_g":35,"carbs_g":65,"fat_g":18}', NULL),
  ('snack', 'Protein Bar + Apple', 'In-room grab & go pairing.', '/assets/menu/protein-bar.jpg', 280, 20, 35, 8, 3500, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":280,"protein_g":20,"carbs_g":35,"fat_g":8}', NULL),
  ('snack', 'Mixed Nuts (30g)', 'Roasted cashews, pistachios, almonds.', '/assets/menu/mixed-nuts.jpg', 180, 6, 6, 16, 2800, '{"sizes": {"S": 0.8, "M": 1.0, "L": 1.3}}', '{"kcal":180,"protein_g":6,"carbs_g":6,"fat_g":16}', NULL);

INSERT INTO hotel_services (name, description, price_cents, duration_minutes, booking_url) VALUES
  ('Signature Personal Training', 'Private in-suite coaching with biometric tracking.', 24000, 60, 'https://booking.hotelfit.com/pt'),
  ('Thermal Reset Ritual', 'Cold plunge + infrared + breathwork concierge.', 28000, 75, 'https://booking.hotelfit.com/thermal'),
  ('Room Recovery Upgrade', 'Normatec compression + guided mobility kit.', 18000, 45, 'https://booking.hotelfit.com/recovery')
ON CONFLICT DO NOTHING;

INSERT INTO facilities (name, description, hours, icon, booking_url, image_url) VALUES
  ('Skyline Pool Deck', 'Heated infinity pools with DJ sunsets + cabanas.', '6am – 11pm', '🏖️', 'https://booking.hotelfit.com/cabana', '/assets/facilities/pool.jpg'),
  ('Recovery Lab', 'Infrared, cold plunge, compression boots, and lab techs.', '7am – 10pm', '❄️', 'https://booking.hotelfit.com/recovery-lab', '/assets/facilities/recovery.jpg'),
  ('Movement Studio', 'Reformers, yoga, and functional circuits overlooking the bay.', '24/7', '🧘', 'https://booking.hotelfit.com/studio', '/assets/facilities/studio.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO venues (name, city, country, logo_url, hero_image_url, story) VALUES
  ('TS Suites Skyline', 'Bali', 'Indonesia', '/assets/logo.png', '/assets/hotel-bg.jpg', 'Residences engineered with HotelFit labs, thermal suites, and private gyms.')
ON CONFLICT DO NOTHING;

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
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_services ENABLE ROW LEVEL SECURITY;

-- Public read access for templates and exercises
CREATE POLICY "Public read workout_templates" ON workout_templates FOR SELECT USING (true);
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read brand_settings" ON brand_settings FOR SELECT USING (true);
CREATE POLICY "Public read workouts" ON workouts FOR SELECT USING (true);
CREATE POLICY "Public read kitchen_queue" ON kitchen_queue FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read facilities" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read hotel_services" ON hotel_services FOR SELECT USING (true);

-- Session-based access for workout data
CREATE POLICY "Session access workout_sessions" ON workout_sessions FOR ALL USING (true);
CREATE POLICY "Session access session_events" ON session_events FOR ALL USING (true);
CREATE POLICY "Session access fitness_tests" ON fitness_tests FOR ALL USING (true);
CREATE POLICY "Session access workout_logs" ON workout_logs FOR ALL USING (true);
CREATE POLICY "Session access user_profiles" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Session access meal_orders" ON meal_orders FOR ALL USING (true);
CREATE POLICY "Service role manage recipes" ON recipes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
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
-- Studio Booking System Schema
-- Implements real database-backed class scheduling and booking system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- COACHES TABLE
-- ============================================================================
CREATE TABLE coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  bio text,
  certifications text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- STUDIO CLASSES (Templates)
-- ============================================================================
CREATE TABLE studio_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  intensity text CHECK (intensity IN ('Low', 'Medium', 'High')) NOT NULL,
  max_spots integer NOT NULL DEFAULT 12,
  cover_image_url text,
  focus_area text CHECK (focus_area IN ('Core', 'Glutes', 'Full Body')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CLASS SCHEDULES (Specific instances on calendar)
-- ============================================================================
CREATE TABLE class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES studio_classes(id) ON DELETE CASCADE NOT NULL,
  coach_id uuid REFERENCES coaches(id) ON DELETE SET NULL,
  scheduled_time timestamptz NOT NULL,
  location text DEFAULT 'Studio A',
  available_spots integer NOT NULL,
  status text CHECK (status IN ('scheduled', 'cancelled', 'completed')) DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- CLASS BOOKINGS (User reservations)
-- ============================================================================
CREATE TABLE class_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  schedule_id uuid REFERENCES class_schedules(id) ON DELETE CASCADE NOT NULL,
  booking_status text CHECK (booking_status IN ('confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'confirmed',
  booked_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, schedule_id) -- Prevent double booking same class
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_class_schedules_time ON class_schedules(scheduled_time);
CREATE INDEX idx_class_schedules_status ON class_schedules(status);
CREATE INDEX idx_class_bookings_user ON class_bookings(user_id);
CREATE INDEX idx_class_bookings_schedule ON class_bookings(schedule_id);
CREATE INDEX idx_class_bookings_status ON class_bookings(booking_status);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_coaches 
  BEFORE UPDATE ON coaches 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_studio_classes 
  BEFORE UPDATE ON studio_classes 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_class_schedules 
  BEFORE UPDATE ON class_schedules 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_class_bookings 
  BEFORE UPDATE ON class_bookings 
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for coaches and classes
CREATE POLICY "Public read coaches" ON coaches FOR SELECT USING (true);
CREATE POLICY "Public read studio_classes" ON studio_classes FOR SELECT USING (true);
CREATE POLICY "Public read class_schedules" ON class_schedules FOR SELECT USING (true);

-- Users can read all bookings (for leaderboards, class capacity, etc.)
CREATE POLICY "Public read bookings" ON class_bookings FOR SELECT USING (true);

-- Users can only insert/update/delete their own bookings
CREATE POLICY "Users manage own bookings" ON class_bookings 
  FOR ALL USING (auth.uid() = user_id);
-- HRM System Schema Integration
-- Implements the "Golden Rule" workflow for Heart Rate Monitoring

-- 1. BOOKING & ASSIGNMENTS
-- Links a user's intent to join a class with a specific device reservation

CREATE TABLE hrm_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  class_id text NOT NULL, -- Logical ID from the class schedule/cms
  booking_time timestamptz DEFAULT now(),
  status text CHECK (status IN ('confirmed', 'cancelled', 'checked_in', 'no_show')) DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hrm_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES hrm_bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  class_id text NOT NULL,
  device_id text NOT NULL, -- The physical ID of the band (e.g., 'HRM-101')
  device_number int, -- The visual number on the band/wall (e.g., 12)
  status text CHECK (status IN ('reserved', 'active', 'completed', 'cancelled')) DEFAULT 'reserved',
  reserved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. LIVE SESSION MANAGEMENT
-- The actual running instance of a class that collects data

CREATE TABLE hrm_class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id text NOT NULL,
  location text DEFAULT 'Studio A',
  instructor_name text,
  status text CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')) DEFAULT 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz, -- NULL until finished
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE hrm_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  booking_id uuid REFERENCES hrm_bookings(id),
  assignment_id uuid REFERENCES hrm_assignments(id),
  device_id text NOT NULL,
  status text CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Note: hrm_samples are high-frequency and likely stored in a different time-series DB or 
-- a partitioned table. For this schema, we will assume they are handled by the separate 
-- HRM API service or a dedicated hypertable if using TimescaleDB.

-- 3. POST-CLASS RESULTS & RECAPS
-- Computed data for persistent history and UI display

CREATE TABLE hrm_session_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  
  -- Performance Metrics
  avg_hr int,
  max_hr int,
  min_hr int,
  calories_est int,
  points int, -- Gamification points
  effort_score numeric, -- Computed score (e.g., weighted zones)
  
  -- Time in Zones (seconds)
  zone_1_sec int DEFAULT 0,
  zone_2_sec int DEFAULT 0,
  zone_3_sec int DEFAULT 0,
  zone_4_sec int DEFAULT 0,
  zone_5_sec int DEFAULT 0,
  
  -- Ranks
  rank_overall int,
  rank_gender int,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- User-facing recap object (Pre-computed for fast UI load)
CREATE TABLE hrm_user_class_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  
  -- JSON blob for flexible UI rendering
  -- Contains: { rank, stats, comparison_to_avg, graph_data_points, awards }
  recap_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Class-wide recap (Leaderboards, aggregates)
CREATE TABLE hrm_class_recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES hrm_class_sessions(id) ON DELETE CASCADE,
  
  total_calories int,
  avg_effort_score numeric,
  participant_count int,
  
  -- JSON blob for leaderboard and distribution charts
  -- Contains: { top_performers: [], zone_distribution: {}, class_averages: {} }
  summary_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id)
);

-- 4. INDEXES & TRIGGERS
CREATE INDEX idx_hrm_assignments_booking ON hrm_assignments(booking_id);
CREATE INDEX idx_hrm_assignments_device ON hrm_assignments(device_id);
CREATE INDEX idx_hrm_sessions_status ON hrm_class_sessions(status);
CREATE INDEX idx_hrm_results_session ON hrm_session_results(session_id);
CREATE INDEX idx_hrm_results_user ON hrm_session_results(user_id);

-- Updated_at triggers
CREATE TRIGGER set_timestamp_hrm_bookings BEFORE UPDATE ON hrm_bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_assignments BEFORE UPDATE ON hrm_assignments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_sessions BEFORE UPDATE ON hrm_class_sessions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_participants BEFORE UPDATE ON hrm_session_participants FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_hrm_results BEFORE UPDATE ON hrm_session_results FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- 5. RLS POLICIES
ALTER TABLE hrm_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_session_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_user_class_recaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_class_recaps ENABLE ROW LEVEL SECURITY;

-- Simple policies (Refine as needed for production roles)
CREATE POLICY "Public read hrm_sessions" ON hrm_class_sessions FOR SELECT USING (true);
CREATE POLICY "Public read hrm_results" ON hrm_session_results FOR SELECT USING (true);
CREATE POLICY "Users read own bookings" ON hrm_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own assignments" ON hrm_assignments FOR SELECT USING (auth.uid() = user_id);
-- Legacy Data Migration from Exequte Mini Program
-- Maps 'Trainings' -> 'studio_classes' and creates schedules

-- 1. LEGACY COACHES
-- "Mr. Instructor" from seeds.rb
INSERT INTO coaches (name, specialty, bio, certifications, image_url) VALUES
('Mr. Instructor', 'General Fitness', 'Experienced instructor from Exequte original program.', ARRAY['Legacy Certified'], 'https://i.pinimg.com/originals/b1/94/82/b19482a076bc6a51f713c37a54e7b615.jpg');

-- 2. LEGACY CLASSES
-- Yoga, Body Pump, Stretching, Abs, Weight Lifting
INSERT INTO studio_classes (slug, name, description, duration_minutes, intensity, max_spots, cover_image_url, focus_area) VALUES
('yoga', 'Yoga', 'Stretch your body and mind with us. Hot Yoga style.', 60, 'Low', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('body-pump', 'Body Pump', 'Go crazy with Body Pump. Light Weight high reps.', 60, 'High', 15, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('stretching', 'Stretching', 'Same like yoga but without Zen.', 45, 'Low', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body'),
('abs-workout', 'Abs Workout', 'Go get that 6-pack.', 30, 'High', 20, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Core'),
('weight-lifting', 'Weight Lifting', 'Free and powerful workout session.', 90, 'High', 30, 'https://s5o.ru/storage/simple/ru/edt/90/50/f5/37/rue5f231c5949.jpg', 'Full Body')
ON CONFLICT (slug) DO NOTHING;

-- 3. GENERATE SCHEDULES FOR LEGACY CLASSES (Next 14 days)
DO $$
DECLARE
  coach_id uuid;
  class_yoga uuid;
  class_pump uuid;
  class_stretch uuid;
  class_abs uuid;
  class_lift uuid;
  
  day_offset integer;
  calc_date date;
BEGIN
  -- Get IDs
  SELECT id INTO coach_id FROM coaches WHERE name = 'Mr. Instructor' LIMIT 1;
  SELECT id INTO class_yoga FROM studio_classes WHERE slug = 'yoga';
  SELECT id INTO class_pump FROM studio_classes WHERE slug = 'body-pump';
  SELECT id INTO class_stretch FROM studio_classes WHERE slug = 'stretching';
  SELECT id INTO class_abs FROM studio_classes WHERE slug = 'abs-workout';
  SELECT id INTO class_lift FROM studio_classes WHERE slug = 'weight-lifting';

  -- Generate 14 days of schedules matching legacy logic
  FOR day_offset IN 0..13 LOOP
    calc_date := CURRENT_DATE + day_offset;
    
    -- Morning Yoga
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_yoga, coach_id, calc_date + TIME '07:00:00', 'Studio A', 20);
    
    -- Lunch Abs
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_abs, coach_id, calc_date + TIME '12:00:00', 'Studio B', 20);
    
    -- Evening Pump
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_pump, coach_id, calc_date + TIME '18:00:00', 'Studio A', 15);
    
    -- Night Lifting
    INSERT INTO class_schedules (class_id, coach_id, scheduled_time, location, available_spots) VALUES
    (class_lift, coach_id, calc_date + TIME '20:00:00', 'Gym Floor', 30);
    
  END LOOP;
END $$;
