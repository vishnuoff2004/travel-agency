File: /project-prompts/TESTS/INTEGRATION_TESTS.md

# Integration Tests — Travel Agency Services Platform

---

## Authentication Tests

### TEST-005 — Login with valid credentials

- **REQ-ID:** REQ-002
- **Scenario:** Registered user logs in with correct email and password
- **Input:** `POST /api/auth/login`, body: `{ "email": "john@example.com", "password": "Password1" }`
- **Expected Output:** HTTP 200, response contains `{ token: "<JWT>", user: { id, name, email, role } }`

### TEST-006 — Login with incorrect password

- **REQ-ID:** REQ-002
- **Scenario:** Registered user logs in with wrong password
- **Input:** `POST /api/auth/login`, body: `{ "email": "john@example.com", "password": "WrongPass1" }`
- **Expected Output:** HTTP 401, response contains `{ message: "Invalid email or password" }`

### TEST-007 — Login with non-existent email

- **REQ-ID:** REQ-002
- **Scenario:** Login attempt with email not registered
- **Input:** `POST /api/auth/login`, body: `{ "email": "nonexistent@example.com", "password": "Password1" }`
- **Expected Output:** HTTP 401, response contains `{ message: "Invalid email or password" }`

### TEST-008 — Account lockout after 5 failures

- **REQ-ID:** REQ-002
- **Scenario:** User enters incorrect password 5 times within 15 minutes
- **Input:** `POST /api/auth/login` 5 times with wrong password
- **Expected Output:** HTTP 429 on 5th attempt, response contains `{ message: "Account locked. Try again after 15 minutes" }`

### TEST-009 — Access with valid JWT

- **REQ-ID:** REQ-003
- **Scenario:** Request to protected endpoint with valid JWT
- **Input:** `GET /api/bookings`, header: `Authorization: Bearer <valid_jwt>`
- **Expected Output:** HTTP 200, booking data returned

### TEST-010 — Access with expired JWT

- **REQ-ID:** REQ-003
- **Scenario:** Request to protected endpoint with expired JWT (over 24 hours old)
- **Input:** `GET /api/bookings`, header: `Authorization: Bearer <expired_jwt>`
- **Expected Output:** HTTP 401, response contains `{ message: "Token expired" }`

### TEST-011 — Access with malformed JWT

- **REQ-ID:** REQ-003
- **Scenario:** Request to protected endpoint with malformed JWT string
- **Input:** `GET /api/bookings`, header: `Authorization: Bearer this.is.not.a.valid.jwt`
- **Expected Output:** HTTP 401, response contains `{ message: "Invalid token" }`

### TEST-012 — Access without JWT

- **REQ-ID:** REQ-003
- **Scenario:** Request to protected endpoint without Authorization header
- **Input:** `GET /api/bookings`, no Authorization header
- **Expected Output:** HTTP 401, response contains `{ message: "No token provided" }`

---

## Role-Based Access Tests

### TEST-013 — Traveler accesses own endpoints

