// MCP System Types

export type AppId = 'AppA' | 'AppB' | 'AppC' | 'MCP';

export type ComponentStatus = 'active' | 'inactive' | 'error';

export type MessageStatus = 'pending' | 'delivered' | 'processed' | 'error';

export interface MCPPackage {
  system: string;
  memory: string[];
  conversation: Array<{
    role: string;
    content: string;
  }>;
  current_task: string;
  target_app?: AppId;
}

export interface SystemNode {
  id: AppId;
  type: 'app' | 'mcp';
  status: ComponentStatus;
  port: number;
  name: string;
  description: string;
  queue: Message[];
}

export interface Message {
  id: string;
  source: AppId;
  target: AppId;
  content: MCPPackage;
  status: MessageStatus;
  timestamp: Date;
  error?: string;
}

export interface Connection {
  id: string;
  from: AppId;
  to: AppId;
  active: boolean;
  messages: Message[];
}

export interface SystemMetrics {
  messageCount: number;
  errorCount: number;
  avgProcessingTime: number;
  activeConnections: number;
}

export interface SystemConfig {
  pollInterval: number;
  maxQueueSize: number;
  retryAttempts: number;
  debugMode: boolean;
}

// WebSocket Events
export type SystemEvent = 
  | { type: 'message_sent'; data: Message }
  | { type: 'message_received'; data: Message }
  | { type: 'status_change'; data: { nodeId: AppId; status: ComponentStatus } }
  | { type: 'error'; data: { message: string; nodeId?: AppId } }
  | { type: 'metrics_update'; data: SystemMetrics };
