File: /project-prompts/REQUIREMENTS.md

# Requirements Document — Travel Agency Services Platform

---

## 1. Functional Requirements

### REQ-001 — User Registration

Users shall register with email, password, name, and phone number. Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one digit. Duplicate email registration shall be rejected with HTTP 409.

Mapped Tests: TEST-001, TEST-002, TEST-003, TEST-004

### REQ-002 — User Login

Registered users shall log in with email and password. Successful login returns a JWT access token with 24-hour expiry. Failed login with incorrect credentials returns HTTP 401. Account lockout after 5 consecutive failed attempts within 15 minutes.

Mapped Tests: TEST-005, TEST-006, TEST-007, TEST-008

### REQ-003 — JWT Authentication

Every API request (except registration and login) must include a valid JWT in the Authorization header. Requests with missing, expired, or malformed tokens shall return HTTP 401. Tokens shall contain user ID, role, and issued-at timestamp.

Mapped Tests: TEST-009, TEST-010, TEST-011, TEST-012

### REQ-004 — Role-Based Access Control

The platform shall support four roles: Traveler, Driver, Agency, Admin. Each role has distinct permitted endpoints. Unauthorized access to a role-restricted endpoint shall return HTTP 403. Admin shall have access to all endpoints.

Mapped Tests: TEST-013, TEST-014, TEST-015, TEST-016

### REQ-005 — Profile Management

Users shall update their name, phone number, and password. Profile updates must be validated with the same rules as registration. Changing email shall require re-authentication.

Mapped Tests: TEST-017, TEST-018, TEST-019

### REQ-006 — Destination Search

Users shall search destinations by source city and destination city. Search must support partial text matching. Results shall return within 2 seconds. Empty results for non-existent routes shall return an empty array with HTTP 200.

Mapped Tests: TEST-020, TEST-021, TEST-022, TEST-023

### REQ-007 — View Agencies and Drivers from Search

Search results shall display agencies serving the route and drivers assigned to those agencies. Each result shall include agency name, driver name, vehicle type, and fare amount. Fares must be displayed in the local currency format.

Mapped Tests: TEST-024, TEST-025, TEST-026

### REQ-008 — Create Booking

Travelers shall create a booking by selecting a route, agency, driver, and travel date. Booking shall require seat count (minimum 1, maximum by vehicle capacity). Duplicate booking for the same traveler on the same date and route shall be rejected with HTTP 409.

Mapped Tests: TEST-027, TEST-028, TEST-029, TEST-030, TEST-031

### REQ-009 — Booking History

Travelers shall view their booking history ordered by created date descending. History shall display booking ID, route, driver, agency, status, fare, and travel date. History shall support pagination with 10 items per page.

Mapped Tests: TEST-032, TEST-033, TEST-034

### REQ-010 — Booking Tracking

Travelers and agencies shall track booking status. Available statuses: Pending, Confirmed, On Trip, Completed, Cancelled. Status transition shall be recorded with timestamp. Invalid status transitions shall be rejected with HTTP 400.

Mapped Tests: TEST-035, TEST-036, TEST-037, TEST-038

### REQ-011 — Booking Cancellation

Travelers shall cancel a booking only if status is Pending or Confirmed. Cancellation after departure or when status is On Trip, Completed, or Cancelled shall be rejected with HTTP 400. Cancellation shall update status to Cancelled with timestamp.

Mapped Tests: TEST-039, TEST-040, TEST-041, TEST-042

### REQ-012 — Driver Profile Management

Drivers shall create and update their profile including name, phone, vehicle type, vehicle registration number, and license number. Vehicle registration number must be unique across all drivers.

Mapped Tests: TEST-043, TEST-044, TEST-045, TEST-046

### REQ-013 — Route Creation by Driver

Drivers shall create routes specifying source city, destination city, departure time, arrival time, fare, and vehicle capacity. Source and destination cannot be the same city. Arrival time must be after departure time.

Mapped Tests: TEST-047, TEST-048, TEST-049, TEST-050

### REQ-014 — Availability Management

Drivers shall mark routes as available or unavailable. A driver cannot accept new bookings while marked unavailable. Availability changes shall take effect immediately.

Mapped Tests: TEST-051, TEST-052, TEST-053

### REQ-015 — Accept or Reject Bookings

Drivers shall accept or reject pending bookings assigned to them. Acceptance changes status to Confirmed. Rejection changes status to Cancelled with reason. Response must be provided within 30 minutes of booking creation, otherwise automatic rejection.

