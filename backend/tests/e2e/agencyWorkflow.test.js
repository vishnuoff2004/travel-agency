const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/agencyService');
jest.mock('../../src/services/authService');

const app = require('../../src/app');
const agencyService = require('../../src/services/agencyService');

describe('TEST-138 to TEST-139 — Agency E2E Workflow', () => {
  const agencyToken = jwt.sign({ id: 3, role: 'agency_admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

  beforeEach(() => { jest.clearAllMocks(); });

  test('TEST-138: Add driver → View/Filter bookings → Remove driver', async () => {
    agencyService.addDriver.mockResolvedValue({ id: 5, agencyId: 1 });
    const add = await request(app).post('/api/agency/drivers').set('Authorization', `Bearer ${agencyToken}`).send({ driverId: 5 });
    expect(add.status).toBe(201);

    agencyService.getBookings.mockResolvedValue({ data: [{ bookingId: 1, travelerName: 'John', status: 'Confirmed' }] });
    const book = await request(app).get('/api/agency/bookings?status=Confirmed').set('Authorization', `Bearer ${agencyToken}`);
    expect(book.status).toBe(200);
    expect(book.body.data.length).toBeGreaterThan(0);

    agencyService.removeDriver.mockResolvedValue({ message: 'Driver removed from agency' });
    const rem = await request(app).delete('/api/agency/drivers/5').set('Authorization', `Bearer ${agencyToken}`);
    expect(rem.status).toBe(200);
  });

  test('TEST-139: Agency views driver list and booking monitor', async () => {
    agencyService.getDrivers.mockResolvedValue({ data: [{ id: 1, name: 'Driver A' }, { id: 2, name: 'Driver B' }], totalItems: 2, page: 1 });
    const drv = await request(app).get('/api/agency/drivers').set('Authorization', `Bearer ${agencyToken}`);
    expect(drv.status).toBe(200);

    agencyService.getBookings.mockResolvedValue({ data: [{ bookingId: 1, status: 'Pending' }] });
    const mon = await request(app).get('/api/agency/bookings').set('Authorization', `Bearer ${agencyToken}`);
    expect(mon.status).toBe(200);
  });
});
