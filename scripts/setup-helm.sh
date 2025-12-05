#!/bin/bash

# Setup Helm charts for PostgreSQL HA and Redis Cluster

echo "Adding Helm repositories..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

echo "Installing PostgreSQL HA..."
helm install postgresql-ha bitnami/postgresql-ha \
  --namespace travelix \
  --create-namespace \
  --set postgresql.password=secret \
  --set postgresql.repmgrPassword=secret \
  --set postgresql.postgresqlDatabase=travelix

echo "Installing Redis Cluster..."
helm install redis-cluster bitnami/redis-cluster \
  --namespace travelix \
  --set cluster.nodes=6 \
  --set cluster.replicasPerMaster=1

echo "Installing Prometheus and Grafana..."
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace travelix \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.adminPassword=admin

echo "Setup complete!"
echo "Access Grafana with: kubectl port-forward -n travelix svc/monitoring-grafana 3000:80"

