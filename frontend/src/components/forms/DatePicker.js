import React from 'react';

function DatePicker({ label, error, register, ...props }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input type="date" {...register} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default DatePicker;
