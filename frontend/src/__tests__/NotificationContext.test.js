import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';

function TestComponent() {
  const { notifications, addNotification, removeNotification } = useNotification();
  return (
    <div>
      <div data-testid="count">{notifications.length}</div>
      <button data-testid="add" onClick={() => addNotification('test msg', 'success')}>Add</button>
      <button data-testid="remove" onClick={() => removeNotification(notifications[0]?.id)}>Remove</button>
    </div>
  );
}

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should start with empty notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  test('should add notification and auto-remove after 3s', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    act(() => { screen.getByTestId('add').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  test('should manually remove notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    act(() => { screen.getByTestId('add').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');
    act(() => { screen.getByTestId('remove').click(); });
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
