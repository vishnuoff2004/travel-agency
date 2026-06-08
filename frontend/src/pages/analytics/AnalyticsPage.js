import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async (s, e) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (s) params.startDate = s;
      if (e) params.endDate = e;
      const res = await api.get('/analytics/bookings-by-date', { params });
      setData(res.data || []);
    } catch (err) {
      setError('Failed to load analytics');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(startDate, endDate);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAnalytics(startDate, endDate);
  };

  return (
    <div>
      <h1>Bookings Analytics</h1>
      <form onSubmit={handleFilter}>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <button type="submit">Filter</button>
      </form>
      {loading && <div>Loading analytics...</div>}
      {error && <div role="alert">{error}</div>}
      {!loading && !error && data.length === 0 && <p>No booking data available.</p>}
      {!loading && data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AnalyticsPage;