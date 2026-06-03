# Phase 4 – Future Expansion & Monitoring

## Goal
Prepare the platform for long-term growth with internationalization, community features, and production monitoring dashboards.

## Duration
Estimated: 2–4 Weeks

---

## Stage 1 — Setup

### REQ‑IDs: REQ‑021, REQ‑027
### TEST‑IDs: TEST‑027, TEST‑032

### Tasks
- Install i18next and react-i18next packages
- Set up Prometheus and Grafana containers in docker-compose

### TDD Flow
1. Write test: local monitoring stack initializes (TEST-032)
2. Run → fail
3. Implement: add docker-compose services for monitoring
4. Run → pass
5. Refactor: separate dev and prod docker configs

---

## Stage 2 — Architecture

### REQ‑IDs: REQ‑021
### TEST‑IDs: TEST‑027

### Tasks
- Configure i18next backend provider
- Create JSON translation files structure (en, es, hi, etc.)
- Set up Prometheus metrics exporter in Express

### TDD Flow
1. Write test: Prometheus endpoint `/metrics` returns data
2. Run → fail
3. Implement: Express metrics middleware
4. Run → pass
5. Refactor: abstract metric collection

---

## Stage 3 — Database

### REQ‑IDs: REQ‑035
### TEST‑IDs: TEST‑040, TEST‑041

### Tasks
- Create community/announcements tables (optional expansion)
- Prepare data seed script for admin import (REQ-035)

### TDD Flow
1. Write test: admin import script populates DB correctly (TEST-040)
2. Run → fail
3. Implement: CSV parser and bulk insert logic
4. Run → pass
5. Refactor: handle import errors gracefully

---

## Stage 4 — Backend

### REQ‑IDs: REQ‑021, REQ‑035
### TEST‑IDs: TEST‑027, TEST‑040

### Tasks
- Create `/api/admin/import` endpoint for bulk seeding
- Implement i18n error message resolution on backend

### TDD Flow
1. Write test: API returns localized error based on Accept-Language header (TEST-027)
2. Run → fail
3. Implement: i18n middleware for errors
4. Run → pass
5. Refactor: map specific error codes to translation keys

---

## Stage 5 — Frontend

### REQ‑IDs: REQ‑021
### TEST‑IDs: TEST‑027

### Tasks
- Replace hardcoded strings with `t()` function from i18next
- Add Language switcher UI component to header
- Implement community/announcement feed UI

### TDD Flow
1. Write test: language switch changes UI text (TEST-027)
2. Run → fail
3. Implement: `useTranslation` hook and JSON dictionaries
4. Run → pass
5. Refactor: lazy-load translation files

---

## Stage 6 — State

### REQ‑IDs: REQ‑021
### TEST‑IDs: TEST‑027

### Tasks
- Manage language preference in Context and local storage
- Connect Axios to send language headers on every request

### TDD Flow
1. Write test: selected language persists across sessions
2. Run → fail
3. Implement: local storage sync for i18next
4. Run → pass
5. Refactor: use URL parameter for language fallback

---

## Stage 7 — Auth

### REQ‑IDs: REQ‑027
### TEST‑IDs: TEST‑032

### Tasks
- Secure Prometheus metrics endpoint (Basic Auth or internal network only)
- Secure Grafana dashboards (admin only)

### TDD Flow
1. Write test: `/metrics` is not accessible publicly (TEST-032)
2. Run → fail
3. Implement: auth middleware on metrics route
4. Run → pass
5. Refactor: internal IP whitelisting

---

## Stage 8 — Integration

### REQ‑IDs: REQ‑021, REQ‑035
### TEST‑IDs: TEST‑027, TEST‑040

### Tasks
- End-to-end test of language switching
- End-to-end test of admin CSV data import

### TDD Flow
1. Write integration test: full import flow from file upload to DB record (TEST-040)
2. Run → fail
3. Implement: connect frontend upload to backend import service
4. Run → pass
5. Refactor: add progress indicator for large imports

---

## Stage 9 — Testing

### REQ‑IDs: REQ‑021, REQ‑027, REQ‑035
### TEST‑IDs: TEST‑027, TEST‑032, TEST‑040, TEST‑041

### Tasks
- Ensure 100% test coverage on new import and localization features
- Verify self-hosted monitoring (no external calls made) (TEST-032)

### TDD Flow
1. Execute full Phase 4 test suite
2. Identify failures
3. Fix implementation
4. Re-run → all pass
5. Refactor: clean up test data

---

## Stage 10 — Deployment

### REQ‑IDs: REQ‑027
### TEST‑IDs: TEST‑032

### Tasks
- Pre-configure Grafana JSON dashboards for easy deployment
- Finalize production docker-compose with monitoring stack included
- Tag release `v4.0.0-expansion`

### TDD Flow
1. Write test: all 5 containers (frontend, backend, db, redis, monitoring) start successfully
2. Run → fail
3. Implement: final docker-compose tweaks
4. Run → pass
5. Refactor: create environment-specific overrides
