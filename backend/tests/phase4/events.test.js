const request = require('supertest');
const jwt = require('jsonwebtoken');

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
const { Event } = require('../../src/models');

const adminToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
const userToken = jwt.sign({ id: 2, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

describe('Phase 4 — Events (REQ-055)', () => {
  test('GET /api/events returns paginated list', async () => {
    Event.findAndCountAll.mockResolvedValue({ count: 1, rows: [{ id: 1, title: 'Event 1' }] });
    const res = await request(app).get('/api/events').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });

  test('POST /api/events requires admin', async () => {
    const res = await request(app).post('/api/events').set('Authorization', `Bearer ${userToken}`).send({});
    expect(res.status).toBe(403);
  });

  test('POST /api/events creates event', async () => {
    Event.create.mockResolvedValue({ id: 1, title: 'New Event' });
    const res = await request(app).post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'New Event', startDate: '2026-07-01', endDate: '2026-07-02' });
    expect(res.status).toBe(201);
  });

  test('PUT /api/events/:id updates event', async () => {
    Event.findByPk.mockResolvedValue({ id: 1, update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated' }) });
    const res = await request(app).put('/api/events/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
  });

  test('DELETE /api/events/:id deletes event', async () => {
    Event.findByPk.mockResolvedValue({ id: 1, destroy: jest.fn().mockResolvedValue(true) });
    const res = await request(app).delete('/api/events/1').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});