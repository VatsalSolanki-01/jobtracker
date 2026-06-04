pipeline {
    agent any

    stages {
        stage('checkout scm') {
            steps {
                git branch: 'main', url: 'https://github.com/VatsalSolanki-01/jobtracker.git'
            }
        }
        stage('frontend-build'){
            steps{
                sh '''
                    docker build -t vatsalsolanki19/jobtracker-frontend:latest ./frontend 
                '''
            }
        }
        stage('backend-build'){
            steps{
                sh '''
                    docker build -t vatsalsolanki19/jobtracker-backend:latest ./backend 
                '''
            }
        }
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                sh 'docker push vatsalsolanki19/jobtracker-frontend:latest'
                sh 'docker push vatsalsolanki19/jobtracker-backend:latest'
            }
        }
        stage('deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}