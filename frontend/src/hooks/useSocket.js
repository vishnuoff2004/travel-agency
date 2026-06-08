import { useState, useEffect, useCallback } from 'react';
import socketManager from '../services/socketService';

export function useSocket(namespace = '') {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = socketManager.connect(namespace);
    setSocket(s);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) setIsConnected(true);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, [namespace]);

  const emit = useCallback((event, data) => {
    if (socket) socket.emit(event, data);
  }, [socket]);

  const on = useCallback((event, handler) => {
    if (socket) socket.on(event, handler);
    return () => { if (socket) socket.off(event, handler); };
  }, [socket]);

  return { socket, isConnected, emit, on, disconnect: () => socketManager.disconnect(namespace) };
}
