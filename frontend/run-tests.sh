#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting test suite...${NC}"

# Run the test script
./test.sh

# Capture test script exit code
TEST_EXIT_CODE=$?

echo -e "\n${YELLOW}Running log analysis...${NC}"

# Run log analysis
node analyze-logs.js test-server.log

# Capture analysis exit code
ANALYSIS_EXIT_CODE=$?

# Check if both test and analysis succeeded
if [ $TEST_EXIT_CODE -eq 0 ] && [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}Test suite completed successfully${NC}"
    exit 0
else
    echo -e "\n${RED}Test suite failed${NC}"
    echo -e "Test exit code: $TEST_EXIT_CODE"
    echo -e "Analysis exit code: $ANALYSIS_EXIT_CODE"
    exit 1
fi
