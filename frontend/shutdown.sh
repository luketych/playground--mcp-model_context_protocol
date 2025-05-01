#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}Shutting down MCP development environment...${NC}"

# Kill test server
if pgrep -f "node test-server.js" > /dev/null; then
    echo "Stopping test server..."
    pkill -f "node test-server.js"
fi

# Kill Next.js development server
if lsof -i :3000 -t > /dev/null; then
    echo "Stopping Next.js development server..."
    kill $(lsof -t -i:3000)
fi

# Wait for processes to finish
sleep 2

# Verify ports are clear
if ! lsof -i :3000 -t > /dev/null && ! lsof -i :8765 -t > /dev/null; then
    echo -e "${GREEN}All development servers stopped successfully${NC}"
else
    echo -e "${RED}Warning: Some processes may still be running${NC}"
    echo "Check ports 3000 and 8765"
fi
