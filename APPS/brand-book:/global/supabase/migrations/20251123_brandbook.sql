create table if not exists brand_assets (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  type text not null, -- logo_primary, logo_secondary, logomark, logotype, mockup, pdf, other
  title text,
  description text,
  file_url text,
  thumb_url text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists brand_moodboard_images (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  file_url text not null,
  source text default 'upload', -- upload, ai, external
  weight numeric default 1,
  created_at timestamptz default now()
);

create table if not exists brand_logo_variants (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  variant_type text not null, -- main, monochrome, stacked, horizontal, submark
  file_url text not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists brand_typography_rules (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  display_font text,
  body_font text,
  usage text,
  dos text,
  donts text,
  sample_text text,
  created_at timestamptz default now()
);

create table if not exists brand_color_usage (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  name text,
  hex text,
  role text, -- primary, secondary, accent, background
  description text,
  created_at timestamptz default now()
);

create table if not exists brand_imagery_rules (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  style text,
  dos text,
  donts text,
  created_at timestamptz default now()
);
