# Hotel Fit Solutions — Full Suite v3.0

One CMS powering TV, digital signage, fitness, food & beverage, CRM, and analytics. Tech stack stays Next.js 14 (App Router) + Supabase + Vercel, with optional Mux/Bunny for video delivery and connectors to PMS/POS/Accounting/HRM systems.

---
## 0. Executive Blurb
Hotel Fit Solutions is a multi-tenant hospitality wellness OS. One CMS controls in-room TV workouts, lobby/restaurant signage, gym leaderboards, room-service menus, stock, recipe costing, POS sync, and guest wellness CRM. Analytics track every screen impression, video play, and order. Core tech: Next.js (Vercel) + Supabase (Auth/DB/Storage/Edge) plus optional Mux/Bunny CDN, with connectors for PMS/POS/Accounting/HRM.

## 1. Product Modules
### A. Screens & TV
- **HotelTV WebApp** – smart-TV browser / HDMI stick friendly.
- **Digital Signage** – lobby, restaurant, spa, elevator.
- **Gym Display** – classes, HRM zones, leaderboards.
- **Kitchen Display (KDS)** – live orders.

### B. Fitness
- Workout library (video + timer + difficulty).
- In-room programs (Beginner / Intermediate / 20-min express).
- HRM overlay (class mode, zones, kcal).
- Trainer CRM (clients, sessions, progress).

### C. Food & Beverage
- Menu builder (pricing, allergens, nutrition).
- Recipe costing (BOM, food-cost %, margin warnings).
- Inventory & purchasing (stock, suppliers, POs, FIFO/expiry).
- POS sync (orders, sales, stock deduction, price pushes).

### D. CRM & Analytics
- Guest profiles (preferences, goals, diet flags).
- Wellness scores (engagement index).
- Revenue & margins (F&B, programs, upsells).
- Reports (screen impressions, video plays, item profitability).

### E. Admin / CMS
- Multi-property tenants, roles & permissions.
- Drag-and-drop content scheduling.
- Real-time publish to TV / Signage / Gym / KDS.
- API keys for PMS / POS / Accounting / HRM integrations.

## 2. Architecture
- **Frontend:** Next.js + React + Tailwind (TV-safe presets), API routes for SSR where needed.
- **Backend:** Supabase Postgres + Auth + Storage + Edge Functions.
- **Storage/CDN:** Supabase Storage for images/docs, Mux/Bunny for video.
- **Hosting:** Vercel (app) + Supabase Cloud (DB).
- **Integrations:** REST/GraphQL connectors (Opera/Cloudbeds, Micros/Lightspeed/Square, Xero/QB, Whoop/Garmin/Polar).
- **Multi-tenancy:** Every table scoped by `hotel_id`; RLS enforces isolation.

## 3. Database Schema (migration snippet)
Paste into `supabase/migrations/2025_11_12_hfs_v3.sql`.