- **REQ-ID:** REQ-004
- **Scenario:** Traveler-role user accesses traveler endpoints (search, booking)
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`, JWT with role "Traveler"
- **Expected Output:** HTTP 200, route data returned

### TEST-014 — Traveler accesses admin endpoint

- **REQ-ID:** REQ-004
- **Scenario:** Traveler attempts to access admin-only endpoint
- **Input:** `GET /api/admin/users`, JWT with role "Traveler"
- **Expected Output:** HTTP 403, response contains `{ message: "Insufficient permissions" }`

### TEST-015 — Driver accesses driver endpoint

- **REQ-ID:** REQ-004
- **Scenario:** Driver-role user accesses driver-only endpoint
- **Input:** `POST /api/drivers/routes`, JWT with role "Driver", valid route payload
- **Expected Output:** HTTP 201, route created

### TEST-016 — Admin accesses all endpoints

- **REQ-ID:** REQ-004
- **Scenario:** Admin accesses traveler, driver, agency, and admin endpoints
- **Input:** `GET /api/admin/users`, JWT with role "Admin"
- **Expected Output:** HTTP 200 for all endpoints

---

## Profile Management Tests

### TEST-017 — Update profile with valid data

- **REQ-ID:** REQ-005
- **Scenario:** User updates name and phone number
- **Input:** `PUT /api/users/profile`, body: `{ "name": "John Updated", "phone": "+919876543210" }`
- **Expected Output:** HTTP 200, updated user object returned with new name and phone

### TEST-018 — Update profile with invalid phone

- **REQ-ID:** REQ-005
- **Scenario:** User updates phone number with invalid format
- **Input:** `PUT /api/users/profile`, body: `{ "phone": "abc" }`
- **Expected Output:** HTTP 400, error message "Invalid phone number format"

### TEST-019 — Update email without re-auth

- **REQ-ID:** REQ-005
- **Scenario:** User attempts to change email without re-authenticating
- **Input:** `PUT /api/users/profile`, body: `{ "email": "newemail@example.com" }`
- **Expected Output:** HTTP 403, error message "Re-authentication required to change email"

---

## Destination Search Tests

### TEST-020 — Search existing route

- **REQ-ID:** REQ-006
- **Scenario:** Search for a route that exists in the database
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** HTTP 200, array with at least one result containing agency name, driver name, vehicle type, fare

### TEST-021 — Search with partial text

- **REQ-ID:** REQ-006
- **Scenario:** Search using partial city name
- **Input:** `GET /api/routes/search?source=Mum&destination=Pun`
- **Expected Output:** HTTP 200, returns routes matching Mumbai→Pune

### TEST-022 — Search non-existent route

- **REQ-ID:** REQ-006
- **Scenario:** Search for a route that does not exist
- **Input:** `GET /api/routes/search?source=Tokyo&destination=Osaka`
- **Expected Output:** HTTP 200, empty array `[]`

### TEST-024 — Search returns agencies and drivers

- **REQ-ID:** REQ-007
- **Scenario:** Search returns complete result with agency and driver details
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** Each result includes `{ agencyName, agencyId, driverName, driverId, vehicleType, fare }`

### TEST-025 — Search result contains all fields

- **REQ-ID:** REQ-007
- **Scenario:** Verify all required fields present in search results
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** Every result object has non-null values for: agencyName, driverName, vehicleType, fare

---

## Booking Tests

### TEST-027 — Create booking with valid data

- **REQ-ID:** REQ-008
- **Scenario:** Traveler creates a booking with valid route, driver, and date
- **Input:** `POST /api/bookings`, body: `{ "routeId": 1, "driverId": 1, "seatCount": 2, "travelDate": "2026-07-15" }`
- **Expected Output:** HTTP 201, booking returned with status "Pending" and assigned bookingId

### TEST-029 — Create duplicate booking

- **REQ-ID:** REQ-008
- **Scenario:** Same traveler books same route, driver, and date again
- **Input:** `POST /api/bookings`, body: `{ "routeId": 1, "driverId": 1, "seatCount": 1, "travelDate": "2026-07-15" }` (same as TEST-027)
- **Expected Output:** HTTP 409, error message "You already have a booking for this route on this date"

### TEST-031 — Create booking as unauthenticated

- **REQ-ID:** REQ-008
- **Scenario:** Unauthenticated user attempts to create a booking
- **Input:** `POST /api/bookings`, no Authorization header
- **Expected Output:** HTTP 401, error message "No token provided"

### TEST-032 — View booking history

- **REQ-ID:** REQ-009
- **Scenario:** Traveler views their booking history
- **Input:** `GET /api/bookings`
- **Expected Output:** HTTP 200, array of bookings belonging to the authenticated user, ordered by createdDate DESC

### TEST-033 — Booking history pagination

- **REQ-ID:** REQ-009
- **Scenario:** Traveler requests page 2 with 10 items per page
- **Input:** `GET /api/bookings?page=2&limit=10`
- **Expected Output:** HTTP 200, response contains `{ data: [...], page: 2, limit: 10, totalPages: N, totalItems: N }`

### TEST-034 — Booking history empty state

- **REQ-ID:** REQ-009
- **Scenario:** Traveler with no bookings views history
- **Input:** `GET /api/bookings` (new user with zero bookings)
- **Expected Output:** HTTP 200, empty array `[]`, pagination: `{ page: 1, totalItems: 0 }`

### TEST-039 — Cancel pending booking

- **REQ-ID:** REQ-011
- **Scenario:** Traveler cancels a booking with status Pending
- **Input:** `PUT /api/bookings/1/cancel`, booking status = "Pending"
- **Expected Output:** HTTP 200, booking status changed to "Cancelled", cancellation timestamp recorded

### TEST-040 — Cancel confirmed booking

- **REQ-ID:** REQ-011
- **Scenario:** Traveler cancels a booking with status Confirmed
- **Input:** `PUT /api/bookings/1/cancel`, booking status = "Confirmed"
- **Expected Output:** HTTP 200, booking status changed to "Cancelled"

### TEST-041 — Cancel completed booking

- **REQ-ID:** REQ-011
- **Scenario:** Traveler attempts to cancel a booking with status Completed
- **Input:** `PUT /api/bookings/1/cancel`, booking status = "Completed"
- **Expected Output:** HTTP 400, error message "Cannot cancel a booking with status Completed"

### TEST-042 — Cancel already cancelled booking

- **REQ-ID:** REQ-011
- **Scenario:** Traveler attempts to cancel a booking already with status Cancelled
- **Input:** `PUT /api/bookings/1/cancel`, booking status = "Cancelled"
- **Expected Output:** HTTP 400, error message "Booking is already cancelled"

### TEST-038 — Track non-existent booking

- **REQ-ID:** REQ-010
- **Scenario:** Query status for a booking ID that does not exist
- **Input:** `GET /api/bookings/99999/status`
- **Expected Output:** HTTP 404, error message "Booking not found"

---

## Driver Management Tests

### TEST-043 — Create driver profile

- **REQ-ID:** REQ-012
- **Scenario:** Driver creates their profile with all required fields
- **Input:** `POST /api/drivers/profile`, body: `{ "name": "Driver A", "phone": "+911234567890", "vehicleType": "Sedan", "vehicleReg": "KA01AB1234", "licenseNo": "DL1234567890" }`
- **Expected Output:** HTTP 201, driver profile returned with assigned driverId

### TEST-044 — Update driver profile

- **REQ-ID:** REQ-012
- **Scenario:** Driver updates phone number in profile
- **Input:** `PUT /api/drivers/profile`, body: `{ "phone": "+919999999999" }`
- **Expected Output:** HTTP 200, profile returned with updated phone number

### TEST-047 — Create route with valid data

- **REQ-ID:** REQ-013
- **Scenario:** Driver creates a route with valid source, destination, times, fare, and capacity
- **Input:** `POST /api/drivers/routes`, body: `{ "source": "Mumbai", "destination": "Pune", "departureTime": "2026-07-15T08:00:00Z", "arrivalTime": "2026-07-15T12:00:00Z", "fare": 500, "capacity": 4 }`
- **Expected Output:** HTTP 201, route object returned with assigned routeId

### TEST-051 — Mark route unavailable

- **REQ-ID:** REQ-014
- **Scenario:** Driver marks their route as unavailable
- **Input:** `PUT /api/drivers/routes/1/availability`, body: `{ "available": false }`
- **Expected Output:** HTTP 200, route availability set to false

### TEST-052 — Mark route available

- **REQ-ID:** REQ-014
- **Scenario:** Driver marks their route as available
- **Input:** `PUT /api/drivers/routes/1/availability`, body: `{ "available": true }`
- **Expected Output:** HTTP 200, route availability set to true

### TEST-053 — Booking on unavailable route

- **REQ-ID:** REQ-014
- **Scenario:** Traveler attempts to book on a route marked unavailable
- **Input:** `POST /api/bookings`, body: `{ "routeId": 1, "driverId": 1, "seatCount": 1, "travelDate": "2026-07-15" }` (route is unavailable)
- **Expected Output:** HTTP 400, error message "This route is currently unavailable"

### TEST-054 — Accept pending booking

- **REQ-ID:** REQ-015
- **Scenario:** Driver accepts a pending booking
- **Input:** `PUT /api/drivers/bookings/1/accept`
- **Expected Output:** HTTP 200, booking status changed from "Pending" to "Confirmed"

### TEST-055 — Reject pending booking

- **REQ-ID:** REQ-015
- **Scenario:** Driver rejects a pending booking with a reason
- **Input:** `PUT /api/drivers/bookings/1/reject`, body: `{ "reason": "Vehicle under maintenance" }`
- **Expected Output:** HTTP 200, booking status changed to "Cancelled", cancellation reason recorded

### TEST-056 — Accept already confirmed booking

- **REQ-ID:** REQ-015
- **Scenario:** Driver attempts to accept a booking already confirmed
- **Input:** `PUT /api/drivers/bookings/1/accept`, booking status = "Confirmed"
- **Expected Output:** HTTP 400, error message "Booking is already confirmed"

### TEST-058 — Accept booking from another driver

- **REQ-ID:** REQ-015
- **Scenario:** Driver attempts to accept a booking assigned to a different driver
- **Input:** `PUT /api/drivers/bookings/1/accept`, JWT with driverId=2, booking belongs to driverId=1
- **Expected Output:** HTTP 403, error message "This booking is not assigned to you"

### TEST-059 — Update to On Trip from Confirmed

- **REQ-ID:** REQ-016
- **Scenario:** Driver updates booking status to On Trip
- **Input:** `PUT /api/drivers/bookings/1/status`, body: `{ "status": "On Trip" }`, current status = "Confirmed"
- **Expected Output:** HTTP 200, status changed to "On Trip"

### TEST-060 — Update to Completed from On Trip

- **REQ-ID:** REQ-016
- **Scenario:** Driver updates booking status to Completed
- **Input:** `PUT /api/drivers/bookings/1/status`, body: `{ "status": "Completed" }`, current status = "On Trip"
- **Expected Output:** HTTP 200, status changed to "Completed"

---

## Agency Management Tests

### TEST-063 — Add driver to agency

- **REQ-ID:** REQ-017
- **Scenario:** Agency adds a driver to their agency
- **Input:** `POST /api/agency/drivers`, body: `{ "driverId": 3 }` (driver currently unassigned)
- **Expected Output:** HTTP 201, driver assigned to agency

### TEST-064 — Remove driver from agency

- **REQ-ID:** REQ-017
- **Scenario:** Agency removes a driver with no active bookings
- **Input:** `DELETE /api/agency/drivers/3`
- **Expected Output:** HTTP 200, driver unassigned from agency

### TEST-066 — Remove driver with active bookings

- **REQ-ID:** REQ-017
- **Scenario:** Agency attempts to remove a driver who has active confirmed bookings
- **Input:** `DELETE /api/agency/drivers/3` (driver has confirmed bookings)
- **Expected Output:** HTTP 409, error message "Cannot remove driver with active confirmed bookings"

### TEST-067 — View agency bookings

- **REQ-ID:** REQ-018
- **Scenario:** Agency views all bookings under their drivers
- **Input:** `GET /api/agency/bookings`
- **Expected Output:** HTTP 200, array of bookings with bookingId, travelerName, route, driverName, status, fare

### TEST-068 — Filter bookings by status

- **REQ-ID:** REQ-018
- **Scenario:** Agency filters bookings by status Confirmed
- **Input:** `GET /api/agency/bookings?status=Confirmed`
- **Expected Output:** HTTP 200, only bookings with status "Confirmed"

### TEST-069 — Filter bookings by date range

- **REQ-ID:** REQ-018
- **Scenario:** Agency filters bookings between two dates
- **Input:** `GET /api/agency/bookings?fromDate=2026-07-01&toDate=2026-07-31`
- **Expected Output:** HTTP 200, bookings with travelDate within July 2026

---

## Admin Tests

### TEST-070 — Admin views all users

- **REQ-ID:** REQ-019
- **Scenario:** Admin requests list of all registered users
- **Input:** `GET /api/admin/users`
- **Expected Output:** HTTP 200, array of users with id, name, email, role, active status

### TEST-071 — Admin deactivates user

- **REQ-ID:** REQ-019
- **Scenario:** Admin deactivates a user account
- **Input:** `PUT /api/admin/users/5/deactivate`
- **Expected Output:** HTTP 200, user active = false, logged with adminId and timestamp

### TEST-072 — Deactivated user login attempt

- **REQ-ID:** REQ-019
- **Scenario:** Deactivated user attempts to log in
- **Input:** `POST /api/auth/login`, body: `{ "email": "deactivated@example.com", "password": "Password1" }`
- **Expected Output:** HTTP 403, error message "Account deactivated. Contact administrator"

### TEST-073 — Non-admin attempts user management

- **REQ-ID:** REQ-019
- **Scenario:** Traveler attempts to access admin user management
- **Input:** `GET /api/admin/users`, JWT with role "Traveler"
- **Expected Output:** HTTP 403, error message "Insufficient permissions"

### TEST-074 — Admin creates agency

- **REQ-ID:** REQ-020
- **Scenario:** Admin creates a new travel agency
- **Input:** `POST /api/admin/agencies`, body: `{ "name": "City Travels", "email": "city@travels.com", "phone": "+911234567890" }`
- **Expected Output:** HTTP 201, agency object returned with assigned agencyId

### TEST-075 — Admin deactivates agency

- **REQ-ID:** REQ-020
- **Scenario:** Admin deactivates an agency
- **Input:** `PUT /api/admin/agencies/1/deactivate`
- **Expected Output:** HTTP 200, agency active = false

### TEST-076 — Search after agency deactivation

- **REQ-ID:** REQ-020
- **Scenario:** Search for routes after deactivating an agency
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune` (agency 1 is deactivated)
- **Expected Output:** HTTP 200, results do not include routes from deactivated agency

