# Travelix – Microservices Travel Booking Platform

Production-ready travel booking system built with **NestJS Microservices**, deployed on **Kubernetes (Minikube/K3s)**, featuring Redis Cluster, PostgreSQL-HA, background jobs, distributed locking, full observability & CI/CD.

![](https://img.shields.io/badge/NestJS-v10-red) ![](https://img.shields.io/badge/TypeScript-5.3-blue) ![](https://img.shields.io/badge/Kubernetes-1.29-brightgreen) ![](https://img.shields.io/badge/Redis-Cluster-orange) ![](https://img.shields.io/badge/PostgreSQL--HA-15-blue)

## Architecture Overview
![Architecture](https://raw.githubusercontent.com/yourusername/travelix-microservices/main/docs/architecture.png)

## Features
- 6 independent microservices (API Gateway, Auth, User, Tour, Booking, Notification)
- Docker + multi-stage build
- Kubernetes deployment with Ingress, HPA, Liveness/Readiness probes
- PostgreSQL High Availability (bitnami/postgresql-ha) + read replica
- Redis Cluster for cache, session, rate-limiting, distributed lock & BullMQ
- Background job processing (booking confirmation email)
- Rate limiting & JWT authentication
- Full CI/CD with GitHub Actions
- Observability: Prometheus + Grafana dashboards (CPU, latency, Redis, Postgres)
- RedLock to prevent double booking

## Tech Stack
- NestJS 10 + TypeScript
- Docker & Docker Compose
- Kubernetes (Minikube/K3s)
- Redis Cluster + BullMQ
- PostgreSQL-HA (Helm)
- Prometheus + Grafana
- GitHub Actions

## Local Development
```bash
docker compose up --build
# API Gateway: http://localhost:3000
