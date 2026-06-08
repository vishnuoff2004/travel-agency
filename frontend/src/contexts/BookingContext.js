import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const searchRoutes = useCallback(async (source, destination) => {
    setLoading(true);
    try {
      const res = await api.get('/routes/search', { params: { source, destination } });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data) => {
    const res = await api.post('/bookings', data);
    return res.data;
  }, []);

  const getBookings = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await api.get('/bookings', { params: { page, limit } });
      setBookings(res.data.data || []);
      setPagination({ page: res.data.page, limit: res.data.limit, totalPages: res.data.totalPages, totalItems: res.data.totalItems });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id) => {
    const res = await api.put(`/bookings/${id}/cancel`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    return res.data;
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, currentBooking, pagination, loading, searchRoutes, createBooking, getBookings, cancelBooking, setCurrentBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
