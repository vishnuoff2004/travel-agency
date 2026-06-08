const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models', () => ({
  Booking: { count: jest.fn(), findAll: jest.fn() },
  Driver: { findOne: jest.fn(), count: jest.fn() },
  User: { count: jest.fn() },
  Agency: { count: jest.fn() },
  Sequelize: { Op: require('sequelize').Op },
}));

const app = require('../../src/app');

const travelerToken = jwt.sign({ id: 1, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
const driverToken = jwt.sign({ id: 2, role: 'driver' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
const adminToken = jwt.sign({ id: 99, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

const { Booking, Driver, User, Agency } = require('../../src/models');

describe('Dashboard APIs (REQ-022 to REQ-024)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/dashboard/user should return 200 — TEST-081', async () => {
    Booking.count.mockResolvedValue(0);
    Booking.findAll.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/dashboard/user')
      .set('Authorization', `Bearer ${travelerToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activeBookings');
    expect(res.body).toHaveProperty('totalBookings');
  });

  test('GET /api/dashboard/admin should return 200 — TEST-085', async () => {
    User.count.mockResolvedValue(10);
    Agency.count.mockResolvedValue(3);
    Booking.count.mockResolvedValue(5);
    Booking.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2).mockResolvedValueOnce(1).mockResolvedValueOnce(3).mockResolvedValueOnce(4).mockResolvedValueOnce(2);
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalUsers');
    expect(res.body).toHaveProperty('totalAgencies');
    expect(res.body).toHaveProperty('totalActiveBookings');
    expect(res.body).toHaveProperty('bookingsByStatus');
  });

  test('traveler cannot access admin dashboard', async () => {
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${travelerToken}`);
    expect(res.status).toBe(403);
  });

  test('driver cannot access admin dashboard', async () => {
    const res = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(403);
  });
});
