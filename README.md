# Kubernetes Assignment - Deploy Flask + Express on Minikube

## Project Overview

This project deploys a full-stack web application on a local Kubernetes cluster using Minikube.
- **Frontend**: Express.js (Node.js) - serves a contact form UI
- **Backend**: Flask (Python) - handles form submissions

The frontend talks to the backend inside the Kubernetes cluster using a ClusterIP service.

---

## Project Structure

```
task-7-Kubernetes/
├── flask-backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── express-frontend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── views/
│   │   └── index.ejs
│   └── public/
│       └── style.css
├── k8s/
│   ├── flask-backend-deployment.yaml
│   ├── flask-backend-service.yaml
│   ├── express-frontend-deployment.yaml
│   └── express-frontend-service.yaml
└── README.md
```

---

## Prerequisites

- Docker installed
- Minikube installed
- kubectl installed

---

## Step-by-Step Deployment

### Step 1: Start Minikube

```bash
minikube start
```

### Step 2: Set Docker to use Minikube's Docker daemon

This is important so that Kubernetes can find our locally built images.

```bash
eval $(minikube docker-env)
```

**For Windows PowerShell:**
```powershell
minikube docker-env --shell powershell | Invoke-Expression
```

**For Windows CMD:**
```cmd
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i
```

### Step 3: Build Docker Images

Build the Flask backend image:
```bash
cd flask-backend
docker build -t flask-backend:latest .
cd ..
```

Build the Express frontend image:
```bash
cd express-frontend
docker build -t express-frontend:latest .
cd ..
```

### Step 4: Apply Kubernetes Manifests

Apply all YAML files:
```bash
kubectl apply -f k8s/flask-backend-deployment.yaml
kubectl apply -f k8s/flask-backend-service.yaml
kubectl apply -f k8s/express-frontend-deployment.yaml
kubectl apply -f k8s/express-frontend-service.yaml
```

### Step 5: Verify Pods are Running

```bash
kubectl get pods
```

Expected output (wait a minute if status shows ContainerCreating):
```
NAME                                READY   STATUS    RESTARTS   AGE
flask-backend-xxxx                  1/1     Running   0          30s
express-frontend-xxxx               1/1     Running   0          30s
```

### Step 6: Verify Services

```bash
kubectl get services
```

Expected output:
```
NAME                       TYPE        CLUSTER-IP      PORT(S)          AGE
flask-backend-service      ClusterIP   10.x.x.x        5000/TCP         30s
express-frontend-service   NodePort    10.x.x.x        3000:30001/TCP   30s
kubernetes                 ClusterIP   10.96.0.1        443/TCP          5m
```

### Step 7: Access the Application

```bash
minikube service express-frontend-service
```

This will open the contact form in your browser. You can fill the form and submit it - it will send data to the Flask backend running in another pod.

You can also access it manually:
```bash
minikube service express-frontend-service --url
```

---

## How it Works

1. Express frontend runs in a pod and is exposed via **NodePort** service (port 30001)
2. Flask backend runs in a separate pod and is exposed via **ClusterIP** service (internal only)
3. When user submits the form, Express sends the data to Flask using the Kubernetes service name `flask-backend-service`
4. Flask processes the data and returns a response
5. Express shows the result on the page

---

## Useful Commands

```bash
# check pod logs
kubectl logs <pod-name>

# describe a pod (for debugging)
kubectl describe pod <pod-name>

# delete all deployments and services
kubectl delete -f k8s/

# stop minikube
minikube stop
```

---

## GitHub Repository

Link: https://github.com/syedibad52/task-7-Kubernetes
