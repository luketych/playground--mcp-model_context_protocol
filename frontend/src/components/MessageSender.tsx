'use client';

import React, { useState } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

const MessageSender: React.FC = () => {
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('app_a');
  const { sendMessage } = useWebSocketContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Create a message object
    const messageObj = {
      source: 'web-ui',
      target: target,
      content: {
        message: message,
        timestamp: new Date().toISOString()
      },
      type: 'command'
    };
    
    // Send the message
    sendMessage(messageObj);
    
    // Clear the input
    setMessage('');
  };
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">Send Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-300 mb-1">Target App</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="app_a">App A</option>
            <option value="app_b">App B</option>
            <option value="app_c">App C</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter your message..."
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default MessageSender;
