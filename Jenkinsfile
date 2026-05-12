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
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }
    }
}
