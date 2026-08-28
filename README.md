# Kubernetes Assignment - Contact Form App

i made a simple contact form app and deployed it on kubernetes using minikube. the frontend is express (node.js) and the backend is flask (python). the frontend sends form data to the backend through kubernetes services.

## how it works

- express frontend runs in one pod, flask backend runs in another pod
- frontend is exposed using NodePort (port 30001) so we can access it from browser
- backend uses ClusterIP so only the frontend can talk to it (not accessible from outside)
- when you fill the form and hit submit, express sends the data to flask using the k8s service name `flask-backend-service`
- flask processes it and sends back a response

## project structure

```
task-7-Kubernetes/
├── flask-backend/
│   ├── app.py            # flask api
│   ├── requirements.txt
│   └── Dockerfile
├── express-frontend/
│   ├── server.js         # express server
│   ├── package.json
│   ├── Dockerfile
│   ├── views/
│   │   └── index.ejs     # the form page
│   └── public/
│       └── style.css
├── k8s/
│   ├── flask-backend-deployment.yaml
│   ├── flask-backend-service.yaml
│   ├── express-frontend-deployment.yaml
│   └── express-frontend-service.yaml
├── screenshots/          # screenshots of running app
├── deploy.sh             # script to deploy everything
└── README.md
```

## prerequisites

- docker
- minikube
- kubectl

## how to deploy

### easy way (use the script)

```bash
chmod +x deploy.sh
./deploy.sh
```

this will start minikube, build images, deploy everything and open the app.

### manual way

1. start minikube
```bash
minikube start
```

2. set docker to use minikube's docker (important!)
```bash
eval $(minikube docker-env)
```

3. build the images
```bash
docker build -t flask-backend:v1 ./flask-backend
docker build -t express-frontend:v1 ./express-frontend
```

4. deploy to kubernetes
```bash
kubectl apply -f k8s/
```

5. check if pods are running
```bash
kubectl get pods
```

6. check services
```bash
kubectl get services
```

7. open the app
```bash
minikube service express-frontend-service
```

## screenshots

see the `screenshots/` folder for:
- kubectl get pods output
- kubectl get services output
- the app running in browser

## what i learned

- how to write dockerfiles for python and node apps
- how kubernetes deployments and services work
- difference between ClusterIP and NodePort services
- how pods talk to each other using service names (service discovery)
- how to set up health checks (liveness and readiness probes) so k8s can monitor pods
- resource limits to control how much cpu/memory each pod uses
- using minikube for local kubernetes development

## useful commands

```bash
# check pod logs
kubectl logs <pod-name>

# debug a pod
kubectl describe pod <pod-name>

# delete everything
kubectl delete -f k8s/

# stop minikube
minikube stop
```

## github

https://github.com/syedibad52/task-7-Kubernetes
