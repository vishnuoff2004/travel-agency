import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function BookingRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/dashboard/driver').then(res => setRequests(res.data.pendingRequests || [])).catch(() => {});
  }, []);

  const handleAction = async (id, action) => {
    try {
      const url = `/drivers/bookings/${id}/${action}`;
      await api.put(url);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div>
      <h1>Booking Requests</h1>
      {requests.length === 0 && <p>No pending requests.</p>}
    </div>
  );
}

export default BookingRequestsPage;
