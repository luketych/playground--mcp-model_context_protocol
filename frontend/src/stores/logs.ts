'use client';

import { create } from 'zustand';
import { LogEntry, LogStoreActions } from '../types/mcp';

interface LogStore extends LogStoreActions {
  logs: LogEntry[];
  findDuplicateLog: (timestamp: string, message: string) => boolean;
}

export const useLogStore = create<LogStore>((set, get) => ({
  logs: [],
  
  addLog: (log) => set((state) => {
    // Check for duplicates
    const isDuplicate = state.logs.some(
      existingLog => 
        existingLog.timestamp === log.timestamp && 
        existingLog.message === log.message &&
        existingLog.source === log.source
    );
    
    // Only add if not a duplicate
    if (!isDuplicate) {
      return { logs: [...state.logs, log] };
    }
    return state;
  }),
  
  clearLogs: () => set({ logs: [] }),
  
  findDuplicateLog: (timestamp, message) => {
    const { logs } = get();
    return logs.some(log => log.timestamp === timestamp && log.message === message);
  }
}));
