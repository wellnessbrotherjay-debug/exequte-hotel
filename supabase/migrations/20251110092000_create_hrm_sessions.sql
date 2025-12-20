-- HRM session log for realtime + analytics
create table if not exists public.hrm_sessions (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null,
  session_code text not null,
  participant_name text,
  avg_hr integer,
  max_hr integer,
  zone_distribution jsonb not null default '{}'::jsonb,
  calories numeric(10,2),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists hrm_sessions_venue_session_idx
  on public.hrm_sessions (venue_id, session_code);

alter table public.hrm_sessions enable row level security;

create policy "Allow service role manage hrm sessions"
  on public.hrm_sessions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Allow anon read hrm sessions"
  on public.hrm_sessions
  for select
  using (true);