### TEST-077 — Non-admin creates agency

- **REQ-ID:** REQ-020
- **Scenario:** Driver attempts to create an agency
- **Input:** `POST /api/admin/agencies`, JWT with role "Driver"
- **Expected Output:** HTTP 403, error message "Insufficient permissions"

### TEST-078 — Admin cancels any booking

- **REQ-ID:** REQ-021
- **Scenario:** Admin cancels a completed booking
- **Input:** `PUT /api/admin/bookings/1/cancel`, body: `{ "reason": "Platform policy" }`, booking status = "Completed"
- **Expected Output:** HTTP 200, booking cancelled, reason and adminId logged

### TEST-079 — Admin views all bookings

- **REQ-ID:** REQ-021
- **Scenario:** Admin views every booking across all agencies
- **Input:** `GET /api/admin/bookings`
- **Expected Output:** HTTP 200, array of all bookings with agency name, driver name, traveler name

### TEST-080 — Admin cancel logs admin ID

- **REQ-ID:** REQ-021
- **Scenario:** Verify cancellation audit log contains admin ID
- **Input:** `PUT /api/admin/bookings/1/cancel`, body: `{ "reason": "Policy" }`
- **Expected Output:** Audit log entry contains `{ adminId, bookingId, action: "cancel", reason, timestamp }`

