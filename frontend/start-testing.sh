#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BLUE}${BOLD}MCP System Testing Guide${NC}"
echo -e "${BOLD}----------------------${NC}\n"

# Check if servers are running
echo -e "${YELLOW}Checking server status...${NC}"

if ! lsof -i :3000 -t > /dev/null; then
    echo -e "${YELLOW}Next.js server is not running!${NC}"
    echo "Run ./dev.sh first"
    exit 1
fi

if ! lsof -i :8765 -t > /dev/null; then
    echo -e "${YELLOW}Test server is not running!${NC}"
    echo "Run ./dev.sh first"
    exit 1
fi

echo -e "${GREEN}✓ All servers are running${NC}\n"

# Open browser
echo -e "${BLUE}Opening test environment...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
fi

# Display test instructions
echo -e "\n${BOLD}Test Sequence:${NC}"
echo "1. Verify Connection Status"
echo "   - Should see green indicator"
echo "   - Three nodes should appear"
echo ""
echo "2. Send Test Messages"
echo "   - Select 'mcp' as target"
echo "   - Enter 'test' as task"
echo "   - Watch status flow: pending → processing → complete"
echo ""
echo "3. Check Real-time Updates"
echo "   - Message Inspector shows history"
echo "   - System Map shows node status"
echo "   - Queue items appear and clear"
echo ""
echo "4. Test Error Handling"
echo "   - Try invalid messages"
echo "   - Check UI feedback"
echo ""
echo -e "${YELLOW}See TEST_INSTRUCTIONS.md for complete test cases${NC}\n"

echo -e "${BLUE}Monitoring server logs...${NC}"
echo -e "${BOLD}----------------------${NC}"
echo -e "Press ${YELLOW}Ctrl+C${NC} to exit monitoring\n"

# Tail both server logs if available
tail -f logs/*.log 2>/dev/null || echo "No log files found"
