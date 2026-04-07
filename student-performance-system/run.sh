#!/bin/bash

# Student Performance System - Run Script
# This script starts all services for the Student Performance AI System

set -e

echo "🚀 Starting Student Performance System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $port ($name) is already in use${NC}"
        return 1
    fi
    return 0
}

# Function to start a service
start_service() {
    local dir=$1
    local command=$2
    local name=$3

    echo -e "${BLUE}📁 Starting $name in $dir...${NC}"
    cd "$dir"

    if [ "$command" = "npm start" ]; then
        # For npm, run in background
        npm start &
        echo $! > "../.${name}.pid"
    elif [ "$command" = "python app.py" ]; then
        # For Python Flask, run in background
        python app.py &
        echo $! > "../.${name}.pid"
    else
        # For other commands
        eval "$command" &
        echo $! > "../.${name}.pid"
    fi

    cd ..
    echo -e "${GREEN}✅ $name started${NC}"
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"

    # Kill processes by PID files
    for pidfile in .*.pid; do
        if [ -f "$pidfile" ]; then
            pid=$(cat "$pidfile")
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid"
                echo -e "${GREEN}✅ Stopped process $pid${NC}"
            fi
            rm "$pidfile"
        fi
    done
}

# Function to show usage
usage() {
    echo "Usage: $0 [start|stop|restart]"
    echo "  start   - Start all services"
    echo "  stop    - Stop all services"
    echo "  restart - Restart all services"
    exit 1
}

# Check command line arguments
case "${1:-start}" in
    start)
        # Check if ports are available
        check_port 3000 "Frontend (React)"
        check_port 5000 "Backend (Node.js)"
        check_port 8000 "AI Service (Flask)"

        echo -e "${YELLOW}⚠️  Make sure MongoDB is running on port 27017${NC}"
        echo -e "${YELLOW}   Start with: mongod${NC}"
        echo -e "${YELLOW}   Or Docker: docker run -d -p 27017:27017 mongo:latest${NC}"
        echo ""

        # Start services
        start_service "frontend" "npm start" "Frontend"
        sleep 2
        start_service "backend" "npm start" "Backend"
        sleep 2
        start_service "ai-service" "python app.py" "AI Service"

        echo ""
        echo -e "${GREEN}🎉 All services started!${NC}"
        echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
        echo -e "${BLUE}🔧 Backend: http://localhost:5000${NC}"
        echo -e "${BLUE}🤖 AI Service: http://localhost:8000${NC}"
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

        # Wait for Ctrl+C
        trap stop_services SIGINT
        wait
        ;;

    stop)
        stop_services
        ;;

    restart)
        $0 stop
        sleep 2
        $0 start
        ;;

    *)
        usage
        ;;
esac