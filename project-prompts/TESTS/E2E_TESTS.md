File: /project-prompts/TESTS/E2E_TESTS.md

# End-to-End Tests — Travel Agency Services Platform

---

## Traveler Workflow

### TEST-130 — Full traveler registration and login flow

- **REQ-ID:** REQ-001, REQ-002, REQ-003
- **Scenario:** New user registers, logs in, and accesses protected endpoint
- **Input:**
  1. `POST /api/auth/register` with valid data → HTTP 201
  2. `POST /api/auth/login` with same credentials → HTTP 200 with JWT
  3. `GET /api/users/profile` with JWT → HTTP 200
- **Expected Output:** Complete roundtrip succeeds, profile returns matching registered data

### TEST-131 — Full traveler search and book flow

- **REQ-ID:** REQ-006, REQ-007, REQ-008
- **Scenario:** Traveler searches route, views results, and creates booking
- **Input:**
  1. `GET /api/routes/search?source=Mumbai&destination=Pune` → results
  2. Select route from results
  3. `POST /api/bookings` with routeId, driverId, seatCount=1, travelDate → HTTP 201
- **Expected Output:** Booking created with status "Pending"

### TEST-132 — Traveler booking life cycle

- **REQ-ID:** REQ-008, REQ-009, REQ-010, REQ-011
- **Scenario:** Create booking → view in history → track status → cancel
- **Input:**
  1. Create booking → HTTP 201
  2. `GET /api/bookings` → booking appears in history
  3. `GET /api/bookings/1/status` → status "Pending"
  4. `PUT /api/bookings/1/cancel` → HTTP 200
  5. `GET /api/bookings/1/status` → status "Cancelled"
- **Expected Output:** Full lifecycle works correctly

### TEST-133 — Traveler with no bookings

- **REQ-ID:** REQ-009
- **Scenario:** Newly registered traveler with zero bookings
- **Input:**
  1. Register new user
  2. `GET /api/bookings`
- **Expected Output:** Empty array, pagination shows totalItems=0

---

## Driver Workflow

### TEST-134 — Full driver registration and route creation

- **REQ-ID:** REQ-012, REQ-013
- **Scenario:** Driver registers profile and creates a route
- **Input:**
  1. Register as driver → HTTP 201
  2. `POST /api/drivers/profile` with valid data → HTTP 201
  3. `POST /api/drivers/routes` with valid route → HTTP 201
- **Expected Output:** Driver profile created, route created and visible

### TEST-135 — Driver availability and booking management

- **REQ-ID:** REQ-014, REQ-015, REQ-016
- **Scenario:** Driver manages availability, accepts booking, updates trip
- **Input:**
  1. `PUT /api/drivers/routes/1/availability` → available=true
  2. Traveler creates booking → booking assigned to driver
  3. `PUT /api/drivers/bookings/1/accept` → status "Confirmed"
  4. `PUT /api/drivers/bookings/1/status` → status "On Trip"
  5. `PUT /api/drivers/bookings/1/status` → status "Completed"
- **Expected Output:** Full trip lifecycle from availability to completion

### TEST-136 — Driver rejects booking

- **REQ-ID:** REQ-015
- **Scenario:** Driver rejects a pending booking
- **Input:**
  1. Traveler creates booking
  2. `PUT /api/drivers/bookings/1/reject` with reason
- **Expected Output:** Booking status "Cancelled" with reason recorded

### TEST-137 — Driver views dashboard

- **REQ-ID:** REQ-023
- **Scenario:** Driver logs in and views dashboard
- **Input:**
  1. `POST /api/auth/login` as driver
  2. `GET /api/dashboard/driver`
  3. `PUT /api/drivers/availability` toggle
- **Expected Output:** Dashboard shows pending count, active trips, availability toggle works

---

## Agency Workflow

### TEST-138 — Full agency management flow

- **REQ-ID:** REQ-017, REQ-018
- **Scenario:** Admin creates agency, agency manages drivers and monitors bookings
- **Input:**
  1. Admin creates agency → HTTP 201
  2. Agency admin logs in
  3. `POST /api/agency/drivers` add driver → HTTP 201
  4. `GET /api/agency/bookings` view bookings
  5. `GET /api/agency/bookings?status=Confirmed` filter
- **Expected Output:** Agency can manage drivers and monitor filtered bookings

### TEST-139 — Agency remove driver with no bookings

