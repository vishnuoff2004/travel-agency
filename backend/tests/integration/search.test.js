const request = require('supertest');

jest.mock('../../src/services/searchService');

const app = require('../../src/app');
const searchService = require('../../src/services/searchService');

describe('TEST-020 to TEST-025 — Search APIs (REQ-006, REQ-007)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return results for existing route — TEST-020', async () => {
    searchService.searchRoutes.mockResolvedValue({
      data: [{ id: 1, source: 'Mumbai', destination: 'Pune', fare: 500, driverName: 'Ravi', agencyName: 'City Travels', vehicleType: 'Sedan' }],
    });
    const res = await request(app).get('/api/routes/search?source=Mumbai&destination=Pune');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('should return empty array for non-existent route — TEST-022', async () => {
    searchService.searchRoutes.mockResolvedValue({ data: [], message: 'No routes found for this destination' });
    const res = await request(app).get('/api/routes/search?source=Tokyo&destination=Osaka');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test('results should include agency and driver details — TEST-024', async () => {
    searchService.searchRoutes.mockResolvedValue({
      data: [{ id: 1, source: 'Mumbai', destination: 'Pune', fare: 500, driverName: 'Ravi', driverId: 1, agencyName: 'City Travels', agencyId: 1, vehicleType: 'Sedan' }],
    });
    const res = await request(app).get('/api/routes/search?source=Mumbai&destination=Pune');
    expect(res.body.data[0]).toHaveProperty('agencyName');
    expect(res.body.data[0]).toHaveProperty('driverName');
    expect(res.body.data[0]).toHaveProperty('vehicleType');
    expect(res.body.data[0]).toHaveProperty('fare');
  });
});
