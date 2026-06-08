const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/driverService');
jest.mock('../../src/services/authService');
jest.mock('../../src/models', () => {
  const mockOp = {
    in: (v) => v,
    notIn: (v) => v,
    between: (v) => v,
  };
  const mockDriver = { id: 1, userId: 2, name: 'Driver A' };
  const mockBooking = { id: 1, userId: 1, driverId: 1, status: 'Pending', travelDate: '2026-07-15' };
  return {
    Driver: { findOne: jest.fn(() => Promise.resolve(mockDriver)) },
    Booking: { count: jest.fn(() => Promise.resolve(0)), findAll: jest.fn(() => Promise.resolve([])) },
    User: { findOne: jest.fn(), findByPk: jest.fn() },
    Agency: { findOne: jest.fn() },
    Sequelize: { Op: mockOp },
  };
});

const app = require('../../src/app');
const driverService = require('../../src/services/driverService');
const authService = require('../../src/services/authService');

describe('TEST-134 to TEST-137 — Driver E2E Workflow', () => {
  const driverToken = jwt.sign({ id: 2, role: 'driver' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

  beforeEach(() => { jest.clearAllMocks(); });

  test('TEST-134: Register driver → Create profile → Create route', async () => {
    authService.register.mockResolvedValue({ id: 2, name: 'Driver A', role: 'driver' });
    const reg = await request(app).post('/api/auth/register').send({ name: 'Driver A', email: 'driver@test.com', password: 'Password1', phone: '+911111111111' });
    expect(reg.status).toBe(201);

    driverService.createProfile.mockResolvedValue({ id: 1, name: 'Driver A', vehicleReg: 'KA01AB1234', licenseNo: 'DL123456' });
    const pro = await request(app).post('/api/drivers/profile').set('Authorization', `Bearer ${driverToken}`).send({ name: 'Driver A', phone: '+911111111111', vehicleType: 'Sedan', vehicleReg: 'KA01AB1234', licenseNo: 'DL123456' });
    expect(pro.status).toBe(201);

    driverService.createRoute.mockResolvedValue({ id: 1, source: 'Mumbai', destination: 'Pune', fare: 500 });
    const route = await request(app).post('/api/drivers/routes').set('Authorization', `Bearer ${driverToken}`).send({ source: 'Mumbai', destination: 'Pune', departureTime: '2026-07-15T08:00:00Z', arrivalTime: '2026-07-15T10:00:00Z', fare: 500, capacity: 4 });
    expect(route.status).toBe(201);
  });

  test('TEST-135: Availability → Accept → On Trip → Completed', async () => {
    driverService.setRouteAvailability.mockResolvedValue({ id: 1, available: true });
    const avail = await request(app).put('/api/drivers/routes/1/availability').set('Authorization', `Bearer ${driverToken}`).send({ available: true });
    expect(avail.status).toBe(200);

    driverService.acceptBooking.mockResolvedValue({ id: 1, status: 'Confirmed' });
    const acc = await request(app).put('/api/drivers/bookings/1/accept').set('Authorization', `Bearer ${driverToken}`);
    expect(acc.status).toBe(200);

    driverService.updateTripStatus.mockResolvedValueOnce({ id: 1, status: 'On Trip' }).mockResolvedValueOnce({ id: 1, status: 'Completed' });
    const trip = await request(app).put('/api/drivers/bookings/1/status').set('Authorization', `Bearer ${driverToken}`).send({ status: 'On Trip' });
    expect(trip.status).toBe(200);

    const comp = await request(app).put('/api/drivers/bookings/1/status').set('Authorization', `Bearer ${driverToken}`).send({ status: 'Completed' });
    expect(comp.status).toBe(200);
  });

  test('TEST-136: Driver rejects booking', async () => {
    driverService.rejectBooking.mockResolvedValue({ id: 1, status: 'Cancelled', cancelReason: 'Vehicle under maintenance' });
    const rej = await request(app).put('/api/drivers/bookings/1/reject').set('Authorization', `Bearer ${driverToken}`).send({ reason: 'Vehicle under maintenance' });
    expect(rej.status).toBe(200);
  });

  test('TEST-137: Driver dashboard and availability toggle', async () => {
    driverService.getDashboardData.mockResolvedValue({ pendingRequests: 2, activeTrips: 1, todayTrips: [] });
    const dash = await request(app).get('/api/dashboard/driver').set('Authorization', `Bearer ${driverToken}`);
    expect(dash.status).toBe(200);

    driverService.setOverallAvailability.mockResolvedValue({ id: 1, available: false });
    const tog = await request(app).put('/api/drivers/availability').set('Authorization', `Bearer ${driverToken}`).send({ available: false });
    expect(tog.status).toBe(200);
  });
});
