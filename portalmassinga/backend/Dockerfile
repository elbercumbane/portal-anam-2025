# Dockerfile para Backend Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Instalar Maven
RUN apk add --no-cache maven

# Copiar arquivos do projeto
COPY pom.xml .
COPY .mvn .mvn

# Baixar dependências (cache layer)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN mvn clean package -DskipTests

# Imagem final
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8081

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/api/health || exit 1

# Configurar encoding UTF-8
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8 -Duser.language=pt -Duser.country=BR"
ENV LANG=pt_BR.UTF-8
ENV LC_ALL=pt_BR.UTF-8

# Executar aplicação
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-Duser.language=pt", "-Duser.country=BR", "-jar", "app.jar"]
