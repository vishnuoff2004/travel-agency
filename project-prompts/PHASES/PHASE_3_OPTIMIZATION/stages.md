File: /project-prompts/PHASES/PHASE_3_OPTIMIZATION/stages.md

# Phase 3 — Stages

---

## STAGE 1: Setup
**REQ-IDs:** REQ-049, REQ-050
**TEST-IDs:** TEST-049, TEST-050
**Steps:**
- Install npm packages: `npm install ioredis bullmq`
- Add `redis` service to `docker-compose.yml` with image `redis:7-alpine`, exposed port `6379`, named volume `redis-data`, `restart: unless-stopped`, and healthcheck via `redis-cli ping`
- Add `REDIS_URL=redis://redis:6379` to backend `.env` file
- Create `src/config/redis.ts` exporting a singleton `Redis` client via `ioredis`
- Create `src/config/queue.ts` exporting a BullMQ `Queue` instance for `booking-jobs` and a `Worker` instance with default processor stub
- Write tests: `tests/phase3/test_redis_connection.py` verifying `ping` returns `PONG` and `set`/`get` round-trip works
- Write tests: `tests/phase3/test_bullmq_setup.py` verifying job enqueue and worker processing within 5 seconds
- Refactor: Extract `redis.ts` config into shared `src/config/cache.ts` module
- Refactor: Wrap `Queue` and `Worker` instantiation in factory functions for testability
- Refactor: Move queue connection options into a typed `QueueConfig` interface

## STAGE 2: Architecture
**REQ-IDs:** REQ-049, REQ-050
**TEST-IDs:** TEST-049, TEST-050
**Steps:**
- Create `src/cache/CacheService.ts` with constructor accepting ioredis `Redis` instance and methods: `get<T>(key)`, `set<T>(key, value, ttl?)`, `del(key)`, `clearNamespace(pattern)`
- Create `src/workers/WorkerFactory.ts` with `createQueue(name)`, `createWorker(name, handler)`, and `handlerMap` for job name to processor mappings
- Create `src/workers/bookingWorker.ts` registering `booking:auto-reject` handler that sets booking status to `rejected` and sends notification
- Write tests: `tests/phase3/test_cache_architecture.ts` verifying cache abstraction interface and `clearNamespace` helper
- Write tests: `tests/phase3/test_queue_architecture.ts` verifying worker factory, job dispatch to correct handler, and failed job handling
- Refactor: Add typed generics to `CacheService` methods for stronger type safety
- Refactor: Extract job name constants into `src/workers/jobNames.ts`
- Refactor: Add `retry` and `backoff` strategy config to `WorkerFactory`

## STAGE 3: Database
**REQ-IDs:** REQ-031, REQ-033
**TEST-IDs:** TEST-031, TEST-033
**Steps:**
- Run `npx prisma migrate dev --create-only --name add_composite_indexes` to create a new migration
- Edit generated SQL to add composite indexes: `idx_bookings_status_date_agency` on `(status, travel_date, agency_id)`, `idx_bookings_user_status` on `(user_id, status)`, `idx_bookings_agency_date` on `(agency_id, travel_date)`, `idx_tours_destination_active` on `(destination, is_active)`
- Run `npx prisma migrate deploy` to apply the migration
- Add `scripts/phase3/profile-queries.ts` that runs the five most common search/booking queries with `EXPLAIN ANALYZE` and logs output
- Write tests: `tests/phase3/test_query_optimization.ts` asserting `EXPLAIN` shows `type: range` or `ref`, not `ALL`
- Write tests: Create `prisma/migrations/phase3_add_composite_indexes/` migration file and verify `key_len` covers all three indexed columns
- Refactor: Add `QueryProfiler` utility class to `src/db/profiler.ts` wrapping slow-query logging
- Refactor: Add Prisma middleware in `src/config/prisma.ts` to log all queries taking longer than 100ms
- Refactor: Add `DATABASE_PROFILING_ENABLED` env flag

