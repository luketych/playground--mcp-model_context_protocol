// Message types
export interface Message {
  id?: string;
  source?: string;
  target?: string;
  type: 'command' | 'query' | 'event' | 'response';
  content: any;
}

// Log entry types
export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
  data?: any;
  type?: 'message' | 'system' | 'status';
  target?: string;
}

// System store types
export interface SystemState {
  nodes: SystemNode[];
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

export interface SystemNode {
  name: string;
  status: 'online' | 'offline' | 'error';
  type: 'mcp' | 'app' | 'ui';
  queueSize?: number;
}

// Store actions
export interface LogStoreActions {
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
}

export interface SystemStoreActions {
  updateNodes: (nodes: SystemNode[]) => void;
  updateStatus: (status: SystemState['status'], error?: string) => void;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload: any;
}

// Animation types
export interface MessageAnimation {
  id: string;
  source: string;
  target: string;
  progress: number;
  startTime: number;
}
