'use client';

import React, { useMemo, useState } from 'react';
import { useSystemStore } from '@/stores/system';
import type { Message } from '@/types/mcp';

export default function MessageInspector() {
  const { messages, clearMessages } = useSystemStore();
  const [isClearing, setIsClearing] = useState(false);

  const sortedMessages = useMemo(() => {
    return Object.values(messages).sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [messages]);

  const handleClearMessages = async () => {
    setIsClearing(true);
    try {
      await clearMessages();
    } finally {
      setIsClearing(false);
    }
  };

  const renderMessage = (message: Message) => {
    const statusColors = {
      pending: 'status-badge-offline',
      processing: 'bg-blue-500 bg-opacity-20 text-blue-400',
      completed: 'status-badge-online',
      error: 'status-badge-error'
    };

    return (
      <div 
        key={message.id}
        className="message-card animate-fadeIn"
      >
        <div className="message-header">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{message.source} → {message.target}</span>
              <span className="text-xs text-gray-500">
                [{message.type}]
              </span>
            </div>
            {message.status && (
              <div className={`status-badge ${statusColors[message.status]}`}>
                {message.status}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="message-content">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message.content.current_task}</p>
            <span className="text-xs text-gray-500">
              {message.content.system}
            </span>
          </div>
          
          {message.content.memory.length > 0 && (
            <div className="mt-2 p-2 bg-gray-900/50 rounded border border-gray-700">
              <p className="text-xs font-medium text-gray-400 mb-1">Memory:</p>
              <ul className="memory-list">
                {message.content.memory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {message.content.conversation.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
              {message.content.conversation.map((msg, index) => (
                <div 
                  key={index}
                  className={`conversation-message conversation-message-${msg.role}`}
                >
                  <span className="font-medium text-xs uppercase mr-2">
                    {msg.role}:
                  </span>
                  {msg.content}
                </div>
              ))}
            </div>
          )}
        </div>

        {message.metadata && Object.keys(message.metadata).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 space-x-2">
              {Object.entries(message.metadata).map(([key, value]) => (
                <span key={key}>
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Message Inspector</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {Object.keys(messages).length} messages
          </div>
          {Object.keys(messages).length > 0 && (
            <button 
              onClick={handleClearMessages}
              disabled={isClearing}
              className="btn-secondary text-xs"
            >
              {isClearing ? (
                <span className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4" 
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
                  Clearing...
                </span>
              ) : (
                'Clear'
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {sortedMessages.map(renderMessage)}
        {sortedMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-3 rounded-full bg-gray-800/50 mb-4">
              <svg 
                className="w-6 h-6 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-600 mt-1">
              Send a test message to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
