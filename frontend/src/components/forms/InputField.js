import React from 'react';

function InputField({ label, error, register, ...props }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input {...register} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default InputField;
