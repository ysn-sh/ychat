import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAccessToken } from "@/api/client";

type EventHandler = (data: any) => void;

export function useWebSocket(url: string) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<Record<string, EventHandler[]>>({});

  // Connect when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let socket: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(url);

      socket.onopen = () => {
        setIsConnected(true);
        // Authenticate immediately
        const token = getAccessToken();
        if (token) {
          socket.send(JSON.stringify({ type: "auth", token }));
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Auto-reconnect after 3s
        reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const { event: eventName, payload } = msg;
          handlersRef.current[eventName]?.forEach((h) => h(payload));
        } catch (err) {
          console.warn("Invalid WS message", err);
        }
      };

      socketRef.current = socket;
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    };
  }, [isAuthenticated, user, url]);

  const sendEvent = useCallback((event: string, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, payload }));
    }
  }, []);

  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!handlersRef.current[event]) handlersRef.current[event] = [];
    handlersRef.current[event].push(handler);
    return () => {
      if (handlersRef.current[event]) {
        handlersRef.current[event] = handlersRef.current[event].filter((h) => h !== handler);
      }
    };
  }, []);

  return { sendEvent, subscribe, isConnected };
}