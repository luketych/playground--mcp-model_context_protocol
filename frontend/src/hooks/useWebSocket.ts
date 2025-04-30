'use client';

import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSystemStore } from '@/stores/system';
import type { 
  Message, 
  SystemNode, 
  ServerMessage, 
  ServerNode,
  ServerResponse,
  QueueItem
} from '@/types/mcp';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8765';

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { addMessage, updateMessage, addNode, updateNode } = useSystemStore();
  const isConnectedRef = useRef(false);

  const handleMessage = useCallback(
    (wsMessage: ServerResponse) => {
      console.log('WebSocket message received:', wsMessage.type);
      
      switch (wsMessage.type) {
        case 'message': {
          const serverMessage = wsMessage.payload as ServerMessage;
          const message: Message = {
            ...serverMessage,
            content: {
              system: serverMessage.content.system,
              current_task: serverMessage.content.current_task,
              memory: serverMessage.content.memory,
              conversation: serverMessage.content.conversation.map(msg => 
                typeof msg === 'string' 
                  ? { role: 'user', content: msg }
                  : msg
              )
            }
          };
          addMessage(message);
          break;
        }
        case 'status': {
          const serverNode = wsMessage.payload as ServerNode;
          const node: SystemNode = {
            ...serverNode,
            queue: serverNode.queue.map((item): QueueItem => {
              if (typeof item === 'string') {
                return {
                  id: item,
                  type: 'unknown',
                  data: {}
                };
              }
              return {
                id: item.id || 'unknown',
                type: item.type || 'unknown',
                data: item.data || {}
              };
            }),
            description: serverNode.description || `${serverNode.name} node`,
            port: serverNode.port || 0
          };
          addNode(node);
          break;
        }
        case 'error': {
          console.error('WebSocket error:', wsMessage.payload);
          break;
        }
      }
    },
    [addMessage, addNode]
  );

  useEffect(() => {
    if (!socketRef.current) {
      console.log('Connecting to WebSocket server at:', WS_URL);
      socketRef.current = io(WS_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected successfully');
        isConnectedRef.current = true;
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected');
        isConnectedRef.current = false;
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        isConnectedRef.current = false;
      });

      socketRef.current.on('message', handleMessage);
    }

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up WebSocket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [handleMessage]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    if (socketRef.current && isConnectedRef.current) {
      console.log('Sending message:', message);
      socketRef.current.emit('message', {
        ...message,
        content: {
          ...message.content,
          conversation: message.content.conversation.map(msg => ({
            role: msg.role || 'user',
            content: msg.content
          }))
        }
      });
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  }, []);

  return {
    isConnected: isConnectedRef.current,
    sendMessage,
  };
};
