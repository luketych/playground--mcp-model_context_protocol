const fs = require('fs');

// ANSI color codes 
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function analyzeLog(logPath) {
  try {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    
    // Statistics tracking
    const stats = {
      totalMessages: 0,
      messagesByType: {},
      errorCount: 0,
      warningCount: 0,
      responseTime: {
        min: Number.MAX_VALUE,
        max: 0,
        total: 0,
        count: 0
      },
      resourceUtilization: {
        cpuMax: 0,
        memoryMax: 0,
        warnings: 0
      }
    };

    // Message tracking for response time calculation
    const pendingMessages = new Map();

    // Process each line
    lines.forEach(line => {
      if (!line) return;

      try {
        // Extract timestamp and data
        const match = line.match(/\[(.*?)\]\s+(\w+)\s+\[(.*?)\]\s+(.*)/);
        if (!match) return;

        const [, timestamp, level, source, message] = match;
        let data = null;

        // Try to parse any JSON data in the message
        const dataStart = message.indexOf('{');
        if (dataStart !== -1) {
          try {
            data = JSON.parse(message.slice(dataStart));
          } catch (e) {
            // Ignore parse errors for non-JSON content
          }
        }

        // Track message stats
        if (data && data.type === 'message') {
          stats.totalMessages++;
          stats.messagesByType[data.type] = (stats.messagesByType[data.type] || 0) + 1;

          // Track message timing
          if (data.payload && data.payload.id) {
            const id = data.payload.id;
            if (data.payload.status === 'pending') {
              pendingMessages.set(id, Date.parse(timestamp));
            } else if (data.payload.status === 'completed' && pendingMessages.has(id)) {
              const startTime = pendingMessages.get(id);
              const duration = Date.parse(timestamp) - startTime;
              stats.responseTime.min = Math.min(stats.responseTime.min, duration);
              stats.responseTime.max = Math.max(stats.responseTime.max, duration);
              stats.responseTime.total += duration;
              stats.responseTime.count++;
              pendingMessages.delete(id);
            }
          }
        }

        // Track errors and warnings
        if (level === 'ERROR') stats.errorCount++;
        if (level === 'WARN') stats.warningCount++;

        // Track resource utilization
        if (data && data.type === 'RESOURCE_WARNING') {
          stats.resourceUtilization.warnings++;
          if (data.details) {
            stats.resourceUtilization.cpuMax = Math.max(stats.resourceUtilization.cpuMax, data.details.cpuLoad || 0);
            stats.resourceUtilization.memoryMax = Math.max(stats.resourceUtilization.memoryMax, data.details.memoryUsage || 0);
          }
        }

      } catch (error) {
        console.error('Error processing log line:', error);
      }
    });

    return stats;
  } catch (error) {
    console.error('Error reading log file:', error);
    return null;
  }
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function printResults(stats) {
  console.log('\n=== Test Analysis Results ===\n');

  // Message Statistics
  console.log(`${colors.cyan}Message Statistics:${colors.reset}`);
  console.log(`Total Messages: ${stats.totalMessages}`);
  Object.entries(stats.messagesByType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  // Error and Warning Summary
  console.log(`\n${colors.cyan}Issues:${colors.reset}`);
  console.log(`Errors: ${colors.red}${stats.errorCount}${colors.reset}`);
  console.log(`Warnings: ${colors.yellow}${stats.warningCount}${colors.reset}`);

  // Response Time Analysis
  if (stats.responseTime.count > 0) {
    const avgResponse = stats.responseTime.total / stats.responseTime.count;
    console.log(`\n${colors.cyan}Response Time:${colors.reset}`);
    console.log(`Min: ${formatDuration(stats.responseTime.min)}`);
    console.log(`Max: ${formatDuration(stats.responseTime.max)}`);
    console.log(`Avg: ${formatDuration(avgResponse)}`);
  }

  // Resource Utilization
  console.log(`\n${colors.cyan}Resource Utilization:${colors.reset}`);
  console.log(`Peak CPU: ${stats.resourceUtilization.cpuMax.toFixed(2)}%`);
  console.log(`Peak Memory: ${stats.resourceUtilization.memoryMax.toFixed(2)}%`);
  console.log(`Resource Warnings: ${stats.resourceUtilization.warnings}`);

  // Overall Status
  const hasIssues = stats.errorCount > 0 || stats.warningCount > 0;
  console.log(`\n${colors.cyan}Overall Status:${colors.reset}`);
  console.log(hasIssues ? 
    `${colors.red}✘ Issues Detected${colors.reset}` : 
    `${colors.green}✓ All Tests Passed${colors.reset}`
  );
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const logFile = args[0] || 'test-server.log';
  
  console.log(`Analyzing log file: ${logFile}`);
  const stats = analyzeLog(logFile);
  
  if (stats) {
    printResults(stats);
  } else {
    console.error('Failed to analyze logs');
    process.exit(1);
  }
}

module.exports = { analyzeLog, printResults };
