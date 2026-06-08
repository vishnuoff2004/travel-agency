const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/authService');
jest.mock('../../src/services/bookingService');
jest.mock('../../src/services/searchService');
jest.mock('../../src/services/userService');

const app = require('../../src/app');
const authService = require('../../src/services/authService');
const bookingService = require('../../src/services/bookingService');
const searchService = require('../../src/services/searchService');
const userService = require('../../src/services/userService');

describe('TEST-130 to TEST-133 — Traveler E2E Workflow', () => {
  const travelerToken = jwt.sign({ id: 1, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

  beforeEach(() => { jest.clearAllMocks(); });

  test('TEST-130: Register → Login → Profile', async () => {
    authService.register.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com', role: 'traveler' });
    const reg = await request(app).post('/api/auth/register').send({ name: 'John', email: 'john@test.com', password: 'Password1', phone: '+911234567890' });
    expect(reg.status).toBe(201);

    authService.login.mockResolvedValue({ token: travelerToken, user: { id: 1, name: 'John', email: 'john@test.com', role: 'traveler' } });
    const log = await request(app).post('/api/auth/login').send({ email: 'john@test.com', password: 'Password1' });
    expect(log.status).toBe(200);
    expect(log.body).toHaveProperty('token');

    userService.getProfile.mockResolvedValue({ id: 1, name: 'John', email: 'john@test.com' });
    const pro = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${log.body.token || travelerToken}`);
    expect(pro.status).toBe(200);
  });

  test('TEST-131: Search → Book', async () => {
    searchService.searchRoutes.mockResolvedValue({ data: [{ id: 1, source: 'Mumbai', destination: 'Pune', fare: 500, driverId: 1, driverName: 'Ravi', vehicleType: 'Sedan', agencyName: 'City' }] });
    const search = await request(app).get('/api/routes/search?source=Mumbai&destination=Pune');
    expect(search.status).toBe(200);
    expect(search.body.data.length).toBeGreaterThan(0);

    bookingService.createBooking.mockResolvedValue({ id: 1, status: 'Pending', seatCount: 1, travelDate: '2026-07-15' });
    const book = await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 1, travelDate: '2026-07-15' });
    expect(book.status).toBe(201);
    expect(book.body.status).toBe('Pending');
  });

  test('TEST-132: Booking lifecycle (create → history → status → cancel)', async () => {
    bookingService.createBooking.mockResolvedValue({ id: 1, status: 'Pending' });
    await request(app).post('/api/bookings').set('Authorization', `Bearer ${travelerToken}`).send({ routeId: 1, driverId: 1, seatCount: 1, travelDate: '2026-07-15' });

    bookingService.getUserBookings.mockResolvedValue({ data: [{ id: 1, status: 'Pending' }], page: 1, limit: 10, totalPages: 1, totalItems: 1 });
    const hist = await request(app).get('/api/bookings').set('Authorization', `Bearer ${travelerToken}`);
    expect(hist.status).toBe(200);

    bookingService.cancelBooking.mockResolvedValue({ id: 1, status: 'Cancelled' });
    const can = await request(app).put('/api/bookings/1/cancel').set('Authorization', `Bearer ${travelerToken}`);
    expect(can.status).toBe(200);
  });

  test('TEST-133: New traveler sees empty bookings', async () => {
    bookingService.getUserBookings.mockResolvedValue({ data: [], page: 1, limit: 10, totalPages: 0, totalItems: 0 });
    const res = await request(app).get('/api/bookings').set('Authorization', `Bearer ${travelerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.totalItems).toBe(0);
  });
});
