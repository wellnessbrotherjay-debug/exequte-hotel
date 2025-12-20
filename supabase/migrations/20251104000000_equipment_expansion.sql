-- Expand equipment inventory and exercise mapping

create table if not exists equipment_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text not null,
  category_id uuid references equipment_categories(id) on delete set null,
  brand text,
  model text,
  level text check (level in ('bodyweight','entry','standard','premium')) default 'entry',
  footprint text,
  weight_capacity numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.equipment
  add column if not exists display_name text,
  add column if not exists brand text,
  add column if not exists model text,
  add column if not exists level text,
  add column if not exists footprint text,
  add column if not exists weight_capacity numeric,
  add column if not exists metadata jsonb default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'equipment_level_check'
  ) then
    begin
      alter table public.equipment
        add constraint equipment_level_check check (level in ('bodyweight','entry','standard','premium'));
    exception
      when duplicate_object then null;
    end;
  end if;
end$$;

alter table if exists public.equipment
  add column if not exists slug text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'equipment_slug_key'
  ) then
    begin
      alter table public.equipment add constraint equipment_slug_key unique (slug);
    exception
      when duplicate_object then null;
    end;
  end if;
end$$;

create table if not exists exercise_equipment (
  exercise_id uuid references exercises(id) on delete cascade,
  equipment_id uuid references equipment(id) on delete cascade,
  usage text check (usage in ('required','optional','variation')) default 'required',
  notes text,
  primary key (exercise_id, equipment_id)
);

create table if not exists room_equipment (
  room_id uuid references rooms(id) on delete cascade,
  equipment_id uuid references equipment(id) on delete cascade,
  quantity int check (quantity >= 0) default 1,
  notes text,
  primary key (room_id, equipment_id)
);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'equipment'
  ) then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'equipment'
        and column_name = 'category_id'
    ) then
      execute 'alter table public.equipment add column category_id uuid references public.equipment_categories(id) on delete set null';
    end if;

    execute 'create index if not exists idx_equipment_category on public.equipment(category_id)';
  end if;
end $$;

create index if not exists idx_exercise_equipment_equipment on exercise_equipment(equipment_id);
create index if not exists idx_room_equipment_room on room_equipment(room_id);


-- updated_at triggers reuse existing helper from base schema
do $$
begin
  if exists (
    select 1
    from pg_proc
    where proname = 'trigger_set_timestamp'
  ) then
    create trigger set_timestamp_equipment_categories
      before update on equipment_categories
      for each row
      execute function trigger_set_timestamp();

    create trigger set_timestamp_equipment
      before update on equipment
      for each row
      execute function trigger_set_timestamp();
  end if;
end $$;

-- seed baseline categories and equipment for development
insert into equipment_categories (slug, label, description, sort_order)
values
  ('bodyweight', 'Bodyweight', 'Exercises that require minimal or no equipment', 10),
  ('band', 'Resistance Bands', 'Various resistance levels for mobility and strength work', 20),
  ('strength', 'Strength Equipment', 'Dumbbells, kettlebells and strength tools', 30),
  ('cardio', 'Cardio', 'Cardio specific equipment', 40)
on conflict (slug) do update
set
  label = excluded.label,
  description = excluded.description,
  sort_order = excluded.sort_order;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'equipment' AND column_name = 'slug'
  ) THEN
    insert into equipment (slug, display_name, category_id, brand, model, level, metadata)
    select 'yoga_mat', 'Yoga / Exercise Mat', c.id, 'Generic', null, 'bodyweight', '{}'::jsonb
    from equipment_categories c
    where c.slug = 'bodyweight'
    on conflict (slug) do update
    set
      display_name = excluded.display_name,
      category_id = excluded.category_id,
      brand = excluded.brand,
      model = excluded.model,
      level = excluded.level,
      metadata = excluded.metadata;

    insert into equipment (slug, display_name, category_id, brand, model, level, metadata)
    select 'resistance_band_light', 'Resistance Band - Light', c.id, 'Generic', 'Light', 'entry', jsonb_build_object('tension_lbs', 20)
    from equipment_categories c
    where c.slug = 'band'
    on conflict (slug) do update
    set
      display_name = excluded.display_name,
      category_id = excluded.category_id,
      brand = excluded.brand,
      model = excluded.model,
      level = excluded.level,
      metadata = excluded.metadata;

    insert into equipment (slug, display_name, category_id, brand, model, level, metadata)
    select 'adjustable_dumbbell_pair', 'Adjustable Dumbbell Pair (5-50lb)', c.id, 'Generic', 'Selectorized Pair', 'standard', jsonb_build_object('min_weight_lb', 5, 'max_weight_lb', 50)
    from equipment_categories c
    where c.slug = 'strength'
    on conflict (slug) do update
    set
      display_name = excluded.display_name,
      category_id = excluded.category_id,
      brand = excluded.brand,
      model = excluded.model,
      level = excluded.level,
      metadata = excluded.metadata;
  END IF;
END$$;

-- Map sample exercises to equipment
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'equipment'
      and column_name = 'slug'
  ) then
    insert into exercise_equipment (exercise_id, equipment_id, usage)
    select e.id, eq.id, 'optional'
    from exercises e
    join equipment eq on eq.slug = 'yoga_mat'
    where e.slug in ('air_squat', 'plank', 'side_plank')
    on conflict do nothing;

    insert into exercise_equipment (exercise_id, equipment_id, usage)
    select e.id, eq.id, 'required'
    from exercises e
    join equipment eq on eq.slug = 'resistance_band_light'
    where e.slug in ('glute_bridge', 'reverse_lunge')
    on conflict do nothing;

    insert into exercise_equipment (exercise_id, equipment_id, usage)
    select e.id, eq.id, 'variation'
    from exercises e
    join equipment eq on eq.slug = 'adjustable_dumbbell_pair'
    where e.slug in ('air_squat', 'reverse_lunge')
    on conflict do nothing;
  end if;
end $$;
