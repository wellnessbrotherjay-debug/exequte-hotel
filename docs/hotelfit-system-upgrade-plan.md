# HotelFit System Upgrade Plan — AI Marketing & Automation

AI-driven upgrades for HotelFit to automate paid social, generate on-brand creatives, modernise email/CRM, and expose unified marketing analytics. Integrations target Lexi AI (Meta campaign automation), Omneky (creative gen/analytics), and a best-of-breed email provider (Klaviyo or Sendgrid).

---
## 1) Research Highlights
- **Lexi AI**: Hands-free Meta ads; analyses site URL, launches evergreen campaigns, auto-tunes targeting/budgets/creatives, swaps fatigued assets. Starter plan limits ad account and daily spend.
- **Omneky**: Brand-aligned image/video/copy gen via Brand LLM; predictive scores on creative elements; agentic A/B testing and optimisation; embedded editor (IMG.LY) for manual tweaks.
- **Email tools (ecomm.design index)**: Segmentation by behaviour/purchases, automated flows (welcome/abandonment/re-engagement), A/B testing and analytics, strong APIs/webhooks, transactional focus (Mandrill/Postmark).

## 2) Upgrade Goals → Modules
- **Ad Automation Engine**: Auto-create Meta campaigns, run dynamic creative gen, A/B tests, daily optimisation, budget controls, and performance storage.
- **AI Creative Suite**: Omneky-powered creative generation/analytics with brand assets + editable UI (IMG.LY or similar).
- **Email & CRM Automation**: Provider adapters (Klaviyo/Sendgrid) for segments, flows, transactional emails, and stats; surface via CRM Drip Center.
- **Marketing Dashboard**: Cross-channel view (ads, email, push), predictive insights, attribution to bookings/memberships, and Finance Suite linkage.
- **Data & Attribution**: Supabase tables for campaigns, creatives, daily performance, email metrics, and user-level attribution.

## 3) Implementation Blueprint (Code Prompts)
- **Lexi API wrapper (`lib/lexiApi.ts`)**
  - Auth via `process.env.LEXI_API_KEY` + `LEVI_API_SECRET`.
  - `createCampaign({ websiteUrl, adAccountId, dailyBudget }) → campaignId` using POST `/api/v1/campaigns`.
  - `getCampaignStats(campaignId)` → impressions, clicks, conversions, spend, ROAS via GET `/api/v1/campaigns/:id/stats`.
  - Strong typing, error handling, Jest tests with mocked fetch.
- **Omneky API wrapper (`lib/omnekyApi.ts`)**
  - Auth via `OMNEKY_API_KEY`, `BRAND_LLM_ID`.
  - `generateCreatives({ brandAssets, message }) → Creative[]` via POST `/api/v1/creative/generate`.
  - `getCreativeAnalytics(creativeId)` → predictive scores/insights via GET `/api/v1/creative/:id/metrics`.
  - Handle async headers/errors; Jest mocks.
- **Marketing Engine (`services/marketingEngine.ts`)**
  - Constructor injects Lexi API, Omneky API, Supabase client.
  - `launchCampaign` = Lexi `createCampaign` + Omneky `generateCreatives` + persist to Supabase.
  - `refreshCampaignStats` = pull Lexi metrics, upsert `marketing_campaign_performance`.
  - `optimiseCampaign` = apply Lexi/Omneky suggestions (budgets/creative rotation).
  - Daily scheduler (cron/serverless) and event emission `CAMPAIGN_UPDATED_EVENT`.
- **Email Provider Adapter (`services/emailProvider.ts`)**
  - Switch on `EMAIL_PROVIDER` (`klaviyo` | `sendgrid`).
  - `addSubscriber(email, profile)`, `triggerFlow(flowId, recipientId, data)`, `getCampaignStats(campaignId)`.
  - Provider specifics: Klaviyo list/flows endpoints; Sendgrid contacts/single sends/stats. Jest mocks.
- **Marketing Dashboard UI (`pages/admin/marketing.tsx` + `/api/marketing/stats`)**
  - Charts: daily spend vs conversions per campaign; creative performance pies (colours/copy themes from Omneky analytics); email metrics table.
  - Form to launch campaigns (budget, site URL) via Lexi.
  - Responsive, accessible; reuse existing design system (Tailwind/Chakra).
- **CRM Drip Center Enhancements**
  - Dropdowns for segments (Supabase query) and flow templates (provider API).
  - Timeline view of subscriber progress; call `EmailProvider.triggerFlow` on launch.

## 4) API Integration Notes
- **Lexi**: POST `https://api.lexi.ai/v1/campaigns`; GET `.../campaigns/{id}/stats`; POST `.../campaigns/{id}/optimise`. Pass API key/secret; respect starter spend caps.
- **Omneky**: POST `https://api.omneky.com/v1/creative/generate`; GET `.../creative/{id}/metrics`; POST `.../creative/{id}/edit`. Include `BRAND_LLM_ID`.
- **Email**:  
  - Klaviyo: POST `/api/v2/list/{list_id}/members`, GET `/api/v1/metrics/timeline`, POST `/api/v1/flows/{flow_id}/actions/{action_id}`.  
  - Sendgrid: PUT `/v3/marketing/contacts`, POST `/v3/marketing/singlesends`, GET `/v3/stats`.
- **Security**: Store keys in env; consider admin UI secrets vault; never log secrets.

## 5) Supabase Schema (run migration)
```sql
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,            -- e.g. 'meta', 'email'
    external_campaign_id TEXT NOT NULL,
    name TEXT,
    daily_budget NUMERIC,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_creatives (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    external_creative_id TEXT NOT NULL,
    type TEXT NOT NULL,                 -- 'image', 'video', 'copy'
    url TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_campaign_performance (
    id SERIAL PRIMARY KEY,
    campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    spend NUMERIC DEFAULT 0,
    roas NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_campaign_performance (
    id SERIAL PRIMARY KEY,
    campaign_id uuid,
    provider TEXT NOT NULL,
    date DATE NOT NULL,
    emails_sent BIGINT DEFAULT 0,
    opens BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_attribution (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
    source TEXT NOT NULL,               -- 'ad_click', 'email_click'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    additional_data JSONB
);
```
- Add indexes on `(campaign_id, date)` for performance tables; index `marketing_attribution (user_id, campaign_id)`.

## 6) Env Vars Checklist
- `LEXI_API_KEY`, `LEXI_API_SECRET`
- `OMNEKY_API_KEY`, `BRAND_LLM_ID`
- `EMAIL_PROVIDER` (`klaviyo` | `sendgrid`)
- `Klaviyo`: `KLAVIYO_API_KEY`, `KLAVIYO_LIST_ID`
- `Sendgrid`: `SENDGRID_API_KEY`
- Scheduler secrets for cron/serverless (if required).

## 7) Rollout Steps
- Confirm Lexi/Omneky account access and real endpoint shapes.
- Apply Supabase migration; backfill indexes.
- Implement wrappers/services/tests above; wire `/api/marketing/stats`.
- Build Marketing Dashboard + Drip Center enhancements; connect to event bus.
- End-to-end test: campaign launch → creative generation → metrics ingestion → dashboard/Finance Suite visibility → email flows and attribution signals.
