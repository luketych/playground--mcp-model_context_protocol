'use client';

import React from 'react';
import SystemMap from '@/components/SystemMap';
import MessageInspector from '@/components/MessageInspector';
import SystemControls from '@/components/SystemControls';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function HomePage() {
  const { isConnected } = useWebSocket();
  
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-gray-400">
          {isConnected ? 'Connected to MCP' : 'Disconnected'}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - System Map */}
        <div className="lg:col-span-2">
          <div className="node-card">
            <h2 className="text-lg font-semibold mb-4">System Map</h2>
            <div className="aspect-[3/2] relative">
              <SystemMap />
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-1">
          <div className="node-card sticky top-6">
            <SystemControls />
          </div>
        </div>

        {/* Message Inspector - Full Width */}
        <div className="lg:col-span-3">
          <div className="node-card">
            <MessageInspector />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="node-card bg-gradient-to-br from-gray-900 to-gray-800/50">
        <h2 className="text-lg font-semibold mb-4">About MCP System</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The Model Context Protocol (MCP) system enables efficient communication 
            and context sharing between multiple AI applications. Key features:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Central message routing and context management</li>
            <li>Real-time message visualization</li>
            <li>Extensible application architecture</li>
            <li>Built-in monitoring and debugging tools</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Send test messages and monitor the system behavior using the controls above.
          </p>
        </div>
      </div>
    </div>
  );
}
