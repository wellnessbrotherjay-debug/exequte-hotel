-- Hospitality catalog additions: venues, facilities, services, and richer menu/workout metadata

alter table public.workouts
  add column if not exists slug text unique;

update public.workouts
set slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

alter table public.menu_items
  add column if not exists image_url text;

create table if not exists public.hotel_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null default 0,
  duration_minutes integer,
  booking_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  hours text,
  icon text,
  booking_url text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  logo_url text,
  hero_image_url text,
  story text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_timestamp_hotel_services on public.hotel_services;
create trigger set_timestamp_hotel_services
  before update on public.hotel_services
  for each row
  execute function trigger_set_timestamp();

drop trigger if exists set_timestamp_facilities on public.facilities;
create trigger set_timestamp_facilities
  before update on public.facilities
  for each row
  execute function trigger_set_timestamp();

drop trigger if exists set_timestamp_venues on public.venues;
create trigger set_timestamp_venues
  before update on public.venues
  for each row
  execute function trigger_set_timestamp();

alter table public.hotel_services enable row level security;
alter table public.facilities enable row level security;
alter table public.venues enable row level security;

create policy if not exists "Public read hotel services" on public.hotel_services for select using (true);
create policy if not exists "Public read facilities" on public.facilities for select using (true);
create policy if not exists "Public read venues" on public.venues for select using (true);

insert into public.hotel_services (name, description, price_cents, duration_minutes, booking_url)
values
  ('Signature Personal Training', 'Private in-suite coaching with biometric tracking.', 24000, 60, 'https://booking.hotelfit.com/pt'),
  ('Thermal Reset Ritual', 'Cold plunge + infrared + breathwork concierge.', 28000, 75, 'https://booking.hotelfit.com/thermal'),
  ('Room Recovery Upgrade', 'Normatec compression + guided mobility kit.', 18000, 45, 'https://booking.hotelfit.com/recovery')
on conflict (id) do nothing;

insert into public.facilities (name, description, hours, icon, booking_url, image_url)
values
  ('Skyline Pool Deck', 'Heated infinity pools with DJ sunsets + cabanas.', '6am – 11pm', '🏖️', 'https://booking.hotelfit.com/cabana', '/assets/facilities/pool.jpg'),
  ('Recovery Lab', 'Infrared, cold plunge, compression boots, and lab techs.', '7am – 10pm', '❄️', 'https://booking.hotelfit.com/recovery-lab', '/assets/facilities/recovery.jpg'),
  ('Movement Studio', 'Reformers, yoga, and functional circuits overlooking the bay.', '24/7', '🧘', 'https://booking.hotelfit.com/studio', '/assets/facilities/studio.jpg')
on conflict (id) do nothing;

insert into public.venues (name, city, country, logo_url, hero_image_url, story)
values
  ('TS Suites Skyline', 'Bali', 'Indonesia', '/assets/logo.png', '/assets/hotel-bg.jpg', 'Residences engineered with HotelFit labs, thermal suites, and private gyms.')
on conflict (id) do nothing;
