# Backend Service Dockerfile with built-in MongoDB
FROM node:18-alpine

# Install MongoDB and system dependencies
RUN apk add --no-cache mongodb mongodb-tools

# Create MongoDB data directory
RUN mkdir -p /data/db && chown -R mongodb:mongodb /data/db

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user and add to mongodb group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    addgroup nodejs mongodb

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db' >> /start.sh && \
    echo 'npm start' >> /start.sh && \
    chmod +x /start.sh

# Expose ports (MongoDB and Node.js)
EXPOSE 27017 5000

# Health check for both services
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Run the startup script
CMD ["/start.sh"]