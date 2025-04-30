'use client';

import React from 'react';
import { useSystemStore } from '@/stores/system';
import type { Message } from '@/types/mcp';

const MessageInspector: React.FC = () => {
  const { messages } = useSystemStore();

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-blue-500';
      case 'processed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Message History</h2>
        <span className="text-sm text-gray-400">
          {messages.length} messages
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Send a test message to get started.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="node-card hover:border-gray-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-${message.source.toLowerCase()}`}>
                      {message.source}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className={`font-mono text-${message.target.toLowerCase()}`}>
                      {message.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {message.content.current_task}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xs ${getStatusColor(message.status)}`}>
                    {message.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 hidden group-hover:block">
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500">System</label>
                    <p className="text-sm">{message.content.system}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Memory</label>
                    <ul className="text-sm list-disc list-inside">
                      {message.content.memory.map((item, i) => (
                        <li key={i} className="text-gray-400">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {message.content.conversation.length > 0 && (
                    <div>
                      <label className="text-xs text-gray-500">Conversation</label>
                      <div className="space-y-2">
                        {message.content.conversation.map((msg, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-semibold">{msg.role}:</span>{' '}
                            {msg.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageInspector;