- **REQ-ID:** REQ-017
- **Scenario:** Agency removes driver who has no active confirmed bookings
- **Input:**
  1. Add driver to agency
  2. Verify driver has no confirmed bookings
  3. `DELETE /api/agency/drivers/3`
- **Expected Output:** Driver removed successfully

### TEST-140 — Agency remove driver with active bookings (rejected)

- **REQ-ID:** REQ-017
- **Scenario:** Agency tries to remove driver with confirmed bookings
- **Input:**
  1. Driver has confirmed booking
  2. `DELETE /api/agency/drivers/3`
- **Expected Output:** HTTP 409, driver not removed

---

## Admin Workflow

### TEST-141 — Full admin management flow

- **REQ-ID:** REQ-019, REQ-020, REQ-021
- **Scenario:** Admin manages users, agencies, and bookings
- **Input:**
  1. `GET /api/admin/users` → list users
  2. `PUT /api/admin/users/5/deactivate` → deactivate user
  3. `POST /api/admin/agencies` → create agency
  4. `PUT /api/admin/agencies/1/deactivate` → deactivate agency
  5. `GET /api/admin/bookings` → view all bookings
  6. `PUT /api/admin/bookings/1/cancel` → cancel any booking
- **Expected Output:** All admin operations succeed

### TEST-142 — Admin dashboard

- **REQ-ID:** REQ-024
- **Scenario:** Admin views dashboard
- **Input:**
  1. `POST /api/auth/login` as admin
  2. `GET /api/dashboard/admin`
- **Expected Output:** Dashboard shows totalUsers, totalAgencies, totalActiveBookings, bookingsByStatus

---

## Edge Case Workflows

### TEST-143 — Search with special characters

- **REQ-ID:** REQ-006, REQ-038
- **Scenario:** Search with special characters in query
- **Input:** `GET /api/routes/search?source=<script>&destination=Pune`
- **Expected Output:** HTTP 200, empty array (no SQL injection, sanitized input)

### TEST-144 — Booking with maximum seats

- **REQ-ID:** REQ-039
- **Scenario:** Book exactly at vehicle capacity limit
- **Input:** `POST /api/bookings`, seatCount = vehicle capacity (e.g., 4)
- **Expected Output:** HTTP 201, booking created

### TEST-145 — Simultaneous last seat booking

- **REQ-ID:** REQ-040
- **Scenario:** Two parallel requests for last seat
- **Input:** Two concurrent `POST /api/bookings` with seatCount = 1 (capacity = 1)
- **Expected Output:** Exactly one HTTP 201, one HTTP 409

### TEST-146 — Booking on date 6 months from now

- **REQ-ID:** REQ-041
- **Scenario:** Book exactly 6 months in the future
- **Input:** `{ travelDate: currentDate + 6 months }`
- **Expected Output:** HTTP 201 or HTTP 400 at boundary (depends on exact policy implementation)

### TEST-147 — Driver auto-unavailability during trip

- **REQ-ID:** REQ-042
- **Scenario:** Driver starts trip, new booking attempt fails
- **Input:**
  1. Driver updates status to "On Trip"
  2. Traveler attempts to book this driver on same date
- **Expected Output:** Booking request rejected

### TEST-148 — Deactivated agency removal from search

- **REQ-ID:** REQ-044
- **Scenario:** Agency deactivated, search excludes their routes
- **Input:**
  1. Admin deactivates agency
  2. `GET /api/routes/search` that previously matched this agency's routes
- **Expected Output:** Agency routes not in results

---

## Non-Functional Tests

### TEST-100 — All APIs respond within 2 seconds

- **REQ-ID:** REQ-029
- **Scenario:** Measure response time for all API endpoints under normal load
- **Input:** Execute GET, POST, PUT requests for each endpoint
- **Expected Output:** Each response received within 2000ms

### TEST-101 — Search API responds within 1 second

- **REQ-ID:** REQ-029
- **Scenario:** Measure search API response time
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** Response received within 1000ms

### TEST-102 — 1000 concurrent search requests

