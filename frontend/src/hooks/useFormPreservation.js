import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'form_';

export function useFormPreservation(formKey, initialValues) {
  const storageKey = `${STORAGE_PREFIX}${formKey}`;

  const [values, setValues] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return initialValues;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {}
  }, [storageKey, values]);

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  return { values, setValues, handleChange, clearSaved };
}
