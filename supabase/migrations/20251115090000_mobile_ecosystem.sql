-- Mobile ecosystem core tables

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  birth_date date,
  gender text,
  photo_url text,
  crm_external_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.membership_tiers (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  name text,
  description text,
  price_cents int,
  currency text default 'USD',
  duration_days int,
  benefits jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  venue_id uuid,
  tier_id uuid references membership_tiers(id),
  status text check (status in ('active','expired','canceled','pending')) default 'pending',
  start_date date,
  end_date date,
  auto_renew boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  venue_id uuid,
  source text,
  created_at timestamptz default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  label text,
  mac_address text,
  last_seen_at timestamptz
);

create table if not exists public.hr_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  workout_session_id uuid,
  avg_hr int,
  max_hr int,
  hr_series jsonb,
  calories numeric,
  created_at timestamptz default now()
);

create table if not exists public.body_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  provider text,
  payload jsonb,
  weight_kg numeric,
  body_fat_pct numeric,
  muscle_mass_kg numeric,
  bmr numeric,
  tdee numeric,
  posture jsonb,
  scanned_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text,
  value numeric,
  unit text,
  taken_at timestamptz default now()
);

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  title text,
  goal text,
  difficulty text,
  duration_min int,
  blocks jsonb,
  created_by uuid,
  is_public boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  template_id uuid references workout_templates(id),
  mode text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_sec int,
  calories numeric,
  notes text
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid references workout_sessions(id) on delete cascade,
  exercise_name text,
  load_kg numeric,
  reps int,
  rpe numeric,
  rest_sec int,
  tempo text,
  completed_at timestamptz default now()
);

create table if not exists public.circuits (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  name text,
  description text,
  station_count int,
  station_time_sec int,
  transition_sec int,
  active boolean default true
);

create table if not exists public.circuit_stations (
  id uuid primary key default gen_random_uuid(),
  circuit_id uuid references circuits(id) on delete cascade,
  order_index int,
  station_name text,
  instructions text
);

create table if not exists public.circuit_attendance (
  id uuid primary key default gen_random_uuid(),
  circuit_id uuid references circuits(id),
  user_id uuid references auth.users(id),
  started_at timestamptz,
  ended_at timestamptz
);

create table if not exists public.fitness_tests (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  name text,
  protocol jsonb
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references fitness_tests(id),
  user_id uuid references auth.users(id),
  result jsonb,
  tested_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  name text,
  description text,
  kcal int,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  tags text[],
  price_cents int,
  available boolean default true,
  photo_url text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  venue_id uuid,
  status text check (status in ('pending','paid','preparing','ready','delivered','canceled')) default 'pending',
  subtotal_cents int,
  total_cents int,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  qty int,
  price_cents int,
  macros jsonb
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  cover_url text,
  active boolean default true
);

create table if not exists public.media_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  url text,
  label text,
  taken_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  venue_id uuid,
  provider text,
  provider_ref text,
  amount_cents int,
  currency text,
  status text,
  created_at timestamptz default now()
);

-- RLS
alter table user_profiles enable row level security;
alter table memberships enable row level security;
alter table workout_sessions enable row level security;
alter table workout_sets enable row level security;
alter table body_scans enable row level security;
alter table measurements enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table hr_sessions enable row level security;
alter table media_photos enable row level security;

create policy if not exists "Members select own profile" on user_profiles
  for select using (auth.uid() = user_id);
create policy if not exists "Members upsert own profile" on user_profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Members read memberships" on memberships
  for select using (auth.uid() = user_id);

create policy if not exists "Members insert memberships" on memberships
  for insert with check (auth.uid() = user_id);

create policy if not exists "Members read workouts" on workout_sessions
  for select using (auth.uid() = user_id);

create policy if not exists "Members write workouts" on workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Members read sets" on workout_sets
  for select using (
    exists (select 1 from workout_sessions ws where ws.id = workout_session_id and ws.user_id = auth.uid())
  );

create policy if not exists "Members write sets" on workout_sets
  for insert with check (
    exists (select 1 from workout_sessions ws where ws.id = workout_session_id and ws.user_id = auth.uid())
  );

create policy if not exists "Members read scans" on body_scans
  for select using (auth.uid() = user_id);

create policy if not exists "Members write scans" on body_scans
  for insert with check (auth.uid() = user_id);

create policy if not exists "Members read measurements" on measurements
  for select using (auth.uid() = user_id);
create policy if not exists "Members write measurements" on measurements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Members read orders" on orders
  for select using (auth.uid() = user_id);
create policy if not exists "Members write orders" on orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Members read order items" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy if not exists "Members read hr" on hr_sessions
  for select using (auth.uid() = user_id);
create policy if not exists "Members insert hr" on hr_sessions
  for insert with check (auth.uid() = user_id);

create policy if not exists "Members CRUD photos" on media_photos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
