"use client";

import React from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { useSystemStore } from '../stores/system';
import { WebSocketProvider } from '../contexts/WebSocketContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  // Initialize WebSocket connection
  useWebSocket();

  // Get connection status
  const status = useSystemStore(state => state.status);
  const error = useSystemStore(state => state.error);

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Connection status bar */}
        <div className={`
          w-full px-4 py-1 text-sm flex justify-between items-center
          ${status === 'connected' ? 'bg-green-800' : 
            status === 'error' ? 'bg-red-800' : 'bg-yellow-800'}
        `}>
          <div className="flex items-center">
            <div className={`
              w-2 h-2 rounded-full mr-2
              ${status === 'connected' ? 'bg-green-400' : 
                status === 'error' ? 'bg-red-400' : 'bg-yellow-400'}
            `} />
            <span className="text-white">
              {status === 'connected' ? 'Connected to MCP' :
               status === 'error' ? 'Connection Error' : 'Connecting...'}
            </span>
          </div>
          {error && (
            <span className="text-red-200">{error}</span>
          )}
        </div>

        {/* Main content */}
        <div className="h-[calc(100vh-24px)]">
          {children}
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default ClientLayout;
