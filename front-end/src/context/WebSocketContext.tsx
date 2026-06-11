import { createContext, useContext, type ReactNode } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface WSContextType {
  subscribe: (event: string, handler: (data: any) => void) => () => void;
  sendEvent: (event: string, payload: any) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WSContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const ws = useWebSocket("ws://localhost:4050/ws");

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWS() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWS must be used within a WebSocketProvider");
  }
  return context;
}