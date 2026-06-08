File: /project-prompts/SYSTEM_DESIGN.md

# System Design — Travel Agency Services Platform

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React.js SPA (Port 3000)                 │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐  │  │
│  │  │ Auth    │ │ Search   │ │ Booking│ │ Dashboard  │  │  │
│  │  │ Pages   │ │ Pages    │ │ Pages  │ │ Pages      │  │  │
│  │  └─────────┘ └──────────┘ └────────┘ └────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Context API (State Management)          │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON (Axios)
                           │ JWT in Authorization Header
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Express.js Server (Port 5000)               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │  │
│  │  │ Auth     │ │ RBAC     │ │ Request  │ │ Error  │  │  │
│  │  │ Routes   │ │ Middleware│ │ Logger   │ │ Handler│  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Auth     │ │ Booking  │ │ Driver   │ │ Agency/Admin │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           Input Validation Layer                    │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Sequelize ORM + MySQL 8.0                     │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──┐  │  │
│  │  │Users │ │Routes│ │Book- │ │Agen- │ │Drivers│ │..│  │  │
│  │  │      │ │      │ │ings  │ │cies  │ │      │ │  │  │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Style

Three-tier monolith deployed via Docker Compose:
- **Presentation Layer:** React.js SPA served by Nginx (production) or dev server (development)
- **Application Layer:** Express.js REST API
- **Data Layer:** MySQL 8.0 with Sequelize ORM

### 1.3 Communication Flow

1. Browser → Axios HTTP → Express.js (REST JSON)
2. JWT authentication via Authorization: Bearer header
3. Express validates token → middleware checks role permissions
4. Route handler → Service layer → Sequelize ORM → MySQL
5. Response flows back through the same path

---

## 2. Tech Stack

| Layer       | Technology        | Version  | Purpose                         |
|-------------|-------------------|----------|---------------------------------|
| Frontend    | React.js          | ^18.x    | UI rendering                    |
| Routing     | React Router DOM  | ^6.x     | Client-side routing             |
| Styling     | Tailwind CSS      | ^3.x     | Utility-first CSS               |
| State       | Context API       | built-in | Global state management         |
| Forms       | React Hook Form   | ^7.x     | Form validation & submission    |
| HTTP Client | Axios             | ^1.x     | API communication               |
| Backend     | Node.js           | ^18.x    | Runtime                         |
| Framework   | Express.js        | ^4.x     | HTTP server & routing           |
| Auth        | jsonwebtoken      | ^9.x     | JWT generation & verification   |
| Password    | bcrypt            | ^5.x     | Password hashing                |
| ORM         | Sequelize         | ^6.x     | Database abstraction            |
| Database    | MySQL             | 8.0      | Data storage                    |
| DB Driver   | mysql2            | ^3.x     | MySQL driver for Node.js        |
| Container   | Docker            | latest   | Containerization                |
| Orchestrate | Docker Compose    | latest   | Multi-container orchestration   |

---

## 3. Database Schema

### 3.1 Entity-Relationship Diagram

```
Users ──┬── Bookings ──┬── Routes
         │              │
         │              └── Drivers ──┬── Agencies
         │                             │
         └── BookingStatusHistory ─────┘
```

### 3.2 Tables

#### users

| Column       | Type         | Constraints                    |
|-------------|-------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT             |
| name        | VARCHAR(100)| NOT NULL                       |
| email       | VARCHAR(255)| NOT NULL, UNIQUE, INDEX        |
| password    | VARCHAR(255)| NOT NULL                       |
| phone       | VARCHAR(20) | NOT NULL                       |
| role        | ENUM('Traveler','Driver','Agency','Admin') | NOT NULL, DEFAULT 'Traveler' |
| active      | BOOLEAN     | NOT NULL, DEFAULT true         |
| loginAttempts| INT        | NOT NULL, DEFAULT 0            |
| lockedUntil | DATETIME    | NULL                           |
| createdAt   | DATETIME    | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updatedAt   | DATETIME    | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

Indexes: `email` (UNIQUE), `role`

#### agencies

