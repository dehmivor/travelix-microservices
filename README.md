# Travelix – Microservices Travel Booking Platform

Production-ready travel booking system built with **NestJS Microservices**, deployed on **Kubernetes (Minikube/K3s)**, featuring Redis Cluster, PostgreSQL-HA, background jobs, distributed locking, full observability & CI/CD.

![](https://img.shields.io/badge/NestJS-v10-red) ![](https://img.shields.io/badge/TypeScript-5.3-blue) ![](https://img.shields.io/badge/Kubernetes-1.29-brightgreen) ![](https://img.shields.io/badge/Redis-Cluster-orange) ![](https://img.shields.io/badge/PostgreSQL--HA-15-blue)

## 🏗️ Architecture Overview

```
Internet
   ↓ (HTTPS)

Ingress NGINX → API Gateway (NestJS) ← Rate limiting + JWT Auth
   ↓↓↓↓↓↓

[Auth Service]  [User Service]  [Tour Service]  [Booking Service] → BullMQ Queue → [Notification Service]
   ↓               ↓                 ↓                  ↓
PostgreSQL-HA   PostgreSQL-HA   PostgreSQL-HA         Redis Cluster (cache + queue + lock)
   ↓               ↓                 ↓
Prometheus → Grafana (dashboard CPU/RAM/Latency/Redis/Postgres)

GitHub Actions → Build Docker → Push → Deploy Minikube/K3s
```

## ✨ Features

- **6 Independent Microservices**: API Gateway, Auth, User, Tour, Booking, Notification
- **Docker & Multi-stage Build**: Optimized container images
- **Kubernetes Deployment**: Ingress, HPA, Liveness/Readiness probes
- **PostgreSQL High Availability**: bitnami/postgresql-ha with read replicas
- **Redis Cluster**: Cache, session, rate-limiting, distributed lock & BullMQ
- **Background Job Processing**: Booking confirmation emails via BullMQ
- **Rate Limiting & JWT Authentication**: Secure API access
- **Full CI/CD**: GitHub Actions automated build and deploy
- **Observability**: Prometheus + Grafana dashboards (CPU, latency, Redis, Postgres)
- **Distributed Locking**: RedLock pattern to prevent double booking

## 🛠️ Tech Stack

- **Backend**: NestJS 10 + TypeScript
- **Database**: PostgreSQL 15 (HA setup)
- **Cache & Queue**: Redis Cluster + BullMQ
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Minikube/K3s)
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions
- **Package Management**: Nx Monorepo

## 📋 Prerequisites

- Node.js 18+ or 20+
- Docker & Docker Compose
- Minikube or K3s (for Kubernetes deployment)
- kubectl
- Helm 3.x
- GitHub account + Docker Hub account (for CI/CD)

## 🚀 Quick Start

### Local Development with Docker Compose

```bash
# Clone the repository
git clone https://github.com/yourusername/travelix-microservices.git
cd travelix-microservices

# Install dependencies
npm install

# Start all services
docker compose up --build

# Access services:
# - API Gateway: http://localhost:3000
# - Auth Service: http://localhost:3001
# - User Service: http://localhost:3002
# - Tour Service: http://localhost:3003
# - Booking Service: http://localhost:3004
# - Notification Service: http://localhost:3005
```

### Individual Service Development

```bash
# Run API Gateway
nx serve api-gateway

# Run Auth Service
nx serve auth-service

# Run User Service
nx serve user-service

# Run Tour Service
nx serve tour-service

# Run Booking Service
nx serve booking-service

# Run Notification Service
nx serve notification-service
```

## 📦 Services Overview

### 1. API Gateway (Port 3000)
- Entry point for all client requests
- Rate limiting (100 requests/minute)
- Request routing to microservices
- Health check endpoint: `/health`

### 2. Auth Service (Port 3001)
- JWT-based authentication
- Login endpoint: `POST /auth/login`
- Protected routes with JWT guard
- Token blacklisting (Redis)

