#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Restarting MCP Frontend Development Environment...${NC}"

# Kill any running Next.js processes
echo -e "\n${GREEN}Stopping running processes...${NC}"
pkill -f "next"

# Clean up build files
echo -e "\n${GREEN}Cleaning build files...${NC}"
rm -rf .next
rm -rf node_modules/.cache

# Clear Next.js cache
echo -e "\n${GREEN}Clearing Next.js cache...${NC}"
npm run clean

# Reinstall dependencies
echo -e "\n${GREEN}Reinstalling dependencies...${NC}"
npm install

# Start development server
echo -e "\n${GREEN}Starting development server...${NC}"
npm run dev
