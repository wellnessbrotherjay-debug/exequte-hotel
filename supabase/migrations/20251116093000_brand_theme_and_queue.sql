create table if not exists public.brand_settings (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  logo_url text,
  background_url text,
  video_url text,
  primary_color text not null default '#00CFFF',
  secondary_color text not null default '#1AE6B5',
  accent_color text not null default '#FFB400',
  font_family text not null default 'Inter, sans-serif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
    DROP TRIGGER IF EXISTS set_timestamp_brand_settings ON public.brand_settings;
    CREATE TRIGGER set_timestamp_brand_settings
      BEFORE UPDATE ON public.brand_settings
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END$$;

insert into public.brand_settings (slug, name, logo_url, background_url, video_url, primary_color, secondary_color, accent_color, font_family)
values (
  'default',
  'GLVT by TS Suites',
  '/assets/logo.png',
  '/assets/hotel-bg.jpg',
  'https://watch.cloudflarestream.com/jPokBIILUKYwWLcJwmuCV_bvQgKJfdnqqivRGJi5',
  '#00CFFF',
  '#1AE6B5',
  '#FFB400',
  'Inter, sans-serif'
)
on conflict (slug) do update
set
  name = excluded.name,
  logo_url = excluded.logo_url,
  background_url = excluded.background_url,
  video_url = excluded.video_url,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  accent_color = excluded.accent_color,
  font_family = excluded.font_family;

create table if not exists public.kitchen_queue (
  id uuid primary key default uuid_generate_v4(),
  meal_order_id uuid references public.meal_orders(id) on delete cascade,
  user_id uuid,
  room_number text,
  guest_name text,
  status text not null default 'queued',
  priority text default 'standard',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kitchen_queue_status_idx on public.kitchen_queue(status);
create index if not exists kitchen_queue_created_idx on public.kitchen_queue(created_at desc);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
    DROP TRIGGER IF EXISTS set_timestamp_kitchen_queue ON public.kitchen_queue;
    CREATE TRIGGER set_timestamp_kitchen_queue
      BEFORE UPDATE ON public.kitchen_queue
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END$$;

alter table public.kitchen_queue enable row level security;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'kitchen_queue' AND policyname = 'Open access kitchen queue'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON %I.%I FOR ALL USING (true)',
      'Open access kitchen queue', 'public', 'kitchen_queue'
    );
  END IF;
END$$;

create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  duration integer not null default 45,
  workout_type text not null default 'strength',
  thumbnail_url text,
  video_url text,
  station_lineup jsonb not null default '[]'::jsonb,
  equipment jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure expected columns exist in case an older/partial schema created the table without them.
ALTER TABLE public.workouts
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS duration integer DEFAULT 45,
  ADD COLUMN IF NOT EXISTS workout_type text DEFAULT 'strength',
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS station_lineup jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS equipment jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Backfill sensible defaults for any existing rows that may have NULLs
-- If the table has 'station_lineup' or 'equipment' stored as arrays or text,
-- convert them to jsonb safely before running COALESCE updates.
DO $$
BEGIN
  -- Convert station_lineup to jsonb if it's not already jsonb
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'workouts' AND column_name = 'station_lineup' AND udt_name <> 'jsonb'
  ) THEN
    ALTER TABLE public.workouts
      ALTER COLUMN station_lineup TYPE jsonb USING (
        CASE
          WHEN station_lineup IS NULL THEN '[]'::jsonb
          WHEN pg_typeof(station_lineup)::text = 'text[]' THEN to_jsonb(station_lineup)
          ELSE station_lineup::jsonb
        END
      );
  END IF;

  -- Convert equipment to jsonb if it's not already jsonb
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'workouts' AND column_name = 'equipment' AND udt_name <> 'jsonb'
  ) THEN
    ALTER TABLE public.workouts
      ALTER COLUMN equipment TYPE jsonb USING (
        CASE
          WHEN equipment IS NULL THEN '[]'::jsonb
          WHEN pg_typeof(equipment)::text = 'text[]' THEN to_jsonb(equipment)
          ELSE equipment::jsonb
        END
      );
  END IF;
END$$;

-- Backfill sensible defaults for any existing rows that may have NULLs
UPDATE public.workouts
SET duration = COALESCE(duration, 45),
    workout_type = COALESCE(workout_type, 'strength'),
    station_lineup = COALESCE(station_lineup, '[]'::jsonb),
    equipment = COALESCE(equipment, '[]'::jsonb),
    created_at = COALESCE(created_at, now()),
    updated_at = COALESCE(updated_at, now())
WHERE TRUE;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
    DROP TRIGGER IF EXISTS set_timestamp_workouts ON public.workouts;
    CREATE TRIGGER set_timestamp_workouts
      BEFORE UPDATE ON public.workouts
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END$$;

alter table public.workouts enable row level security;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'workouts' AND policyname = 'Open access workouts'
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON %I.%I FOR SELECT USING (true)',
      'Open access workouts', 'public', 'workouts'
    );
  END IF;
END$$;

insert into public.workouts (name, description, duration, workout_type, thumbnail_url, video_url, station_lineup, equipment)
values
  (
    'Skyline Warrior',
    'Signature HIIT pairing inspired by TS Suites rooftop labs.',
    45,
    'HIIT',
    '/assets/workouts/skyline-warrior.jpg',
    '/assets/workouts/skyline-warrior.mp4',
    jsonb_build_array(
      jsonb_build_object('station', 1, 'title', 'Air Bike Sprints', 'focus', 'Power'),
      jsonb_build_object('station', 2, 'title', 'Kettlebell Complex', 'focus', 'Strength'),
      jsonb_build_object('station', 3, 'title', 'Core Slings', 'focus', 'Stability')
    ),
    jsonb_build_array('assault bike', 'kettlebell set', 'trx')
  ),
  (
    'Hydra Flow',
    'Low impact metabolic flow with strength waves and tempo holds.',
    50,
    'Strength',
    '/assets/workouts/hydra-flow.jpg',
    '/assets/workouts/hydra-flow.mp4',
    jsonb_build_array(
      jsonb_build_object('station', 1, 'title', 'Tempo Goblet Squat', 'focus', 'Legs'),
      jsonb_build_object('station', 2, 'title', 'Ring Rows', 'focus', 'Back'),
      jsonb_build_object('station', 3, 'title', 'Slider Crawls', 'focus', 'Core')
    ),
    jsonb_build_array('kettlebell', 'rings', 'sliders')
  )
on conflict do nothing;