```sql
-- Tenancy & Users
create table hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  timezone text default 'Asia/Makassar',
  created_at timestamptz default now()
);

create table staff_users (
  id uuid primary key default auth.uid(),
  hotel_id uuid references hotels(id) on delete cascade,
  email text unique not null,
  role text check (role in ('admin','manager','trainer','chef','frontdesk','viewer')) not null,
  display_name text,
  created_at timestamptz default now()
);

-- Screens & Playlists
create table screens (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  code text unique,
  type text check (type in ('tv','signage','gym','kds')) not null,
  location text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table playlists (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  target text check (target in ('tv','signage','gym','kds')) not null
);

create table playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid references playlists(id) on delete cascade,
  order_index int not null,
  content_type text check (content_type in ('video','image','html','offer','menu','workout')) not null,
  content_ref uuid,
  start_time time,
  end_time time
);

-- Media Library
create table videos (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  category text,
  duration_seconds int,
  storage_url text,
  thumbnail_url text,
  level text,
  created_at timestamptz default now()
);

-- Fitness
create table workouts (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text not null,
  video_id uuid references videos(id),
  duration_minutes int,
  tags text[],
  equipment text[],
  calories_est int
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  trainer_id uuid references staff_users(id),
  capacity int,
  hrm_enabled boolean default false
);

create table class_attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  guest_id uuid,
  checked_in_at timestamptz default now(),
  hrm_session_id text
);

-- F&B / Inventory
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  unit text not null,
  cost_per_unit numeric(10,4) not null,
  allergen text[],
  kcal_per_unit numeric(10,2),
  protein_per_unit numeric(10,2),
  carbs_per_unit numeric(10,2),
  fat_per_unit numeric(10,2),
  supplier_id uuid
);

create table inventory_batches (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  qty numeric(14,3) not null,
  received_at date not null,
  expiry_date date,
  unit_cost numeric(10,4) not null
);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  yield_qty numeric(10,3) not null,
  yield_unit text not null,
  prep_time_min int,
  method text
);

create table recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  qty numeric(12,3) not null,
  unit text not null
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  recipe_id uuid references recipes(id),
  name text not null,
  category text,
  sale_price numeric(10,2) not null,
  is_active boolean default true,
  allergens text[],
  calories numeric(10,2),
  macros jsonb
);

-- Orders / POS Mirror
create table orders (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  created_at timestamptz default now(),
  origin text check (origin in ('room','restaurant','gym','spa','tablet','tv')),
  room_number text,
  guest_id uuid,
  status text check (status in ('pending','in_kitchen','ready','served','paid','cancelled')) default 'pending',
  pos_ref text
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  qty int not null,
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) generated always as (qty * unit_price) stored
);

-- Suppliers & POs
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  contact jsonb
);

create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  status text check (status in ('draft','sent','received','cancelled')) default 'draft',
  created_at timestamptz default now()
);

create table purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  ingredient_id uuid references ingredients(id),
  qty numeric(12,3) not null,
  unit text not null,
  unit_price numeric(10,4) not null
);

-- Offers / Promos
create table offers (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  title text,
  body text,
  starts_at timestamptz,
  ends_at timestamptz,
  target text[]
);

-- Analytics
create table analytics_events (
  id bigserial primary key,
  hotel_id uuid references hotels(id) on delete cascade,
  actor_type text,
  actor_id uuid,
  event text,
  ref_id uuid,
  meta jsonb,
  happened_at timestamptz default now()
);
```

*Enable RLS everywhere with `hotel_id` scoping; staff role gates CRUD per module.*

## 4. API Surface (Next.js Routes / Edge Functions)
- **Public**
  - `GET /api/screens/:code/playlist` – merged playlist for TV/signage.
  - `GET /api/tv/home?hotel_id=...` – hero config, quick actions.
- **Fitness**
  - `GET /api/workouts?hotel_id=&tag=`
  - `GET /api/videos/:id`
  - `POST /api/classes/:id/checkin` → `{ guest_id }`.
- **F&B**
  - `GET /api/menu?hotel_id=&category=`
  - `POST /api/orders` → `{hotel_id, origin, room_number, items}`
  - `POST /api/orders/:id/status` → `{ status }`
- **Inventory**
  - `GET /api/ingredients?hotel_id=`
  - `POST /api/po`
  - `POST /api/inventory/receive`
- **Analytics**
  - `POST /api/track`
  - `GET /api/reports/overview?hotel_id=`

Edge Functions protect stock deduction, cost computation, and POS callbacks.

## 5. Core Logic
- **Dynamic Screen Logic:** time-of-day playlists; optionally occupancy/weather-aware promotions.
- **Recipe Cost & Margin:** `recipe_cost = Σ(recipe_items.qty * ingredient.unit_cost)`; portion cost & margin warnings in CMS.
- **Stock Deduction:** FIFO depletion on `order_items` insert using recipe BOM.
- **HRM Overlay:** classes marked `hrm_enabled` show live zones from HRM WebSocket/vendor feeds.

