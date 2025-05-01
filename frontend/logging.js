const fs = require('fs');
const path = require('path');
const util = require('util');

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

class Logger {
    constructor(name) {
        this.name = name;
        this.logFile = path.join(logsDir, `${name}.log`);
        this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });
    }

    timestamp() {
        return new Date().toISOString();
    }

    format(level, message, data = null) {
        const ts = this.timestamp();
        const base = `[${ts}] ${level} [${this.name}] ${message}`;
        if (data) {
            return `${base}\n${util.inspect(data, { depth: null, colors: false })}`;
        }
        return base;
    }

    log(level, message, data = null) {
        const formatted = this.format(level, message, data);
        this.stream.write(formatted + '\n');
        
        // Also write to console with colors
        const colors = {
            INFO: '\x1b[32m',  // Green
            WARN: '\x1b[33m',  // Yellow
            ERROR: '\x1b[31m', // Red
            DEBUG: '\x1b[36m'  // Cyan
        };
        const reset = '\x1b[0m';
        console.log(`${colors[level] || ''}${formatted}${reset}`);
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    debug(message, data = null) {
        if (process.env.NODE_ENV !== 'production') {
            this.log('DEBUG', message, data);
        }
    }

    close() {
        this.stream.end();
    }
}

module.exports = Logger;
