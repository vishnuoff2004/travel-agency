import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

function BookingPage() {
  const [searchParams] = useSearchParams();
  const [seatCount, setSeatCount] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const routeId = searchParams.get('routeId');
  const driverId = searchParams.get('driverId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', { routeId: Number(routeId), driverId: Number(driverId), seatCount: Number(seatCount), travelDate });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Book a Trip</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div><label>Seats</label><input type="number" min="1" value={seatCount} onChange={e => setSeatCount(e.target.value)} /></div>
        <div><label>Travel Date</label><input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} required /></div>
        <button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
      </form>
    </div>
  );
}

export default BookingPage;
