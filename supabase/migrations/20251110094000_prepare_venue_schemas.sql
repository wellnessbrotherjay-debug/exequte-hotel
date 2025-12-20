-- Track venue-specific namespaces.
create table if not exists public.venue_namespaces (
  venue_id text primary key,
  schema_name text not null,
  created_at timestamptz not null default now()
);

comment on table public.venue_namespaces is
  'Placeholder table describing the per-venue schema strategy for phase 2. Real schema creation will be handled via Supabase automation when venues onboard.';
