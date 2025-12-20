-- Recipes master list to power detailed kitchen tickets
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  instructions text,
  ingredients jsonb not null default '[]'::jsonb,
  base_macros jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items
  add column if not exists recipe_id uuid references public.recipes(id),
  add column if not exists description text,
  add column if not exists base_macros jsonb not null default '{}'::jsonb;

create index if not exists menu_items_recipe_id_idx on public.menu_items(recipe_id);

alter table public.meal_orders
  add column if not exists room_number text,
  add column if not exists guest_name text,
  add column if not exists macro_adjustments jsonb not null default '{}'::jsonb,
  add column if not exists recipe_snapshot jsonb not null default '[]'::jsonb,
  add column if not exists kitchen_notes text,
  add column if not exists delivery_method text not null default 'room',
  add column if not exists ticket_ref text;

alter table public.meal_orders
  drop constraint if exists meal_orders_delivery_method_check,
  add constraint meal_orders_delivery_method_check check (delivery_method in ('room','pickup','dine_in'));

create index if not exists meal_orders_room_number_idx on public.meal_orders(room_number);

alter table public.recipes enable row level security;

create policy if not exists "Allow anon read recipes"
  on public.recipes
  for select
  using (true);

create policy if not exists "Service role manage recipes"
  on public.recipes
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
