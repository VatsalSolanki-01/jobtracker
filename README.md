# Job Tracker CI/CD Deployment Pipeline

A hands-on DevOps project that demonstrates how a modern application can be automatically built, containerized, published, and deployed using AWS, Jenkins, Docker, and Docker Compose.

---

# What This Project Does

This project builds a complete CI/CD pipeline for a containerized Job Tracker application consisting of a React frontend, Go backend, and MySQL database.

Developers push code to GitHub, Jenkins automatically pulls the latest source code, builds Docker images, pushes them to Docker Hub, and deploys the updated application to a remote application server.

This setup simulates how real-world DevOps teams automate application delivery and deployments across environments.

---

# How It Helps / Problems It Solves

Manual deployments are time-consuming, error-prone, and difficult to scale. Every deployment requires building applications, transferring artifacts, updating servers, and restarting services.

My project solves these challenges by enabling:

• Automated application builds through Jenkins Pipelines  
• Consistent deployments using Docker containers  
• Centralized image storage with Docker Hub  
• Remote deployment through secure SSH connectivity  
• Rapid application updates with minimal manual intervention  
• Reproducible environments using Docker Compose  
• Simplified application management across infrastructure  

This type of CI/CD workflow helps teams deliver software faster, reduce deployment errors, and improve operational efficiency.

---

# Architecture Diagram

                +----------------------+
                |       GitHub         |
                |----------------------|
                | Source Code          |
                +----------+-----------+
                           |
                           | Git Pull
                           v
                +----------------------+
                |   Jenkins Server     |
                |----------------------|
                | Jenkins Pipeline     |
                | Docker Build         |
                | Docker Push          |
                +----------+-----------+
                           |
                           | Push Images
                           v
                +----------------------+
                |     Docker Hub       |
                |----------------------|
                | Frontend Image       |
                | Backend Image        |
                +----------+-----------+
                           |
                           | Docker Pull
                           v
                +----------------------+
                | Application Server   |
                |----------------------|
                | Docker Compose       |
                | Frontend Container   |
                | Backend Container    |
                | MySQL Container      |
                +----------------------+

### Flow

1. Developer pushes code to GitHub.
2. Jenkins pulls the latest source code.
3. Jenkins builds frontend and backend Docker images.
4. Jenkins pushes images to Docker Hub.
5. Jenkins connects to the Application Server through SSH.
6. Docker Compose pulls the latest images.
7. Containers are recreated automatically.
8. Updated application becomes available to users.

---

# Tech Stack

| Tool | Logo |
|--------|--------|
| AWS EC2 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="40"/> |
| Jenkins | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" width="40"/> |
| Docker | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40"/> |
| Docker Compose | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40"/> |
| Docker Hub | <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" width="40"/> |
| Go | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" width="40"/> |
| React | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40"/> |
| MySQL | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="40"/> |
| Linux | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" width="40"/> |
| GitHub | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="40"/> |

---

# Application Features

### Frontend

• View job applications  
• Add new applications  
• Update existing applications  
• Delete applications  
• Dashboard statistics  

### Backend

• RESTful API built with Go and Gin  
• CRUD operations for job applications  
• MySQL database integration  
• Health check endpoint  

### Database

• Persistent MySQL storage  
• Automatic table creation through GORM migrations  

---

# CI/CD Pipeline Stages

### Source Control

• Pull latest code from GitHub

### Build Stage

• Build React frontend Docker image  
• Build Go backend Docker image

### Registry Stage

• Authenticate with Docker Hub  
• Push frontend image  
• Push backend image

### Deployment Stage

• SSH into Application Server  
• Pull latest images  
• Recreate containers using Docker Compose

### Verification Stage

• Validate frontend accessibility  
• Validate backend health endpoint  
• Verify CRUD operations

---

# Infrastructure

### Jenkins Server

Responsible for:

• Running CI/CD pipelines  
• Building Docker images  
• Pushing images to Docker Hub  
• Deploying applications remotely

### Application Server

Responsible for:

• Running application containers  
• Hosting frontend service  
• Hosting backend service  
• Hosting MySQL database

---

# Project Outcomes

• Automated end-to-end deployment pipeline

• Containerized multi-tier application

• Remote deployment using Jenkins and SSH

• Docker image management through Docker Hub

• Infrastructure hosted on AWS EC2

• Practical implementation of DevOps CI/CD concepts

---

Automating software delivery from code commit to production deployment.
