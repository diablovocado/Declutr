# Declutr Production Deployment Guide

This guide details instructions for deploying Declutr to cloud production environments using Docker Compose, Kubernetes, and Helm.

## Prerequisites

- Docker 24.0+ & Docker Compose 2.20+
- Kubernetes Cluster 1.28+ (`kubectl` configured)
- Helm v3.12+

## 1. Local Production Deployment (Docker Compose)

Launch the complete stack locally including Go API, Next.js Web UI, PostgreSQL+pgvector, Redis, MinIO storage, and Prometheus monitoring:

```bash
# 1. Copy environment template
cp .env.production.example .env

# 2. Build and launch multi-service stack
docker-compose up --build -d

# 3. Verify container statuses
docker-compose ps
```

Access endpoints:
- Web App: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Backend API & Health: `http://localhost:8080/health`
- Prometheus Metrics: `http://localhost:9090`

## 2. Kubernetes Cloud Deployment

Deploy Declutr into a Kubernetes cluster using standard manifests:

```bash
# Create target namespace
kubectl create namespace declutr-prod

# Apply ConfigMap
kubectl apply -f infrastructure/kubernetes/configmap.yaml -n declutr-prod

# Deploy Services & Deployments
kubectl apply -f infrastructure/kubernetes/service.yaml -n declutr-prod
kubectl apply -f infrastructure/kubernetes/deployment.yaml -n declutr-prod

# Enable Autoscaling and Ingress
kubectl apply -f infrastructure/kubernetes/hpa.yaml -n declutr-prod
kubectl apply -f infrastructure/kubernetes/ingress.yaml -n declutr-prod
```

## 3. Helm Production Deployment

Deploy using Helm chart:

```bash
helm upgrade --install declutr infrastructure/helm/declutr \
  --namespace declutr-prod \
  --create-namespace \
  --values infrastructure/helm/declutr/values.yaml
```
