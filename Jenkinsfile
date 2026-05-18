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

        stage('Deploy with Ansible (Preprod)') {
    steps {
        withCredentials([
            string(credentialsId: 'smart-db-host', variable: 'DB_HOST'),
            string(credentialsId: 'smart-db-port', variable: 'DB_PORT'),
            string(credentialsId: 'smart-db-name', variable: 'DB_NAME'),
            string(credentialsId: 'smart-db-user', variable: 'DB_USER'),
            string(credentialsId: 'smart-db-pass', variable: 'DB_PASSWORD')
        ]) {
            script {
                // Jenkins exécute le playbook Ansible en lui injectant l'environnement sécurisé
                sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy-playbook.yml'
            }
        }
    }
}
}
    }
}