Mapped Tests: TEST-054, TEST-055, TEST-056, TEST-057, TEST-058

### REQ-016 — Trip Status Update

Drivers shall update trip status to On Trip (when trip starts) and Completed (when trip ends). Status On Trip shall only be allowed from Confirmed. Status Completed shall only be allowed from On Trip.

Mapped Tests: TEST-059, TEST-060, TEST-061, TEST-062

### REQ-017 — Agency Driver Management

Agencies shall add, remove, and view drivers under their agency. A driver can belong to exactly one agency at a time. Removing a driver with active confirmed bookings shall be rejected with HTTP 409.

Mapped Tests: TEST-063, TEST-064, TEST-065, TEST-066

### REQ-018 — Agency Booking Monitoring

Agencies shall view all bookings under their drivers. View shall support filtering by status, date range, and driver. Results shall include booking ID, traveler name, route, driver, status, and fare.

Mapped Tests: TEST-067, TEST-068, TEST-069

### REQ-019 — Admin User Management

Admins shall view, activate, and deactivate all users. Deactivated users shall not be able to log in. Activation and deactivation shall be logged with admin ID and timestamp.

Mapped Tests: TEST-070, TEST-071, TEST-072, TEST-073

### REQ-020 — Admin Agency Management

Admins shall create, view, update, and deactivate agencies. Deactivated agencies and their drivers shall not appear in search results.

Mapped Tests: TEST-074, TEST-075, TEST-076, TEST-077

### REQ-021 — Admin Booking Oversight

Admins shall view and cancel any booking regardless of status. Admin cancellations shall be logged with admin ID and reason.

Mapped Tests: TEST-078, TEST-079, TEST-080

### REQ-022 — User Dashboard

User dashboard shall display: active bookings count, total bookings count, and list of upcoming trips within next 7 days. Data shall refresh on page load.

Mapped Tests: TEST-081, TEST-082

### REQ-023 — Driver Dashboard

Driver dashboard shall display: pending booking requests count, active trip count, today's trips, and availability toggle. Pending requests count shall show bookings awaiting response for more than 10 minutes.

Mapped Tests: TEST-083, TEST-084

### REQ-024 — Admin Dashboard

Admin dashboard shall display: total users count, total agencies count, total active bookings, and bookings by status breakdown. Data shall refresh on page load.

Mapped Tests: TEST-085, TEST-086

### REQ-025 — Form Validation

All forms shall validate required fields, email format, password rules, phone number format (10-15 digits), and numeric ranges. Validation errors shall be displayed inline below each field within 100ms of user input.

Mapped Tests: TEST-087, TEST-088, TEST-089, TEST-090

### REQ-026 — Loading States

All asynchronous operations shall display loading indicators. API calls exceeding 300ms shall show a skeleton loader. Failed API calls shall display an error notification within 1 second.

Mapped Tests: TEST-091, TEST-092, TEST-093

### REQ-027 — Success and Error Notifications

Successful operations shall display a success notification for 3 seconds. Error notifications shall display until dismissed by the user. Notifications shall not block user interaction.

Mapped Tests: TEST-094, TEST-095, TEST-096

### REQ-028 — Session Protection

Idle sessions shall expire after 60 minutes. Users shall be redirected to login with a session-expired message. Unsaved form data shall be preserved in local storage on session timeout.

Mapped Tests: TEST-097, TEST-098, TEST-099

---

## 2. Non-Functional Requirements

### REQ-029 — API Response Time

All API responses shall complete within 2 seconds under normal load (up to 100 concurrent requests). Search APIs shall complete within 1 second.

Mapped Tests: TEST-100, TEST-101

### REQ-030 — Concurrent User Support

The platform shall support up to 1,000 concurrent users without degradation of response time beyond 3 seconds.

Mapped Tests: TEST-102, TEST-103

### REQ-031 — Database Query Performance

All database queries shall execute within 500ms. Tables with more than 10,000 rows shall have indexes on foreign keys and status columns.

Mapped Tests: TEST-104

### REQ-032 — Password Security

Passwords shall be hashed with bcrypt using a cost factor of 10. Passwords shall never be stored in plaintext. Passwords shall never be returned in API responses.

Mapped Tests: TEST-105, TEST-106

### REQ-033 — Data Consistency

Booking status transitions shall be atomic. Concurrent status updates on the same booking shall result in exactly one succeeding. The system shall use database transactions for all booking operations.

