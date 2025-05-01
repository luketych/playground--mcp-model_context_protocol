#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing MCP Frontend development environment...${NC}"

# Check if running from the correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must be run from the frontend directory${NC}"
    exit 1
fi

# Clean node_modules and cache
echo -e "\n${GREEN}Cleaning previous installation...${NC}"
rm -rf node_modules
rm -rf .next
rm -rf .turbo
rm -f .env.local
rm -f package-lock.json

# Reset to clean state
echo -e "\n${GREEN}Creating fresh environment...${NC}"
cp .env.example .env.local

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm cache clean --force
npm install

# Run type checking
echo -e "\n${GREEN}Running type checking...${NC}"
npm run type-check

echo -e "\n${GREEN}Initialization complete!${NC}"
echo -e "You can now run the development server with: ${YELLOW}npm run dev${NC}"
