export type NodeType = 'mcp' | 'app';
export type NodeStatus = 'active' | 'inactive' | 'error';
export type MessageStatus = 'pending' | 'delivered' | 'processed' | 'error';
export type AppId = 'AppA' | 'AppB' | 'AppC' | 'MCP';

export interface ConversationMessage {
  role: string;
  content: string;
}

export interface MessageContent {
  system: string;
  current_task: string;
  memory: string[];
  conversation: ConversationMessage[];
}

export interface Message {
  id: string;
  source: AppId;
  target: AppId;
  content: MessageContent;
  timestamp: string;
  status: MessageStatus;
  error?: string;
}

export interface QueueItem {
  id: string;
  type: string;
  data: any;
}

export interface SystemNode {
  id: AppId;
  type: NodeType;
  name: string;
  status: NodeStatus;
  port: number;
  description: string;
  queue: QueueItem[];  // Changed from Message[] to QueueItem[]
  lastSeen?: string;
  error?: string;
}

// Server response types
export interface ServerMessageContent {
  system: string;
  current_task: string;
  memory: string[];
  conversation: Array<string | { role: string; content: string }>;
}

export interface ServerMessage {
  id: string;
  source: AppId;
  target: AppId;
  content: ServerMessageContent;
  timestamp: string;
  status: MessageStatus;
  error?: string;
}

export interface ServerNode extends Omit<SystemNode, 'queue'> {
  queue: Array<string | QueueItem>;
}

export interface ServerResponse {
  type: 'message' | 'status' | 'error';
  payload: ServerMessage | ServerNode | Error;
}
