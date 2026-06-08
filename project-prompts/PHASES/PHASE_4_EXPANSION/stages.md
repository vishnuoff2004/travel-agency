File: /project-prompts/PHASES/PHASE_4_EXPANSION/stages.md

# Phase 4 — Stages

---

## STAGE 1: Setup
**REQ-IDs:** REQ-053, REQ-054, REQ-057, REQ-058
**TEST-IDs:** TEST-053, TEST-054, TEST-057, TEST-058
**Steps:**
- Install npm packages: `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`, `prom-client`
- Create `docker-compose.yml` at project root with Grafana (port 3001) and Prometheus (port 9090) services; configure Prometheus to scrape the backend at `http://backend:4000/metrics` every 15s
- Create Prometheus config file `prometheus.yml` with a scrape config targeting the backend service
- Create placeholder `i18n.ts` config file exporting an `i18next` instance (no real translations yet)
- Move Prometheus config path to a `.env` variable (`PROMETHEUS_CONFIG_PATH`)
- Extract i18next initialization into a dedicated `src/i18n/index.ts` module
- Pin Grafana and Prometheus image versions in `docker-compose.yml` for reproducibility (e.g., `grafana/grafana:10.2.0`, `prom/prometheus:v2.48.0`)

## STAGE 2: Architecture
**REQ-IDs:** REQ-053, REQ-057, REQ-058
**TEST-IDs:** TEST-053, TEST-057, TEST-058
**Steps:**
- Create i18n architecture (`src/i18n/index.ts`) with `Backend`, `LanguageDetector`, `initReactI18next`, configured with `fallbackLng: 'en'`, `supportedLngs: ['en', 'hi']`, `detection.order: ['cookie', 'localStorage', 'navigator']`, and `backend.loadPath: '/locales/{{lng}}/translation.json'`
- Create monitoring architecture (`src/monitoring/prometheus.ts`) with `prom-client` default metrics collection and a custom `http_request_duration_seconds` histogram with buckets `[0.01, 0.05, 0.1, 0.5, 1, 5]` and labels `method`, `route`, `status_code`
- Create `grafana/dashboards/travel-agency.json` with UID `"travel-agency-metrics"` containing panels for HTTP request duration, active users, and server resource usage
- Extract histogram bucket configuration into a constants file (`src/monitoring/constants.ts`)
- Add TypeScript interfaces for i18n config options to enable stricter validation
- Split the Grafana dashboard JSON into multiple panel JSON files under `grafana/panels/` and compose them at deploy time

## STAGE 3: Database
**REQ-IDs:** REQ-055, REQ-056
**TEST-IDs:** TEST-055, TEST-056
**Steps:**
- Create Knex migration `migrations/20260608000001_add_announcements_events.ts` with `announcements` table (id UUID PK, title VARCHAR 255, body TEXT, type VARCHAR 20 with CHECK IN `['info','warning','urgent']`, active BOOLEAN default true, created_at TIMESTAMP, updated_at TIMESTAMP) and `events` table (id UUID PK, title VARCHAR 255, description TEXT, start_date TIMESTAMP, end_date TIMESTAMP, location VARCHAR 255, organizer_id UUID FK to users, created_at TIMESTAMP, updated_at TIMESTAMP)
- Create Knex migration `migrations/20260608000002_add_notifications.ts` with `notifications` table (id UUID PK, user_id UUID FK to users NOT NULL, title VARCHAR 255, body TEXT, type VARCHAR 50 default `'info'`, is_read BOOLEAN default false, created_at TIMESTAMP)
- Add composite indexes: `idx_notifications_user_read` on `(user_id, is_read)`, `idx_announcements_active` on `(active)`, `idx_events_dates` on `(start_date, end_date)`
- Add `ON UPDATE CASCADE` to foreign keys for consistency
- Add `updated_at` trigger to automatically refresh the timestamp on row update for `announcements` and `events`

## STAGE 4: Auth
**REQ-IDs:** REQ-055
**TEST-IDs:** TEST-055
**Steps:**
- Create RBAC middleware `src/middleware/requireRole.ts` that accepts a list of roles, returns 401 if `req.user` is missing, and returns 403 if the user's role is not in the allowed list
- Register admin route groups in `src/routes/admin.ts` with `requireRole('admin')` middleware, including routes for POST/DELETE/PUT on `/announcements`, `/announcements/:id`, `/events`, `/events/:id`
- Mount the admin router in `app.ts` at `/api/admin`
- Ensure JWT payload includes `role` claim during login — update existing auth logic if needed
- Combine `requireRole` checks into a reusable `Authorize` decorator pattern or higher-order function that also validates resource ownership
- Add rate limiting to admin endpoints (e.g., 100 requests per minute per admin) using `express-rate-limit`
- Log all RBAC denial events to the monitoring system for audit trail

