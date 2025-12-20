-- Equipment library that stores detailed equipment specs
create table if not exists public.equipment_library (
  id uuid primary key default gen_random_uuid(),
  equipment_name text not null,
  category text,
  size_length numeric,
  size_width numeric,
  size_height numeric,
  weight numeric,
  required_space numeric,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_equipment_library_category on public.equipment_library(category);
create index if not exists idx_equipment_library_created_at on public.equipment_library(created_at);

alter table public.equipment_library enable row level security;

create policy "Allow anon read equipment library"
  on public.equipment_library
  for select
  using (true);

create policy "Service role manage equipment library"
  on public.equipment_library
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
