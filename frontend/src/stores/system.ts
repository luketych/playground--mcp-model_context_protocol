import { create } from 'zustand';
import type { SystemNode, Message, AppId } from '@/types/mcp';

interface SystemStore {
  nodes: Map<string, SystemNode>;
  messages: Message[];
  addNode: (node: SystemNode) => void;
  updateNode: (id: string, updates: Partial<SystemNode>) => void;
  removeNode: (id: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
}

const createEmptyNode = (id: string): SystemNode => ({
  id: id as AppId,
  type: 'app',
  name: id,
  status: 'inactive',
  port: 0,
  description: `${id} node`,
  queue: []
});

const normalizeNode = (node: Partial<SystemNode> & { id: AppId }): SystemNode => ({
  ...createEmptyNode(node.id),
  ...node,
  queue: node.queue || [],
  port: node.port || 0,
  description: node.description || `${node.id} node`
});

const normalizeMessage = (message: Message): Message => ({
  ...message,
  timestamp: message.timestamp || new Date().toISOString(),
  status: message.status || 'pending'
});

export const useSystemStore = create<SystemStore>((set) => ({
  nodes: new Map(),
  messages: [],

  addNode: (node) =>
    set((state) => {
      const nodes = new Map(state.nodes);
      const existingNode = nodes.get(node.id);
      nodes.set(node.id, normalizeNode({
        ...existingNode,
        ...node
      }));
      return { nodes };
    }),

  updateNode: (id, updates) =>
    set((state) => {
      const nodes = new Map(state.nodes);
      const node = nodes.get(id);
      if (node) {
        nodes.set(id, normalizeNode({
          ...node,
          ...updates,
          id: node.id
        }));
      }
      return { nodes };
    }),

  removeNode: (id) =>
    set((state) => {
      const nodes = new Map(state.nodes);
      nodes.delete(id);
      return { nodes };
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, normalizeMessage(message)],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? normalizeMessage({ ...msg, ...updates }) : msg
      ),
    })),

  clearMessages: () =>
    set(() => ({
      messages: [],
    })),
}));
