#!/bin/bash

# Build script for individual services
SERVICES=("api-gateway" "auth-service" "user-service" "tour-service" "booking-service" "notification-service")
DOCKER_HUB_USERNAME=${DOCKER_HUB_USERNAME:-"your-dockerhub-username"}

for service in "${SERVICES[@]}"; do
  echo "Building $service..."
  docker build -t $DOCKER_HUB_USERNAME/travelix-$service:latest \
    --target builder \
    --build-arg SERVICE=$service \
    -f Dockerfile .
  
  echo "Pushing $service..."
  docker push $DOCKER_HUB_USERNAME/travelix-$service:latest
done

