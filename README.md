# JobTracker CI/CD Pipeline with Kubernetes

A production inspired DevOps project demonstrating an end to end CI/CD pipeline for deploying a multi tier application to Kubernetes using Jenkins, Docker, Docker Hub, and Minikube.

---

# Overview

JobTracker is a containerized web application consisting of a React frontend, Go backend, MySQL database, and Nginx reverse proxy.

The project demonstrates how modern DevOps teams automate software delivery using Jenkins pipelines and Kubernetes.

Whenever code is pushed to GitHub, Jenkins automatically builds Docker images, pushes them to Docker Hub, and deploys the latest version of the application to a Kubernetes cluster.

---

# Project Goals

This project demonstrates practical implementation of:

• CI/CD pipeline automation

• Docker image creation and version management

• Kubernetes Deployments and Services

• Container orchestration

• Rolling application updates

• Infrastructure automation

• Production style application deployment

---

# Architecture

> Insert architecture diagram here.

The deployment architecture consists of:

Developer

↓

GitHub

↓

Jenkins Pipeline

↓

Docker Hub

↓

Kubernetes Cluster (Minikube)

↓

Frontend

Backend

MySQL

Nginx

---

# CI/CD Pipeline

## Source Stage

• Pull latest source code from GitHub

## Build Stage

• Build React frontend Docker image

• Build Go backend Docker image

## Registry Stage

• Authenticate with Docker Hub

• Push frontend image

• Push backend image

## Approval Stage

• Manual deployment approval

## Deployment Stage

• Apply Kubernetes manifests

• Create or update Deployments

• Create or update Services

• Perform rolling updates automatically

---

# Kubernetes Architecture

The application runs inside a Kubernetes cluster using the following workloads.

## Frontend

Deployment

Replicas: 3

Service

ClusterIP

---

## Backend

Deployment

Replicas: 3

Service

ClusterIP

---

## MySQL

Deployment

Replicas: 1

Service

ClusterIP

---

## Nginx

Deployment

Replicas: 2

Service

NodePort

---

# Kubernetes Resources

The project includes Kubernetes manifests for:

• Deployments

• ReplicaSets (managed by Deployments)

• Pods

• Services

These manifests allow Kubernetes to automatically maintain the desired application state.

---

# Tech Stack

| Technology | Purpose                                          |
| ---------- | ------------------------------------------------ |
| GitHub     | Source Control                                   |
| Jenkins    | Continuous Integration and Continuous Deployment |
| Docker     | Containerization                                 |
| Docker Hub | Image Registry                                   |
| Kubernetes | Container Orchestration                          |
| Minikube   | Local Kubernetes Cluster                         |
| React      | Frontend                                         |
| Go         | Backend API                                      |
| Gin        | HTTP Framework                                   |
| MySQL      | Database                                         |
| Nginx      | Reverse Proxy                                    |
| Linux      | Host Operating System                            |

---

# Repository Structure

```
.
├── backend/
├── frontend/
├── kubernetes/
│   ├── frontend.yaml
│   ├── frontend-service.yaml
│   ├── backend.yaml
│   ├── backend-service.yaml
│   ├── mysql.yaml
│   ├── mysql-service.yaml
│   ├── nginx.yaml
│   └── nginx-service.yaml
├── Jenkinsfile
└── README.md
```

---

# Application Features

## Frontend

• Dashboard

• Create job applications

• Update job applications

• Delete job applications

• View application statistics

## Backend

• REST API built with Go and Gin

• CRUD operations

• MySQL integration

• Health endpoint

## Database

• Persistent MySQL storage

• Automatic schema creation using GORM

---

# Project Highlights

• Automated CI/CD pipeline using Jenkins

• Multi container application deployed on Kubernetes

• Docker image management using Docker Hub

• Kubernetes Deployments with multiple replicas

• Kubernetes Services for internal communication

• Rolling deployments using kubectl

• Infrastructure defined as code using Kubernetes manifests

---

# Future Improvements

• Deploy to Amazon EKS

• Configure Ingress Controller

• External DNS

• TLS using cert-manager

• ConfigMaps

• Kubernetes Secrets

• Horizontal Pod Autoscaler

• Monitoring using Prometheus and Grafana

• Centralized logging using Loki

---

# Learning Outcomes

Through this project I gained practical experience with:

• Jenkins Pipelines

• Docker image lifecycle

• Kubernetes Deployments

• ReplicaSets

• Pods

• Services

• Rolling updates

• Kubernetes networking

• CI/CD automation

• Container orchestration

---

Automating software delivery from code commit to Kubernetes deployment.
