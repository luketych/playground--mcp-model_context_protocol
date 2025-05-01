'use client';

import { create } from 'zustand';
import { LogEntry, LogStoreActions } from '../types/mcp';

interface LogStore extends LogStoreActions {
  logs: LogEntry[];
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] })
}));
