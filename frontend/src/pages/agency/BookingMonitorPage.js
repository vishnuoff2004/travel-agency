import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function BookingMonitorPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/agency/bookings').then(res => setBookings(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1>Booking Monitor</h1>
      {bookings.map((b, i) => (
        <div key={i}>
          <p>Booking #{b.bookingId} - {b.travelerName} - {b.route} - {b.status}</p>
        </div>
      ))}
    </div>
  );
}

export default BookingMonitorPage;