| Column       | Type         | Constraints                    |
|-------------|-------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT             |
| name        | VARCHAR(150)| NOT NULL                       |
| email       | VARCHAR(255)| NOT NULL, UNIQUE               |
| phone       | VARCHAR(20) | NOT NULL                       |
| active      | BOOLEAN     | NOT NULL, DEFAULT true         |
| createdBy   | INT         | FK → users.id, NOT NULL       |
| createdAt   | DATETIME    | NOT NULL                       |
| updatedAt   | DATETIME    | NOT NULL                       |

Indexes: `email` (UNIQUE), `active`

#### drivers

| Column              | Type         | Constraints                    |
|--------------------|-------------|--------------------------------|
| id                 | INT         | PK, AUTO_INCREMENT             |
| userId             | INT         | FK → users.id, NOT NULL, UNIQUE|
| agencyId           | INT         | FK → agencies.id, NULL         |
| name               | VARCHAR(100)| NOT NULL                       |
| phone              | VARCHAR(20) | NOT NULL                       |
| vehicleType        | ENUM('Sedan','SUV','Minivan','Bus') | NOT NULL       |
| vehicleReg         | VARCHAR(20) | NOT NULL, UNIQUE               |
| licenseNo          | VARCHAR(50) | NOT NULL                       |
| available          | BOOLEAN     | NOT NULL, DEFAULT true         |
| createdAt          | DATETIME    | NOT NULL                       |
| updatedAt          | DATETIME    | NOT NULL                       |

Indexes: `userId` (UNIQUE), `agencyId`, `vehicleReg` (UNIQUE)

#### routes

| Column       | Type         | Constraints                    |
|-------------|-------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT             |
| driverId    | INT         | FK → drivers.id, NOT NULL     |
| source      | VARCHAR(100)| NOT NULL                       |
| destination | VARCHAR(100)| NOT NULL                       |
| departureTime| DATETIME   | NOT NULL                       |
| arrivalTime | DATETIME    | NOT NULL                       |
| fare        | DECIMAL(10,2)| NOT NULL, CHECK (fare > 0)   |
| capacity    | INT         | NOT NULL, CHECK (1-60)         |
| available   | BOOLEAN     | NOT NULL, DEFAULT true         |
| createdAt   | DATETIME    | NOT NULL                       |
| updatedAt   | DATETIME    | NOT NULL                       |

Indexes: `driverId`, `source`, `destination`, `(source, destination)`

#### bookings

| Column       | Type         | Constraints                    |
|-------------|-------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT             |
| userId      | INT         | FK → users.id, NOT NULL       |
| routeId     | INT         | FK → routes.id, NOT NULL      |
| driverId    | INT         | FK → drivers.id, NOT NULL     |
| seatCount   | INT         | NOT NULL, CHECK (>= 1)         |
| travelDate  | DATE        | NOT NULL                       |
| status      | ENUM('Pending','Confirmed','On Trip','Completed','Cancelled') | NOT NULL, DEFAULT 'Pending' |
| cancelReason| VARCHAR(255)| NULL                           |
| cancelledBy | INT         | FK → users.id, NULL           |
| createdAt   | DATETIME    | NOT NULL                       |
| updatedAt   | DATETIME    | NOT NULL                       |

Indexes: `userId`, `driverId`, `routeId`, `status`, `travelDate`, `(userId, routeId, travelDate)` (partial unique)

#### booking_status_history

| Column       | Type         | Constraints                    |
|-------------|-------------|--------------------------------|
| id          | INT         | PK, AUTO_INCREMENT             |
| bookingId   | INT         | FK → bookings.id, NOT NULL    |
| fromStatus  | VARCHAR(20) | NULL                           |
| toStatus    | VARCHAR(20) | NOT NULL                       |
| changedBy   | INT         | FK → users.id, NULL           |
| createdAt   | DATETIME    | NOT NULL                       |

Indexes: `bookingId`

---

## 4. API Design

### 4.1 Base URL

Development: `http://localhost:5000/api`

### 4.2 Authentication Endpoints

| Method | Path               | Auth   | Roles          | REQ IDs     |
|--------|-------------------|--------|----------------|-------------|
| POST   | /auth/register    | Public | All            | REQ-001     |
| POST   | /auth/login       | Public | All            | REQ-002     |

### 4.3 User Endpoints

| Method | Path               | Auth   | Roles          | REQ IDs     |
|--------|-------------------|--------|----------------|-------------|
| GET    | /users/profile    | JWT    | All            | REQ-005     |
| PUT    | /users/profile    | JWT    | All            | REQ-005     |
| GET    | /dashboard/user   | JWT    | Traveler       | REQ-022     |

