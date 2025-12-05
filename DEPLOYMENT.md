# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Minikube or K3s
- kubectl
- Helm 3.x

## Local Development with Docker Compose

```bash
# Build and start all services
docker compose up --build

# Access services:
# - API Gateway: http://localhost:3000
# - Auth Service: http://localhost:3001
# - User Service: http://localhost:3002
# - Tour Service: http://localhost:3003
# - Booking Service: http://localhost:3004
# - Notification Service: http://localhost:3005
```

## Kubernetes Deployment

### 1. Start Minikube

```bash
minikube start --driver=docker
minikube addons enable ingress
```

### 2. Setup Helm Charts

```bash
chmod +x scripts/setup-helm.sh
./scripts/setup-helm.sh
```

### 3. Build and Push Docker Images

```bash
# Update DOCKER_HUB_USERNAME in scripts/build-docker.sh
chmod +x scripts/build-docker.sh
./scripts/build-docker.sh
```

### 4. Update Kubernetes Manifests

Update image names in all deployment files in `k8s/` directory:
- Replace `your-dockerhub-username` with your Docker Hub username

### 5. Deploy to Kubernetes

```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh
```

### 6. Check Status

```bash
kubectl get pods -n travelix
kubectl get services -n travelix
kubectl get ingress -n travelix
```

### 7. Access Services

```bash
# Get ingress IP
minikube ip

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
# <minikube-ip> travelix.local

# Access via browser
http://travelix.local
```

## Monitoring

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

## Troubleshooting

### Check Pod Logs

```bash
kubectl logs -n travelix <pod-name>
kubectl logs -n travelix -l app=api-gateway
```

### Describe Pod

```bash
kubectl describe pod -n travelix <pod-name>
```

### Restart Deployment

```bash
kubectl rollout restart deployment -n travelix <deployment-name>
```

