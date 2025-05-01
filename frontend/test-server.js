const { Server } = require('socket.io');
const http = require('http');
const Logger = require('./logging');

const logger = new Logger('test-server');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });
  res.end('MCP Test Server');
});

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  },
  path: '/socket.io'
});

// Define nodes
const nodes = {
  'mcp': {
    name: 'mcp',
    type: 'server',
    status: 'online',
    queue: [],
    description: 'Model Context Protocol Server',
    port: 8765
  },
  'app_a': {
    name: 'app_a',
    type: 'agent',
    status: 'online',
    queue: [],
    description: 'Application A - Task Processing',
    port: 8766
  },
  'app_b': {
    name: 'app_b',
    type: 'agent',
    status: 'online',
    queue: [],
    description: 'Application B - Response Generator',
    port: 8767
  },
  'web-ui': {
    name: 'web-ui',
    type: 'client',
    status: 'online',
    queue: [],
    description: 'Web Interface',
    port: 3000
  },
  'test-client': {
    name: 'test-client',
    type: 'client',
    status: 'online',
    queue: [],
    description: 'Test Client',
    port: null
  }
};

// Helper function to broadcast logs
const broadcastLog = (socket, level, message, data = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    source: 'test-server',
    message,
    data
  };
  
  logger[level.toLowerCase()](message, data);
  socket.broadcast.emit('log', logEntry);
  socket.emit('log', logEntry);
};

// Simulate processing delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Message counter for IDs
let messageCount = 0;

// Generate message ID
const generateId = () => `msg-${Date.now()}-${messageCount++}`;

// Send message helper
const sendMessage = (socket, source, target, type, status, task, memory, conversation) => {
  const message = {
    type: 'message',
    payload: {
      id: generateId(),
      timestamp: new Date().toISOString(),
      source,
      target,
      type,
      status,
      content: {
        system: source,
        current_task: task,
        memory: memory || [],
        conversation: conversation || []
      }
    }
  };

  broadcastLog(socket, 'DEBUG', 'Sending message', message);
  socket.emit('message', message);
};

// Update node status helper
const updateNodeStatus = (socket, nodeName, queueUpdate) => {
  if (!nodes[nodeName]) {
    broadcastLog(socket, 'WARN', `Attempted to update non-existent node: ${nodeName}`);
    return;
  }

  if (queueUpdate) {
    nodes[nodeName].queue = [
      ...nodes[nodeName].queue,
      {
        id: `task-${Date.now()}`,
        type: queueUpdate.type,
        data: queueUpdate.data
      }
    ];
  }
  
  broadcastLog(socket, 'DEBUG', `Updating node status: ${nodeName}`, nodes[nodeName]);
  socket.emit('message', { type: 'status', payload: nodes[nodeName] });
};

