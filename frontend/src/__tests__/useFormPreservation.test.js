import { renderHook, act } from '@testing-library/react';
import { useFormPreservation } from '../hooks/useFormPreservation';

describe('useFormPreservation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return initial values when no saved data', () => {
    const { result } = renderHook(() => useFormPreservation('test', { name: '', email: '' }));
    expect(result.current.values).toEqual({ name: '', email: '' });
  });

  test('should save and restore form values', () => {
    const { result } = renderHook(() => useFormPreservation('test', { name: '', email: '' }));
    act(() => { result.current.handleChange('name', 'John'); });
    act(() => { result.current.handleChange('email', 'john@test.com'); });
    expect(result.current.values).toEqual({ name: 'John', email: 'john@test.com' });
  });

  test('should restore saved values from localStorage', () => {
    localStorage.setItem('form_test', JSON.stringify({ name: 'John', email: 'john@test.com' }));
    const { result } = renderHook(() => useFormPreservation('test', { name: '', email: '' }));
    expect(result.current.values).toEqual({ name: 'John', email: 'john@test.com' });
  });

  test('should clear saved values', () => {
    const { result } = renderHook(() => useFormPreservation('test', { name: 'John' }));
    act(() => { result.current.clearSaved(); });
    expect(localStorage.getItem('form_test')).toBeNull();
  });
});
