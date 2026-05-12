pipeline {
    agent any
    
    tools {
        maven 'maven-3.9.6' 
        jdk 'jdk-17'       
    }

    environment {
        SONAR_SCANNER = tool 'sonar-scanner'
        DOCKER_HUB_USER = 'ton_username_docker' // Optionnel pour l'instant
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Analysis (SonarQube)') {
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh "${SONAR_SCANNER}/bin/sonar-scanner \
                    -Dsonar.projectKey=Smart-Trainer-Backend \
                    -Dsonar.sources=backend/src \
                    -Dsonar.java.binaries=backend/target/classes"
                }
            }
        }

        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (Angular)') {
            steps {
                dir('frontend') {
                    // On suppose que Node/NPM sont installés sur la VM ou via Docker
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Relance tes conteneurs avec les nouveaux builds
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }
    }
}
