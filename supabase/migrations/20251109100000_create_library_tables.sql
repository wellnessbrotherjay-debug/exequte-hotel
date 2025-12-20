-- Library tables to support master + venue-specific overrides
create extension if not exists "pgcrypto";

create table if not exists public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  equipment text,
  video_url text,
  instructions text,
  metadata jsonb not null default '{}'::jsonb,
  venue_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.machine_library (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  category text,
  media_url text,
  metadata jsonb not null default '{}'::jsonb,
  venue_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_library (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  media_url text not null,
  thumbnail_url text,
  metadata jsonb not null default '{}'::jsonb,
  venue_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists exercise_library_slug_venue_idx
  on public.exercise_library (slug, coalesce(venue_id, 'master'));

create unique index if not exists machine_library_slug_venue_idx
  on public.machine_library (slug, coalesce(venue_id, 'master'));

create unique index if not exists video_library_slug_venue_idx
  on public.video_library (slug, coalesce(venue_id, 'master'));

alter table public.exercise_library enable row level security;
alter table public.machine_library enable row level security;
alter table public.video_library enable row level security;

create policy "Allow anon read exercise library"
  on public.exercise_library
  for select
  using (true);

create policy "Allow anon read machine library"
  on public.machine_library
  for select
  using (true);

create policy "Allow anon read video library"
  on public.video_library
  for select
  using (true);

create policy "Service role manage exercise library"
  on public.exercise_library
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manage machine library"
  on public.machine_library
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manage video library"
  on public.video_library
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace function public.set_library_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger exercise_library_updated_at
  before update on public.exercise_library
  for each row execute procedure public.set_library_updated_at();

create trigger machine_library_updated_at
  before update on public.machine_library
  for each row execute procedure public.set_library_updated_at();

create trigger video_library_updated_at
  before update on public.video_library
  for each row execute procedure public.set_library_updated_at();
