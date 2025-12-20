-- Body scan summaries per venue/member
create table if not exists public.body_scans (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null,
  member_id uuid not null,
  member_name text not null,
  body_fat numeric(5,2),
  muscle_mass numeric(6,2),
  posture_score integer,
  scan_url text,
  metadata jsonb not null default '{}'::jsonb,
  scanned_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.body_scans enable row level security;

create policy "Allow service role manage body scans"
  on public.body_scans
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Allow anon read body scans"
  on public.body_scans
  for select
  using (true);
