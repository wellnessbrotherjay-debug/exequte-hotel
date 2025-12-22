create type marketing_channel as enum (
  'facebook_ads',
  'instagram_ads',
  'instagram_organic',
  'tiktok_ads',
  'tiktok_organic',
  'youtube',
  'email',
  'whatsapp',
  'in_room_tv',
  'website',
  'other'
);

create type asset_type as enum (
  'video',
  'image',
  'carousel',
  'copy',
  'script',
  'landing_page',
  'email_template'
);

create type run_type as enum ('ad', 'organic');

create type campaign_stage as enum (
  'idea',
  'brief',
  'production',
  'ready_to_schedule',
  'scheduled',
  'live',
  'completed',
  'paused'
);

create table if not exists brand_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_type text check (brand_type in ('hotel','gym','agency','other')) default 'gym',
  timezone text default 'Asia/Jakarta',
  meta_ad_account_id text,
  tiktok_ad_account_id text,
  google_analytics_property_id text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brand_accounts(id) on delete cascade,
  name text not null,
  objective text,
  stage campaign_stage default 'idea',
  primary_kpi text,
  budget_total numeric,
  start_date date,
  end_date date,
  brief jsonb,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_campaigns_brand_id on campaigns(brand_id);

create table if not exists campaign_channels (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  channel marketing_channel not null,
  status text default 'planned',
  daily_budget numeric,
  currency text default 'USD',
  targeting jsonb,
  placements jsonb,
  extra_config jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_campaign_channels_campaign_id on campaign_channels(campaign_id);

create table if not exists campaign_assets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  channel marketing_channel,
  asset_type asset_type not null,
  title text,
  description text,
  storage_provider text,
  file_url text,
  thumbnail_url text,
  copy_text text,
  language text default 'en',
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_campaign_assets_campaign_id on campaign_assets(campaign_id);

create table if not exists content_calendar (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  channel marketing_channel not null,
  asset_id uuid references campaign_assets(id) on delete set null,
  run_type run_type not null default 'ad',
  scheduled_at timestamptz not null,
  published_at timestamptz,
  status text default 'pending',
  external_post_id text,
  external_ad_set_id text,
  external_campaign_id text,
  tracking_url text,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_content_calendar_campaign_id on content_calendar(campaign_id);
create index if not exists idx_content_calendar_scheduled_at on content_calendar(scheduled_at);

create table if not exists ad_metrics_daily (
  id bigserial primary key,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  channel marketing_channel not null,
  external_campaign_id text,
  external_ad_set_id text,
  external_post_id text,
  metric_date date not null,
  impressions bigint default 0,
  clicks bigint default 0,
  leads bigint default 0,
  purchases bigint default 0,
  spend numeric default 0,
  revenue numeric,
  likes bigint default 0,
  comments bigint default 0,
  shares bigint default 0,
  video_plays bigint default 0,
  custom_events jsonb,
  pulled_at timestamptz default now()
);

create index if not exists idx_ad_metrics_campaign_date
  on ad_metrics_daily(campaign_id, metric_date);

create table if not exists campaign_insights (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  generated_at timestamptz default now(),
  summary text,
  recommendations text,
  raw_json jsonb
);

create index if not exists idx_campaign_insights_campaign_id on campaign_insights(campaign_id);