- **REQ-ID:** REQ-030
- **Scenario:** Send 1000 concurrent search requests
- **Input:** 1000 simultaneous `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** All requests complete, 95th percentile response time < 3000ms, zero HTTP 5xx errors

### TEST-103 — 1000 concurrent booking requests

- **REQ-ID:** REQ-030
- **Scenario:** Send 1000 concurrent booking creation requests
- **Input:** 1000 simultaneous `POST /api/bookings` with different valid data
- **Expected Output:** All requests complete, no server crashes, zero HTTP 5xx errors

### TEST-149 — Password strength enforcement

- **REQ-ID:** REQ-001, REQ-032
- **Scenario:** Attempt registration with various weak passwords
- **Input:**
  - `"short1A"` (7 chars) → rejected
  - `"nouppercase1"` (no uppercase) → rejected
  - `"NOLOWERCASE1"` (no lowercase) → rejected
  - `"NoDigits"` (no digits) → rejected
  - `"Valid1Pass"` (meets rules) → accepted
- **Expected Output:** Only the last password is accepted

### TEST-023 — Search response time under 2s

- **REQ-ID:** REQ-006
- **Scenario:** Measure search API response time
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** Response time < 2000ms

### TEST-026 — Fare displayed in correct format

- **REQ-ID:** REQ-007
- **Scenario:** Verify fare format in search results
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** fare field is a number, displayed with 2 decimal places

### TEST-091 — Loading indicator on API call

- **REQ-ID:** REQ-026
- **Scenario:** Trigger API call and observe UI
- **Input:** Click search button
- **Expected Output:** Loading spinner or skeleton visible within 100ms of request

### TEST-092 — Skeleton loader on slow API

- **REQ-ID:** REQ-026
- **Scenario:** API takes longer than 300ms
- **Input:** Trigger API call with artificial 500ms delay
- **Expected Output:** Skeleton loader appears after 300ms

### TEST-093 — Error notification on failed API

- **REQ-ID:** REQ-026
- **Scenario:** API returns error
- **Input:** Trigger API call that returns HTTP 500
- **Expected Output:** Error notification displayed within 1 second

### TEST-094 — Success notification on create

- **REQ-ID:** REQ-027
- **Scenario:** Successful booking creation
- **Input:** Create booking via form
- **Expected Output:** Green success notification appears, disappears after 3 seconds

### TEST-095 — Error notification on failure

- **REQ-ID:** REQ-027
- **Scenario:** Failed booking creation
- **Input:** Submit booking with invalid data
- **Expected Output:** Red error notification appears, persists until dismissed

### TEST-096 — Notification auto-dismissal

- **REQ-ID:** REQ-027
- **Scenario:** Success notification auto-dismisses
- **Input:** Perform successful action
- **Expected Output:** Notification disappears after 3 seconds, no user interaction required

### TEST-097 — Session expires after inactivity

- **REQ-ID:** REQ-028
- **Scenario:** User remains idle for 60 minutes
- **Input:** Log in, wait 60 minutes without interaction, attempt API call
- **Expected Output:** HTTP 401, user redirected to login

### TEST-098 — Redirect to login on expiry

- **REQ-ID:** REQ-028
- **Scenario:** Expired session triggers redirect
- **Input:** JWT expires, user clicks on any protected page
- **Expected Output:** Redirected to /login with ?sessionExpired=true

### TEST-099 — Form data preserved on timeout

- **REQ-ID:** REQ-028
- **Scenario:** Form data survives session timeout
- **Input:** Fill booking form, wait for session timeout, log in again
- **Expected Output:** Form data restored from local storage

### TEST-109 — Backend deployable independently

- **REQ-ID:** REQ-034
- **Scenario:** Deploy backend container without frontend
- **Input:** `docker build -t backend . && docker run -p 5000:5000 backend`
- **Expected Output:** Backend container starts, APIs accessible at localhost:5000

### TEST-110 — Tech stack verification

- **REQ-ID:** REQ-035
- **Scenario:** Verify technology versions in package.json
- **Input:** Check package.json dependencies
- **Expected Output:** React ^18.x, Express ^4.x, Sequelize ^6.x, mysql2 ^3.x, jsonwebtoken ^9.x, bcrypt ^5.x

### TEST-111 — Cross-browser rendering

- **REQ-ID:** REQ-036
- **Scenario:** Render application in Chrome 122+, Firefox 123+, Safari 17+, Edge 122+
- **Input:** Open application URL in each browser
- **Expected Output:** Application renders without console errors in all four browsers

### TEST-150 — Deactivated user cannot login

- **REQ-ID:** REQ-019
- **Scenario:** Admin deactivated user, user tries to login
- **Input:**
  1. Admin deactivates user 5
  2. `POST /api/auth/login` as user 5
- **Expected Output:** HTTP 403 "Account deactivated. Contact administrator"

### TEST-151 — Agency deactivation cascades to drivers

- **REQ-ID:** REQ-044
- **Scenario:** Deactivated agency's drivers excluded from search
- **Input:**
  1. Admin deactivates agency
  2. `GET /api/routes/search` matching that agency's route
- **Expected Output:** Agency and drivers not in results

### TEST-152 — Orphan booking handling on driver removal

- **REQ-ID:** REQ-043
- **Scenario:** Driver removed, pending bookings cancelled
- **Input:**
  1. Driver has pending and confirmed bookings
  2. Agency removes driver
- **Expected Output:** Pending bookings → Cancelled, Confirmed bookings → unchanged

### TEST-153 — Maximum driver per agency listing

- **REQ-ID:** REQ-017
- **Scenario:** Agency views driver list with pagination
- **Input:** `GET /api/agency/drivers?page=1&limit=20`
- **Expected Output:** HTTP 200, up to 20 drivers per page, pagination metadata present

### TEST-154 — Booking cancellation by admin logs correctly

- **REQ-ID:** REQ-021
- **Scenario:** Admin cancels a booking and audit entry is created
- **Input:**
  1. Admin cancels booking
  2. `GET /api/admin/audit-logs?bookingId=1`
- **Expected Output:** Audit log entry contains adminId, bookingId, action "cancel", reason, timestamp

### TEST-155 — Invalid fare format

- **REQ-ID:** REQ-007
- **Scenario:** Driver submits route with negative fare
- **Input:** `POST /api/drivers/routes`, body: `{ "fare": -100 }`
- **Expected Output:** HTTP 400, error message "Fare must be a positive number"

### TEST-156 — Booking history order

- **REQ-ID:** REQ-009
- **Scenario:** Verify booking history is ordered by created date descending
- **Input:** `GET /api/bookings`
- **Expected Output:** Bookings sorted by createdAt descending (newest first)

### TEST-157 — Status update by non-owner driver

- **REQ-ID:** REQ-015
- **Scenario:** Driver tries to update booking assigned to another driver
- **Input:** `PUT /api/drivers/bookings/1/accept` (driverId=2, booking belongs to driverId=1)
- **Expected Output:** HTTP 403

### TEST-158 — Unauthenticated route search

- **REQ-ID:** REQ-006
- **Scenario:** Unauthenticated user searches routes
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`, no JWT
- **Expected Output:** HTTP 401 (if search is protected) or HTTP 200 (if public)

