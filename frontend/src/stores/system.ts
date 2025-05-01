'use client';

import { create } from 'zustand';
import { SystemState, SystemNode } from '../types/mcp';

interface SystemStore extends SystemState {
  updateNodes: (nodes: SystemNode[]) => void;
  updateStatus: (status: SystemState['status'], error?: string) => void;
}

const defaultNodes: SystemNode[] = [
  { name: 'mcp', status: 'offline', type: 'mcp' },
  { name: 'app_a', status: 'offline', type: 'app' },
  { name: 'app_b', status: 'offline', type: 'app' },
  { name: 'web-ui', status: 'offline', type: 'ui' }
];

export const useSystemStore = create<SystemStore>((set) => ({
  nodes: defaultNodes,
  status: 'disconnected',
  updateNodes: (nodes) => set({ nodes }),
  updateStatus: (status, error) => set({ status, error })
}));

// Helper to get node by name
export const getNodeByName = (nodes: SystemNode[], name: string): SystemNode | undefined => {
  return nodes.find(node => node.name === name);
};

// Helper to check if node is active
export const isNodeActive = (node: SystemNode): boolean => {
  return node.status === 'online';
};

// Helper to get node display name
export const getNodeDisplayName = (node: SystemNode): string => {
  return node.name.replace('_', ' ').toUpperCase();
};
