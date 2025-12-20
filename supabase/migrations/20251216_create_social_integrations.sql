-- Create social_integrations table for Meta tokens
create table if not exists public.social_integrations (
  id uuid not null default gen_random_uuid (),
  brand_id text not null, -- Link to Brand ID (e.g., 'ts-suites')
  platform text not null, -- 'facebook', 'instagram'
  access_token text not null, -- The long-lived token
  platform_user_id text, -- The FB User ID or Page ID
  token_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- RLS Policies (Optional: Adjust based on your auth model)
alter table public.social_integrations enable row level security;

create policy "Enable read access for authenticated users"
on public.social_integrations for select
to authenticated
using (true);

create policy "Enable insert for authenticated users"
on public.social_integrations for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users"
on public.social_integrations for update
to authenticated
using (true);
