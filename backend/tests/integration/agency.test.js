const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/agencyService');

const app = require('../../src/app');
const agencyService = require('../../src/services/agencyService');

const agencyToken = jwt.sign({ id: 3, role: 'agency_admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

describe('Agency APIs (REQ-017, REQ-018)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/agency/drivers should return 201 — TEST-063', async () => {
    agencyService.addDriver.mockResolvedValue({ id: 3, agencyId: 1 });
    const res = await request(app)
      .post('/api/agency/drivers')
      .set('Authorization', `Bearer ${agencyToken}`)
      .send({ driverId: 3 });
    expect(res.status).toBe(201);
  });

  test('DELETE /api/agency/drivers/3 should return 200 — TEST-064', async () => {
    agencyService.removeDriver.mockResolvedValue({ message: 'Driver removed from agency' });
    const res = await request(app)
      .delete('/api/agency/drivers/3')
      .set('Authorization', `Bearer ${agencyToken}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/agency/bookings should return 200 — TEST-067', async () => {
    agencyService.getBookings.mockResolvedValue({ data: [] });
    const res = await request(app)
      .get('/api/agency/bookings')
      .set('Authorization', `Bearer ${agencyToken}`);
    expect(res.status).toBe(200);
  });

  test('traveler cannot access agency endpoints — RBAC', async () => {
    const travelerToken = jwt.sign({ id: 1, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/agency/bookings')
      .set('Authorization', `Bearer ${travelerToken}`);
    expect(res.status).toBe(403);
  });
});