### TEST-159 — Complete E2E: Register → Search → Book → Accept → Track → Complete

- **REQ-ID:** REQ-001, REQ-002, REQ-006, REQ-008, REQ-010, REQ-012, REQ-013, REQ-015, REQ-016
- **Scenario:** Full platform workflow from registration to trip completion
- **Input:**
  1. Register traveler → HTTP 201
  2. Login traveler → JWT
  3. Register driver → HTTP 201
  4. Login driver → JWT
  5. Driver creates route → HTTP 201
  6. Traveler searches → finds route
  7. Traveler creates booking → HTTP 201
  8. Driver accepts booking → HTTP 200 (Confirmed)
  9. Driver starts trip → HTTP 200 (On Trip)
  10. Driver completes trip → HTTP 200 (Completed)
  11. Traveler checks status → HTTP 200 (Completed)
  12. Traveler views history → booking appears
- **Expected Output:** Full roundtrip succeeds at every step

### TEST-160 — Complete E2E: Admin manages agency and booking oversight

- **REQ-ID:** REQ-019, REQ-020, REQ-021, REQ-024
- **Scenario:** Admin creates agency, manages users, oversees bookings
- **Input:**
  1. Login as admin
  2. Create agency → HTTP 201
  3. View all users → user list
  4. Deactivate a user → HTTP 200
  5. View dashboard → counts
  6. View all bookings → booking list
  7. Cancel a booking → HTTP 200
- **Expected Output:** All admin operations succeed end-to-end

### TEST-161 — Complete E2E: Agency manages drivers and monitors bookings

