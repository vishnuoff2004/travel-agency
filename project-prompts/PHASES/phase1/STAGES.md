# Phase 1 – Core Booking Platform (MVP)

## Goal
Build the minimum viable platform: authentication, search, booking, driver management, and admin oversight.

## Duration
Estimated: 4–6 Weeks

---

## Scope — REQ‑ID Mapping

| REQ‑ID | Feature |
|--------|---------|
| REQ‑001 | User Registration & Authentication (JWT + bcrypt) |
| REQ‑002 | Role‑Based Access Control (traveler, driver, agency, admin) |
| REQ‑003 | Destination Search (search by source, destination, date) |
| REQ‑004 | Booking Creation (select driver/agency, confirm booking) |
| REQ‑005 | Booking Lifecycle Management (Pending → Confirmed → OnTrip → Completed → Cancelled) |
| REQ‑006 | Driver Availability Management (publish slots, accept/reject bookings) |
| REQ‑007 | Agency Dashboard (manage drivers, monitor bookings) |
| REQ‑008 | Administrator Dashboard (manage users, agencies, drivers) |
| REQ‑011 | Form Validation & Error Handling |
| REQ‑012 | Responsive UI (desktop, tablet, mobile) |
| REQ‑017 | Security (password hashing, JWT, HTTPS, RBAC) |
| REQ‑018 | Data Integrity (ACID transactions for bookings) |
| REQ‑023 | Technology Stack constraint (React, Node, MySQL, Sequelize) |
| REQ‑028 | Concurrent Booking Conflict resolution |
| REQ‑031 | UTC timestamps, client‑side timezone display |
| REQ‑032 | User Input Size limits |
| REQ‑033 | Password Policy enforcement |

## Deliverables

### Backend
- Authentication APIs (`/api/auth/register`, `/api/auth/login`)
- Booking APIs (`/api/bookings`, `/api/bookings/:id/status`)
- Driver APIs (`/api/driver/availability`, `/api/driver/routes`)
- Agency APIs (`/api/agency/:id/dashboard`)
- Admin APIs (`/api/admin/overview`)
- Middleware: auth, RBAC, validation, error handling

### Frontend
- Registration & Login pages
- User Dashboard (search, book, history)
- Driver Dashboard (routes, availability, booking requests)
- Agency Dashboard (driver management, booking monitoring)
- Admin Dashboard (user/agency/driver management)

### Database
- Tables: `users`, `agencies`, `drivers`, `routes`, `bookings`, `availabilities`
- Sequelize models with validations and associations

### Infrastructure
- Docker Compose (frontend, backend, MySQL containers)
- Environment config (`.env` files)

## Value Delivered
A fully functional booking platform where travelers can search, book, and track trips; drivers can manage availability; agencies can oversee operations; admins can manage the platform.

---

## CHECK
- MVP defined ✅
- Each feature delivers usable value ✅
- No overlap with Phase 2/3/4 ✅
- All REQ‑IDs listed are specific to this phase ✅

File: /project-prompts/PHASES/PHASE_1_MVP.md
