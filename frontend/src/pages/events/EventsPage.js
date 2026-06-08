import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/events');
        if (!cancelled) setEvents(res.data.data || []);
      } catch {
        if (!cancelled) setError(t('common.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [t]);

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <div>
      <h1>{t('events.title')}</h1>
      {events.length === 0 && <p>{t('events.noUpcoming')}</p>}
      {events.map(e => (
        <div key={e.id} className="event-card">
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <p>{t('events.dateRange')}: {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}</p>
          {e.location && <p>{t('events.location')}: {e.location}</p>}
        </div>
      ))}
    </div>
  );
}

export default EventsPage;