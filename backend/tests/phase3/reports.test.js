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
  Agency: {
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
  },
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
const { Agency } = require('../../src/models');

describe('Phase 3 — Reports (REQ-052)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedis.get.mockReset();
    mockRedis.set.mockReset();
  });

  test('GET /api/reports/agency-performance requires authentication', async () => {
    const res = await request(app).get('/api/reports/agency-performance');
    expect(res.status).toBe(401);
  });

  test('GET /api/reports/agency-performance returns 403 for traveler role', async () => {
    const token = jwt.sign({ id: 2, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/reports/agency-performance')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('GET /api/reports/agency-performance returns agencies with metrics', async () => {
    Agency.findAndCountAll.mockResolvedValue({
      count: 2,
      rows: [
        { id: 1, name: 'City Travels', active: true, Drivers: [{ id: 1, Bookings: [{ status: 'Completed' }, { status: 'Completed' }] }] },
        { id: 2, name: 'Highway Express', active: true, Drivers: [{ id: 2, Bookings: [{ status: 'Completed' }, { status: 'Cancelled' }, { status: 'Completed' }] }] },
      ],
    });

    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/reports/agency-performance')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty('totalCompletedBookings');
    expect(res.body.data[0]).toHaveProperty('agencyName');
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('pageSize');
    expect(res.body.pagination).toHaveProperty('total');
  });

  test('GET /api/reports/agency-performance supports pagination', async () => {
    Agency.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [{ id: 1, name: 'Test Agency', active: true, Drivers: [] }],
    });

    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
    const res = await request(app)
      .get('/api/reports/agency-performance?page=2&pageSize=5')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.pageSize).toBe(5);
  });
});