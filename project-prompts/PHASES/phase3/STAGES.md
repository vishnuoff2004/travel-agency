# Phase 3 – Optimization & Scaling

## Goal
Improve application performance, add caching, background processing queues, and harden the platform for production-level traffic.

## Duration
Estimated: 2–3 Weeks

---

## Stage 1 — Setup

### REQ‑IDs: REQ‑014, REQ‑020, REQ‑034
### TEST‑IDs: TEST‑020, TEST‑026, TEST‑039

### Tasks
- Install BullMQ and Redis for background processing
- Install express-rate-limit
- Setup basic cron container for backups

### TDD Flow
1. Write test: rate limiter blocks > 100 requests (TEST-039)
2. Run → fail
3. Implement: add express-rate-limit middleware
4. Run → pass
5. Refactor: tune rate limits per route

---

## Stage 2 — Architecture

### REQ‑IDs: REQ‑014, REQ‑015, REQ‑019
### TEST‑IDs: TEST‑020, TEST‑021, TEST‑025

### Tasks
- Design and integrate caching layer (Redis)
- Design structured logging strategy (Winston)
- Set up BullMQ workers for heavy tasks

### TDD Flow
1. Write test: logging middleware captures request details (TEST-025)
2. Run → fail
3. Implement: Winston logger
4. Run → pass
5. Refactor: centralize log formats

---

## Stage 3 — Database

### REQ‑IDs: REQ‑014, REQ‑020
### TEST‑IDs: TEST‑020, TEST‑026

### Tasks
- Add indexes to `users`, `bookings`, `drivers` tables for faster searching
- Create automated backup script using mysqldump

### TDD Flow
1. Write test: search query uses indexes (verify via EXPLAIN) (TEST-020)
2. Run → fail
3. Implement: Sequelize migrations for indexes
4. Run → pass
5. Refactor: optimize queries

---

## Stage 4 — Backend

### REQ‑IDs: REQ‑014, REQ‑019, REQ‑034
### TEST‑IDs: TEST‑020, TEST‑025, TEST‑039

### Tasks
- Implement pagination across all list APIs
- Add Redis caching to GET `/api/search`
- Apply rate limiting middleware globally

### TDD Flow
1. Write test: paginated API returns limited results (TEST-020)
2. Run → fail
3. Implement: update controllers with limit/offset
4. Run → pass
5. Refactor: create generic pagination middleware

---

## Stage 5 — Frontend

### REQ‑IDs: REQ‑014
### TEST‑IDs: TEST‑020

### Tasks
- Implement React.lazy and Suspense for route splitting
- Add skeleton loaders for data fetching
- Implement infinite scroll or pagination controls on list views

### TDD Flow
1. Write test: skeleton loader renders while fetching
2. Run → fail
3. Implement: React Suspense fallbacks
4. Run → pass
5. Refactor: extract common loader component

---

## Stage 6 — State

### REQ‑IDs: REQ‑014
### TEST‑IDs: TEST‑020

### Tasks
- Implement client-side caching (e.g., React Query or SWR)
- Request deduplication on Axios interceptors

### TDD Flow
1. Write test: duplicate API calls are cancelled
2. Run → fail
3. Implement: request cancellation logic
4. Run → pass
5. Refactor: clean up Axios instance

---

## Stage 7 — Auth

### REQ‑IDs: REQ‑017
### TEST‑IDs: TEST‑023

### Tasks
- Security audit of authentication flows
- Ensure proper logging of failed login attempts
- Fine-tune rate limits specifically for `/api/auth/login` to prevent brute force

### TDD Flow
1. Write test: brute force login triggers rate limit (TEST-023)
2. Run → fail
3. Implement: strict rate limit for auth routes
4. Run → pass
5. Refactor: move constants to `.env`

---

## Stage 8 — Integration

### REQ‑IDs: REQ‑014, REQ‑019
### TEST‑IDs: TEST‑020, TEST‑025

### Tasks
- Connect queue system (BullMQ) to notification events
- E2E testing of background processing
- Ensure cached endpoints invalidate correctly on POST/PATCH

### TDD Flow
1. Write integration test: cache is invalidated on resource update
2. Run → fail
3. Implement: Redis cache invalidation logic
4. Run → pass
5. Refactor: centralize cache keys

---

## Stage 9 — Testing

### REQ‑IDs: REQ‑014, REQ‑015, REQ‑016
### TEST‑IDs: TEST‑020, TEST‑021, TEST‑022

### Tasks
- Execute load testing with Artillery or JMeter (TEST-020, TEST-021)
- Simulate container failures to test graceful degradation (TEST-022)
- Restore from backup test (TEST-026)

### TDD Flow
1. Execute load test
2. Identify bottlenecks
3. Fix implementation (add more caching/indexes)
4. Re-run load test → pass
5. Refactor performance critical code

---

## Stage 10 — Deployment

### REQ‑IDs: REQ‑022, REQ‑024, REQ‑025, REQ‑026
### TEST‑IDs: TEST‑028, TEST‑030, TEST‑031

### Tasks
- Build CI/CD pipeline using GitHub Actions (lint, test, build) (REQ-022)
- Configure Docker multi-stage builds (REQ-025)
- Run license compliance check (REQ-026)
- Tag release `v3.0.0-optimization`

### TDD Flow
1. Write test: CI workflow executes successfully on PR (TEST-028)
2. Run → fail
3. Implement: `.github/workflows/ci.yml`
4. Run → pass
5. Refactor: speed up build cache