Mapped Tests: TEST-107, TEST-108

### REQ-034 — Modular Architecture

Frontend and backend shall be separate modules communicating via REST API. Each module shall be deployable independently via Docker containers.

Mapped Tests: TEST-109

---

## 3. Constraints

### REQ-035 — Technology Stack

The platform shall use: React.js for frontend, Node.js with Express.js for backend, MySQL with Sequelize ORM for database, JWT for authentication, Docker for deployment.

Mapped Tests: TEST-110

### REQ-036 — Browser Support

The platform shall support the latest two major versions of Chrome, Firefox, Safari, and Edge.

Mapped Tests: TEST-111

### REQ-037 — API Format

All APIs shall follow RESTful conventions. Request and response bodies shall use JSON format. Dates shall use ISO 8601 format. Error responses shall include a message field.

Mapped Tests: TEST-112

---

## 4. Edge Cases

### REQ-038 — Empty Search Results

Search with no matching routes shall return HTTP 200 with an empty results array and a message field indicating no routes found.

Mapped Tests: TEST-113, TEST-114

### REQ-039 — Maximum Booking Capacity

Booking seat count exceeding vehicle capacity shall be rejected with HTTP 400 and message indicating maximum capacity. Booking seat count of zero or negative shall be rejected with HTTP 400.

Mapped Tests: TEST-115, TEST-116, TEST-117

### REQ-040 — Simultaneous Booking Conflicts

Two travelers attempting to book the last available seat simultaneously shall result in exactly one successful booking. The second shall receive HTTP 409 with insufficient capacity message.

Mapped Tests: TEST-118, TEST-119

### REQ-041 — Past Date Booking

Booking with a travel date in the past shall be rejected with HTTP 400. Booking with a travel date more than 6 months in the future shall be rejected with HTTP 400.

Mapped Tests: TEST-120, TEST-121, TEST-122

### REQ-042 — Driver Auto-Unavailability

A driver with a trip status of On Trip shall be automatically marked as unavailable for new bookings. Availability shall be restored when the trip is marked Completed.

Mapped Tests: TEST-123, TEST-124

### REQ-043 — Orphaned Bookings

If a driver is removed from an agency, all their bookings with status Pending shall be automatically cancelled. Confirmed bookings shall be preserved and assigned to the agency admin for reassignment.

Mapped Tests: TEST-125, TEST-126

### REQ-044 — Account Deactivation Impact

Deactivating an agency shall auto-cancel all pending bookings under that agency. Confirmed and On Trip bookings shall proceed normally. New bookings shall not be accepted by deactivated agencies.

Mapped Tests: TEST-127, TEST-128, TEST-129

---

## 5. Phase 2 Requirements

### REQ-045 — Real-Time Booking and Driver Updates

The system shall provide real-time updates for booking status changes and driver availability changes using WebSocket connections. Booking events (created, confirmed, cancelled, completed) shall be pushed to relevant users within 2 seconds. Driver availability changes shall be pushed to agency admins within 2 seconds.

Mapped Tests: TEST-150, TEST-151, TEST-152

### REQ-046 — WebSocket Authentication and Namespacing

WebSocket connections shall be authenticated using JWT tokens passed during handshake. The server shall organize connections into namespaces: `/bookings`, `/drivers`, `/dashboard`, `/admin`. Each namespace shall enforce role-based access (e.g., `/admin` requires admin role). Unauthenticated connections shall be rejected with error code 4001.

Mapped Tests: TEST-153, TEST-154, TEST-155

### REQ-047 — Notification System

The platform shall provide an in-app notification system with database persistence. Notifications shall have type (info, booking, alert), title, body, and read status. Users shall receive notifications for booking status changes. The system shall provide an API to list notifications (newest first), mark individual notifications as read, and mark all as read.

Mapped Tests: TEST-156, TEST-157, TEST-158, TEST-159

### REQ-048 — Accessibility Compliance

The frontend shall comply with WCAG 2.1 AA standards. All interactive elements shall be keyboard accessible. Modals and dialogs shall implement focus trapping. Color contrast shall meet a minimum ratio of 4.5:1 for normal text. Screen reader announcements shall use `aria-live` regions. All form inputs shall have associated labels.

Mapped Tests: TEST-160, TEST-161, TEST-162, TEST-163

---

## 6. Phase 3 Requirements

### REQ-049 — Caching and Queue System

The system shall implement Redis-based caching for search results (60s TTL) and a BullMQ job queue for background tasks such as auto-rejection of pending bookings after 30 minutes of inactivity. The cache shall use a cache-aside pattern: check cache before querying the database, and populate cache on miss. Cached search responses must return within 20ms.

Mapped Tests: TEST-164, TEST-165, TEST-166

### REQ-050 — Rate Limiting

The API shall implement rate limiting per IP address using Redis, allowing a maximum of 10 requests per second per IP. Exceeding the limit shall return HTTP 429 with a `Retry-After` header. Health-check endpoints and whitelisted IPs shall be exempt from rate limiting.

Mapped Tests: TEST-167, TEST-168

### REQ-051 — Analytics Dashboard

The platform shall provide an analytics dashboard showing booking data grouped by date with counts per status (confirmed, pending, cancelled). The dashboard shall support filtering by date range. Results shall be cached for 5 minutes. Frontend shall load the analytics page lazily.

Mapped Tests: TEST-169, TEST-170

### REQ-052 — Operational Reports

The platform shall provide operational reports for agency performance, including total bookings, cancellations, and top destinations per agency per month. The reports endpoint shall support pagination and date range filtering. Only admin and agency_admin roles shall access reports.

Mapped Tests: TEST-171, TEST-172

### REQ-053 — Multi-Language UI Support (i18n)

The platform shall support English and Hindi (hi) UI languages. All visible strings in the frontend shall use translation keys resolved via i18next. Language switching shall update the UI without a page reload. The user's language preference shall persist across sessions via localStorage.

Mapped Tests: TEST-173, TEST-174, TEST-175

### REQ-054 — Language Switching

The frontend shall include a language switcher component (dropdown or toggle) that calls i18next.changeLanguage(). The active language shall be highlighted. Switching language shall immediately update all translated strings without page reload. The selected language shall be persisted in localStorage and restored on next visit.

Mapped Tests: TEST-176, TEST-177

### REQ-055 — Travel Announcements and Events

The platform shall allow admin users to create, edit, and deactivate announcements (info/warning/urgent types). Active announcements shall be displayed as a dismissible banner on all pages. The platform shall also support events with title, description, date range, location, and organizer. Events are browsable by all authenticated users.

Mapped Tests: TEST-178, TEST-179, TEST-180

### REQ-056 — Notification Center

The platform shall provide a notification center page showing all notifications (paginated, newest first) for the authenticated user. Users shall be able to mark individual notifications as read or mark all as read. An unread count badge shall appear in the navigation bar.

Mapped Tests: TEST-181, TEST-182, TEST-183

### REQ-057 — Application Performance Monitoring

The backend shall expose a /metrics endpoint in Prometheus text format using prom-client. The metrics shall include default Node.js metrics and a custom HTTP request duration histogram (buckets: 0.01, 0.05, 0.1, 0.5, 1, 5) labeled with method, route, and status_code.

Mapped Tests: TEST-184, TEST-185

### REQ-058 — Server Metrics Dashboard

Grafana shall be configured with Prometheus datasource and a pre-built dashboard (UID: travel-agency-metrics) showing panels for HTTP request duration, active users, server resource usage, and error rates. Admin users shall access Grafana at port 3001.

Mapped Tests: TEST-186

---

## 7. Assumptions

### ASSUMPTION-001

Phone number validation accepts digits 10-15, plus optional leading plus sign. Country code is not verified against an external registry.

### ASSUMPTION-002

Vehicle capacity is a positive integer between 1 and 60 inclusive. Vehicle types are predefined: Sedan, SUV, Minivan, Bus.

### ASSUMPTION-003

Currency is assumed to be a single currency (INR) for all operations. Multi-currency support is not required in MVP.

### ASSUMPTION-004

Email delivery (welcome emails, notifications) is out of scope for MVP. Notifications are in-app only.

### ASSUMPTION-005

File uploads (profile pictures, vehicle images) are implemented using local filesystem storage. Cloud storage is not required in MVP.

### ASSUMPTION-006

Time zone handling assumes all operations are in a single time zone (IST, UTC+5:30). Time zone conversion is not required.

### ASSUMPTION-007

The platform does not handle payment processing in MVP. Bookings are confirmed without payment capture.

### ASSUMPTION-008

Maximum 50 drivers per agency. No hard limit in the database, but UI pagination uses 20 items per page for driver listings.
