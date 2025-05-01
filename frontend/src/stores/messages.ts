'use client';

import { create } from 'zustand';
import { Message } from '../types/mcp';

interface MessageStore {
  messages: Record<string, Message>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: {},
  
  addMessage: (message) => {
    if (!message.id) {
      message.id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    set((state) => ({
      messages: {
        ...state.messages,
        [message.id as string]: message
      }
    }));
  },
  
  clearMessages: () => set({ messages: {} })
}));
