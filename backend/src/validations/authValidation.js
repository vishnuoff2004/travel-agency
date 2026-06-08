function validateRegister(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Field name is required');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Field email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.password) {
    errors.push('Field password is required');
  } else {
    if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one digit');
    }
  }

  if (!data.phone || !data.phone.trim()) {
    errors.push('Field phone is required');
  } else if (!/^\+?\d{10,15}$/.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.push('Phone number must be 10-15 digits');
  }

  return errors.length > 0 ? { error: { details: errors.map(e => ({ message: e })) } } : { error: undefined };
}

function validateLogin(data) {
  const errors = [];

  if (!data.email || !data.email.trim()) {
    errors.push('Field email is required');
  }

  if (!data.password) {
    errors.push('Field password is required');
  }

  return errors.length > 0 ? { error: { details: errors.map(e => ({ message: e })) } } : { error: undefined };
}

module.exports = { validateRegister, validateLogin };
