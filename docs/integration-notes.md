# Integration notes for v3.0 upgrade

This file explains how to run and verify the new v3.0 integration.

1. Environment
- Copy `.env.local.example` to `.env.local` and set values:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (server-side only)

2. Start dev

```bash
npm install
npm run dev
```

3. APIs
- `GET /api/menu?hotel_id=...` — returns active menu items with recipe/macros
- `POST /api/orders` — create order; body: { hotel_id, order, items }
- `PUT /api/orders` — update order; body: { hotel_id, order_id, updates }
- `POST /api/analytics` — log analytics events; body: { hotel_id, screen_code, event_type, payload }

4. Admin pages
- `app/admin/*` pages scaffolded: Screens, Playlists, Videos, Workouts, Menu, Inventory, Orders, Reports
- Pass `?hotel_id=...` in query string to filter data for a specific tenant

5. TV
- Visit `/tv/ROOM1234` (replace with actual screen code) to render playlist, workouts and menu tiles.

6. Security and RLS
- API routes use the server service role key for database access. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set only in server environment.
- All API queries filter by `hotel_id` where applicable to respect multi-tenant isolation.

7. Next steps
- Add CRUD forms for admin pages and wire up auth checks
- Add more robust error handling and input validation in APIs
- Add tests for API endpoints