// Handle messages
const handleMessage = async (socket, data) => {
  try {
    // Validate message format
    if (!data.source || !data.target || !data.type || !data.content) {
      throw new Error('Invalid message format');
    }

    // Check if target exists
    if (!nodes[data.target]) {
      broadcastLog(socket, 'ERROR', 'Invalid target node', {
        source: data.source,
        target: data.target,
        error: 'Target node does not exist'
      });
      return;
    }

    // Check for special error test cases
    if (data.content.current_task === 'error_test') {
      broadcastLog(socket, 'ERROR', 'Error test triggered', {
        code: 'TEST_ERROR',
        description: 'This is a simulated error response',
        task: data.content.current_task
      });
      return;
    }

    broadcastLog(socket, 'INFO', 'Received message:', data);
    
    // Step 1: Acknowledge receipt
    sendMessage(
      socket,
      'mcp',
      data.source,
      'response',
      'pending',
      'Acknowledging request',
      [],
      [{ role: 'system', content: 'Request received' }]
    );
    
    updateNodeStatus(socket, data.source, {
      type: 'outgoing',
      data: { message: data.content.current_task }
    });

    await delay(500);

    // Step 2: Start processing
    sendMessage(
      socket,
      data.target,
      data.source,
      'response',
      'processing',
      `Processing ${data.content.current_task}`,
      [`Started processing at ${new Date().toISOString()}`],
      [
        ...data.content.conversation,
        { role: 'system', content: 'Processing task...' }
      ]
    );

    updateNodeStatus(socket, data.target, {
      type: 'incoming',
      data: { message: data.content.current_task }
    });

    await delay(1000);

    // Step 3: Complete processing
    sendMessage(
      socket,
      data.target,
      data.source,
      'response',
      'completed',
      `Completed ${data.content.current_task}`,
      [
        `Started processing at ${new Date().toISOString()}`,
        `Completed processing at ${new Date().toISOString()}`
      ],
      [
        ...data.content.conversation,
        { role: 'assistant', content: `Task "${data.content.current_task}" processed successfully` }
      ]
    );

    // Clear queues
    if (nodes[data.source]) nodes[data.source].queue = [];
    if (nodes[data.target]) nodes[data.target].queue = [];
    
    updateNodeStatus(socket, data.source);
    updateNodeStatus(socket, data.target);
    
  } catch (error) {
    broadcastLog(socket, 'ERROR', 'Error processing message:', error);
  }
};

// Add error simulation
const simulateErrors = (socket) => {
  setInterval(() => {
    const errorTypes = [
      {
        level: 'ERROR',
        message: 'Database connection failed',
        data: { code: 'DB_ERROR', retries: 3 }
      },
      {
        level: 'ERROR',
        message: 'Task execution timeout',
        data: { code: 'TIMEOUT', task_id: 'task-' + Date.now() }
      },
      {
        level: 'WARN',
        message: 'High memory usage detected',
        data: { usage: '85%', threshold: '80%' }
      },
      {
        level: 'WARN',
        message: 'Service degradation',
        data: { latency: '500ms', normal: '100ms' }
      }
    ];

    if (Math.random() < 0.1) { // 10% chance
      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      broadcastLog(socket, errorType.level, errorType.message, errorType.data);
    }
  }, 10000);
};

// Handle connections
io.on('connection', (socket) => {
  broadcastLog(socket, 'INFO', 'Client connected:', socket.id);

  // Send initial node status
  Object.values(nodes).forEach(node => {
    socket.emit('message', { type: 'status', payload: node });
  });

  // Handle init message
  socket.on('init', async (data) => {
    broadcastLog(socket, 'INFO', 'Client initialized:', data);
    
    sendMessage(
      socket,
      'mcp',
      data.client,
      'response',
      'completed',
      'initialization',
      ['System initialized', 'Client connected'],
      [{ role: 'system', content: 'Welcome to MCP Test Server' }]
    );
  });

  // Handle messages
  socket.on('message', async (data) => {
    await handleMessage(socket, data);
  });

  // Start error simulation
  simulateErrors(socket);

  // Send periodic status updates
  const statusInterval = setInterval(() => {
    if (!socket.connected) return;
    
    const memUsage = process.memoryUsage();
    const metrics = {
      activeClients: io.engine.clientsCount,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB'
      },
      messageCount,
      nodes: Object.values(nodes).map(node => ({
        name: node.name,
        status: node.status,
        queueSize: node.queue.length
      }))
    };

    broadcastLog(socket, 'DEBUG', 'System heartbeat', metrics);
  }, 5000);

  // Handle disconnection
  socket.on('disconnect', () => {
    broadcastLog(socket, 'INFO', 'Client disconnected:', socket.id);
    clearInterval(statusInterval);
  });
});

// Start server
const PORT = 8765;
server.listen(PORT, () => {
  logger.info(`Test server running on port ${PORT}`);
  logger.info('Waiting for connections...');
});

// Handle process termination
process.on('SIGINT', () => {
  logger.info('\nShutting down test server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection:', { reason, promise });
});