---

## Dashboard Tests

### TEST-081 — Dashboard shows active bookings

- **REQ-ID:** REQ-022
- **Scenario:** Traveler views dashboard with active bookings
- **Input:** `GET /api/dashboard/user`
- **Expected Output:** HTTP 200, response contains `{ activeBookings: N, totalBookings: N }`

### TEST-082 — Dashboard shows upcoming trips

- **REQ-ID:** REQ-022
- **Scenario:** Traveler views upcoming trips on dashboard
- **Input:** `GET /api/dashboard/user`
- **Expected Output:** HTTP 200, response contains `{ upcomingTrips: [...] }` with trips within next 7 days

### TEST-083 — Dashboard shows pending requests

- **REQ-ID:** REQ-023
- **Scenario:** Driver views pending booking requests on dashboard
- **Input:** `GET /api/dashboard/driver`
- **Expected Output:** HTTP 200, response contains `{ pendingRequests: N, activeTrips: N }`

### TEST-084 — Dashboard availability toggle

- **REQ-ID:** REQ-023
- **Scenario:** Driver toggles availability from dashboard
- **Input:** `PUT /api/drivers/availability`, body: `{ "available": false }`
- **Expected Output:** HTTP 200, driver availability updated

### TEST-085 — Dashboard shows counts

