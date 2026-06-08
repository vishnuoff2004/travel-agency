import React, { useState, useEffect } from 'react';

export default function DashboardStats({ fetchStats, interval = 30000 }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer;

    const load = async () => {
      try {
        const data = await fetchStats();
        if (mounted) setStats(data);
      } catch (err) {
        console.error('Dashboard stats error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    timer = setInterval(load, interval);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [fetchStats, interval]);

  if (loading) {
    return <div className="dashboard-stats dashboard-stats--loading" aria-busy="true">Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="dashboard-stats" role="region" aria-label="Dashboard statistics" aria-live="polite">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="dashboard-stats__card">
          <span className="dashboard-stats__label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span className="dashboard-stats__value">{value ?? 0}</span>
        </div>
      ))}
    </div>
  );
}
