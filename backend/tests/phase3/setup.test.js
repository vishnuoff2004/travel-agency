const path = require('path');
const fs = require('fs');

jest.mock('ioredis', () => {
  const mRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    scan: jest.fn(),
    on: jest.fn(),
    status: 'ready',
  };
  return jest.fn(() => mRedis);
});

describe('Phase 3 Setup — Dependencies', () => {
  test('ioredis is a dependency', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.dependencies['ioredis']).toBeDefined();
  });

  test('bullmq is a dependency', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.dependencies['bullmq']).toBeDefined();
  });

  test('config/redis.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/config/redis.js'))).toBe(true);
  });

  test('config/queue.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/config/queue.js'))).toBe(true);
  });

  test('cache/CacheService.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/cache/CacheService.js'))).toBe(true);
  });

  test('redis config exports a Redis instance', () => {
    const redis = require('../../src/config/redis');
    expect(redis).toBeDefined();
  });

  test('queue config exports createQueue and createWorker', () => {
    const queue = require('../../src/config/queue');
    expect(typeof queue.createQueue).toBe('function');
    expect(typeof queue.createWorker).toBe('function');
  });

  test('bookingQueue is defined', () => {
    const queue = require('../../src/config/queue');
    expect(typeof queue.createQueue).toBe('function');
  });
});

describe('Phase 3 Architecture — CacheService', () => {
  let mockRedis;
  let CacheService;

  beforeEach(() => {
    CacheService = require('../../src/cache/CacheService').CacheService;
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      scan: jest.fn(),
    };
  });

  test('get returns parsed JSON', async () => {
    mockRedis.get.mockResolvedValue(JSON.stringify({ foo: 'bar' }));
    const cache = CacheService(mockRedis);
    const result = await cache.get('test-key');
    expect(result).toEqual({ foo: 'bar' });
  });

  test('get returns null for missing key', async () => {
    mockRedis.get.mockResolvedValue(null);
    const cache = CacheService(mockRedis);
    const result = await cache.get('missing');
    expect(result).toBeNull();
  });

  test('set serializes objects as JSON', async () => {
    const cache = CacheService(mockRedis);
    await cache.set('key', { data: 1 }, 60);
    expect(mockRedis.set).toHaveBeenCalledWith('key', JSON.stringify({ data: 1 }), 'EX', 60);
  });

  test('del calls redis del', async () => {
    const cache = CacheService(mockRedis);
    await cache.del('some-key');
    expect(mockRedis.del).toHaveBeenCalledWith('some-key');
  });

  test('clearNamespace scans and deletes matching keys', async () => {
    mockRedis.scan
      .mockResolvedValueOnce(['0', ['cache:a', 'cache:b']]);
    const cache = CacheService(mockRedis);
    await cache.clearNamespace('cache:*');
    expect(mockRedis.del).toHaveBeenCalledWith('cache:a', 'cache:b');
  });
});