- **REQ-ID:** REQ-017, REQ-018
- **Scenario:** Agency adds driver, monitors bookings, filters by status
- **Input:**
  1. Login as agency admin
  2. Add driver to agency → HTTP 201
  3. View agency bookings → list
  4. Filter by status → filtered list
  5. View driver list → paginated list
- **Expected Output:** Agency operations succeed end-to-end

---

## Phase 2 — Realtime Tests

### TEST-150 — Booking status change pushes real-time event

- **REQ-ID:** REQ-045
- **Scenario:** Traveler and driver receive WebSocket event when booking status changes
- **Input:**
  1. Connect to WebSocket `/bookings` with traveler JWT → connected
  2. Driver accepts booking via API → HTTP 200
  3. Traveler WebSocket receives `booking:status-changed` event with new status
- **Expected Output:** WebSocket event received within 2 seconds with correct booking ID and status

### TEST-151 — Driver availability update pushed to agency

- **REQ-ID:** REQ-045
- **Scenario:** Agency admin receives WebSocket event when driver toggles availability
- **Input:**
  1. Connect to WebSocket `/drivers` with agency JWT → connected
  2. Driver toggles availability via API → HTTP 200
  3. Agency WebSocket receives `driver:availability-changed` event
- **Expected Output:** WebSocket event received with correct driver ID and availability status

### TEST-152 — Multiple clients receive distinct events

- **REQ-ID:** REQ-045
- **Scenario:** Two travelers each create bookings; each receives their own events only
- **Input:**
  1. Traveler A connects to `/bookings` → connected
  2. Traveler B connects to `/bookings` → connected
  3. Traveler A creates booking → event received by A only
  4. Traveler B creates booking → event received by B only
- **Expected Output:** No cross-client event leakage

### TEST-153 — Socket authentication rejects invalid token

- **REQ-ID:** REQ-046
- **Scenario:** WebSocket connection with expired/malformed/missing JWT is rejected
- **Input:**
  1. Connect with expired JWT → error 4001
  2. Connect with malformed JWT → error 4001
  3. Connect without JWT → error 4001
- **Expected Output:** All three rejected with authentication error

### TEST-154 — Socket namespace enforces role

- **REQ-ID:** REQ-046
- **Scenario:** Traveler trying to join `/admin` namespace is rejected
- **Input:**
  1. Connect with traveler JWT
  2. Join `/admin` namespace → unauthorized error
  3. Connect with admin JWT
  4. Join `/admin` namespace → success
- **Expected Output:** Namespace access enforced by role

### TEST-155 — Socket connection persists after HTTP re-auth

- **REQ-ID:** REQ-046
- **Scenario:** User re-authenticates (new JWT), WebSocket reconnects with new token
- **Input:**
  1. Connect with valid JWT
  2. Re-authenticate via API → new JWT
  3. Disconnect old socket
  4. Reconnect with new JWT → connected
- **Expected Output:** Socket connection lifecycle works after token refresh

### TEST-156 — Notification created on booking event

- **REQ-ID:** REQ-047
- **Scenario:** System creates notification when booking status changes to confirmed
- **Input:**
  1. Create booking → notification created (type: booking)
  2. GET /api/notifications → notification appears in list
- **Expected Output:** Notification has correct title, body, type, and is_read=false

### TEST-157 — Mark notification as read

- **REQ-ID:** REQ-047
- **Scenario:** User marks a notification as read
- **Input:**
  1. GET /api/notifications → has unread notification
  2. PUT /api/notifications/1/read → HTTP 200
  3. GET /api/notifications/1 → is_read=true
- **Expected Output:** Notification marked as read

### TEST-158 — Mark all notifications as read

- **REQ-ID:** REQ-047
- **Scenario:** User marks all notifications as read
- **Input:**
  1. GET /api/notifications → 3 unread notifications
  2. PUT /api/notifications/read-all → HTTP 200
  3. GET /api/notifications → all is_read=true
- **Expected Output:** All notifications marked as read

### TEST-159 — Notification list is paginated newest-first

- **REQ-ID:** REQ-047
- **Scenario:** User with 25 notifications receives page 1 (20 items) and page 2 (5 items)
- **Input:**
  1. GET /api/notifications?page=1 → 20 items, newest first
  2. GET /api/notifications?page=2 → 5 items, older ones
- **Expected Output:** Pagination works, sorted by created_at DESC

### TEST-160 — Keyboard navigation on search page