## STAGE 4: Auth
**REQ-IDs:** REQ-049
**TEST-IDs:** TEST-049
**Steps:**
- Create `src/middleware/rateLimiter.ts` using ioredis `INCR` + `EXPIRE` to track request counts per IP with window of 10 requests per 1 second
- On rate limit exceed: respond with `429` status, `Retry-After: 1` header, and JSON body `{ error: 'Too many requests' }`
- Use Redis key pattern `ratelimit:{ip}:{endpoint}:{window-start}`
- Wire middleware globally in `src/app.ts` via `app.use(rateLimiter)` for all `/api/v1/*` routes
- Add `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` to environment config
- Write tests: `tests/phase3/test_rate_limiting.ts` verifying 11th request returns `429` with `Retry-After` header and subsequent request after 2 seconds succeeds
- Refactor: Extract Redis key builder into helper function `buildRateLimitKey(ip, endpoint)`
- Refactor: Add configurable `skip` function to bypass rate limiting for whitelisted IPs or health-check endpoints
- Refactor: Move rate limit config to `src/config/rateLimit.ts` with typed options

## STAGE 5: Backend
**REQ-IDs:** REQ-049, REQ-050, REQ-051, REQ-052, REQ-006, REQ-015, REQ-029, REQ-030, REQ-031
**TEST-IDs:** TEST-049, TEST-050, TEST-051, TEST-052
**Steps:**
- Implement cache-aside for search in `src/services/searchService.ts`: before DB query check Redis key `cache:tours:search:${md5(query)}`, on hit return parsed JSON, on miss query DB and `cache.set(key, results, 60)`, use 60s TTL
- Implement BullMQ auto-reject in `src/workers/autoRejectWorker.ts`: on booking creation enqueue `booking:auto-reject` job with `delay: 30 * 60 * 1000`, worker handler fetches booking, sets `status: rejected` if `paymentStatus === 'pending'`, saves, emits `BookingAutoRejected` event
- Create analytics endpoint `GET /api/v1/analytics/bookings-by-date` accepting `from`/`to` query params, grouping by `travel_date` with counts per status, returning JSON array of `{ date, total, confirmed, pending, cancelled }`
- Create operational reports endpoint `GET /api/v1/reports/agency-performance` accepting `agencyId`/`month`, computing total bookings, revenue, avg rating, top 5 destinations
- Wire both routes in `src/app.ts` under `/api/v1/analytics` and `/api/v1/reports`
- Write tests: `tests/phase3/test_search_cache.ts` verifying cache-aside pattern and sub-20ms cached response
- Write tests: `tests/phase3/test_auto_reject_job.ts` verifying pending booking rejected after 30-minute delayed job
- Write tests: `tests/phase3/test_analytics_endpoint.ts` verifying response shape and correct counts against seeded data
- Write tests: `tests/phase3/test_operational_reports.ts` verifying field types and values
- Refactor: Add CacheService TTL constants to `src/cache/ttl.ts` (`SEARCH_TTL = 60`)
- Refactor: Extract analytics SQL queries into `src/repositories/analyticsRepository.ts`
- Refactor: Extract report SQL into `src/repositories/reportRepository.ts`
- Refactor: Add pagination support to analytics endpoint (`limit`, `offset`)
- Refactor: Add input validation with `zod` schemas for all query params

## STAGE 6: Frontend
**REQ-IDs:** REQ-026, REQ-051
**TEST-IDs:** TEST-026, TEST-051
**Steps:**
- Implement lazy loading in `frontend/src/App.tsx` using `React.lazy(() => import('./pages/AnalyticsDashboard'))` and `React.lazy(() => import('./pages/ReportsPage'))`, wrap each in `<Suspense fallback={<PageSkeleton />}>`
- Create debounced search hook `frontend/src/hooks/useDebounce.ts` that returns value after `delay` ms of no changes, use in `SearchBar.tsx` with 300ms delay triggering API call only on debounced value change
- Create Analytics Dashboard page at `frontend/src/pages/AnalyticsDashboard.tsx` fetching analytics data, rendering `<BarChart>` via `recharts`, showing `<DateRangePicker>` filter, loading skeleton, and `<ErrorBoundary>`
- Optimize re-renders in `frontend/src/components/BookingCard.tsx` with `React.memo`, `useCallback`, and `useMemo`
- Write tests: `frontend/src/__tests__/phase3/test_lazy_loading.tsx` verifying analytics chunk loaded only on `/analytics` route
- Write tests: `frontend/src/__tests__/phase3/test_search_debounce.tsx` verifying 5 rapid events fire only 1 API call
- Write tests: `frontend/src/__tests__/phase3/test_analytics_dashboard.tsx` verifying chart renders correct data points, loading skeleton, and error boundary
- Refactor: Extract chart configuration to `frontend/src/config/chartConfig.ts`
- Refactor: Add `react-lazily` utility for consistent lazy-load pattern
- Refactor: Add analytics data hook `useAnalyticsData(from, to)` returning `{ data, loading, error }`

