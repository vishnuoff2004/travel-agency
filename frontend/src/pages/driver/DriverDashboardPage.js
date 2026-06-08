import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function DriverDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/driver').then(res => setData(res.data)).catch(() => {});
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <p>Pending Requests: {data.pendingRequests}</p>
      <p>Active Trips: {data.activeTrips}</p>
    </div>
  );
}

export default DriverDashboardPage;
