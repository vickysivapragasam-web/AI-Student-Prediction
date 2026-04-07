# Student Performance AI System - Docker Setup

This document explains how to run the Student Performance AI System using Docker and the provided run scripts.

## 🚀 Quick Start

### Option 1: Using Run Scripts (Recommended for Development)

#### Linux/Mac:
```bash
chmod +x run.sh
./run.sh start
```

#### Windows (PowerShell):
```powershell
.\run.ps1
# or
.\run.ps1 -Action start
```

#### Windows (Command Prompt):
```cmd
run.bat start
```

To stop all services:
```bash
./run.sh stop
# or
.\run.ps1 -Action stop
```

#### PowerShell Script Features:
- **Parameter validation**: Accepts `start`, `stop`, or `restart` actions
- **Port checking**: Verifies ports are available before starting
- **Process tracking**: Better process management and cleanup
- **Error handling**: Comprehensive error handling and colored output
- **Interactive mode**: Keeps running and handles Ctrl+C gracefully

Usage examples:
```powershell
# Start services (default action)
.\run.ps1

# Explicit start
.\run.ps1 -Action start

# Stop services
.\run.ps1 -Action stop

# Restart services
.\run.ps1 -Action restart
```

### Option 2: Using Docker Compose (Recommended for Production)

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 📋 Services

The application consists of 3 services:

1. **Backend** (Node.js + MongoDB) - Ports 5000 (API) and 27017 (Database)
2. **AI Service** (Python Flask) - Port 8000
3. **Frontend** (React) - Port 3000

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────────────────────┐
│   Frontend      │    │         Backend                 │
│   (React)       │◄──►│  (Node.js + MongoDB)           │
│   Port 3000     │    │   Port 5000 (API)              │
└─────────────────┘    │   Port 27017 (Database)        │
         │             └─────────────────────────────────┘
         └─────────────────────┼───────────────────────────
                               ▼
                    ┌─────────────────┐
                    │   AI Service    │
                    │   (Python)      │
                    │   Port 8000     │
                    └─────────────────┘
```

## 🔧 Development Setup

### Prerequisites

- **For Run Scripts:**
  - Node.js (v18+)
  - Python (v3.11+)
  - MongoDB (local or Atlas)
  - npm/yarn

- **For Docker:**
  - Docker
  - Docker Compose

### Environment Variables

Create `.env.local` files in the respective directories:

#### Backend (.env.local)
```env
MONGODB_URI=mongodb://127.0.0.1:27017/studentDB
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studentDB
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:8000
```

## 📁 Project Structure

```
student-performance-system/
├── ai-service/           # Python Flask AI service
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...
├── backend/              # Node.js Express API with built-in MongoDB
│   ├── Dockerfile        # Now includes MongoDB installation
│   ├── package.json
│   └── ...
├── frontend/             # React application
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ...
├── docker-compose.yml    # Docker orchestration (3 services)
├── run.sh               # Linux/Mac run script
├── run.bat              # Windows CMD run script
├── run.ps1              # Windows PowerShell run script
└── README.md
```

## 🐳 Docker Commands

### Build Specific Service
```bash
docker-compose build backend
docker-compose build frontend
docker-compose build ai-service
```

### View Service Logs
```bash
docker-compose logs backend
docker-compose logs -f frontend  # Follow logs
```

### Execute Commands in Containers
```bash
# Access backend container
docker-compose exec backend sh

# Access database
docker-compose exec mongodb mongo
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ This deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## � Additional Documentation

Each service has its own detailed README:

- **[Backend API](./backend/README.md)** - Complete API documentation, authentication, endpoints, and deployment
- **[AI Service](./ai-service/README.md)** - ML model details, prediction API, and training information
- **[Frontend](./frontend/README.md)** - React application setup, features, and development guide

## �🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000  # Linux/Mac
   netstat -ano | findstr :3000  # Windows
   ```

2. **MongoDB connection issues:**
   - Ensure MongoDB is running locally or Atlas IP is whitelisted
   - Check `MONGODB_URI` in `.env.local`

3. **Permission issues:**
   ```bash
   # Make run script executable
   chmod +x run.sh
   ```

4. **Docker build issues:**
   ```bash
   # Clear Docker cache
   docker system prune -a
   ```

### Health Checks

All services include health checks. Monitor them with:
```bash
docker-compose ps
```

## 🚀 Deployment

### Production Deployment

1. Update environment variables for production URLs
2. Use a reverse proxy (nginx) for SSL termination
3. Configure proper logging and monitoring
4. Set up CI/CD pipeline for automated builds

### Environment Variables for Production

```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/prod-db
FRONTEND_URL=https://yourdomain.com

# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_AI_URL=https://ai.yourdomain.com
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all prerequisites are installed
4. Check port availability

For more information, see the individual service READMEs in their respective directories.