- **REQ-ID:** REQ-048
- **Scenario:** All interactive elements reachable and operable via keyboard
- **Input:**
  1. Tab through search form → all fields reachable
  2. Enter on Search button → search triggered
  3. Tab through result list → results navigable
  4. Escape on modal → modal closes
- **Expected Output:** Full keyboard operability without mouse

### TEST-161 — Focus trap in modal dialog

- **REQ-ID:** REQ-048
- **Scenario:** Focus cycles within modal, does not escape to background
- **Input:**
  1. Open modal
  2. Tab repeatedly → focus cycles through modal elements
  3. Shift+Tab repeatedly → focus cycles in reverse
  4. Tab on last element → focus wraps to first
- **Expected Output:** Focus trapped within modal

### TEST-162 — ARIA live region announces booking confirmation

- **REQ-ID:** REQ-048
- **Scenario:** Booking confirmation triggers aria-live announcement
- **Input:**
  1. Complete booking flow
  2. Verify aria-live region contains confirmation text
- **Expected Output:** Screen reader announcement fires with correct message

### TEST-163 — Color contrast meets WCAG AA

- **REQ-ID:** REQ-048
- **Scenario:** All text elements meet 4.5:1 contrast ratio
- **Input:**
   1. Audit all pages with axe-core
   2. Check color-contrast violations
- **Expected Output:** Zero color-contrast violations

---

## Phase 3 — Optimization Tests

### TEST-164 — Search result caching

- **REQ-ID:** REQ-049
- **Scenario:** Repeated search returns cached result within 20ms
- **Input:**
   1. First search call → normal response time
   2. Identical second search call → response under 20ms
   3. Third call with different query → normal response time
- **Expected Output:** Cached responses return faster than uncached

### TEST-165 — Cache invalidation on TTL expiry

- **REQ-ID:** REQ-049
- **Scenario:** Cached result expires after TTL
- **Input:**
   1. Search query → cached
   2. Wait for TTL + 1s
   3. Same search query → fresh DB fetch
- **Expected Output:** Cache expires and data is re-fetched

### TEST-166 — Auto-reject pending booking after 30 min

- **REQ-ID:** REQ-049
- **Scenario:** Pending booking is auto-rejected after 30 minutes via BullMQ
- **Input:**
   1. Create booking → status Pending
   2. Wait for queue to process (delay: 30 min)
   3. Check booking status → Cancelled/Rejected
- **Expected Output:** Background job processes and updates status

### TEST-167 — Rate limiting returns 429 on excess

- **REQ-ID:** REQ-050
- **Scenario:** 11th request within 1 second window returns 429
- **Input:**
   1. Send 10 rapid requests → all succeed
   2. Send 11th request → HTTP 429
   3. Wait 1 second
   4. Send request → HTTP 200
- **Expected Output:** Rate limit enforced and resets after window

### TEST-168 — Rate limit exempts health endpoint

- **REQ-ID:** REQ-050
- **Scenario:** Health endpoint bypasses rate limiter
- **Input:**
   1. Send 50 rapid requests to /api/health
   2. All return HTTP 200
- **Expected Output:** Health endpoint not rate limited

### TEST-169 — Analytics endpoint returns aggregated data

- **REQ-ID:** REQ-051
- **Scenario:** GET /api/analytics/bookings-by-date returns correct grouping
- **Input:**
   1. Send GET /api/analytics/bookings-by-date?from=2026-01-01&to=2026-12-31
- **Expected Output:** JSON array with date, total, confirmed, pending, cancelled per row

### TEST-170 — Analytics cached for 5 minutes

- **REQ-ID:** REQ-051
- **Scenario:** Repeated analytics call returns cached data
- **Input:**
   1. First analytics call → normal response
   2. Second call within 5 min → sub-20ms response
- **Expected Output:** Analytics response cached

### TEST-171 — Agency performance report

- **REQ-ID:** REQ-052
- **Scenario:** GET /api/reports/agency-performance returns correct metrics
- **Input:**
   1. Send GET /api/reports/agency-performance?agencyId=1&month=2026-07
- **Expected Output:** JSON with totalBookings, cancellations, topDestinations

### TEST-172 — Report access restricted to admin roles

- **REQ-ID:** REQ-052
- **Scenario:** Traveler cannot access reports endpoint
- **Input:**
    1. Login as traveler
    2. GET /api/reports/agency-performance → HTTP 403
    3. Login as admin
    4. GET /api/reports/agency-performance → HTTP 200