### 4.4 Search Endpoints

| Method | Path                     | Auth   | Roles          | REQ IDs     |
|--------|-------------------------|--------|----------------|-------------|
| GET    | /routes/search           | Public | All            | REQ-006     |

Query params: `source` (required), `destination` (required)

Response:
```json
{
  "data": [
    {
      "routeId": 1,
      "source": "Mumbai",
      "destination": "Pune",
      "departureTime": "2026-07-15T08:00:00.000Z",
      "arrivalTime": "2026-07-15T12:00:00.000Z",
      "fare": 500.00,
      "capacity": 4,
      "agencyName": "City Travels",
      "agencyId": 1,
      "driverName": "Raj Kumar",
      "driverId": 1,
      "vehicleType": "Sedan"
    }
  ]
}
```

### 4.5 Booking Endpoints

| Method | Path                   | Auth   | Roles          | REQ IDs     |
|--------|-----------------------|--------|----------------|-------------|
| POST   | /bookings             | JWT    | Traveler       | REQ-008     |
| GET    | /bookings             | JWT    | Traveler       | REQ-009     |
| GET    | /bookings/:id         | JWT    | Traveler,Owner | REQ-010     |
| PUT    | /bookings/:id/cancel  | JWT    | Traveler       | REQ-011     |
| GET    | /bookings/:id/status  | JWT    | All            | REQ-010     |

POST /bookings body:
```json
{
  "routeId": 1,
  "driverId": 1,
  "seatCount": 2,
  "travelDate": "2026-07-15"
}
```

### 4.6 Driver Endpoints

| Method | Path                            | Auth   | Roles   | REQ IDs     |
|--------|--------------------------------|--------|---------|-------------|
| POST   | /drivers/profile               | JWT    | Driver  | REQ-012     |
| PUT    | /drivers/profile               | JWT    | Driver  | REQ-012     |
| POST   | /drivers/routes                | JWT    | Driver  | REQ-013     |
| PUT    | /drivers/routes/:id/availability| JWT   | Driver  | REQ-014     |
| PUT    | /drivers/bookings/:id/accept   | JWT    | Driver  | REQ-015     |
| PUT    | /drivers/bookings/:id/reject   | JWT    | Driver  | REQ-015     |
| PUT    | /drivers/bookings/:id/status   | JWT    | Driver  | REQ-016     |
| PUT    | /drivers/availability          | JWT    | Driver  | REQ-023     |
| GET    | /dashboard/driver              | JWT    | Driver  | REQ-023     |

### 4.7 Agency Endpoints

| Method | Path                   | Auth   | Roles   | REQ IDs     |
|--------|-----------------------|--------|---------|-------------|
| POST   | /agency/drivers       | JWT    | Agency  | REQ-017     |
| DELETE | /agency/drivers/:id   | JWT    | Agency  | REQ-017     |
| GET    | /agency/drivers       | JWT    | Agency  | REQ-017     |
| GET    | /agency/bookings      | JWT    | Agency  | REQ-018     |

### 4.8 Admin Endpoints

| Method | Path                          | Auth   | Roles   | REQ IDs     |
|--------|------------------------------|--------|---------|-------------|
| GET    | /admin/users                 | JWT    | Admin   | REQ-019     |
| PUT    | /admin/users/:id/deactivate  | JWT    | Admin   | REQ-019     |
| PUT    | /admin/users/:id/activate    | JWT    | Admin   | REQ-019     |
| POST   | /admin/agencies              | JWT    | Admin   | REQ-020     |
| PUT    | /admin/agencies/:id          | JWT    | Admin   | REQ-020     |
| PUT    | /admin/agencies/:id/deactivate| JWT   | Admin   | REQ-020     |
| GET    | /admin/bookings              | JWT    | Admin   | REQ-021     |
| PUT    | /admin/bookings/:id/cancel   | JWT    | Admin   | REQ-021     |
| GET    | /dashboard/admin             | JWT    | Admin   | REQ-024     |

### 4.9 Standard Error Response Format

