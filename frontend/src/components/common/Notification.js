import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

function Notification() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className={`notification ${n.type}`} onClick={() => removeNotification(n.id)}>
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notification;
