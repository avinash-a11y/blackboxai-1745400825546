#!/bin/bash

# Trustable Cares - Blood Donation Platform
# Development script to set up and start the application in development mode

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Trustable Cares - Blood Donation Platform (Development Mode) ===${NC}"
echo -e "${YELLOW}Setting up the development environment...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to continue.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm to continue.${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Check if nodemon is installed
if ! npm list -g nodemon &> /dev/null; then
    echo -e "${YELLOW}Installing nodemon globally...${NC}"
    npm install -g nodemon
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOL
PORT=8000
NODE_ENV=development
SESSION_SECRET=trustable-cares-secret-key

DB_HOST=localhost
DB_PORT=3306
DB_NAME=trustable_cares
DB_USER=root
DB_PASSWORD=password
EOL
    echo -e "${GREEN}.env file created successfully.${NC}"
    echo -e "${YELLOW}Please update the database credentials in the .env file if needed.${NC}"
fi

# Ask if user wants to seed the database
echo -e "${YELLOW}Do you want to seed the database with sample data? (y/n)${NC}"
read -r seed_db

if [ "$seed_db" = "y" ] || [ "$seed_db" = "Y" ]; then
    echo -e "${YELLOW}Seeding database...${NC}"
    npm run seed
    echo -e "${GREEN}Database seeded successfully.${NC}"
fi

# Start the application in development mode
echo -e "${YELLOW}Starting the application in development mode...${NC}"
echo -e "${GREEN}The application will be available at http://localhost:8000${NC}"
echo -e "${YELLOW}The application will automatically restart when changes are detected.${NC}"
npm run dev
