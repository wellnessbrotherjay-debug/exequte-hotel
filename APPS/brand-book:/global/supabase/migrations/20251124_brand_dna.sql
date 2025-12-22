create table if not exists brand_dna (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  personality jsonb,
  tone jsonb,
  colors jsonb,
  typography jsonb,
  imagery jsonb,
  forbidden_phrases text[],
  required_elements text[],
  last_trained_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists brand_consistency_reviews (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  asset_id uuid references campaign_assets(id) on delete set null,
  score jsonb,
  summary text,
  recommendations text,
  details jsonb,
  created_at timestamptz default now()
);

create table if not exists brand_dna_sources (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  file_url text,
  text_extracted text,
  colors jsonb,
  fonts jsonb,
  notes text,
  created_at timestamptz default now()
);
