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
const { Announcement } = require('../../src/models');

const adminToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');
const userToken = jwt.sign({ id: 2, role: 'traveler' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

describe('Phase 4 — Announcements (REQ-055)', () => {
  test('GET /api/announcements returns list', async () => {
    Announcement.findAll.mockResolvedValue([{ id: 1, title: 'Test', body: 'Body', type: 'info', active: true }]);
    const res = await request(app).get('/api/announcements').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('POST /api/announcements requires admin', async () => {
    const res = await request(app).post('/api/announcements').set('Authorization', `Bearer ${userToken}`).send({});
    expect(res.status).toBe(403);
  });

  test('POST /api/announcements creates announcement', async () => {
    Announcement.create.mockResolvedValue({ id: 1, title: 'New', body: 'Content', type: 'warning', active: true });
    const res = await request(app).post('/api/announcements').set('Authorization', `Bearer ${adminToken}`).send({ title: 'New', body: 'Content', type: 'warning' });
    expect(res.status).toBe(201);
  });

  test('DELETE /api/announcements/:id deactivates', async () => {
    const mockAnn = { id: 1, active: true, save: jest.fn().mockResolvedValue({ id: 1, active: false }) };
    Announcement.findByPk.mockResolvedValue(mockAnn);
    const res = await request(app).delete('/api/announcements/1').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Announcement.findByPk).toHaveBeenCalledWith('1');
    expect(mockAnn.active).toBe(false);
  });
});