# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw.cmd .
COPY src src

RUN apk add --no-cache bash && \
    chmod +x mvnw.cmd

# Use Maven wrapper to build (skip tests)
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw.cmd -B package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
