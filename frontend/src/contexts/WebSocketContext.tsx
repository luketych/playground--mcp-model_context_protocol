'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useWebSocket from '../hooks/useWebSocket';

// Define the context type
interface WebSocketContextType {
  sendMessage: (message: any) => void;
}

// Create the context with a default value
const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
});

// Create a provider component
interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  // Use the WebSocket hook to get the sendMessage function
  const { sendMessage } = useWebSocket();

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Create a custom hook to use the WebSocket context
export const useWebSocketContext = () => useContext(WebSocketContext);

export default WebSocketContext;