## STAGE 7: State
**REQ-IDs:** REQ-051
**TEST-IDs:** TEST-051
**Steps:**
- Create `frontend/src/hooks/useCacheState.ts` generic hook with module-level `Map<string, { data: T; expiresAt: number }>`, returning cached data if `Date.now() < expiresAt`, else calling fetcher, with default TTL of 5 minutes
- Create `frontend/src/hooks/useAnalytics.ts` using `useCacheState` with key `"analytics:{from}:{to}"`, fetcher calling `GET /api/v1/analytics/bookings-by-date`, returning `{ data, loading, error, refetch, clearCache }`
- Update `<AnalyticsDashboard>` to use `useAnalytics` instead of bare `fetch`
- Add `Clear Cache` button visible in dev mode only
- Write tests: `frontend/src/__tests__/phase3/test_analytics_state.tsx` verifying cache storage by key, cache hit on re-navigation, new fetch on range change, and re-fetch after cache clear
- Refactor: Extract `CacheStore` into class `frontend/src/state/CacheStore.ts` with `get`, `set`, `has`, `clear`, `invalidateNamespace` methods
- Refactor: Add `CacheContext` React context for shareable cache across components
- Refactor: Add cache size limit of max 50 entries with LRU eviction

## STAGE 8: Integration
**REQ-IDs:** REQ-049, REQ-050, REQ-051, REQ-052, REQ-029, REQ-030
**TEST-IDs:** TEST-049, TEST-050, TEST-051, TEST-052, TEST-029, TEST-030
**Steps:**
- Ensure all backend services running: `docker-compose up -d redis db api`
- Add `integration-test` script in `package.json` setting `NODE_ENV=test` and `REDIS_URL=redis://localhost:6379`
- Wire `SearchService` with `CacheService` using cache-aside pattern
- Wire `BookingService` to enqueue `booking:auto-reject` jobs on booking creation
- Wire `AnalyticsDashboard` frontend to call real analytics endpoint
- Wire `ReportsPage` frontend to call real reports endpoint
- Add request-time tracking middleware to log cache hit/miss ratios
- Add BullMQ job event listeners for `completed`, `failed`, and `progress` with logging
- Write tests: `tests/phase3/integration/test_cache_integration.ts` verifying only first request hits DB and requests 2-5 return <20ms
- Write tests: `tests/phase3/integration/test_queue_integration.ts` verifying 3 pending bookings auto-rejected after 31 minutes
- Write tests: `tests/phase3/integration/test_analytics_integration.ts` verifying 50 bookings across 10 dates return correct aggregates
- Write tests: `tests/phase3/integration/test_reports_integration.ts` verifying 2 agencies across 3 months return correct `totalBookings` and `revenue`
- Write tests: `tests/phase3/integration/test_search_cache_e2e.ts` verifying cached results skip loading spinner
- Write tests: `tests/phase3/integration/test_booking_auto_reject_e2e.ts` verifying end-to-end auto-rejection
- Refactor: Add health-check endpoint `GET /api/v1/health` reporting Redis connectivity and BullMQ queue status
- Refactor: Add cache warmup script `scripts/warmCache.ts` pre-populating popular searches
- Refactor: Move integration test setup into shared `tests/phase3/integration/setup.ts` for DB seeding and Redis startup

