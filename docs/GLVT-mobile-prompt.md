# Antigravity Prompt: GLVT Gym Mobile Experience

Use this prompt inside Antigravity (or a comparable AI builder) to create a mobile-first experience for the GLVT Gym location within the white-label Hotel Fit Solutions platform.

## Context
- Brand: GLVT Gym (white-label deployment of the Hotel Fit Solutions stack).
- Facilities: 8 workout stations with rotating exercises, body-scan machines, nutrition access, and integrated booking + payment + membership flows.
- Existing: Web UX works on desktop but is not mobile friendly; we need a purpose-built mobile version.

## Goal
Deliver a mobile-native UX that feels like a premium gym companion: quick station selection, frictionless booking, rich body-scan insights, and easy membership + payments. Optimize for fast loading, offline resilience, and accessibility.

## Core User Stories
1. **Landing & Login**: Members can sign in/sign up (SSO, email, or magic link) and land on a personalized home with next reservations, current station queue, and active membership status.
2. **Station Guide (8 stations)**: Mobile carousel/grid listing each station with current workout cards (media, reps, timer, safety tips). Support quick-start timers, video/image galleries, and swipe navigation between stations.
3. **Body Scan Machines**: Users can book a scan, view historical scans (body fat, circumference, posture), and compare results over time with visual charts + AI insights.
4. **Bookings & Classes**: End-to-end booking flow for classes, stations, scans, and rooms (sauna, stretching, PT bay): availability view, time-slot picker, confirmation, reminders, and in-app notifications.
5. **Memberships & Payments**: Upgrade/downgrade plans, add payment methods, handle promo codes, and show transparent pricing + invoices/receipts.
6. **Nutrition Access**: Macro goals, meal plans, and recipe browser; optional barcode scanner/upload for logging; daily macro progress ring and hydration reminders.
7. **Dashboards & History**: Activity history (workouts, scans, bookings, facilities), streaks, badges, and export/share options.
8. **Support & Community**: In-app chat/support, FAQs, and optional community feed for class updates.
9. **Workout Plans & Logs**: Follow structured plans (beginner, hypertrophy, conditioning) with station-by-station workouts; log sets/reps/weight/RPE, auto-calc estimated 1RM, and show per-session summaries.
10. **Facility Explorer**: Browse GLVT facilities (weights area, cardio, sauna, recovery) with capacity/traffic indicators, equipment maps, and booking for reservable spaces.

## UX Requirements
- **Navigation**: Bottom nav with Home, Stations, Book, Body Scan, Profile. Contextual FAB for quick actions (start timer, book scan, log set, pay membership).
- **Home**: Hero with GLVT branding, today’s schedule card, next class CTA, station queue summary, nutrition ring, and shortcuts to body scan + payment.
- **Stations**: Card carousel optimized for thumb reach; each card shows station name, current workout, timer/rep controls, safety highlights, and media preview. Include offline-ready media caching and a persistent mini-player for video/audio cues. Quick toggles to mark sets as complete, adjust weights, or substitute exercises.
- **Booking Flow**: Mobile calendar + slot selector, capacity indicator, waitlist, notifications toggle, Apple/Google wallet pass for bookings. Include facility-specific booking rules (time caps, cooldowns), recurring sessions, and group booking invites.
- **Body Scan**: Guided flow with prep tips, booking confirmation, live status, and post-scan insights (charts, trendlines, recommendations). Allow PDF/CSV export and share. Surface deltas vs. last scan and auto-link to tailored workout/nutrition adjustments.
- **Membership/Payments**: PCI-compliant card entry, saved methods, Apple/Google Pay, invoices list, pause/cancel controls, and upgrade prompts from paywalled features.
- **Nutrition**: Macro targets, adjustable goals, recipe browser with filters (protein-forward, vegetarian, etc.), barcode scanner or photo upload entry point, hydration tracker widget. Syncs with workout logs to adjust recovery macros on heavy days.
- **Workout Plans & Logs**: Plan library with filters (goal, duration, equipment), dynamic daily cards, in-workout logging UI (sets/reps/weight/timer), rest timer, RPE input, auto-progression suggestions, and PR highlights. Export logs to CSV/Apple Health/Google Fit.
- **Facility Explorer**: Map/list of gym zones with live capacity (traffic heatmap), equipment availability badges, and booking for reservable stations/rooms. Integrate indoor navigation hints and maintenance notices.
- **Notifications**: Push + in-app banners for booking reminders, scan results ready, expiring memberships, and nutrition nudges; allow granular preferences.
- **Accessibility**: WCAG AA, large tap targets, high-contrast theme toggle, voice-over labels for all actions, haptic feedback on critical actions.

