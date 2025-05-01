#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BLUE}Starting MCP Development Environment${NC}"
echo -e "${BOLD}------------------------------------${NC}\n"

# Function to cleanup background processes on exit
cleanup() {
  echo -e "\n${RED}Shutting down servers...${NC}"
  pkill -f "node test-server.js"
  kill $(lsof -t -i:3000) 2>/dev/null
  exit 0
}

# Set up cleanup on script termination
trap cleanup SIGINT SIGTERM

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 3000 is already in use${NC}"
    exit 1
fi

if lsof -Pi :8765 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 8765 is already in use${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
fi

# Start test server
echo -e "${BLUE}Starting test server...${NC}"
node test-server.js &
TEST_SERVER_PID=$!

# Wait for test server to start
sleep 2

# Check if test server started successfully
if ! lsof -Pi :8765 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Failed to start test server${NC}"
    cleanup
    exit 1
fi

echo -e "${GREEN}Test server running on port 8765${NC}"

# Start Next.js development server
echo -e "\n${BLUE}Starting Next.js development server...${NC}"
NEXT_TELEMETRY_DISABLED=1 npm run dev &
NEXT_PID=$!

# Wait for Next.js server to start
echo -e "${BLUE}Waiting for Next.js server...${NC}"
until curl -s http://localhost:3000 >/dev/null; do
    sleep 1
done

echo -e "\n${GREEN}Development environment is ready!${NC}"
echo -e "${BOLD}------------------------------------${NC}"
echo -e "Test Server: ${GREEN}http://localhost:8765${NC}"
echo -e "Next.js:    ${GREEN}http://localhost:3000${NC}"
echo -e "\n${BLUE}Press Ctrl+C to stop all servers${NC}\n"

# Keep script running and show test server logs
wait $TEST_SERVER_PID