### 3. User Service (Port 3002)
- User CRUD operations
- PostgreSQL database
- Endpoints: `GET/POST/PUT/DELETE /users`

### 4. Tour Service (Port 3003)
- Tour management
- Redis caching (5-minute TTL)
- Endpoints: `GET/POST/PUT/DELETE /tours`

### 5. Booking Service (Port 3004)
- Booking creation with distributed lock
- Prevents double booking using Redis lock
- Pushes jobs to BullMQ queue
- Endpoints: `GET/POST /bookings`

### 6. Notification Service (Port 3005)
- Processes booking confirmation jobs
- Email notifications (mock implementation)
- BullMQ worker

## 🐳 Docker Deployment

### Build Images

```bash
# Build all services
docker compose build

# Or build individual service
docker build -t travelix-api-gateway:latest .
```

### Run with Docker Compose

```bash
docker compose up -d
docker compose logs -f
```

## ☸️ Kubernetes Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Kubernetes deployment instructions.

### Quick Deploy

```bash
# 1. Start Minikube
minikube start --driver=docker
minikube addons enable ingress

# 2. Setup Helm charts (PostgreSQL HA, Redis Cluster, Prometheus)
chmod +x scripts/setup-helm.sh
./scripts/setup-helm.sh

# 3. Build and push Docker images
chmod +x scripts/build-docker.sh
# Update DOCKER_HUB_USERNAME in the script
./scripts/build-docker.sh

# 4. Deploy to Kubernetes
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh

# 5. Check status
kubectl get pods -n travelix
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:
1. Builds all services
2. Runs tests
3. Builds Docker images
4. Pushes to Docker Hub
5. Deploys to Kubernetes (on main branch)

### Setup GitHub Secrets

- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Your Docker Hub access token

## 📊 Monitoring

### Access Grafana

```bash
kubectl port-forward -n travelix svc/monitoring-grafana 3000:80
# Access at http://localhost:3000
# Username: admin
# Password: admin (change in production)
```

### Access Prometheus

```bash
kubectl port-forward -n travelix svc/monitoring-kube-prometheus-prometheus 9090:9090
# Access at http://localhost:9090
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
nx test api-gateway

# Run with coverage
nx test --coverage
```

## 📁 Project Structure

```
travelix-microservices/
├── apps/
│   ├── api-gateway/          # API Gateway service
│   ├── auth-service/          # Authentication service
│   ├── user-service/          # User management service
│   ├── tour-service/          # Tour management service
│   ├── booking-service/       # Booking service with distributed lock
│   └── notification-service/  # Notification service with BullMQ
├── k8s/                       # Kubernetes manifests
├── scripts/                   # Deployment scripts
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                # Multi-stage Docker build
└── package.json              # Dependencies and scripts
```

## 🔐 Environment Variables

Create `.env` file for local development:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=travelix

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Node
NODE_ENV=development
```

## 🐛 Troubleshooting

### Services not starting

```bash
# Check logs
docker compose logs <service-name>

# Check Kubernetes pods
kubectl logs -n travelix <pod-name>
```

### Database connection issues

```bash
# Verify PostgreSQL is running
docker compose ps postgres

# Check database connection
docker compose exec postgres psql -U postgres -d travelix
```

### Redis connection issues

```bash
# Verify Redis is running
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping
```

## 📝 API Examples

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create User

```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe", "phone": "+1234567890"}'
```

### Create Tour

```bash
curl -X POST http://localhost:3003/tours \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris Adventure",
    "description": "Explore the City of Light",
    "price": 1500,
    "destination": "Paris",
    "duration": 5,
    "availableSlots": 20
  }'
```

### Create Booking

```bash
curl -X POST http://localhost:3004/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "tourId": 1,
    "numberOfGuests": 2
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Nx team for the monorepo tooling
- Kubernetes community for excellent documentation

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for learning and demonstrating microservices architecture**
