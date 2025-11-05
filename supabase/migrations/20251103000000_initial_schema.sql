-- Create tables for hotel room workout system

-- ROOMS & SESSIONS
create table rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null,
  name text,
  qr_slug text unique
);

create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid, -- nullable guest
  status text check (status in ('idle','testing','ready','running','paused','done')) default 'idle',
  started_at timestamptz,
  ended_at timestamptz
);

-- USER PROFILE & TESTING
create table user_profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  display_name text,
  dob date,
  sex text check (sex in ('male','female','other')),
  height_cm numeric,
  weight_kg numeric,
  body_fat_pct numeric,
  activity_factor numeric default 1.4,  -- sedentary 1.2 → athlete 1.9
  goal text check (goal in ('maintain','lose','gain')) default 'maintain',
  meals_per_day int default 3
);

create table fitness_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade,
  session_id uuid references workout_sessions(id) on delete cascade,
  age int,
  height_cm numeric,
  weight_kg numeric,
  body_fat_pct numeric,
  level_self text check (level_self in ('beginner','intermediate','advanced')),
  max_pushups int,
  squats_60s int,
  plank_hold_sec int,
  step_test_hr int,
  computed_level numeric,
  mapped_band text,
  created_at timestamptz default now()
);

-- WORKOUT LIBRARY
create table workout_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  category text,
  level text,
  duration_min int,
  blocks jsonb,
  video_pack text,
  created_at timestamptz default now()
);

-- EXERCISES
create table exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text,
  cues text,
  demo_url text,
  type text,
  tags text[]
);

-- SESSION RUN DATA
create table session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade,
  ts timestamptz default now(),
  event text,
  payload jsonb
);

create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade,
  session_id uuid references workout_sessions(id) on delete set null,
  template_slug text,
  duration_sec int,
  total_reps int,
  rpe int,
  notes text,
  metrics jsonb,
  created_at timestamptz default now()
);

-- MEALS / MENU / ORDERS
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  category text,
  name text,
  base_kcal int,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  price_cents int,
  options jsonb
);

create table meal_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete set null,
  session_id uuid references workout_sessions(id) on delete set null,
  status text check (status in ('queued','in_kitchen','ready','delivered','cancelled')) default 'queued',
  total_cents int default 0,
  macros jsonb,
  items jsonb,
  created_at timestamptz default now()
);

-- Realtime channels
alter table session_events replica identity full;
alter table meal_orders replica identity full;