- **REQ-ID:** REQ-024
- **Scenario:** Admin views dashboard with system counts
- **Input:** `GET /api/dashboard/admin`
- **Expected Output:** HTTP 200, response contains `{ totalUsers: N, totalAgencies: N, totalActiveBookings: N }`

### TEST-086 — Dashboard shows status breakdown

- **REQ-ID:** REQ-024
- **Scenario:** Admin views booking status breakdown
- **Input:** `GET /api/dashboard/admin`
- **Expected Output:** HTTP 200, response contains `{ bookingsByStatus: { Pending: N, Confirmed: N, OnTrip: N, Completed: N, Cancelled: N } }`

---

## API Format Tests

### TEST-112 — API response format compliance

- **REQ-ID:** REQ-037
- **Scenario:** Verify all APIs return JSON with Content-Type application/json
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** HTTP 200, Content-Type: application/json, dates in ISO 8601 format

### TEST-113 — Empty results returns 200

- **REQ-ID:** REQ-038
- **Scenario:** Search with no matching routes
- **Input:** `GET /api/routes/search?source=Atlantis&destination=Olympus`
- **Expected Output:** HTTP 200, Content-Type: application/json

### TEST-114 — Empty results contains message

- **REQ-ID:** REQ-038
- **Scenario:** Empty search result includes message field
- **Input:** `GET /api/routes/search?source=Atlantis&destination=Olympus`
- **Expected Output:** HTTP 200, body: `{ "data": [], "message": "No routes found for this destination" }`

