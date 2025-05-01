#!/bin/bash

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up MCP Frontend...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "\n${GREEN}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}Please edit .env.local with your configuration settings.${NC}"
fi

# Run type checking
echo -e "\n${GREEN}Running type checking...${NC}"
npm run type-check

# Build the project
echo -e "\n${GREEN}Building the project...${NC}"
npm run build

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "You can now run the development server with: ${YELLOW}npm run dev${NC}"
echo -e "Or start the production server with: ${YELLOW}npm start${NC}"