## 6. Example Queries
```sql
-- Top 10 profitable menu items (yesterday)
select mi.name,
       sum(oi.qty) as qty_sold,
       sum(oi.line_total) as revenue,
       round(avg(mi.sale_price)::numeric,2) as avg_price
from order_items oi
join orders o on o.id = oi.order_id
join menu_items mi on mi.id = oi.menu_item_id
where o.hotel_id = :hotel_id
  and o.created_at::date = (now() at time zone 'Asia/Makassar')::date - 1
group by mi.name
order by revenue desc
limit 10;
```
```sql
-- Food-cost %
select mi.id, mi.name, mi.sale_price,
       get_portion_cost(mi.id) as portion_cost,
       round(100*(1 - get_portion_cost(mi.id)/mi.sale_price),2) as margin_percent
from menu_items mi
where mi.hotel_id = :hotel_id and mi.is_active = true;
```
```sql
-- Screen engagement
select date_trunc('day', happened_at) as day,
       count(*) filter (where event='video_play')    as video_plays,
       count(*) filter (where event='menu_view')     as menu_views,
       count(*) filter (where event='order_submit')  as orders
from analytics_events
where hotel_id = :hotel_id
group by 1 order by 1 desc;
```

## 7. Frontend Notes (Next.js)
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`.
- TV Home: `app/tv/[code]/page.tsx` fetches screen/playlist → render hero tiles.
- Menu Page: `app/menu/page.tsx?hotel_id=` fetch → build cart → POST `/api/orders`.
- Admin CMS: `/app/admin` (Supabase Auth + RLS) covering Screens, Playlists, Videos, Workouts, Menu, Inventory, Orders, Reports, Settings.

## 8. Integrations (Pilot Priority)
1. POS: Oracle Micros or Lightspeed (menu pushes, order webhooks, payments).
2. Accounting: Xero/QuickBooks nightly sales & COGS export.
3. PMS: Opera/Cloudbeds for room/guest matching.
4. HRM: Polar/Garmin/Whoop for live classes + summaries.

## 9. Roles & Permissions
- **admin** – tenancy, billing, API keys.
- **manager** – content, pricing, reports.
- **chef** – inventory, recipes, KDS, POs.
- **trainer** – workouts/classes, gym display, client notes.
- **frontdesk** – orders, bookings, quick edits.
- **viewer** – read-only reports.

## 10. Pricing Model
| Tier | Includes | Price Example |
| --- | --- | --- |
| Basic | TV + Signage + 20 videos + Menu viewer | $5/room/mo |
| Pro | + POS sync + Inventory + Recipe Costing + Gym Display | $12/room/mo |
| Enterprise | + CRM + Analytics + Staff training + SLA | $20/room/mo |

Add-ons: custom content, AI personalization, multi-property analytics.

## 11. Demo Script (5 minutes)
1. Open TV home (dynamic greeting). Launch 10-min stretch workout.
2. Return, order “Power Bowl” → Room 1208 → order sent.
3. Switch to KDS → order appears → mark “Ready” → front desk sees update.
4. Admin CMS → update bowl price + publish promo → signage updates.
5. Analytics dashboard → yesterday’s sales, food-cost %, top videos.

## 12. Roadmap
- **Q1:** POS + inventory live; analytics v1; 50 workout videos.
- **Q2:** PMS guest-link + loyalty; HRM live classes; AI menu recs.
- **Q3:** Partner marketplace; chain dashboards; white-label program.

## 13. Why We Win
“at-visions power + Peloton vibes + VHPS control = one hospitality wellness OS.” We make guests healthier and F&B smarter — with one login.

---
## Immediate Next Steps
1. **Create migration** from Section 3 (use Supabase CLI) to scaffold the new schema.
2. **Map existing data** to tenant-aware tables (add `hotel_id` columns, backfill, update RLS).
3. **Stand up APIs** listed in Section 4 (Next.js routes + Edge Functions where sensitive).
4. **Design CMS screens** for playlists, menu builder, inventory, and analytics views.
5. **Upgrade front-end** flows (TV home, menu ordering, KDS, signage scheduler) to read from new APIs.
6. **Integrations pilots** – choose one PMS + one POS partner and build the adapters.