### TEST-119 — Second booking gets 409

- **REQ-ID:** REQ-040
- **Scenario:** Sequential bookings for last seat (capacity = 1)
- **Input:** Two sequential POST /api/bookings requests with seatCount = 1
- **Expected Output:** First: HTTP 201, Second: HTTP 409 "Insufficient capacity"

### TEST-124 — Driver available after trip ends

- **REQ-ID:** REQ-042
- **Scenario:** Driver completes trip, availability auto-restored
- **Input:** `PUT /api/drivers/bookings/1/status`, body: `{ "status": "Completed" }`
- **Expected Output:** HTTP 200, driver availability set to true

### TEST-126 — Confirmed booking preserved on removal

- **REQ-ID:** REQ-043
- **Scenario:** Agency removes driver with confirmed bookings
- **Input:** `DELETE /api/agency/drivers/3` (driver has confirmed bookings)
- **Expected Output:** HTTP 409, confirmed bookings NOT cancelled

### TEST-127 — Agency deactivation cancels pending

- **REQ-ID:** REQ-044
- **Scenario:** Admin deactivates agency with pending bookings
- **Input:** `PUT /api/admin/agencies/1/deactivate`
- **Expected Output:** HTTP 200, all pending bookings under this agency set to Cancelled

### TEST-128 — Agency deactivation preserves active

- **REQ-ID:** REQ-044
- **Scenario:** Admin deactivates agency with active bookings (Confirmed, On Trip)
- **Input:** `PUT /api/admin/agencies/1/deactivate`
- **Expected Output:** HTTP 200, Confirmed and On Trip bookings remain unchanged

### TEST-129 — Search excludes deactivated agency

- **REQ-ID:** REQ-044
- **Scenario:** Search after agency deactivation
- **Input:** `GET /api/routes/search?source=Mumbai&destination=Pune`
- **Expected Output:** HTTP 200, results exclude deactivated agency's routes
