# 🚀 TaskFlow — Cloud-Native Task Management App

A full-stack task management application built to practice **DevOps, containerization, and Kubernetes deployment**.

TaskFlow allows users to create, complete, and delete tasks through a React frontend connected to a Node.js REST API, with MongoDB used for persistent data storage.

## ✨ Features

- ✅ Create, view, complete, and delete tasks
- ⚛️ React + Vite frontend
- 🟢 Node.js + Express REST API
- 🍃 MongoDB database integration
- 🐳 Docker containerization
- 🧩 Docker Compose for local development
- ☸️ Kubernetes Deployments and Services
- 🔁 Multiple backend replicas
- 🌐 Nginx reverse proxy for frontend-to-backend communication
- 💾 MongoDB persistent volume in Docker Compose

## 🏗️ Architecture

```text
                User / Browser
                      |
                      v
              React Frontend
                 + Nginx
                      |
                  /api proxy
                      |
                      v
             Express REST API
             (Kubernetes Pods)
                /         \
               v           v
                   MongoDB
                taskflow DB
                tasks collection
```

**Key concept:** Multiple backend replicas use a shared MongoDB database instead of keeping tasks in individual application memory.

## 🛠️ Tech Stack

| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| React + Vite   | Frontend                          |
| Node.js        | Backend runtime                   |
| Express.js     | REST API                          |
| MongoDB        | Persistent data storage           |
| Docker         | Containerization                  |
| Docker Compose | Local multi-container environment |
| Kubernetes     | Application orchestration         |
| Nginx          | Static hosting and reverse proxy  |
| Git + GitHub   | Version control                   |

## 📁 Project Structure

```text
taskflow/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
├── k8s/
│   ├── backend.yaml
│   └── frontend.yaml
├── docker-compose.yml
├── .gitignore
└── README.md
```

## ⚙️ Run Locally with Docker Compose

### Prerequisites

- Git
- Docker Desktop with Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/pathumnimsara/taskflow-devops.git
cd taskflow-devops
```

### 2. Start the application

```bash
docker compose up --build -d
```

### 3. Open the application

- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Health endpoint:** [http://localhost:3001/health](http://localhost:3001/health)

### 4. View container status

```bash
docker compose ps
```

### 5. View backend logs

```bash
docker compose logs backend
```

### 6. Stop the application

```bash
docker compose down
```

The MongoDB data volume is retained when you stop the Compose services normally. To remove the volume and its data, use `docker compose down -v` only when you intentionally want to delete it.

## ☸️ Kubernetes Deployment

This project includes Kubernetes manifests for the backend and frontend.

### Prerequisites

- Docker Desktop with Kubernetes enabled
- `kubectl`
- TaskFlow backend and frontend images available to the Kubernetes cluster

### 1. Deploy the backend

```bash
kubectl apply -f k8s/backend.yaml
```

### 2. Deploy the frontend

```bash
kubectl apply -f k8s/frontend.yaml
```

### 3. Check deployments and Pods

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

### 4. Check backend logs

```bash
kubectl logs deployment/taskflow-backend
```

### 5. Check rollout status

```bash
kubectl rollout status deployment/taskflow-backend
kubectl rollout status deployment/taskflow-frontend
```

### 6. Scale the backend

```bash
kubectl scale deployment/taskflow-backend --replicas=2
```

The backend connects to MongoDB through the Kubernetes Service using the `MONGO_URL` and `MONGO_DB` environment variables.

## 🔌 API Endpoints

| Method | Endpoint     | Description            |
| ------ | ------------ | ---------------------- |
| GET    | `/`          | API status             |
| GET    | `/health`    | Health check           |
| GET    | `/tasks`     | Retrieve all tasks     |
| POST   | `/tasks`     | Create a task          |
| PATCH  | `/tasks/:id` | Update task completion |
| DELETE | `/tasks/:id` | Delete a task          |

## 🧠 DevOps Skills Practiced

- Building Docker images for frontend and backend
- Running multi-container applications with Docker Compose
- Configuring container networking
- Deploying applications with Kubernetes
- Using Kubernetes Deployments, Services, and replicas
- Connecting an application to MongoDB
- Managing configuration through environment variables
- Troubleshooting application and container logs
- Understanding why stateless backend replicas need shared data storage

## 🚧 Planned Improvements

- [ ] GitHub Actions CI/CD pipeline
- [ ] Automated tests
- [ ] Docker image publishing to Docker Hub
- [ ] Kubernetes readiness and liveness probes
- [ ] Resource requests and limits
- [ ] Monitoring with Prometheus and Grafana
- [ ] Secure configuration and secrets management
- [ ] Cloud deployment

## 👨‍💻 Author

**Pathum Nimesh Nimsara**

- GitHub: [@pathumnimsara](https://github.com/pathumnimsara)

---

⭐ Built as a hands-on project to learn and demonstrate practical DevOps skills.
