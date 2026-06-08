const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/userService');
jest.mock('../../src/services/authService');

const app = require('../../src/app');
const userService = require('../../src/services/userService');

const testToken = jwt.sign(
  { id: 1, role: 'traveler' },
  process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev'
);

describe('TEST-017 to TEST-019 — User Profile APIs (REQ-005)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 with user profile on GET /api/users/profile', async () => {
    userService.getProfile.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com' });
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
  });

  test('should return 401 without auth on GET /api/users/profile', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
  });
});
