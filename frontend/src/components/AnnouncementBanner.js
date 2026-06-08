import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

function AnnouncementBanner() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    api.get('/announcements')
      .then(res => setAnnouncements(res.data || []))
      .catch(() => {});
  }, []);

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('dismissed_announcements', JSON.stringify(updated));
  };

  const visible = announcements.filter(a => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="announcement-banner-container">
      {visible.map(a => (
        <div key={a.id} className={`announcement-banner announcement-${a.type}`} role="alert">
          <span className="announcement-title">{a.title}</span>
          <span className="announcement-body">{a.body}</span>
          <button onClick={() => dismiss(a.id)} aria-label={t('announcement.dismiss')}>
            {t('announcement.dismiss')}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBanner;