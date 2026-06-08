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

const { CacheService } = require('../../src/cache/CacheService');

jest.mock('../../src/models', () => ({
  Route: { findAll: jest.fn() },
  Driver: {},
  Agency: {},
}));

const searchService = require('../../src/services/searchService');

describe('Phase 3 — Search Cache (REQ-049)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('search with cache miss queries DB and caches result', async () => {
    const { Route } = require('../../src/models');
    Route.findAll.mockResolvedValue([]);
    mockRedis.get.mockResolvedValue(null);

    const result = await searchService.searchRoutes('Mumbai', 'Pune');

    expect(mockRedis.get).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled();
    expect(result).toEqual({ data: [], message: 'No routes found for this destination' });
  });

  test('search with cache hit returns cached data without DB query', async () => {
    const { Route } = require('../../src/models');
    const cachedData = [{ id: 1, source: 'Mumbai', destination: 'Pune', fare: 500 }];
    mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

    const result = await searchService.searchRoutes('Mumbai', 'Pune');

    expect(Route.findAll).not.toHaveBeenCalled();
    expect(result).toEqual({ data: cachedData });
  });

  test('cache key includes source and destination', async () => {
    const { Route } = require('../../src/models');
    Route.findAll.mockResolvedValue([]);
    mockRedis.get.mockResolvedValue(null);

    await searchService.searchRoutes('Delhi', 'Agra');

    const cacheKey = mockRedis.get.mock.calls[0][0];
    expect(cacheKey).toContain('search');
    expect(cacheKey).toContain('Delhi');
    expect(cacheKey).toContain('Agra');
  });

  test('cache TTL is 60 seconds', async () => {
    const { Route } = require('../../src/models');
    Route.findAll.mockResolvedValue([]);
    mockRedis.get.mockResolvedValue(null);

    await searchService.searchRoutes('Mumbai', 'Pune');

    expect(mockRedis.set).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      'EX',
      60,
    );
  });
});