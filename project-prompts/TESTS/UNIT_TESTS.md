# Unit Tests

## Overview
These unit tests focus on isolated functions and services within the backend codebase. They are implemented using **Jest** and **Supertest** for Express route handlers.

| TEST‑ID | REQ‑ID | Target | Description |
|---------|--------|--------|-------------|
| **UT‑001** | REQ‑001 | `authService.registerUser` | Verify that a valid registration creates a user and returns a JWT. |
| **UT‑002** | REQ‑001 | `authService.registerUser` | Reject registration when password does not meet policy. |
| **UT‑003** | REQ‑002 | `authMiddleware.checkRole` | Allow access for a driver role on driver‑dashboard route. |
| **UT‑004** | REQ‑002 | `authMiddleware.checkRole` | Deny access for a traveler role on driver‑dashboard route. |
| **UT‑005** | REQ‑006 | `availabilityService.createSlots` | Accept future availability slots. |
| **UT‑006** | REQ‑006 | `availabilityService.createSlots` | Reject past availability slots. |
| **UT‑007** | REQ‑014 | `searchController.search` | Return results quickly (<200 ms) for typical queries. |
| **UT‑008** | REQ‑017 | `security.validateInput` | Sanitize malicious SQL injection payload.

### Example Jest Snippet (UT‑001)
```javascript
import { registerUser } from '../../src/services/authService';
import db from '../../src/models';

test('UT-001: successful registration returns JWT', async () => {
  const payload = { email: 'test@example.com', password: 'StrongPass1!', role: 'traveler' };
  const result = await registerUser(payload);
  expect(result).toHaveProperty('token');
  expect(result).toHaveProperty('userId');
});
```

---

# Integration Tests

## Overview
Integration tests validate the interaction between multiple components (controllers, services, DB). Implemented with **Supertest** against the running Express server.

| TEST‑ID | REQ‑ID | Endpoint | Scenario |
|---------|--------|----------|----------|
| **IT‑001** | REQ‑001 | POST `/api/auth/register` | Register a new traveler and receive JWT. |
| **IT‑002** | REQ‑004 | POST `/api/bookings` | Create a booking when driver is available; expect 201.
| **IT‑003** | REQ‑004 | POST `/api/bookings` | Attempt booking with conflicting driver slot; expect 409.
| **IT‑004** | REQ‑005 | PATCH `/api/bookings/:id/status` | Transition from Pending to Confirmed; verify status change and notification event.
| **IT‑005** | REQ‑009 | WebSocket `/api/notifications` | Subscribe and receive `bookingStatusChanged` after status update.
| **IT‑006** | REQ‑014 | GET `/api/search` | Simulate 500 concurrent requests; assert 95% ≤200 ms.
| **IT‑007** | REQ‑017 | POST `/api/search` with malicious payload | Ensure response is 400 and no data leak.

### Example Supertest Snippet (IT‑001)
```javascript
import request from 'supertest';
import app from '../../src/app';

test('IT-001: register traveler', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'traveler@example.com', password: 'StrongPass1!', role: 'traveler' })
    .expect(201);
  expect(res.body).toHaveProperty('token');
});
```

---

# End-to-End (E2E) Tests

## Overview
E2E tests simulate real user journeys through the full stack using **Cypress**.

| TEST‑ID | REQ‑ID | User Flow Description |
|---------|--------|-----------------------|
| **E2E‑001** | REQ‑001, REQ‑003, REQ‑004, REQ‑005, REQ‑009 | Traveler registers, searches destination, books a driver, receives realtime status updates, and views booking history. |
| **E2E‑002** | REQ‑006, REQ‑013 | Driver logs in, publishes availability, receives booking request, accepts it, and updates status to OnTrip. |
| **E2E‑003** | REQ‑007, REQ‑008 | Agency admin logs in, views dashboard metrics, and manages driver assignments. |
| **E2E‑004** | REQ‑014, REQ‑015, REQ‑016 | System undergoes load test with 500 concurrent searches; UI remains responsive and shows performance indicators. |
| **E2E‑005** | REQ‑017, REQ‑018 | Attempt to submit a form with invalid input; UI displays proper validation messages and prevents submission.

### Cypress Sample (E2E‑001)
```javascript
describe('Traveler end‑to‑end flow', () => {
  it('registers, searches, books, and receives notifications', () => {
    // Registration
    cy.visit('/register');
    cy.get('[data-cy=email]').type('e2e_user@example.com');
    cy.get('[data-cy=password]').type('StrongPass1!');
    cy.get('[data-cy=role]').select('traveler');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/dashboard');

    // Search
    cy.get('[data-cy=search-destination]').type('Chennai');
    cy.get('[data-cy=search-date]').type('2026-07-01');
    cy.get('[data-cy=search-btn]').click();
    cy.contains('Available Drivers').should('exist');

    // Book
    cy.get('[data-cy=driver-select]').first().click();
    cy.get('[data-cy=book-btn]').click();
    cy.contains('Booking Confirmed').should('exist');

    // Notification
    cy.wait(5000); // allow socket to push update
    cy.contains('Your booking status changed to Confirmed').should('exist');
  });
});
```

---

**All tests are linked to their respective REQ‑IDs and fulfill the TDD‑FIRST requirement.**
