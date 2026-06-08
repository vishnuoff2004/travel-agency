import { useState, useEffect, useCallback } from 'react';
import socketManager from '../services/socketService';

export function useRealtimeBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const socket = socketManager.connect('/bookings');

    const handleCreated = (data) => {
      setLastEvent({ type: 'created', data });
      setBookings(prev => [data, ...prev]);
    };
    const handleStatusChanged = (data) => {
      setLastEvent({ type: 'status-changed', data });
      setBookings(prev => prev.map(b => b.bookingId === data.bookingId ? { ...b, ...data } : b));
    };
    const handleCancelled = (data) => {
      setLastEvent({ type: 'cancelled', data });
      setBookings(prev => prev.map(b => b.bookingId === data.bookingId ? { ...b, ...data } : b));
    };

    socket.on('booking:created', handleCreated);
    socket.on('booking:status-changed', handleStatusChanged);
    socket.on('booking:cancelled', handleCancelled);

    return () => {
      socket.off('booking:created', handleCreated);
      socket.off('booking:status-changed', handleStatusChanged);
      socket.off('booking:cancelled', handleCancelled);
    };
  }, [userId]);

  const clearLastEvent = useCallback(() => setLastEvent(null), []);

  return { bookings, lastEvent, clearLastEvent };
}

export function useRealtimeNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const socket = socketManager.connect();

    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [userId]);

  return { notifications, unreadCount, setUnreadCount };
}
