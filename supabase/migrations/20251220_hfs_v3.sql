-- Tenancy & Users
create table hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  timezone text default 'Asia/Makassar',
  created_at timestamptz default now()
);

create table staff_users (
  id uuid primary key default auth.uid(),
  hotel_id uuid references hotels(id) on delete cascade,
  email text unique not null,
  role text check (role in ('admin','manager','trainer','chef','frontdesk','viewer')) not null,
  display_name text,
  created_at timestamptz default now()
);

-- Screens & Playlists
create table screens (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  code text unique,
  type text check (type in ('tv','signage','gym','kds')) not null,
  location text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table playlists (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  target text check (target in ('tv','signage','gym','kds')) not null
);

create table playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references playlists(id) on delete cascade,
  order_index int not null,
  content_type text check (content_type in ('video','image','html','offer','menu','workout')) not null,
  content_ref uuid,
  start_time time,
  end_time time
);

-- Media Library
create table videos (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  category text,
  duration_seconds int,
  storage_url text,
  thumbnail_url text,
  level text,
  created_at timestamptz default now()
);

-- Fitness & Workouts (Enhanced for Trainerize-style tracking)
create table exercises (
    id uuid primary key default gen_random_uuid(),
    hotel_id uuid references hotels(id) on delete cascade, -- Tenancy scoped
    name text not null,
    description text,
    video_url text,
    thumbnail_url text,
    muscle_groups text[],
    equipment_needed text[],
    type text default 'strength',
    created_at timestamptz default now()
);

create table workouts (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text not null,
  description text,
  video_id uuid references videos(id), -- Optional: for follow-along video style
  category text null, -- e.g. 'Strength', 'HIIT'
  difficulty_level text check (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes int,
  tags text[],
  equipment text[],
  calories_est int,
  is_premium boolean default false,
  created_at timestamptz default now()
);

create table workout_blocks (
    id uuid primary key default gen_random_uuid(),
    workout_id uuid references workouts(id) on delete cascade,
    title text not null, -- e.g., "Warmup", "Circuit A"
    sort_order int not null,
    type text default 'standard', -- standard, circuit, emom, amrap
    rounds int default 1
);

create table workout_exercises (
    id uuid primary key default gen_random_uuid(),
    block_id uuid references workout_blocks(id) on delete cascade,
    exercise_id uuid references exercises(id),
    sort_order int not null,
    target_sets int default 3,
    target_reps int,
    target_time_sec int,
    target_rpe int,
    rest_time_sec int default 60,
    notes text
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  trainer_id uuid references staff_users(id),
  capacity int,
  hrm_enabled boolean default false
);

create table class_attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  guest_id uuid,
  checked_in_at timestamptz default now(),
  hrm_session_id text
);

-- User Tracking (Sessions & Logs)
create table user_workout_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    hotel_id uuid references hotels(id) on delete cascade, -- Track where it happened
    workout_id uuid references workouts(id) on delete set null,
    status text default 'in_progress', -- in_progress, completed, abandoned
    started_at timestamptz default now(),
    completed_at timestamptz,
    total_volume_kg numeric default 0,
    total_time_sec int default 0,
    calories_burned int default 0,
    feeling_rating int,
    notes text
);

create table user_set_logs (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references user_workout_sessions(id) on delete cascade,
    exercise_id uuid references exercises(id),
    block_id uuid references workout_blocks(id),
    set_number int not null,
    weight_kg numeric,
    reps_completed int,
    time_sec int,
    is_pr boolean default false,
    logged_at timestamptz default now()
);

-- F&B / Inventory
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  unit text not null,
  cost_per_unit numeric(10,4) not null,
  allergen text[],
  kcal_per_unit numeric(10,2),
  protein_per_unit numeric(10,2),
  carbs_per_unit numeric(10,2),
  fat_per_unit numeric(10,2),
  supplier_id uuid
);

create table inventory_batches (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  qty numeric(14,3) not null,
  received_at date not null,
  expiry_date date,
  unit_cost numeric(10,4) not null
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  yield_qty numeric(10,3) not null,
  yield_unit text not null,
  prep_time_min int,
  method text
);

create table recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  qty numeric(12,3) not null,
  unit text not null
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  recipe_id uuid references recipes(id),
  name text not null,
  category text,
  sale_price numeric(10,2) not null,
  is_active boolean default true,
  allergens text[],
  calories numeric(10,2),
  macros jsonb
);

-- Orders / POS Mirror
create table orders (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  created_at timestamptz default now(),
  origin text check (origin in ('room','restaurant','gym','spa','tablet','tv')),
  room_number text,
  guest_id uuid,
  status text check (status in ('pending','in_kitchen','ready','served','paid','cancelled')) default 'pending',
  pos_ref text
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  qty int not null,
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) generated always as (qty * unit_price) stored
);

-- Suppliers & POs
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  contact jsonb
);

create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  status text check (status in ('draft','sent','received','cancelled')) default 'draft',
  created_at timestamptz default now()
);

create table purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  ingredient_id uuid references ingredients(id),
  qty numeric(12,3) not null,
  unit text not null,
  unit_price numeric(10,4) not null
);

-- Offers / Promos
create table offers (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  body text,
  starts_at timestamptz,
  ends_at timestamptz,
  target text[]
);

-- Analytics
create table analytics_events (
  id bigserial primary key,
  hotel_id uuid references hotels(id) on delete cascade,
  actor_type text,
  actor_id uuid,
  event text,
  ref_id uuid,
  meta jsonb,
  happened_at timestamptz default now()
);
