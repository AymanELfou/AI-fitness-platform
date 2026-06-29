FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# On copie directement le JAR généré par Jenkins dans le workspace
COPY target/*.jar app.jar

# Alignement sur le port configuré dans ton cluster K8s
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