```json
{
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

### 4.10 Pagination Format

```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalItems": 50
}
```

---

## 5. Folder Structure

### 5.1 Project Root

```
travel-agency-platform/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Driver.js
│   │   │   ├── Agency.js
│   │   │   ├── Route.js
│   │   │   ├── Booking.js
│   │   │   └── BookingStatusHistory.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── bookings.js
│   │   │   ├── drivers.js
│   │   │   ├── agency.js
│   │   │   ├── admin.js
│   │   │   └── search.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── bookingController.js
│   │   │   ├── driverController.js
│   │   │   ├── agencyController.js
│   │   │   ├── adminController.js
│   │   │   └── searchController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   ├── driverService.js
│   │   │   ├── agencyService.js
│   │   │   └── adminService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rbac.js
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── validations/
│   │   │   ├── authValidation.js
│   │   │   ├── bookingValidation.js
│   │   │   ├── driverValidation.js
│   │   │   └── userValidation.js
│   │   └── utils/
│   │       ├── jwt.js
│   │       ├── logger.js
│   │       └── helpers.js
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── routes/
│   │   │   ├── AppRoutes.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── RoleRoute.js
│   │   ├── layouts/
│   │   │   ├── MainLayout.js
│   │   │   ├── AuthLayout.js
│   │   │   └── DashboardLayout.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── RegisterPage.js
│   │   │   ├── traveler/
│   │   │   │   ├── SearchPage.js
│   │   │   │   ├── BookingPage.js
│   │   │   │   ├── BookingHistoryPage.js
│   │   │   │   └── BookingDetailPage.js
│   │   │   ├── driver/
│   │   │   │   ├── DriverDashboardPage.js
│   │   │   │   ├── RouteManagementPage.js
│   │   │   │   └── BookingRequestsPage.js
│   │   │   ├── agency/
│   │   │   │   ├── AgencyDashboardPage.js
│   │   │   │   ├── DriverManagementPage.js
│   │   │   │   └── BookingMonitorPage.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.js
│   │   │   │   ├── UserManagementPage.js
│   │   │   │   ├── AgencyManagementPage.js
│   │   │   │   └── BookingOversightPage.js
│   │   │   └── NotFoundPage.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── SkeletonLoader.js
│   │   │   │   ├── Notification.js
│   │   │   │   ├── Pagination.js
│   │   │   │   ├── Modal.js
│   │   │   │   └── Button.js
│   │   │   ├── forms/
│   │   │   │   ├── InputField.js
│   │   │   │   ├── SelectField.js
│   │   │   │   ├── DatePicker.js
│   │   │   │   └── FormError.js
│   │   │   ├── booking/
│   │   │   │   ├── BookingCard.js
│   │   │   │   ├── BookingStatusBadge.js
│   │   │   │   └── BookingTimeline.js
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.js
│   │   │   │   └── SearchResultCard.js
│   │   │   └── dashboard/
│   │   │       ├── StatCard.js
│   │   │       └── StatusBreakdownChart.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── BookingContext.js
│   │   │   └── NotificationContext.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useBookings.js
│   │   │   └── useSearch.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   ├── searchService.js
│   │   │   └── adminService.js
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       └── validators.js
│   └── tests/
│
└── database/
    ├── init.sql
    └── seed.sql
```

---

## 6. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Three-tier monolith | Simpler deployment than microservices, sufficient for MVP scale (1000 concurrent users) |
| ORM | Sequelize | Mature Node.js ORM, supports migrations, seeders, model associations |
| Auth | JWT with blacklist | Stateless auth via JWT, optional blacklist for forced logout |
| State Management | Context API | Sufficient for application complexity, avoids Redux boilerplate |
| Forms | React Hook Form | Performant, reduces re-renders, built-in validation |
| Password | bcrypt cost 10 | Industry standard, ~100ms verification time on modern hardware |
| API Versioning | URL prefix /api | Simple, explicit versioning strategy |
| Pagination | Offset-based | Standard for relational databases, suitable for expected data volume |
| Error Format | Consistent JSON | All errors return `{ message, errors? }` for predictable client handling |

---

## 7. Status Transition Rules

```
Pending ──────→ Confirmed (driver accepts)
Pending ──────→ Cancelled  (driver rejects, traveler cancels, auto-timeout)
Confirmed ────→ On Trip    (driver starts trip)
Confirmed ────→ Cancelled  (traveler cancels)
On Trip ──────→ Completed  (driver ends trip)
Any status ───→ Cancelled  (admin override)
```

Invalid transitions return HTTP 400 with message.
