# Requirements State

This file captures the full set of functional and non‑functional requirements extracted from the requirement documents.

---

## Functional Requirements

| REQ‑ID | Description |
|--------|-------------|
| **REQ‑001** | User Registration & Authentication – Users (travelers, drivers, agencies, administrators) must be able to register with email/password, log in, and receive a JWT token for session management. |
| **REQ‑002** | Role‑Based Access Control – The system must enforce role‑based permissions (traveler, driver, agency, admin) for all protected routes and UI sections. |
| **REQ‑003** | Destination Search – Travelers can search for destinations, view available agencies and drivers, and filter results by location, date, and price. |
| **REQ‑004** | Booking Creation – Travelers can create a booking by selecting a driver and agency, providing trip details, and confirming the request. |
| **REQ‑005** | Booking Lifecycle Management – The platform must track booking states: *Pending → Confirmed → On Trip → Completed → Cancelled*. Users can view status updates in real time. |
| **REQ‑006** | Driver Availability Management – Drivers can publish availability windows, update routes, and accept or reject booking requests. |
| **REQ‑007** | Agency Dashboard – Agencies can manage their fleet of drivers, monitor bookings, and generate operational reports. |
| **REQ‑008** | Administrator Dashboard – Admins can manage all users, agencies, drivers, view system metrics, and perform moderation actions. |
| **REQ‑009** | Realtime Notifications – All participants receive push/web‑socket notifications for booking status changes, driver arrivals, and system alerts. |
| **REQ‑010** | Booking History & Export – Users can view past bookings and export data (CSV/JSON) for personal records. |
| **REQ‑011** | Form Validation & Error Handling – All input forms must validate required fields, data formats, and display user‑friendly error messages. |
| **REQ‑012** | Responsive UI – The frontend must be fully responsive across desktop, tablet, and mobile viewports. |
| **REQ‑013** | Accessibility Compliance – UI components must meet WCAG 2.1 AA criteria (keyboard navigation, ARIA labels, contrast ratios). |

## Non‑Functional Requirements

| REQ‑ID | Description |
|--------|-------------|
| **REQ‑014** | Performance – API response times ≤ 200 ms for search and booking operations under normal load (≤ 500 concurrent users). |
| **REQ‑015** | Scalability – System must support horizontal scaling of both frontend and backend services; database should handle growth to 1 M booking records. |
| **REQ‑016** | Reliability – Uptime ≥ 99.9 % with automated health checks and graceful degradation for non‑critical services. |
| **REQ‑017** | Security – Passwords salted & hashed (bcrypt), JWT signed with RSA‑256, HTTPS enforced, and role‑based API authorization. |
| **REQ‑018** | Data Integrity – ACID‑compliant transactions for booking creation and status updates. |
| **REQ‑019** | Logging & Auditing – All critical actions (login, booking changes, admin actions) must be logged with timestamps and user IDs. |
| **REQ‑020** | Backup & Recovery – Daily automated backups of the MySQL database with a restore time objective ≤ 30 minutes. |
| **REQ‑021** | Internationalization – UI text must be externalized to support future language packs (i18next ready). |
| **REQ‑022** | Deployment – Containerized with Docker; CI/CD pipeline using GitHub Actions for automated builds, tests, and deployments. |

## Constraints

| REQ‑ID | Description |
|--------|-------------|
| **REQ‑023** | Technology Stack – Frontend: React.js + Tailwind CSS; Backend: Node.js + Express.js; Database: MySQL + Sequelize ORM; Realtime: Socket.io. |
| **REQ‑024** | Browser Support – Must work on latest versions of Chrome, Edge, and Firefox (no legacy IE support). |
| **REQ‑025** | Hosting Environment – Application will run in Docker containers on a Linux host; no reliance on Windows‑specific APIs. |
| **REQ‑026** | Open‑Source Licenses – All third‑party libraries must have permissive licenses (MIT, Apache 2.0). |
| **REQ‑027** | No External SaaS – All services (auth, storage, messaging) must be self‑hosted; no third‑party SaaS dependencies. |

## Edge Cases & Assumptions

| REQ‑ID | Description |
|--------|-------------|
| **REQ‑028** | Concurrent Booking Conflict – If two travelers attempt to book the same driver/slot simultaneously, the system must resolve the race condition and notify the loser with a clear “slot no longer available” message. |
| **REQ‑029** | Partial Network Failure – When a websocket connection drops, the UI should fallback to polling every 15 seconds to keep booking status updated. |
| **REQ‑030** | Driver Late Arrival – If a driver does not update status within 15 minutes of “On Trip”, the system escalates to admin for manual intervention. |
| **REQ‑031** | Data Validation Assumption – All timestamps are in UTC; clients convert to local time zones for display. |
| **REQ‑032** | User Input Size – Maximum length for text fields: 255 characters for names, 500 characters for comments. |
| **REQ‑033** | Password Policy – Minimum 8 characters, at least one uppercase, one number, and one special character. |
| **REQ‑034** | API Rate Limits – 100 requests per minute per user token to prevent abuse. |
| **REQ‑035** | Initial Data Seed – The system starts with no pre‑populated agencies or drivers; admins will import CSV data during the initial setup. |

---

File: /project-prompts/MEMORY/REQUIREMENTS_STATE.md
