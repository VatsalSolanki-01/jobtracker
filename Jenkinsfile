pipeline {
    agent any

    stages {

        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/VatsalSolanki-01/jobtracker.git'
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    docker build -t vatsalsolanki19/jobtracker-frontend:latest ./frontend
                '''
            }
        }

        stage('Backend Build') {
            steps {
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

        stage('Push Images') {
            steps {
                sh '''
                    docker push vatsalsolanki19/jobtracker-frontend:latest
                    docker push vatsalsolanki19/jobtracker-backend:latest
                '''
            }
        }

        stage('Manual Approval') {
            steps {
                input message: 'Images pushed successfully. Proceed with deployment?', ok: 'Deploy'
            }
        }

        stage('Deploy to Application Server') {
            steps {
                withCredentials([string(credentialsId: 'app-server-ip', variable: 'APP_IP')]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$APP_IP "
                            cd ~/jobtracker &&
                            docker compose pull &&
                            docker compose up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully'
        }
        failure {
            echo 'Pipeline failed - check logs'
        }
    }
}