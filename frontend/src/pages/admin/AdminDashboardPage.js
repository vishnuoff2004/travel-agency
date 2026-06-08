import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/admin').then(res => setData(res.data)).catch(() => {});
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Users: {data.totalUsers}</p>
      <p>Total Agencies: {data.totalAgencies}</p>
      <p>Active Bookings: {data.totalActiveBookings}</p>
      <h2>Status Breakdown</h2>
      {data.bookingsByStatus && Object.entries(data.bookingsByStatus).map(([k, v]) => (
        <p key={k}>{k}: {v}</p>
      ))}
    </div>
  );
}

export default AdminDashboardPage;
