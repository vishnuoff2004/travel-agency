const request = require('supertest');

jest.mock('ioredis', () => jest.fn(() => ({
  get: jest.fn(), set: jest.fn(), del: jest.fn(), scan: jest.fn(),
  incr: jest.fn(), expire: jest.fn(), on: jest.fn(), status: 'ready',
})));

jest.mock('../../src/models', () => ({
  Announcement: { findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
  Event: { findAndCountAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
  Booking: { findAll: jest.fn(), count: jest.fn() },
  BookingStatusHistory: { create: jest.fn() },
  Route: { findAll: jest.fn() },
  Driver: {}, Agency: {},
  Sequelize: { Op: { like: Symbol('like'), gte: Symbol('gte'), lte: Symbol('lte'), notIn: Symbol('notIn'), between: Symbol('between'), in: Symbol('in') } },
}));

const app = require('../../src/app');

describe('Phase 4 — Metrics (REQ-057)', () => {
  test('GET /api/metrics returns prometheus format', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('# HELP');
  });

  test('GET /api/metrics includes nodejs metrics', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.text).toContain('nodejs_');
  });
});