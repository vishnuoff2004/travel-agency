File: /project-prompts/TESTS/INTEGRATION_TESTS.md

# Integration Tests

## Overview
Integration tests validate the interaction between multiple components (controllers, services, database) of the backend. They are implemented with **Supertest** against the running Express server.

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

test('IT‑001: register traveler', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'traveler@example.com', password: 'StrongPass1!', role: 'traveler' })
    .expect(201);
  expect(res.body).toHaveProperty('token');
});
```
