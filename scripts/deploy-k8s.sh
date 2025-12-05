#!/bin/bash

# Deploy script for Kubernetes
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "Creating ConfigMap and Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

echo "Deploying services..."
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/user-service-deployment.yaml
kubectl apply -f k8s/tour-service-deployment.yaml
kubectl apply -f k8s/booking-service-deployment.yaml
kubectl apply -f k8s/notification-service-deployment.yaml

echo "Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "Deployment complete!"
echo "Check status with: kubectl get pods -n travelix"

