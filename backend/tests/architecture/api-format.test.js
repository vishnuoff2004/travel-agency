const request = require('supertest');
const app = require('../../src/app');

describe('REQ-037 — API Format (TEST-112)', () => {
  test('should return JSON with Content-Type application/json', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('should return 404 as JSON for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  test('should have status field in health response', () => {
    return request(app)
      .get('/api/health')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('timestamp');
      });
  });

  test('should handle CORS headers', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  test('should reject invalid JSON body with 400', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('not-json');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