## STAGE 5: Backend
**REQ-IDs:** REQ-053, REQ-054, REQ-055, REQ-056, REQ-057
**TEST-IDs:** TEST-053, TEST-054, TEST-055, TEST-056, TEST-057
**Steps:**
- Add Express static serving for `/locales` from `public/locales/`; create `public/locales/en/translation.json` and `public/locales/hi/translation.json` with complete key-value pairs for all UI strings
- Create language detection middleware `src/middleware/languageDetector.ts` that reads `Accept-Language`, validates against supported languages `['en', 'hi']`, and sets `req.language`
- Create announcements controller with `listActive` (paginated query for active announcements), `create` (Joi validation, insert, return 201), `update` (validate params, update by ID), `remove` (soft-delete by setting `active = false`)
- Create events controller with `list` (support `start_date` and `end_date` query filters, paginated), `create`, `update`, `remove` (admin-only CRUD)
- Create notifications controller with `list` (user-scoped, newest first), `listUnread` (add `AND is_read = false`), `markRead` (update by ID and user_id), `markAllRead` (update all by user_id); trigger notification creation on booking confirmation event
- Mount `GET /metrics` endpoint using `register.metrics()` from `prom-client`
- Mount `GET /api/health` endpoint returning `{ status: 'ok', uptime: process.uptime() }`
- Move translation JSON files to a CDN path configuration variable for production
- Implement cursor-based pagination for notifications instead of offset-based for performance
- Add request-scoped metrics labels for route parameters (sanitized to avoid cardinality explosion)
- Add a metrics middleware that automatically records duration for every route via `httpRequestDuration.observe()`

## STAGE 6: Frontend
**REQ-IDs:** REQ-053, REQ-054, REQ-055, REQ-056, REQ-026, REQ-027, REQ-036
**TEST-IDs:** TEST-053, TEST-054, TEST-055, TEST-056
**Steps:**
- In `src/index.tsx`, import and initialize `i18n` from `src/i18n/index.ts`; wrap `<App />` with `<I18nextProvider i18n={i18n}>`
- Create English translation file `public/locales/en/translation.json` with full key set: `nav.home`, `nav.bookings`, `nav.admin`, `nav.events`, `nav.notifications`, `booking.status.confirmed`, `booking.status.pending`, `booking.status.cancelled`, `announcement.title`, `events.title`, `events.noUpcoming`, `notification.title`, `notification.markAllRead`, `language.switcher.english`, `language.switcher.hindi`
- Create Hindi translation file `public/locales/hi/translation.json` with all keys translated to Hindi
- Create `LanguageSwitcher` component that renders two buttons, calls `i18n.changeLanguage(lng)` on click, highlights active language with `active` class, and uses `useTranslation()` for button labels
- Create `AnnouncementBanner` component that fetches `GET /api/announcements` on mount, renders a dismissible banner for each active announcement color-coded by type (info=blue, warning=yellow, urgent=red), and uses `useTranslation()` for the "Dismiss" button text
- Create `EventsPage` component that fetches `GET /api/events` with optional date range filters, displays cards with title/date range/location/description, and shows empty-state via translation key `events.noUpcoming`
- Create `NotificationCenter` component that fetches `GET /api/notifications` on mount, displays a list with title/body preview/timestamp/read-unread styling, has "Mark all as read" button calling `PATCH /api/notifications/read-all`, and shows unread count badge in the nav bar
- Update `<NavBar />` to show translated labels via `useTranslation()` for REQ-026/REQ-027/REQ-036 enhancements
- Extract all API fetch calls into a custom hook `useApi` with built-in language header injection
- Memoize translation function calls in list renders with `useMemo` to avoid re-renders
- Add skeleton loading states for EventsPage and NotificationCenter while data is fetching
- Implement virtual scrolling for notification lists exceeding 50 items

## STAGE 7: State
**REQ-IDs:** REQ-053, REQ-054, REQ-056
**TEST-IDs:** TEST-053, TEST-054, TEST-056
**Steps:**
- Configure `i18next-browser-languagedetector` with `localStorage` cache: set detection order to `['localStorage', 'cookie', 'navigator']` and enable `caches: ['localStorage']`
- Create `NotificationContext` (`src/contexts/NotificationContext.tsx`) with `unreadCount`, `notifications`, `markAsRead`, `markAllAsRead`, and `refreshNotifications` — fetch both all notifications and unread count on mount, optimistically decrement `unreadCount` on `markAsRead`, set to 0 on `markAllAsRead`
- Wrap the app root with `<NotificationProvider>` in `App.tsx`
- Wire the unread count into the nav bar badge component
- Move optimistic update logic into a custom hook `useOptimisticUnread` to separate concerns from the context provider
- Add WebSocket connection inside `NotificationProvider` for real-time notification push and unread count increment
- Extract `localStorage` language persistence into a dedicated `LanguagePersistenceService` for easier testing

