import React from 'react';

function FormError({ message }) {
  if (!message) return null;
  return <div className="form-error-message">{message}</div>;
}

export default FormError;
