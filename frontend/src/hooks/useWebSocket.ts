'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSystemStore } from '../stores/system';
import { useLogStore } from '../stores/logs';
import { SystemNode, LogEntry } from '../types/mcp';

export function useWebSocket() {
  const updateNodes = useSystemStore(state => state.updateNodes);
  const updateStatus = useSystemStore(state => state.updateStatus);
  const addLog = useLogStore(state => state.addLog);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Cleanup function to disconnect socket on unmount
    const cleanup = () => {
      if (socketRef.current) {
        console.log('Disconnecting WebSocket');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };

    try {
      // Get WebSocket URL from environment variable or fallback
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:9002';
      console.log(`Connecting to WebSocket server at ${wsUrl}`);
      
      // Create socket connection
      socketRef.current = io(wsUrl, {
        transports: ['websocket', 'polling'],  // Allow fallback to polling
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 30000,
        autoConnect: true
      });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        updateStatus('connected');
        setIsConnected(true);

        // Send initialization message
        socket.emit('init', {
          client: 'web-ui',
          version: '1.0.0',
          userAgent: navigator.userAgent
        });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        updateStatus('disconnected');
        setIsConnected(false);
      });

      socket.on('connect_error', (error: Error) => {
        console.error('WebSocket connection error:', error);
        updateStatus('error', error.message);
        setIsConnected(false);
      });

      // Message handlers
      socket.on('message', (message: any) => {
        console.log('Received message:', message);
        addLog({
          timestamp: new Date().toISOString(),
          level: 'INFO',
          source: message.source || 'unknown',
          message: 'Message received',
          data: message,
          type: 'message',
          target: message.target
        });
      });

      socket.on('log', (log: LogEntry) => {
        console.log('Received log:', log);
        // Ensure timestamp exists
        const logWithTimestamp = {
          ...log,
          timestamp: log.timestamp || new Date().toISOString()
        };
        
        // Add log to store (duplicate checking is handled in the store)
        addLog(logWithTimestamp);
      });

      // System status handlers
      socket.on('system:status', (data: { nodes: SystemNode[] }) => {
        console.log('Received system status:', data);
        if (Array.isArray(data.nodes)) {
          updateNodes(data.nodes);
        }
      });

      socket.on('system:heartbeat', (data: { nodes: SystemNode[] }) => {
        console.log('Received heartbeat:', data);
        if (data.nodes && Array.isArray(data.nodes)) {
          updateNodes(data.nodes);
        }
      });

      // Request initial system status
      socket.emit('request_status');

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      updateStatus('error', 'Failed to initialize WebSocket connection');
    }

    // Cleanup on unmount
    return cleanup;
  }, []); // Empty dependency array - only run once on mount

  // Return a function to send messages and the isConnected state
  return {
    sendMessage: (message: any) => {
      if (socketRef.current) {
        socketRef.current.emit('send_message', { data: message });
      }
    },
    isConnected
  };
}

export default useWebSocket;
