#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting test environment...${NC}"

# Function to check if a port is in use
check_port() {
  lsof -i:$1 > /dev/null 2>&1
  return $?
}

# Function to wait for a port to be available
wait_for_port() {
  local port=$1
  local count=0
  local max_attempts=30
  
  while ! check_port $port; do
    if [ $count -gt $max_attempts ]; then
      echo -e "${RED}Timeout waiting for port $port${NC}"
      exit 1
    fi
    echo -n "."
    sleep 1
    ((count++))
  done
  echo ""
}

# Check if server is already running
if check_port 8765; then
  echo -e "${RED}Port 8765 is already in use. Please stop any running servers first.${NC}"
  exit 1
fi

# Start the test server
echo -e "${YELLOW}Starting test server...${NC}"
node test-server.js > test-server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready
echo -n "Waiting for server to start"
wait_for_port 8765

# Start the simulation
echo -e "${YELLOW}Starting test simulation...${NC}"
node simulate-activity.js > simulate-activity.log 2>&1 &
SIMULATOR_PID=$!

# Wait for completion
sleep 6

# Cleanup
echo -e "${YELLOW}Cleaning up processes...${NC}"
kill $SERVER_PID $SIMULATOR_PID > /dev/null 2>&1

# Display results
echo -e "${GREEN}Test run complete${NC}"
echo "Server log:"
cat test-server.log
echo -e "\nSimulation log:"
cat simulate-activity.log

# Remove logs
rm test-server.log simulate-activity.log

echo -e "${GREEN}Done${NC}"
