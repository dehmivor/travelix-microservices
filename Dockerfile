# Multi-stage build for all services
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Build all apps
RUN npm run build

# Production stage - can be used for any service
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Default command (can be overridden in docker-compose)
CMD ["node", "dist/apps/api-gateway/main"]
