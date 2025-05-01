const { io } = require('socket.io-client');

async function testConnection() {
  console.log('Testing MCP server connection...\n');

  // Try polling first
  console.log('Attempting polling transport...');
  await testWithTransport(['polling']);

  // Then try WebSocket
  console.log('\nAttempting WebSocket transport...');
  await testWithTransport(['websocket']);

  // Finally try both
  console.log('\nAttempting both transports...');
  await testWithTransport(['polling', 'websocket']);
}

function testWithTransport(transports) {
  return new Promise((resolve) => {
    const socket = io('http://localhost:8765', {
      transports,
      reconnectionAttempts: 1,
      timeout: 5000,
      path: '/socket.io',
      autoConnect: true,
      forceNew: true,
      withCredentials: false,
      extraHeaders: {
        'Access-Control-Allow-Origin': '*'
      }
    });

    socket.on('connect', () => {
      console.log(`✓ Connected successfully using ${transports.join(', ')}`);
      console.log('Socket ID:', socket.id);
      
      // Send test message
      socket.emit('init', { client: 'test-script' });
    });

    socket.on('connect_error', (error) => {
      console.error(`✗ Connection failed using ${transports.join(', ')}:`, error.message);
    });

    // Set timeout to close this attempt
    setTimeout(() => {
      socket.close();
      resolve();
    }, 5000);
  });
}

// Run tests
testConnection().then(() => {
  console.log('\nConnection tests completed.');
  console.log('\nIf all tests failed, please ensure:');
  console.log('1. MCP server is running on port 8765');
  console.log('2. Server has Socket.IO configured');
  console.log('3. CORS is properly configured');
  console.log('4. No firewall blocking connections');
  process.exit(0);
});

// Handle script timeout
setTimeout(() => {
  console.error('\n✗ Test script timed out after 20 seconds');
  process.exit(1);
}, 20000);
