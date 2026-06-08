const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/authService');
jest.mock('../../src/services/bookingService');

const app = require('../../src/app');
const authService = require('../../src/services/authService');
const bookingService = require('../../src/services/bookingService');

const travelerToken = jwt.sign({ id: 1, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

describe('TEST-142 to TEST-149 — Edge Cases', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('Last seat booking — first succeeds, second gets 409', async () => {
    bookingService.createBooking.mockResolvedValueOnce({ id: 1, status: 'Pending' });
    bookingService.createBooking.mockRejectedValueOnce({ status: 409, message: 'Insufficient capacity' });

    const first = await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 1, travelDate: '2026-07-15' });
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 1, travelDate: '2026-07-15' });
    expect(second.status).toBe(409);
  });

  test('Deactivated user login returns 403', async () => {
    authService.login.mockRejectedValue({ status: 403, message: 'Account deactivated. Contact administrator' });
    const res = await request(app).post('/api/auth/login').send({ email: 'deactivated@test.com', password: 'Password1' });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/deactivated/i);
  });

  test('Past date booking returns 400', async () => {
    bookingService.createBooking.mockRejectedValue({ status: 400, message: 'Travel date cannot be in the past' });
    const res = await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 1, travelDate: '2020-01-01' });
    expect(res.status).toBe(400);
  });

  test('Excess seats returns 400', async () => {
    bookingService.createBooking.mockRejectedValue({ status: 400, message: 'Seat count exceeds vehicle capacity' });
    const res = await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 100, travelDate: '2026-07-15' });
    expect(res.status).toBe(400);
  });
});
