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

       stage('Docker Build, Scan & Push') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'docker-hub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASSWORD'
        )]) {
            script {
                echo 'Construction de l\'image Docker Backend...'
                sh "docker build -t ${DOCKER_USER}/smart-trainer-backend:latest ./backend"

                echo 'Construction de l\'image Docker Frontend (Angular SSR)...'
                sh "docker build -t ${DOCKER_USER}/smart-trainer-frontend:latest ./frontend"


                echo '🛡️ Analyse de sécurité Trivy - Backend...'
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity CRITICAL --exit-code 1 ${DOCKER_USER}/smart-trainer-backend:latest"

                echo '🛡️ Analyse de sécurité Trivy - Frontend...'
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity CRITICAL --exit-code 1 ${DOCKER_USER}/smart-trainer-frontend:latest"


                sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USER} --password-stdin"

                echo 'Push de l\'image Backend sur Docker Hub...'
                sh "docker push ${DOCKER_USER}/smart-trainer-backend:latest"

                echo 'Push de l\'image Frontend sur Docker Hub...'
                sh "docker push ${DOCKER_USER}/smart-trainer-frontend:latest"
            }
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
                        sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy-playbook.yml'
                    }
                }
            }
        }

       stage('Deploy to Kubernetes (CD)') {
            steps {
                script {
                    echo "--- Début du Déploiement Continu sur Kubernetes ---"

                    sh 'curl -LO "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl"'
                    sh 'chmod +x ./kubectl'

                    withCredentials([file(credentialsId: 'k8s-kubeconfig', variable: 'KUBECONFIG')]) {

                        echo "--- Application des manifests Kubernetes ---"
                        sh './kubectl apply -f smart-trainer-k8s/backend-deployment.yaml'
                        sh './kubectl apply -f smart-trainer-k8s/backend-hpa.yaml'
                        sh './kubectl apply -f smart-trainer-k8s/frontend-deployment.yaml'

                        echo "--- Déclenchement du Rolling Update (Zéro coupure) ---"
                        sh './kubectl rollout restart deployment/backend-deployment'
                        sh './kubectl rollout restart deployment/frontend-deployment'

                        echo "--- Vérification de la stabilité du déploiement ---"
                        sh './kubectl rollout status deployment/backend-deployment --timeout=90s'
                    }

                    echo "--- Déploiement accompli avec succès ! ---"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            script {
                withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_URL')]) {
                    sh """
                        curl -X POST -H 'Content-type: application/json' \
                        --data '{"text":"✅ *Build Réussi !*\\n*Projet :* ${env.JOB_NAME}\\n*Build :* #${env.BUILD_NUMBER}\\n*Lien :* ${env.BUILD_URL}"}' \
                        \$SLACK_URL
                    """
                }
            }
        }

        failure {
            script {
                withCredentials([string(credentialsId: 'SLACK_WEBHOOK_URL', variable: 'SLACK_URL')]) {
                    sh """
                        curl -X POST -H 'Content-type: application/json' \
                        --data '{"text":"❌ *Le Build a Échoué...*\\n*Projet :* ${env.JOB_NAME}\\n*Build :* #${env.BUILD_NUMBER}\\n*Vérifie les logs ici :* ${env.BUILD_URL}console"}' \
                        \$SLACK_URL
                    """
                }
            }
        }
    }
}
