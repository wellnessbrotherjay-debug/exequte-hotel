-- Create tables for hotel room workout system

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null,
  name text,
  qr_slug text unique
);

create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid, -- nullable guest
  status text check (status in ('idle','testing','ready','running','paused','done')) default 'idle',
  started_at timestamptz,
  ended_at timestamptz
);

-- USER PROFILE & TESTING
create table if not exists user_profiles (
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

-- Compatibility: some environments may already have a user_profiles table keyed by user_id.
-- Ensure an `id` column exists and is unique so downstream foreign keys succeed.
do $$
declare
  has_user_id boolean;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_profiles'
      and column_name = 'user_id'
  ) into has_user_id;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_profiles'
      and column_name = 'id'
  ) then
    alter table public.user_profiles add column id uuid;
  end if;

  if has_user_id then
    update public.user_profiles
    set id = coalesce(id, user_id)
    where id is null;
  else
    update public.user_profiles
    set id = coalesce(id, gen_random_uuid())
    where id is null;
  end if;

  alter table public.user_profiles
    alter column id set not null,
    alter column id set default gen_random_uuid();

  begin
    alter table public.user_profiles
      add constraint user_profiles_id_unique unique (id);
  exception
    when duplicate_object then null;
  end;
end $$;

create or replace function public.handle_user_profiles_id()
returns trigger as $$
begin
  new.id := coalesce(new.id, new.user_id, gen_random_uuid());
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_profiles_set_id on public.user_profiles;
create trigger user_profiles_set_id
  before insert on public.user_profiles
  for each row execute function public.handle_user_profiles_id();

create table if not exists fitness_tests (
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
create table if not exists workout_templates (
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
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text,
  cues text,
  demo_url text,
  type text,
  tags text[]
);

-- SESSION RUN DATA
create table if not exists session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade,
  ts timestamptz default now(),
  event text,
  payload jsonb
);

create table if not exists workout_logs (
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
create table if not exists menu_items (
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

create table if not exists meal_orders (
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
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'session_events'
  ) then
    execute 'alter table session_events replica identity full';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'meal_orders'
  ) then
    execute 'alter table meal_orders replica identity full';
  end if;
end $$;
