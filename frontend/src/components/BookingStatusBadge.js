import React from 'react';

const STATUS_COLORS = {
  Pending: { bg: '#fff3cd', text: '#856404' },
  Confirmed: { bg: '#d4edda', text: '#155724' },
  'On Trip': { bg: '#cce5ff', text: '#004085' },
  Completed: { bg: '#e2e3e5', text: '#383d41' },
  Cancelled: { bg: '#f8d7da', text: '#721c24' },
};

export default function BookingStatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#f8f9fa', text: '#212529' };

  return (
    <span
      className="booking-status-badge"
      role="status"
      aria-label={`Booking status: ${status}`}
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {status}
    </span>
  );
}
