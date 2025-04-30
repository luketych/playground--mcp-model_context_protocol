'use client';

import React, { useState } from 'react';
import { useSystemStore } from '@/stores/system';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { AppId, Message } from '@/types/mcp';

const SystemControls: React.FC = () => {
  const { messages } = useSystemStore();
  const { isConnected, sendMessage } = useWebSocket();
  const [selectedSource, setSelectedSource] = useState<AppId>('AppA');
  const [selectedTarget, setSelectedTarget] = useState<AppId>('MCP');
  const [task, setTask] = useState('');
  const [memory, setMemory] = useState('');

  const handleSendMessage = () => {
    if (!isConnected) return;
    
    const message: Omit<Message, 'id' | 'timestamp' | 'status'> = {
      source: selectedSource,
      target: selectedTarget,
      content: {
        system: 'Test message from control panel',
        current_task: task || 'No specific task',
        memory: memory ? [memory] : [],
        conversation: [
          { role: 'user', content: 'Test message' },
          { role: 'assistant', content: 'Acknowledged' }
        ]
      }
    };
    
    sendMessage(message);
    setTask('');
    setMemory('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">System Controls</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Source</label>
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value as AppId)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="AppA">App A</option>
              <option value="AppB">App B</option>
              <option value="AppC">App C</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Target</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value as AppId)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="MCP">MCP</option>
              <option value="AppA">App A</option>
              <option value="AppB">App B</option>
              <option value="AppC">App C</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Task</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task description"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Memory</label>
          <input
            type="text"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Add memory entry"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!isConnected}
          className={`w-full py-2 px-4 rounded text-sm font-medium
            ${isConnected 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          Send Message
        </button>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="text-sm text-gray-400">
          Total Messages: {messages.length}
        </div>
      </div>
    </div>
  );
};

export default SystemControls;
