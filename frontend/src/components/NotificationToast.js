import React, { useState, useEffect, useCallback } from 'react';

export default function NotificationToast({ onClose, duration = 5000 }) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('info');
  const [visible, setVisible] = useState(false);
  const timerRef = React.useRef(null);

  const show = useCallback((msg, msgType = 'info') => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
  }, [duration, onClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (onClose) onClose();
  }, [onClose]);

  if (!visible) return null;

  const bgColor = type === 'error' ? 'var(--color-error, #dc3545)'
    : type === 'success' ? 'var(--color-success, #28a745)'
    : type === 'warning' ? 'var(--color-warning, #ffc107)'
    : 'var(--color-info, #17a2b8)';

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="notification-toast"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        backgroundColor: bgColor,
        color: '#fff',
        borderRadius: '4px',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span className="notification-toast__message">{message}</span>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="notification-toast__dismiss"
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}
