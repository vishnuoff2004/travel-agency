const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../src/services/adminService');
jest.mock('../../src/services/authService');

const app = require('../../src/app');
const adminService = require('../../src/services/adminService');

describe('TEST-140 to TEST-141 — Admin E2E Workflow', () => {
  const adminToken = jwt.sign({ id: 99, role: 'admin' }, process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev');

  beforeEach(() => { jest.clearAllMocks(); });

  test('TEST-140: View users → Deactivate → Create/Deactivate agency → Oversee bookings', async () => {
    adminService.getUsers.mockResolvedValue([{ id: 1, name: 'User1', active: true }]);
    const users = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
    expect(users.status).toBe(200);

    adminService.toggleUserStatus.mockResolvedValue({ id: 1, active: false });
    const deact = await request(app).put('/api/admin/users/1/deactivate').set('Authorization', `Bearer ${adminToken}`);
    expect(deact.status).toBe(200);

    adminService.createAgency.mockResolvedValue({ id: 1, name: 'New Agency' });
    const create = await request(app).post('/api/admin/agencies').set('Authorization', `Bearer ${adminToken}`).send({ name: 'New Agency', email: 'new@agency.com', phone: '+911234567890' });
    expect(create.status).toBe(201);

    adminService.deactivateAgency.mockResolvedValue({ id: 1, active: false });
    const deactA = await request(app).put('/api/admin/agencies/1/deactivate').set('Authorization', `Bearer ${adminToken}`);
    expect(deactA.status).toBe(200);

    adminService.getAllBookings.mockResolvedValue([{ id: 1, status: 'Completed' }]);
    const books = await request(app).get('/api/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
    expect(books.status).toBe(200);
  });

  test('TEST-141: Admin cancels any booking', async () => {
    adminService.adminCancelBooking.mockResolvedValue({ id: 1, status: 'Cancelled', cancelReason: 'Platform policy', cancelledBy: 99 });
    const cancel = await request(app).put('/api/admin/bookings/1/cancel').set('Authorization', `Bearer ${adminToken}`).send({ reason: 'Platform policy' });
    expect(cancel.status).toBe(200);
  });
});
