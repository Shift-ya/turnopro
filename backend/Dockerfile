FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY vite.config.ts tsconfig.json ./
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src
COPY --from=frontend-build /frontend/dist ./src/main/resources/static

RUN mvn -q -DskipTests clean package

FROM gcr.io/distroless/java21-debian12:nonroot AS runtime
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dserver.address=0.0.0.0", "-Djava.net.preferIPv4Stack=false", "-jar", "/app/app.jar"]