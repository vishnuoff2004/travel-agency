import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Pagination from '../../components/common/Pagination';

function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/bookings', { params: { page, limit: 10 } })
      .then(res => {
        setBookings(res.data.data || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p>No bookings found.</p>}
      {bookings.map(b => (
        <div key={b.id}>
          <Link to={`/bookings/${b.id}`}>Booking #{b.id} - {b.status}</Link>
        </div>
      ))}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default BookingHistoryPage;