- **Expected Output:** Role-based access enforced

---

## Phase 4 — Expansion & Monitoring (REQ-053 to REQ-058)

### TEST-173 — Frontend renders in English by default

- **REQ-ID:** REQ-053
- **Scenario:** App loads with English locale
- **Input:**
    1. Open app without language preference
- **Expected Output:** All UI strings displayed in English

### TEST-174 — Language switching to Hindi updates all strings

- **REQ-ID:** REQ-053
- **Scenario:** Switch to Hindi updates visible text without page reload
- **Input:**
    1. Open app
    2. Click "Hindi" in language switcher
- **Expected Output:** Nav items, headings, buttons render in Hindi

### TEST-175 — Language preference persists after page reload

- **REQ-ID:** REQ-053
- **Scenario:** Selected language survives refresh
- **Input:**
    1. Switch to Hindi
    2. Reload page
- **Expected Output:** UI stays in Hindi

### TEST-176 — Language switcher component renders

- **REQ-ID:** REQ-054
- **Scenario:** LanguageSwitcher shows English/Hindi buttons
- **Input:**
    1. Open app
- **Expected Output:** "English" and "Hindi" buttons visible; active language highlighted

### TEST-177 — Language switcher uses i18next.changeLanguage

- **REQ-ID:** REQ-054
- **Scenario:** Switching language stores preference in localStorage
- **Input:**
    1. Switch language
- **Expected Output:** localStorage item `i18nextLng` contains the language code

### TEST-178 — Admin creates announcement

- **REQ-ID:** REQ-055
- **Scenario:** Admin POST /api/announcements creates a new announcement
- **Input:**
    1. Login as admin
    2. POST /api/announcements with { title, body, type }
- **Expected Output:** HTTP 201 with announcement object

### TEST-179 — Active announcements shown as banner

- **REQ-ID:** REQ-055
- **Scenario:** Active announcements returned by GET /api/announcements
- **Input:**
    1. Admin creates announcement
    2. Any user calls GET /api/announcements
- **Expected Output:** Announcement listed

### TEST-180 — Events CRUD

- **REQ-ID:** REQ-055
- **Scenario:** Full lifecycle for events
- **Input:**
    1. Admin creates event → HTTP 201
    2. User browses events → HTTP 200 with event
    3. Admin updates event → HTTP 200
    4. Admin deletes event → HTTP 200
- **Expected Output:** Full CRUD for events, user read-only

### TEST-181 — Notification center paginated

- **REQ-ID:** REQ-056
- **Scenario:** GET /api/notifications returns paginated results
- **Input:**
    1. Login as traveler
    2. GET /api/notifications?page=1&pageSize=10
- **Expected Output:** JSON with notifications array and pagination metadata

### TEST-182 — Mark notification as read

- **REQ-ID:** REQ-056
- **Scenario:** PUT /api/notifications/:id/read marks single notification read
- **Input:**
    1. Have an unread notification
    2. PUT /api/notifications/1/read
- **Expected Output:** HTTP 200, notification.is_read = true

### TEST-183 — Mark all notifications as read

- **REQ-ID:** REQ-056
- **Scenario:** PUT /api/notifications/read-all marks all user's notifications read
- **Input:**
    1. Have multiple unread notifications
    2. PUT /api/notifications/read-all
- **Expected Output:** All notifications for user have is_read = true

### TEST-184 — /metrics endpoint returns Prometheus format

- **REQ-ID:** REQ-057
- **Scenario:** GET /metrics returns prometheus metrics
- **Input:**
    1. GET /api/metrics
- **Expected Output:** HTTP 200, Content-Type text/plain, contains nodejs_ and http_request_duration_seconds

### TEST-185 — Metrics include HTTP request duration histogram

- **REQ-ID:** REQ-057
- **Scenario:** Histogram recorded for requests
- **Input:**
    1. Hit any API endpoint
    2. GET /api/metrics
- **Expected Output:** http_request_duration_seconds histogram present with method/route/status_code labels

### TEST-186 — Grafana dashboard provisioned

- **REQ-ID:** REQ-058
- **Scenario:** Grafana contains datasource and dashboard
- **Input:**
    1. Access Grafana at http://localhost:3001
- **Expected Output:** Prometheus datasource configured; travel-agency-metrics dashboard available
