# Test Framework Instructions

This document explains how to use the test framework for the MCP system.

## Components

The test framework consists of several components:

1. `test-server.js` - WebSocket server that simulates the MCP environment
2. `simulate-activity.js` - Test scenarios and message simulation
3. `analyze-logs.js` - Log analysis and statistics generation
4. `test.sh` - Test execution script
5. `run-tests.sh` - Combined test runner with analysis

## Setup

1. Make the scripts executable:
```bash
chmod +x test.sh run-tests.sh
```

2. Ensure all dependencies are installed:
```bash
npm install
```

## Running Tests

### Quick Start

To run all tests with analysis:
```bash
./run-tests.sh
```

### Individual Components

To run components separately:

1. Start test server:
```bash
node test-server.js
```

2. Run test scenarios:
```bash
node simulate-activity.js
```

3. Analyze logs:
```bash
node analyze-logs.js test-server.log
```

## Test Scenarios

The following scenarios are included:

1. Normal Operation Test
   - Sends standard messages to MCP
   - Verifies basic functionality

2. Error Handling Test
   - Tests invalid target handling
   - Simulates system errors
   - Verifies error response

3. Load Test
   - Sends rapid message sequences
   - Tests system under load
   - Monitors resource usage

## Analysis Output

The log analysis provides:

1. Message Statistics
   - Total message count
   - Messages by type
   - Success/failure rates

2. Performance Metrics
   - Response times (min/max/avg)
   - Processing duration
   - Queue depths

3. Resource Utilization
   - CPU usage peaks
   - Memory usage peaks
   - Resource warnings

4. Issue Summary
   - Error count
   - Warning count
   - Overall status

## Customizing Tests

### Adding New Scenarios

Edit `simulate-activity.js` to add new test scenarios:

```javascript
const TEST_SCENARIOS = [
  {
    name: 'your_new_scenario',
    message: {
      source: 'test-client',
      target: 'mcp',
      type: 'command',
      content: {
        // Your test content
      }
    }
  }
];
```

### Modifying Analysis

Edit `analyze-logs.js` to add new metrics or change analysis parameters:

```javascript
const stats = {
  // Add new statistics fields here
  yourNewMetric: {
    count: 0,
    // ...other properties
  }
};
```

## Troubleshooting

1. If tests fail to start:
   - Check if port 8765 is already in use
   - Ensure all dependencies are installed
   - Check file permissions on scripts

2. If analysis shows unexpected results:
   - Check test-server.log for detailed error messages
   - Verify test scenarios are properly configured
   - Ensure WebSocket connections are being established

3. Common issues:
   - Port conflicts: Stop any running instances
   - Permission denied: Run chmod +x on scripts
   - Missing logs: Ensure test server is writing logs

## Contributing

When adding new tests:

1. Follow the existing scenario format
2. Include both positive and negative test cases
3. Add appropriate logging
4. Update this documentation
5. Verify all scenarios still pass

## Best Practices

1. Always run the full test suite before commits
2. Monitor resource usage during load tests
3. Keep test scenarios focused and isolated
4. Document any changes to test parameters
5. Review logs for unexpected patterns

## Support

For issues or questions:

1. Check the troubleshooting guide above
2. Review the test logs
3. Consult the development team
4. File an issue in the project repository
