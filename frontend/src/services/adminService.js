import api from './api';

export async function getUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}

export async function toggleUserStatus(userId) {
  const res = await api.put(`/admin/users/${userId}/deactivate`);
  return res.data;
}

export async function createAgency(data) {
  const res = await api.post('/admin/agencies', data);
  return res.data;
}

export async function deactivateAgency(agencyId) {
  const res = await api.put(`/admin/agencies/${agencyId}/deactivate`);
  return res.data;
}

export async function getAllBookings() {
  const res = await api.get('/admin/bookings');
  return res.data;
}

export async function adminCancelBooking(bookingId, reason) {
  const res = await api.put(`/admin/bookings/${bookingId}/cancel`, { reason });
  return res.data;
}
