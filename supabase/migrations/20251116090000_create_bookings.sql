-- Hotel room bookings

-- Ensure the shared updated_at helper exists before attaching triggers.
create or replace function public.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  room_id uuid references rooms(id) on delete set null,
  status text not null check (status in ('pending','confirmed','checked_in','checked_out','canceled')) default 'pending',
  check_in date not null,
  check_out date not null,
  guest_name text,
  guest_email text,
  guest_phone text,
  package_name text,
  party_size int check (party_size is null or party_size >= 1),
  special_requests text,
  source text default 'mobile',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists bookings_room_idx on public.bookings (room_id);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_check_in_idx on public.bookings (check_in);

alter table public.bookings enable row level security;

create policy if not exists "Users read own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy if not exists "Users insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users update own bookings"
  on public.bookings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists set_timestamp_bookings on public.bookings;
create trigger set_timestamp_bookings
  before update on public.bookings
  for each row execute function trigger_set_timestamp();
