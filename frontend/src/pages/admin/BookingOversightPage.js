import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function BookingOversightPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/admin/bookings').then(res => setBookings(res.data)).catch(() => {});
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.put(`/admin/bookings/${id}/cancel`, { reason: 'Platform policy' });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1>Booking Oversight</h1>
      {bookings.map(b => (
        <div key={b.id}>
          <p>Booking #{b.id} - {b.status}</p>
          {b.status !== 'Cancelled' && <button onClick={() => handleCancel(b.id)}>Cancel</button>}
        </div>
      ))}
    </div>
  );
}

export default BookingOversightPage;
