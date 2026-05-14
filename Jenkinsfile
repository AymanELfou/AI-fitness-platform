pipeline {
    agent any

    tools {
        maven 'maven-3.9.6'
        jdk 'jdk-17'
        nodejs 'node-20'
    }

    environment {
        SONAR_SCANNER = tool 'sonar-scanner'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Backend Analysis (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh """
                        ${SONAR_SCANNER}/bin/sonar-scanner \
                        -Dsonar.projectKey=Smart-Trainer-Backend \
                        -Dsonar.sources=backend/src \
                        -Dsonar.java.binaries=backend/target/classes
                    """
                }
            }
        }

        stage('Build Frontend (Angular)') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Deploy with Docker Compose') {
    steps {
        
        withCredentials([
            string(credentialsId: 'smart-db-host', variable: 'DB_HOST'),
            string(credentialsId: 'smart-db-port', variable: 'DB_PORT'),
            string(credentialsId: 'smart-db-name', variable: 'DB_NAME'),
            string(credentialsId: 'smart-db-user', variable: 'DB_USER'),
            string(credentialsId: 'smart-db-pass', variable: 'DB_PASSWORD')
        ]) {
            script {
                
                sh """
                echo "DB_HOST=${DB_HOST}" > .env
                echo "DB_PORT=${DB_PORT}" >> .env
                echo "DB_NAME=${DB_NAME}" >> .env
                echo "DB_USER=${DB_USER}" >> .env
                echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
                
                
                docker compose up -d --build
                """
            }
        }
    }
}
    }
}
