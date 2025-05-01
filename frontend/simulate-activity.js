const io = require('socket.io-client');
const SERVER_URL = 'http://localhost:8765';

// Create WebSocket connection
const socket = io(SERVER_URL, {
  transports: ['websocket'],
  path: '/socket.io'
});

// Initialize connection
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Send initialization message
  socket.emit('init', {
    client: 'test-client',
    version: '1.0.0',
    userAgent: 'TestSimulator/1.0'
  });

  // Start test sequence
  runTests();
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Log all received messages
socket.on('log', (log) => {
  console.log(`[${log.level}] ${log.message}`, log.data || '');
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

// Test scenarios
const TEST_SCENARIOS = [
  // Normal operation test
  {
    name: 'normal_operation',
    message: {
      source: 'test-client',
      target: 'mcp',
      type: 'command',
      content: {
        system: 'mcp',
        current_task: 'test_task',
        memory: [],
        conversation: [{ role: 'user', content: 'Normal test message' }]
      }
    }
  },

  // Error test - invalid target
  {
    name: 'invalid_target',
    message: {
      source: 'test-client',
      target: 'nonexistent_node',
      type: 'command',
      content: {
        system: 'mcp',
        current_task: 'error_test',
        memory: [],
        conversation: [{ role: 'user', content: 'Testing invalid target' }]
      }
    }
  },

  // Error test - simulated error
  {
    name: 'simulated_error',
    message: {
      source: 'test-client',
      target: 'mcp',
      type: 'command',
      content: {
        system: 'mcp',
        current_task: 'error_test',
        memory: [],
        conversation: [{ role: 'user', content: 'Trigger error test' }]
      }
    }
  },

  // Load test - rapid messages
  {
    name: 'rapid_messages',
    messages: Array(5).fill().map((_, i) => ({
      source: 'test-client',
      target: 'mcp',
      type: 'command',
      content: {
        system: 'mcp',
        current_task: `rapid_test_${i}`,
        memory: [],
        conversation: [{ role: 'user', content: `Rapid message ${i}` }]
      }
    }))
  }
];

// Run test scenarios
async function runTests() {
  console.log('Starting test scenarios...');

  for (const scenario of TEST_SCENARIOS) {
    console.log(`\nRunning scenario: ${scenario.name}`);
    
    if (scenario.messages) {
      // Handle multiple messages scenario
      for (const message of scenario.messages) {
        socket.emit('message', message);
        await delay(100); // Small delay between rapid messages
      }
    } else {
      // Handle single message scenario
      socket.emit('message', scenario.message);
      await delay(1000); // Normal delay between scenarios
    }
  }

  // Allow time for responses then disconnect
  setTimeout(() => {
    socket.disconnect();
    console.log('\nTest complete');
  }, 5000);
}

// Helper function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
