import React from 'react';

function SelectField({ label, error, options, register, ...props }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <select {...register} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default SelectField;
