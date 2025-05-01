'use client';

import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { AppId } from '../types/mcp';

export default function SystemControls() {
  const { sendMessage, isConnected } = useWebSocket();
  const [system, setSystem] = useState<AppId>('mcp');
  const [task, setTask] = useState('test');
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async () => {
    setIsSending(true);
    try {
      await sendMessage({
        source: 'web-ui',
        target: system,
        content: {
          system,
          current_task: task,
          memory: [],
          conversation: [
            { role: 'user', content: 'Test message from UI' }
          ]
        },
        type: 'command',
        metadata: {
          origin: 'web-ui',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSystem(e.target.value as AppId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Controls</h2>
        <div className={`status-badge ${isConnected ? 'status-badge-online' : 'status-badge-offline'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Target System</label>
          <select
            value={system}
            onChange={handleSystemChange}
            disabled={!isConnected || isSending}
            className="input-field"
          >
            <option value="mcp">MCP Server</option>
            <option value="app_a">Application A</option>
            <option value="app_b">Application B</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Task</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={!isConnected || isSending}
            placeholder="Enter task name"
            className="input-field"
          />
        </div>

        <button
          onClick={handleSendTest}
          disabled={!isConnected || isSending || !task.trim()}
          className="btn-primary w-full relative"
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Test Message'
          )}
        </button>

        {!isConnected && (
          <div className="text-xs text-center">
            <p className="text-red-400">
              * Connection to MCP server required
            </p>
            <p className="text-gray-500 mt-1">
              Check server status and try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
