# Phase 2 – Realtime Operations & Dashboard Management

## Goal
Add realtime notifications via Socket.io, enhance dashboards with live data, and implement accessibility compliance.

## Duration
Estimated: 2–3 Weeks

---

## Stage 1 — Setup

### REQ‑IDs: REQ‑009, REQ‑023
### TEST‑IDs: TEST‑015, TEST‑032

### Tasks
- Install socket.io on backend and socket.io-client on frontend
- Add Redis and Redis adapter for socket.io to scale across instances
- Update `.env` with Redis connection details
- Create `sockets/` folder in backend
- Create socket context on frontend

### TDD Flow
1. Write test: server accepts websocket connections (TEST-015)
2. Run → fail (no socket setup)
3. Implement: configure socket.io server and adapter
4. Run → pass
5. Refactor: separate socket configuration

---

## Stage 2 — Architecture

### REQ‑IDs: REQ‑009
### TEST‑IDs: TEST‑015

### Tasks
- Define socket events schema (`bookingStatusChanged`, `driverArrival`, `systemAlert`)
- Create notification service to handle event emission
- Create centralized notification reducer/context on frontend
- Integrate axe-core for accessibility audits in development

### TDD Flow
1. Write test: notification service emits specific events (TEST-015)
2. Run → fail
3. Implement: NotificationService methods
4. Run → pass
5. Refactor: standardize event payloads

---

## Stage 3 — Database

### REQ‑IDs: REQ‑010, REQ‑030
### TEST‑IDs: TEST‑016, TEST‑035

### Tasks
- Create Notification model to persist historical notifications (optional enhancement for REQ-009)
- Ensure Booking model has proper indexes for efficient history export (REQ-010)
- Add escalation flag/timestamp to Booking model for late arrivals (REQ-030)
- Run migrations

### TDD Flow
1. Write test: Booking model tracks escalation status (TEST-035)
2. Run → fail
3. Implement: model updates and migrations
4. Run → pass
5. Refactor: index optimization

---

## Stage 4 — Backend

### REQ‑IDs: REQ‑009, REQ‑010, REQ‑030
### TEST‑IDs: TEST‑015, TEST‑016, TEST‑035, TEST‑040, TEST‑041

### Tasks
- Implement GET `/api/bookings/history/export` (CSV/JSON formats) (REQ-010, REQ-035)
- Update Booking status controller to trigger NotificationService (REQ-009)
- Implement cron job / worker for driver escalation logic (REQ-030)
- Socket namespaces and room management (user-specific rooms)

### TDD Flow
1. Write test: export endpoint returns valid CSV/JSON (TEST-040, TEST-041)
2. Run → fail
3. Implement: export controller logic
4. Run → pass
5. Refactor: extract CSV generation utility

---

## Stage 5 — Frontend

### REQ‑IDs: REQ‑009, REQ‑010, REQ‑013
### TEST‑IDs: TEST‑015, TEST‑016, TEST‑019

### Tasks
- Realtime notification toast component
- Booking status badges that update via socket events
- Export buttons on Booking History page (REQ-010)
- Dashboard enhancements: activity feed, booking analytics overview
- Keyboard navigation support across all complex components (REQ-013)

### TDD Flow
1. Write test: toast component renders on new event (TEST-015)
2. Run → fail
3. Implement: socket event listeners and UI update
4. Run → pass
5. Refactor: component memoization

---

## Stage 6 — State

### REQ‑IDs: REQ‑009, REQ‑029
### TEST‑IDs: TEST‑015, TEST‑034

### Tasks
- NotificationContext: store unread counts, active toasts
- WebSocket connection manager with reconnect logic
- Fallback polling mechanism: fetch status every 15s if socket disconnects (REQ-029)

### TDD Flow
1. Write test: polling activates when socket disconnects (TEST-034)
2. Run → fail
3. Implement: connection state listener and interval polling
4. Run → pass
5. Refactor: custom hook for connection resilience

---

## Stage 7 — Auth

### REQ‑IDs: REQ‑009
### TEST‑IDs: TEST‑015

### Tasks
- WebSocket authentication handshake (verify JWT on connection)
- Secure socket rooms (users only join their own ID room, admins join admin room)
- Disconnect unauthenticated sockets

### TDD Flow
1. Write test: socket connection rejected without valid JWT
2. Run → fail
3. Implement: socket auth middleware
4. Run → pass
5. Refactor: reuse HTTP token verification logic

---

## Stage 8 — Integration

### REQ‑IDs: REQ‑009, REQ‑010, REQ‑013, REQ‑029, REQ‑030
### TEST‑IDs: TEST‑015, TEST‑016, TEST‑019, TEST‑034, TEST‑035, TEST‑040, TEST‑041

### Tasks
- Connect frontend socket client to authenticated backend websocket
- End-to-end flow: status change → DB update → socket emit → UI update
- End-to-end flow: generate export → download file
- Run axe-core accessibility audit on all updated pages

### TDD Flow
1. Write integration test: full realtime notification cycle (TEST-015)
2. Run → fail
3. Implement: wire services together
4. Run → pass
5. Refactor: cleanup event listeners on unmount

---

## Stage 9 — Testing

### REQ‑IDs: All Phase 2 REQ-IDs
### TEST‑IDs: TEST-015, TEST-016, TEST-019, TEST-034, TEST-035, TEST-040, TEST-041

### Tasks
- Run unit/integration tests for export endpoints and socket service
- Test fallback polling mechanism explicitly (TEST-034)
- Manual screen-reader and keyboard navigation testing (TEST-019)
- Test escalation cron job (TEST-035)

### TDD Flow
1. Execute test suite for Phase 2
2. Identify failures
3. Fix implementation
4. Re‑run → all pass
5. Refactor any flaky socket tests

---

## Stage 10 — Deployment

### REQ‑IDs: REQ‑023
### TEST‑IDs: TEST‑032

### Tasks
- Update docker-compose with Redis container
- Ensure load balancer/Nginx is configured for WebSocket upgrade headers
- Update documentation with new infrastructure requirements
- Tag release `v2.0.0-realtime`

### TDD Flow
1. Write test: Nginx configuration accepts ws:// connections
2. Run → fail
3. Implement: Nginx config updates
4. Run → pass
5. Refactor: infrastructure as code
