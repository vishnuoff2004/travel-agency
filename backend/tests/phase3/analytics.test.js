const request = require('supertest');
const jwt = require('jsonwebtoken');

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  scan: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  on: jest.fn(),
  status: 'ready',
};

jest.mock('ioredis', () => jest.fn(() => mockRedis));

jest.mock('../../src/models', () => ({
  Booking: {
    findAll: jest.fn(),
    count: jest.fn(),
  },
  BookingStatusHistory: {
    create: jest.fn(),
  },
  Route: {
    findAll: jest.fn(),
  },
  Driver: {},
  Agency: {},
  Sequelize: {
    Op: {
      like: Symbol('like'),
      gte: Symbol('gte'),
      lte: Symbol('lte'),
      notIn: Symbol('notIn'),
      between: Symbol('between'),
      in: Symbol('in'),
    },
  },
}));

const app = require('../../src/app');
const { Booking } = require('../../src/models');

describe('Phase 3 — Analytics (REQ-051)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedis.get.mockReset();
    mockRedis.set.mockReset();
  });

  test('GET /api/analytics/bookings-by-date requires authentication', async () => {
    const res = await request(app).get('/api/analytics/bookings-by-date');
    expect(res.status).toBe(401);
  });

  test('GET /api/analytics/bookings-by-date returns 403 for traveler role', async () => {
    const token = jwt.sign({ id: 2, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/analytics/bookings-by-date')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('GET /api/analytics/bookings-by-date returns cached data', async () => {
    const cached = [{ date: '2026-01-01', count: 5 }];
    mockRedis.get.mockResolvedValue(JSON.stringify(cached));

    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/analytics/bookings-by-date')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(cached);
    expect(Booking.findAll).not.toHaveBeenCalled();
  });

  test('GET /api/analytics/bookings-by-date queries DB on cache miss', async () => {
    mockRedis.get.mockResolvedValue(null);
    Booking.findAll.mockResolvedValue([
      { date: '2026-01-01', count: 5 },
    ]);

    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/analytics/bookings-by-date')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Booking.findAll).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled();
  });

  test('GET /api/analytics/bookings-by-date accepts date range filter', async () => {
    mockRedis.get.mockResolvedValue(null);
    Booking.findAll.mockResolvedValue([]);

    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    await request(app)
      .get('/api/analytics/bookings-by-date?startDate=2026-01-01&endDate=2026-01-31')
      .set('Authorization', `Bearer ${token}`);

    expect(Booking.findAll).toHaveBeenCalled();
  });
});