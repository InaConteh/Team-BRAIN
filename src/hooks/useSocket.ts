import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export function useSocket() {
  const { session } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!session?.access_token) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_WS_URL || 'ws://localhost:3001';
    const newSocket = io(socketUrl, {
      auth: {
        token: session.access_token,
      },
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session?.access_token]);

  const emit = useCallback(
    (event: string, data: any, callback?: (error?: any, result?: any) => void) => {
      if (!socket) {
        console.warn('Socket not connected');
        return;
      }
      socket.emit(event, data, callback);
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    [socket]
  );

  return {
    socket,
    connected,
    emit,
    on,
  };
}
