File: /project-prompts/PHASES/PHASE_2_REALTIME/stages.md

# Phase 2 — Stages

---

## STAGE 1: Setup
**REQ-IDs:** REQ-045, REQ-046
**TEST-IDs:** TEST-045, TEST-046
**Steps:**
- Install `socket.io` and `@socket.io/redis-adapter` in the backend
- Install `socket.io-client`, `axe-core`, and `@testing-library/user-event` in the frontend
- Add Redis service to `docker-compose.yml` with `REDIS_URL` environment variable

---

## STAGE 2: Architecture
**REQ-IDs:** REQ-045, REQ-046
**TEST-IDs:** TEST-045, TEST-046
**Steps:**
- Create Socket.io server with CORS configuration
- Configure Redis adapter for horizontal scaling
- Define namespaces: `/bookings`, `/drivers`, `/dashboard`, `/admin`
- Implement room join/leave handlers per namespace

---

## STAGE 3: Database
**REQ-IDs:** REQ-047, REQ-048
**TEST-IDs:** TEST-047, TEST-048
**Steps:**
- Create `notifications` table with columns: `id`, `user_id`, `type`, `title`, `body`, `data`, `is_read`, `created_at`
- Create `notification_preferences` table
- Add indexes on `(user_id, created_at DESC)` and `(user_id, is_read)`
- Generate Knex migration files for both tables

---

## STAGE 4: Auth
**REQ-IDs:** REQ-045, REQ-048
**TEST-IDs:** TEST-045, TEST-048
**Steps:**
- Implement `authenticateSocket` middleware using JWT verification
- Implement `requireRole` guard for namespace-level authorization
- Enforce `/admin` namespace requires `admin` role
- Enforce `/drivers` namespace requires `driver` role
- Enforce `/dashboard` namespace requires `admin` or `manager` role

---

## STAGE 5: Backend
**REQ-IDs:** REQ-045, REQ-047
**TEST-IDs:** TEST-045, TEST-047
**Steps:**
- Implement booking event handlers: `booking:created`, `booking:status-changed`, `booking:cancelled`
- Implement driver event handlers: `driver:availability-changed`, `driver:location-updated`, `driver:assigned`
- Implement dashboard event handlers: `dashboard:stats` (emits every 30s), `dashboard:alert`
- Build notification service with methods: `sendNotification`, `markAsRead`, `getUnreadCount`

---

## STAGE 6: Frontend
**REQ-IDs:** REQ-045, REQ-046, REQ-048
**TEST-IDs:** TEST-045, TEST-046, TEST-048
**Steps:**
- Create Socket.io client with auth token injection
- Build `useSocket` hook for socket lifecycle management
- Build `NotificationToast` component using `aria-live` region
- Build `DashboardStats` component with live-updating data
- Build `BookingStatusBadge` component
- Create keyboard navigation hook
- Create `FocusTrap` component for modals/dialogs
- Add accessibility CSS (focus outlines, reduced motion, high contrast)

---

## STAGE 7: State
**REQ-IDs:** REQ-045, REQ-046
**TEST-IDs:** TEST-045, TEST-046
**Steps:**
- Create `SocketContext` provider exposing `isConnected` and `connectionError` state
- Build `useRealtimeBookings` hook that joins the `dashboard:bookings` room
- Build `useRealtimeNotifications` hook that joins the `user:{userId}` room
- Ensure all sockets clean up connections and leave rooms on unmount

---

## STAGE 8: Integration
**REQ-IDs:** REQ-045, REQ-046, REQ-047
**TEST-IDs:** TEST-045, TEST-046, TEST-047
**Steps:**
- Wire realtime middleware to HTTP booking routes to emit socket events on mutations
- Connect `SocketContext` provider in `App.js`
- Integrate realtime hooks into Dashboard page
- Add notification bell indicator to Header component

---

## STAGE 9: Testing
**REQ-IDs:** REQ-045, REQ-046, REQ-047, REQ-048
**TEST-IDs:** TEST-045, TEST-046, TEST-047, TEST-048
**Steps:**
- Fix socket connection failures in test environment
- Mock auth tokens for socket connections in tests
- Address race conditions in event emission handling
- Mock Redis adapter for unit tests
- Add missing ARIA labels across components
- Fix focus management issues in modal/dialog flows
- Close coverage gaps for realtime and accessibility code paths
- Add CI configuration to run Phase 2 tests

---

## STAGE 10: Deployment
**REQ-IDs:** REQ-045, REQ-046, REQ-047, REQ-048
**TEST-IDs:** TEST-045, TEST-046, TEST-047, TEST-048
**Steps:**
- Update `docker-compose.yml` with Redis healthcheck configuration
- Verify no new user-facing ports are exposed
- Set production environment variables (`REACT_APP_SOCKET_URL`)
- Optimize production bundle for realtime dependencies
- Add deployment smoke test script for realtime connectivity validation
