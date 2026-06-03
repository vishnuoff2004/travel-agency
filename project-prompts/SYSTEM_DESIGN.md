File: /project-prompts/SYSTEM_DESIGN.md

# System Design

## 1. Overview
The Travel Agency Services Platform is a modern web‑based application that connects **travelers**, **drivers**, **agencies**, and **administrators**. It provides a full booking lifecycle, realtime notifications, and an admin dashboard. The design follows a **service‑oriented architecture** with clear separation of frontend, backend, and data layers.

## 2. Architecture Diagram
```
[Client (React SPA)] <--HTTPS--> [API Gateway (Express.js)] <--HTTP--> [Business Services]
    |                                 |                               |
    |                                 |                               +--[Auth Service (JWT)]
    |                                 |                               +--[Booking Service]
    |                                 |                               +--[Search Service]
    |                                 |                               +--[Driver Service]
    |                                 |                               +--[Agency Service]
    |                                 |
    +--WebSocket (Socket.io) <-------+                               |
    |                                 |
    +--Static Assets (CDN)            |
    |                                 |
    +--Database (MySQL) <-------------+
    |
    +--Cache (Redis) <-----------------
``` 
*(Note: diagram provided in text form for accessibility.)*

## 3. Technology Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React.js, React Router DOM, Tailwind CSS, Context API, Axios, React Hook Form |
| Backend | Node.js, Express.js, JWT, bcrypt, Socket.io |
| Database | MySQL (InnoDB), Sequelize ORM |
| Caching | Redis |
| Messaging | Socket.io (WebSocket) |
| Containerisation | Docker, Docker‑Compose |
| CI/CD | GitHub Actions |
| Testing | Jest (unit), Supertest (integration), Cypress (E2E) |
| Monitoring | Prometheus, Grafana |
| Internationalisation | i18next |

## 4. Database Schema (simplified)
```sql
-- Users (Travelers, Drivers, Agencies, Admins) 
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('traveler','driver','agency','admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agencies
CREATE TABLE agencies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers
CREATE TABLE drivers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  agency_id BIGINT NOT NULL REFERENCES agencies(id),
  vehicle_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  traveler_id BIGINT NOT NULL REFERENCES users(id),
  driver_id BIGINT NOT NULL REFERENCES drivers(id),
  agency_id BIGINT NOT NULL REFERENCES agencies(id),
  status ENUM('Pending','Confirmed','OnTrip','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  scheduled_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Availability (Driver time slots)
CREATE TABLE availabilities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  driver_id BIGINT NOT NULL REFERENCES drivers(id),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
``` 

## 5. API Specification (selected endpoints)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register a new user (traveler/driver/agency) | ❌ |
| POST | `/api/auth/login` | Login and obtain JWT | ❌ |
| GET | `/api/search` | Search destinations, agencies, drivers | ✅ (traveler) |
| POST | `/api/bookings` | Create a new booking | ✅ (traveler) |
| PATCH | `/api/bookings/:id/status` | Update booking status (driver, agency, admin) | ✅ |
| POST | `/api/driver/availability` | Publish driver availability slots | ✅ (driver) |
| GET | `/api/agency/:id/dashboard` | Agency management view | ✅ (agency) |
| GET | `/api/admin/overview` | System‑wide admin dashboard | ✅ (admin) |
| GET | `/api/bookings/history` | Retrieve past bookings for a user | ✅ |

## 6. Folder Structure (project‑prompts/PROJECT_ROOT)
```
project-root/
├─ backend/                 # Express server
│   ├─ controllers/
│   ├─ routes/
│   ├─ services/
│   ├─ middleware/
│   ├─ models/               # Sequelize models (users, agencies…)
│   ├─ config/               # DB & env config
│   └─ index.js
├─ frontend/                # React SPA
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ routes/
│   │   ├─ context/
│   │   ├─ services/          # API wrappers (axios)
│   │   └─ App.jsx
│   └─ tailwind.config.js
├─ docker-compose.yml
├─ Dockerfile.backend
├─ Dockerfile.frontend
├─ .github/workflows/ci.yml
└─ README.md
```

## 7. Deployment & CI/CD
1. **Docker‑Compose** builds two services (`frontend`, `backend`) and connects them to a MySQL container and a Redis container.
2. **GitHub Actions** run on every push to `main`:
   - Lint (`eslint`, `stylelint`)
   - Unit tests (`jest`)
   - Integration tests (`supertest`)
   - Build Docker images and push to registry (optional)
   - Deploy to staging environment.
3. **Health checks** via `/health` endpoint; metrics exposed for Prometheus.

## 8. Security & Compliance
- **Authentication**: JWT signed with RSA‑256, stored in HttpOnly Secure cookies.
- **Password storage**: bcrypt with cost factor ≥ 12.
- **Authorization**: Role‑based middleware checks on every protected route.
- **Input validation**: `express-validator` sanitises all request bodies.
- **Rate limiting**: 100 requests per minute per JWT.
- **HTTPS everywhere** (TLS termination at reverse proxy).
- **CORS** limited to trusted origins.
- **Logging & Auditing**: All critical actions logged with user‑ID, IP, timestamp.
- **Backup**: Daily MySQL logical backups; point‑in‑time recovery tested weekly.

## 9. Alignment with Requirements
- All **functional** REQ‑IDs are covered by corresponding API endpoints and UI flows.
- **Non‑functional** REQs (performance, scalability, reliability, security, etc.) are addressed through the chosen stack, caching, load‑balancing, and CI/CD pipelines.
- **Constraints** such as self‑hosted services, containerisation, and licensing are respected.
- **Edge cases** (booking conflicts, websocket fallback, timezone handling) are explicitly modelled in the service layer and will be covered by the test suite generated in Command 2.

---
> **Verification Checklist**
> - Architecture diagram present ✅
> - Tech stack listed ✅
> - Database schema defined ✅
> - API spec includes all major REQs ✅
> - Folder structure matches project‑prompt conventions ✅
> - Deployment, security, and alignment sections completed ✅

File generated as per AI‑RUNNER global rule **FILE OUTPUT FORMAT**.
