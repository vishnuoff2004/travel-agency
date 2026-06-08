import api from './api';

export async function searchRoutes(source, destination) {
  const res = await api.get('/routes/search', { params: { source, destination } });
  return res.data;
}