## STAGE 9: Testing
**REQ-IDs:** REQ-049, REQ-050, REQ-051, REQ-052, REQ-029, REQ-030, REQ-031
**TEST-IDs:** TEST-049, TEST-050, TEST-051, TEST-052, TEST-029, TEST-030, TEST-031, TEST-032
**Steps:**
- Run `jest --config jest.phase3.config.js --coverage` executing all Phase 3 tests
- Add `jest.phase3.config.js` file including all `tests/phase3/**` patterns with global timeout of 120 seconds for delayed-job tests
- Tune cache TTLs: adjust `SEARCH_TTL` from 60 to 120 seconds if cache hit ratio < 80%
- Tune queue concurrency: increase `Worker` concurrency from 1 to 5 for faster job processing
- Tune database index performance: add `ANALYTICS_CACHE_TTL = 300` for analytics endpoint caching
- Run `TEST-031` query profiler against production-sized data set (10k bookings, 500 tours)
- Generate performance report `reports/phase3-benchmarks.md` with p50, p95, p99 latencies
- Write benchmark tests: `tests/phase3/benchmarks/test_cache_benchmark.ts` measuring cache hit ratio >= 80% across 100 requests
- Write benchmark tests: `tests/phase3/benchmarks/test_queue_benchmark.ts` measuring job completion rate >= 95% across 50 enqueued jobs
- Write benchmark tests: `tests/phase3/benchmarks/test_search_performance.ts` verifying 50 concurrent searches all complete under 200ms (p95) with cache hit ratio >= 85%
- Write benchmark tests: `tests/phase3/benchmarks/test_booking_performance.ts` verifying 30 concurrent bookings under 500ms and auto-reject within 35 minutes
- Write aggregator: `tests/phase3/suites/run_all_phase3_tests.ts` running full cache, BullMQ, analytics, reports, search, and booking test suites
- Refactor: Add `jest-html-reporter` for structured test reports
- Refactor: Create CI pipeline step `phase3-tests` running only on changes to Phase 3 files
- Refactor: Add `--detectOpenHandles` to test script to catch unclosed Redis connections
- Refactor: Archive benchmark results as artifacts in CI

## STAGE 10: Deployment
**REQ-IDs:** REQ-049, REQ-050
**TEST-IDs:** TEST-049, TEST-050
**Steps:**
- Update `docker-compose.yml` with Redis service: `image: redis:7-alpine`, `container_name: travel-redis`, port `6379`, volume `redis-data:/data`, `restart: unless-stopped`, healthcheck with `redis-cli ping` (interval 5s, timeout 3s, retries 5)
- Add `redis-data` named volume at root level of `docker-compose.yml`
- Update `api` service with `depends_on: redis: condition: service_healthy`
- Configure production BullMQ in `src/config/queue.ts`: `maxRetriesPerRequest: null`, `enableReadyCheck: false`, `defaultJobOptions.removeOnComplete: 100`, `worker.concurrency: 5`, `limiter: { max: 50, duration: 1000 }`
- Add `deploy:phase3` script in `package.json`: `docker-compose up -d redis && npx prisma migrate deploy && docker-compose up -d api`
- Add `REDIS_HOST` and `REDIS_PORT` to production `.env` file
- Write tests: `tests/phase3/deployment/test_docker_compose_redis.ts` verifying `docker-compose.yml` has Redis with proper healthcheck, volume, and restart policy, and backend depends on Redis with `condition: service_healthy`
- Write tests: `tests/phase3/deployment/test_production_queue_config.ts` verifying BullMQ `Queue` and `Worker` production configuration settings
- Refactor: Add `docker-compose.prod.yml` override with resource limits (`mem_limit: 256m` for Redis, `mem_limit: 512m` for API)
- Refactor: Add Redis password via `REDIS_PASSWORD` env var and `requirepass` in production override
- Refactor: Add `scripts/phase3/deploy.sh` that runs migrations, warms cache, and starts workers
- Refactor: Document production Redis persistence (AOF + RDB) in deployment notes