## STAGE 8: Integration
**REQ-IDs:** REQ-053, REQ-054, REQ-055, REQ-056, REQ-057, REQ-058
**TEST-IDs:** TEST-053, TEST-054, TEST-055, TEST-056, TEST-057, TEST-058
**Steps:**
- Add translation key parity CI check script (`scripts/check-translations.ts`) that loads both locale JSON files, diffs their key sets, and fails the build if keys differ
- Wire notification trigger in `src/controllers/bookings.ts`: after a booking is confirmed, call `notificationsService.create({ userId, title: 'Booking Confirmed', body: `Booking ${ref} confirmed`, type: 'booking' })`
- Create Grafana auto-provisioning config: `grafana/provisioning/datasources/prometheus.yml` with URL `http://prometheus:9090` and `grafana/provisioning/dashboards/dashboard.yml` pointing to dashboard JSON path
- Create Cypress end-to-end test files: `cypress/e2e/phase4-language.cy.ts`, `cypress/e2e/phase4-announcements.cy.ts`, `cypress/e2e/phase4-notifications.cy.ts` using `cy.session()` for login persistence
- Ensure backend, frontend, Prometheus, and Grafana are on the same Docker network so service discovery works
- Add a pre-commit hook that runs the translation key parity check automatically
- Consolidate Docker Compose overrides into a `docker-compose.override.yml` for local dev vs CI environment separation
- Add readiness probes to Grafana and Prometheus services in Docker Compose to prevent race conditions in integration tests

## STAGE 9: Testing
**REQ-IDs:** REQ-053, REQ-054, REQ-055, REQ-056, REQ-057, REQ-058
**TEST-IDs:** TEST-053, TEST-054, TEST-055, TEST-056, TEST-057, TEST-058
**Steps:**
- Audit all components in `src/pages/`, `src/components/`, and `src/layouts/` for hardcoded UI strings; replace every instance with `t('key')` calls
- Fix announcement dismissal by using `localStorage.setItem('dismissed_announcements', JSON.stringify([...]))` and filtering out dismissed IDs on banner render
- Fix duplicate notification trigger by debouncing the booking confirmation event emitter with a 1-second dedup window using a Set of booking IDs
- Fix histogram cardinality by sanitizing route labels — replace UUIDs and numeric IDs with `:id` placeholders in the metrics middleware before observing
- Add `waitForScrape` utility that polls the `/metrics` endpoint until `up` metric is 1, with a 30-second timeout, before running dashboard assertions
- Extract the `waitForScrape` utility into a shared test helper (`test/helpers/waitForMetrics.ts`)
- Add a `test:phase4:watch` command that re-runs only Phase 4 tests on file changes
- Generate a consolidated Phase 4 coverage report with thresholds (minimum 80% line coverage for new code)
- Add a CI pipeline step that fails if translation key parity is broken between English and Hindi

## STAGE 10: Deployment
**REQ-IDs:** REQ-057, REQ-058
**TEST-IDs:** TEST-057, TEST-058
**Steps:**
- Update Docker Compose with all services: backend (port 4000, health check on `/api/health`), frontend (port 3000), db (postgres:15, health check with pg_isready), prometheus (`prom/prometheus:v2.48.0`, port 9090, health check on `/-/healthy`), grafana (`grafana/grafana:10.2.0`, port 3001, health check on `/api/health`) — all with proper health checks, volumes, and dependencies
- Update Prometheus config `prometheus.yml` with global scrape interval 15s and scrape config for job `travel-agency-backend` targeting `backend:4000` with metrics path `/metrics`
- Create Grafana provisioning files: `grafana/provisioning/datasources/prometheus.yml` with URL `http://prometheus:9090`, `isDefault: true`; `grafana/provisioning/dashboards/dashboard.yml` with provider pointing to `/var/lib/grafana/dashboards`
- Add a `.env.example` file documenting all required environment variables for the monitoring stack (`GF_SECURITY_ADMIN_PASSWORD`, `PROMETHEUS_PORT`, etc.)
- Create a `docker-compose.prod.yml` override with resource limits, replica counts, and production secrets management
- Add a `Makefile` with targets: `make up`, `make down`, `make logs-monitoring`, `make test-deployment` for operational convenience
- Configure Grafana alerting rules for: backend service down (Prometheus `up == 0` for 1m), high HTTP error rate (>5% 5xx responses over 5m), API latency p99 > 2s over 5m
- Add a `grafana/dashboards/alerts.json` with pre-configured alert channels (Slack, email) for on-call notification
