<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1EyQgwWs_8RSI4bZphgAeWo1ptNgOxh4k

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy the env template and fill in your keys (at minimum `GEMINI_API_KEY`):  
   `cp env/.env.example .env.local && open .env.local`
3. Run the app:
   `npm run dev`

## Global backend scaffold (Supabase + API)
- Supabase schema: `global/supabase/migrations/20251122_marketing.sql`
- Env example for backend: `global/env.local.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Supabase helpers: `global/src/lib/*`
- API route stubs (Next.js App Router style): `global/src/app/api/...` (`campaigns/create`, `brands/[id]`, `brands/[id]/brand-pack`, `campaigns/[id]/assets`, `campaigns/[id]/calendar`, `calendar/bulk-insert`, `metrics/bulk-insert`, `insights/insert`)
- Dashboard buttons call these endpoints with sample payloads to bridge frontend → backend.
