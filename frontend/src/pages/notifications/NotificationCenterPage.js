import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function NotificationCenterPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?page=${p}&pageSize=10`);
      setNotifications(res.data.notifications || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div>
      <h1>{t('notification.title')}</h1>
      {notifications.length > 0 && (
        <button onClick={markAllRead}>{t('notification.markAllRead')}</button>
      )}
      {loading && <div>{t('common.loading')}</div>}
      {!loading && notifications.length === 0 && <p>{t('notification.noNotifications')}</p>}
      {!loading && notifications.map(n => (
        <div
          key={n.id}
          className={`notification-item ${n.isRead ? '' : 'notification-unread'}`}
          onClick={() => !n.isRead && markRead(n.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' && !n.isRead) markRead(n.id); }}
        >
          <strong>{n.title}</strong>
          <p>{n.body}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
          {!n.isRead && <span className="unread-badge">{t('notification.unread')}</span>}
        </div>
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('common.previous')}</button>
          <span>{t('common.page')} {page} {t('common.of')} {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>{t('common.next')}</button>
        </div>
      )}
    </div>
  );
}

export default NotificationCenterPage;