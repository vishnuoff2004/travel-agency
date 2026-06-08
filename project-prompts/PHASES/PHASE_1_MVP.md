File: /project-prompts/PHASES/PHASE_1_MVP.md

# Phase 1 — Core Booking Platform (MVP)

---

## Goal

Deliver a fully functional booking platform where travelers can search destinations, create and manage bookings, drivers can manage routes and trips, agencies can manage drivers and monitor bookings, and admins can oversee the entire platform.

## Duration

4–6 Weeks

## Delivered Value

End-to-end travel booking workflows for all four roles. Platform is production-ready for initial launch.

## Included Requirements

### Authentication & User Management

| REQ-ID | Description |
|--------|-------------|
| REQ-001 | User Registration |
| REQ-002 | User Login |
| REQ-003 | JWT Authentication |
| REQ-004 | Role-Based Access Control |
| REQ-005 | Profile Management |
| REQ-028 | Session Protection |
| REQ-032 | Password Security |

### Destination Search

| REQ-ID | Description |
|--------|-------------|
| REQ-006 | Destination Search |
| REQ-007 | View Agencies and Drivers from Search |
| REQ-038 | Empty Search Results |

### Booking Management

| REQ-ID | Description |
|--------|-------------|
| REQ-008 | Create Booking |
| REQ-009 | Booking History |
| REQ-010 | Booking Tracking |
| REQ-011 | Booking Cancellation |
| REQ-039 | Maximum Booking Capacity |
| REQ-040 | Simultaneous Booking Conflicts |
| REQ-041 | Past Date Booking |
| REQ-033 | Data Consistency |

### Driver Management

| REQ-ID | Description |
|--------|-------------|
| REQ-012 | Driver Profile Management |
| REQ-013 | Route Creation by Driver |
| REQ-014 | Availability Management |
| REQ-015 | Accept or Reject Bookings |
| REQ-016 | Trip Status Update |
| REQ-042 | Driver Auto-Unavailability |

### Agency Management

| REQ-ID | Description |
|--------|-------------|
| REQ-017 | Agency Driver Management |
| REQ-018 | Agency Booking Monitoring |
| REQ-043 | Orphaned Bookings |

### Admin Management

| REQ-ID | Description |
|--------|-------------|
| REQ-019 | Admin User Management |
| REQ-020 | Admin Agency Management |
| REQ-021 | Admin Booking Oversight |
| REQ-044 | Account Deactivation Impact |

### Dashboards

| REQ-ID | Description |
|--------|-------------|
| REQ-022 | User Dashboard |
| REQ-023 | Driver Dashboard |
| REQ-024 | Admin Dashboard |

### UX & Validation

| REQ-ID | Description |
|--------|-------------|
| REQ-025 | Form Validation |
| REQ-026 | Loading States |
| REQ-027 | Success and Error Notifications |

### Architecture & Constraints

| REQ-ID | Description |
|--------|-------------|
| REQ-034 | Modular Architecture |
| REQ-035 | Technology Stack |
| REQ-036 | Browser Support |
| REQ-037 | API Format |

## Deliverables

### Backend

- Express.js server with route structure
- All database models and migrations
- Auth middleware (JWT verification)
- RBAC middleware (role permission checks)
- Error handler middleware
- Validator middleware
- Auth API (register, login)
- User API (profile CRUD)
- Search API (route search with partial matching)
- Booking API (create, list, track, cancel)
- Driver API (profile, routes, availability, accept, reject, status)
- Agency API (driver management, booking monitoring)
- Admin API (user, agency, booking management)
- Dashboard API (user, driver, admin)

### Frontend

- Login and registration pages
- Search page with results display
- Booking creation page
- Booking history page with pagination
- Booking detail and tracking page
- Driver dashboard page
- Route management page
- Booking requests page
- Agency dashboard page
- Driver management page
- Booking monitor page
- Admin dashboard page
- User management page
- Agency management page
- Booking oversight page
- Common components (LoadingSpinner, SkeletonLoader, Notification, Pagination, Modal, Button)
- Form components (InputField, SelectField, DatePicker, FormError)
- Auth context
- API service layer

### Database

- MySQL schema with all 6 tables
- Indexes on search columns, foreign keys, status columns
- Seed data for initial routes and agencies

### Deployment

- Docker Compose with backend, frontend, and MySQL services
- Dockerfile for backend and frontend
- Environment variable configuration

## Excluded from Phase 1

- Realtime notifications (Socket.io) — Phase 2
- Advanced dashboard analytics — Phase 2
- Performance optimization (Redis, pagination) — Phase 3
- Background job processing (BullMQ) — Phase 3
- Multi-language support — Phase 4
- Monitoring (Grafana/Prometheus) — Phase 4
