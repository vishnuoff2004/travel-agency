import api from './api';

export async function createBooking(data) {
  const res = await api.post('/bookings', data);
  return res.data;
}

export async function getBookings(page = 1, limit = 10) {
  const res = await api.get('/bookings', { params: { page, limit } });
  return res.data;
}

export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id) {
  const res = await api.put(`/bookings/${id}/cancel`);
  return res.data;
}
