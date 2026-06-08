const request = require('supertest');

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  on: jest.fn(),
  scan: jest.fn(),
  status: 'ready',
};

jest.mock('ioredis', () => jest.fn(() => mockRedis));

const app = require('../../src/app');
const { buildRateLimitKey, whitelist } = require('../../src/middleware/rateLimiter');

function flushMicrotasks() {
  return new Promise(resolve => setImmediate(resolve));
}

describe('Phase 3 — Rate Limiter', () => {
  let reqCount;

  beforeEach(() => {
    reqCount = 0;
    mockRedis.incr.mockClear();
    mockRedis.expire.mockClear();
    mockRedis.get.mockClear();
    mockRedis.incr.mockImplementation(() => {
      reqCount++;
      return Promise.resolve(reqCount);
    });
    mockRedis.get.mockImplementation(() => Promise.resolve(String(Math.min(reqCount, 11))));
    mockRedis.expire.mockResolvedValue(1);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('buildRateLimitKey returns correct format', () => {
    const key = buildRateLimitKey('10.0.0.1', '/api/test');
    expect(key).toMatch(/^ratelimit:10\.0\.0\.1:\/api\/test:\d+$/);
  });

  test('rate limiter calls next for requests under limit', async () => {
    const { rateLimiter } = require('../../src/middleware/rateLimiter');
    const req = { ip: '10.0.0.1', path: '/api/test' };
    const res = { status: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    rateLimiter(req, res, next);
    await flushMicrotasks();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rate limiter returns 429 when limit exceeded', async () => {
    const { rateLimiter } = require('../../src/middleware/rateLimiter');
    const res = { status: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    for (let i = 0; i < 10; i++) {
      const req = { ip: '10.0.0.1', path: '/api/test' };
      rateLimiter(req, { status: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis(), json: jest.fn() }, jest.fn());
      await flushMicrotasks();
    }

    const req = { ip: '10.0.0.1', path: '/api/test' };
    rateLimiter(req, res, next);
    await flushMicrotasks();

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.set).toHaveBeenCalledWith('Retry-After', '1');
    expect(next).not.toHaveBeenCalled();
  });

  test('GET /api/health bypasses rate limiter', async () => {
    for (let i = 0; i < 50; i++) {
      await request(app).get('/api/health');
    }
    expect(mockRedis.incr).not.toHaveBeenCalled();
  });

  test('whitelisted IPs bypass rate limiter', async () => {
    const { rateLimiter } = require('../../src/middleware/rateLimiter');
    const req = { ip: '127.0.0.1', path: '/api/test' };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    rateLimiter(req, res, next);
    await flushMicrotasks();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('whitelist can be extended', () => {
    expect(whitelist.has('127.0.0.1')).toBe(true);
    expect(whitelist.has('::1')).toBe(true);
    expect(whitelist.has('10.0.0.1')).toBe(false);
  });
});

describe('Phase 3 — CacheService Integration', () => {
  test('CacheService get returns cached value', async () => {
    mockRedis.get.mockResolvedValue(JSON.stringify({ id: 1, name: 'Cached' }));
    const { CacheService } = require('../../src/cache/CacheService');
    const cache = CacheService(mockRedis);
    const result = await cache.get('test');
    expect(result).toEqual({ id: 1, name: 'Cached' });
  });

  test('CacheService set stores with TTL', async () => {
    const { CacheService } = require('../../src/cache/CacheService');
    const cache = CacheService(mockRedis);
    await cache.set('key', { data: 42 }, 60);
    expect(mockRedis.set).toHaveBeenCalledWith('key', '{"data":42}', 'EX', 60);
  });
});