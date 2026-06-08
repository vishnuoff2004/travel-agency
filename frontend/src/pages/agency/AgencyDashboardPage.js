import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AgencyDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/agency/drivers', { params: { limit: 100 } })
      .then(res => setData({ driverCount: res.data.totalItems || 0 }))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Agency Dashboard</h1>
      {data && <p>Total Drivers: {data.driverCount}</p>}
    </div>
  );
}

export default AgencyDashboardPage;
