-- Store the output of TDEE + macro recommendations
create table if not exists public.tdee_logs (
  id uuid primary key default gen_random_uuid(),
  venue_id text,
  member_id uuid,
  inputs jsonb not null,
  result jsonb not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.tdee_logs enable row level security;

create policy "Allow service role manage tdee logs"
  on public.tdee_logs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Allow anon read tdee logs"
  on public.tdee_logs
  for select
  using (true);
