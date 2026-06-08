import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get(`/bookings/${id}`),
      api.get(`/bookings/${id}/status-history`),
    ])
      .then(([b, h]) => {
        setBooking(b.data);
        setHistory(h.data);
      })
      .catch(() => navigate('/bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      navigate('/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot cancel');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div>
      <h1>Booking #{booking.id}</h1>
      <p>Status: {booking.status}</p>
      <p>Seats: {booking.seatCount}</p>
      <p>Travel Date: {booking.travelDate}</p>
      {['Pending', 'Confirmed'].includes(booking.status) && (
        <button onClick={handleCancel}>Cancel Booking</button>
      )}
      <h2>Status History</h2>
      {history.map((h, i) => (
        <p key={i}>{h.fromStatus || 'N/A'} → {h.toStatus} at {new Date(h.changedAt).toLocaleString()}</p>
      ))}
    </div>
  );
}

export default BookingDetailPage;
