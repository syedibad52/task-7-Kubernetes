#!/bin/bash

# deploy script - builds images and deploys to minikube
# run this from the project root folder

echo "=== starting minikube ==="
minikube start

echo ""
echo "=== setting docker to use minikube ==="
eval $(minikube docker-env)

echo ""
echo "=== building flask backend image ==="
docker build -t flask-backend:v1 ./flask-backend

echo ""
echo "=== building express frontend image ==="
docker build -t express-frontend:v1 ./express-frontend

echo ""
echo "=== deploying to kubernetes ==="
kubectl apply -f k8s/

echo ""
echo "=== waiting for pods to be ready ==="
kubectl wait --for=condition=ready pod -l app=flask-backend --timeout=60s
kubectl wait --for=condition=ready pod -l app=express-frontend --timeout=60s

echo ""
echo "=== pod status ==="
kubectl get pods

echo ""
echo "=== service status ==="
kubectl get services

echo ""
echo "=== opening app in browser ==="
minikube service express-frontend-service
