import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation(containerRef, options = {}) {
  const {
    onEscape,
    onEnter,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;

    switch (e.key) {
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape(e);
        }
        break;
      case 'Enter':
        if (onEnter) {
          onEnter(e);
        }
        break;
      default:
        break;
    }
  }, [onEscape, onEnter, enabled]);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el || !enabled) return;

    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, handleKeyDown, enabled]);
}

export default useKeyboardNavigation;