## Data & Integration Notes
- **Location Awareness**: Default location is GLVT Gym; pre-load its schedule, station metadata (8 stations), and machine availability.
- **State**: Support offline-first caching for schedules, station media, and user profile. Sync gracefully when back online.
- **APIs**: Booking, payments, memberships, body scans, and nutrition endpoints should be abstracted for white-label reuse. Include mock data for prototyping if live APIs are unavailable.
- **Security**: OAuth/Magic link auth, role-based access (member vs. staff), secure payment tokenization, audit logs for bookings + payments.
- **Telemetry & Coaching**: Capture workout telemetry (sets/reps/weight, time under tension, HR from wearables) and feed AI coach nudges. Allow staff override for form feedback and plan assignments.

## Mobile App Settings & Pilot Readiness (target: 10 users)
- **Build Targets**: Generate iOS + Android builds (or PWA) with the same branding bundle; enable splash screens, deep links, and app icon set for GLVT Gym.
- **Environment Config**: Single source of truth for API base URL, auth provider keys, payment processor keys, push notification keys, feature flags, and GLVT location ID. Ship a `pilot` profile throttled to 10 active users.
- **Accounts & Seats**: Provision 10 pilot member accounts + 2 staff accounts; enforce seat cap via feature flag or entitlement service. Include device registration + logout-all for lost devices.
- **Push & Notifications**: Enable APNs/FCM credentials, background fetch for bookings/queues, and granular notification toggles. Verify notification behavior on iOS + Android during the pilot.
- **Offline + Caching**: Pre-cache station media, workout plans, and recent bookings for 10 users; set cache TTLs and disk quotas; clearly show offline banners and sync status.
- **Payments & Compliance**: Sandbox mode for card wallets (Apple/Google Pay) and test cards; store invoices/receipts per user; ensure PCI scope is minimized with tokenization.
- **App Store Readiness**: App privacy labels, permissions copy (camera for barcode/scan upload, notifications, health data), crash reporting, analytics (opt-in), and SSO domain verification.
- **Monitoring & Limits**: Configure rate limits appropriate for 10 concurrent users (API + web sockets), alerts for booking/payment failures, and logging for workout telemetry ingestion.
- **QA Checklist**: Smoke-test flows with 10 pilot users: login, book class/station/scan, start workout timer, log sets/reps/weight, body scan view, payment, nutrition log, facility booking. Capture device/OS matrix and attach screenshots.

## Visual & Brand
- Use GLVT palette (deep charcoal, electric blue accents) with rounded cards and subtle gradients.
- Emphasize clarity and speed; minimize modal depth; prefer slide-up sheets for quick tasks.
- Provide light/dark themes; keep typography large and legible for gym environments.

## Flows to Prototype (minimum)
1. Login ➜ Home with upcoming booking + membership card.
2. Stations list ➜ Station detail ➜ Start timer ➜ Swipe to next station.
3. Book class/station/scan ➜ Select slot ➜ Confirm ➜ Add to wallet ➜ Notification preference.
4. Body scan booking ➜ Live status ➜ Results dashboard ➜ Trends comparison.
5. Membership upgrade ➜ Payment ➜ Receipt ➜ Unlock features.
6. Nutrition goal edit ➜ Log meal via barcode/photo ➜ Updated macro ring.
7. Choose workout plan ➜ Start session ➜ Log sets/reps/weight/RPE ➜ See PR highlights + recovery suggestions.
8. Facility explorer ➜ See live capacity ➜ Book sauna/PT bay ➜ Receive arrival reminder.

## Acceptance Criteria
- Mobile-first layout with performant animations and gesture support.
- Works responsively on 390px–430px widths; degrades gracefully on tablets.
- All primary flows reachable within 2 taps from Home or nav.
- Clear error/empty/loading states for bookings, payments, and scans.
- Internationalization-ready copy and centralized theming for white-label reuse.

Provide the generated UI and logic scaffolding, with component-level descriptions and API contract examples so developers can wire live data quickly.
