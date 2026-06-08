const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/driverService');

const app = require('../../src/app');
const driverService = require('../../src/services/driverService');

const driverToken = jwt.sign({ id: 2, role: 'driver' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

describe('Driver APIs (REQ-012 to REQ-016, REQ-042)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/drivers/profile should return 201 — TEST-043', async () => {
    driverService.createProfile.mockResolvedValue({ id: 1, name: 'Driver A', vehicleReg: 'KA01AB1234' });
    const res = await request(app)
      .post('/api/drivers/profile')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ name: 'Driver A', phone: '+911234567890', vehicleType: 'Sedan', vehicleReg: 'KA01AB1234', licenseNo: 'DL1234567890' });
    expect(res.status).toBe(201);
  });

  test('PUT /api/drivers/profile should return 200 — TEST-044', async () => {
    driverService.updateProfile.mockResolvedValue({ id: 1, phone: '+919999999999' });
    const res = await request(app)
      .put('/api/drivers/profile')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ phone: '+919999999999' });
    expect(res.status).toBe(200);
  });

  test('POST /api/drivers/routes should return 201 — TEST-047', async () => {
    driverService.createRoute.mockResolvedValue({ id: 1, source: 'Mumbai', destination: 'Pune' });
    const res = await request(app)
      .post('/api/drivers/routes')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ source: 'Mumbai', destination: 'Pune', departureTime: '2026-07-15T08:00:00Z', arrivalTime: '2026-07-15T12:00:00Z', fare: 500, capacity: 4 });
    expect(res.status).toBe(201);
  });

  test('PUT /api/drivers/bookings/1/accept returns 200 — TEST-054', async () => {
    driverService.acceptBooking.mockResolvedValue({ id: 1, status: 'Confirmed' });
    const res = await request(app)
      .put('/api/drivers/bookings/1/accept')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(200);
  });

  test('PUT /api/drivers/availability returns 200 — TEST-084', async () => {
    driverService.setOverallAvailability.mockResolvedValue({ id: 1, available: false });
    const res = await request(app)
      .put('/api/drivers/availability')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ available: false });
    expect(res.status).toBe(200);
  });
});
