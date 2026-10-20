# Portal ANAM - Backend Spring Boot

Backend desenvolvido com Spring Boot e Java para o Portal da Associação ANAM.

## 🚀 Tecnologias

- **Spring Boot 3.2.0**
- **Java 17**
- **PostgreSQL**
- **Spring Data JPA**
- **Lombok**

## 📋 Pré-requisitos

- Java 17 ou superior
- Maven 3.6+
- PostgreSQL 12+
- pgAdmin4 (opcional, para gerenciar o banco)

## 🔧 Configuração

### 1. Criar a Base de Dados no PostgreSQL

#### Opção A: Via pgAdmin4
1. Abra o pgAdmin4
2. Clique com botão direito em "Databases"
3. Selecione "Create" > "Database"
4. Nome: `anam2025`
5. Clique em "Save"

#### Opção B: Via SQL
```sql
CREATE DATABASE anam2025;
```

### 2. Executar o Script SQL

1. No pgAdmin4, conecte-se à base de dados `anam2025`
2. Abra o arquivo `sql/create-database-anam2025.sql`
3. Execute o script completo (F5 ou botão Execute)

Ou via linha de comando:
```bash
psql -U postgres -d anam2025 -f sql/create-database-anam2025.sql
```

### 3. Configurar as Propriedades da Aplicação

Edite o arquivo `src/main/resources/application.properties` e ajuste as credenciais do PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/anam2025
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 4. Compilar e Executar

```bash
# Windows (PowerShell) - dentro da pasta backend/
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run

# Windows (CMD) - dentro da pasta backend/
mvnw.cmd clean install
mvnw.cmd spring-boot:run

# Linux/Mac - dentro da pasta backend/
./mvnw clean install
./mvnw spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080/api`

## 📡 Endpoints da API

### Candidaturas de Membros

- **POST** `/api/member-applications` - Criar nova candidatura
- **GET** `/api/member-applications` - Listar todas as candidaturas
- **GET** `/api/member-applications?status=Pendente` - Filtrar por status
- **GET** `/api/member-applications/{id}` - Buscar candidatura por ID
- **PUT** `/api/member-applications/{id}/approve` - Aprovar candidatura
- **PUT** `/api/member-applications/{id}/reject` - Rejeitar candidatura

## 📝 Exemplo de Requisição

### Criar Candidatura

```json
POST /api/member-applications
Content-Type: application/json

{
  "photo": "base64_encoded_image_or_url",
  "fullName": "João Silva",
  "fatherName": "José Silva",
  "motherName": "Maria Silva",
  "birthDate": "1990-01-15",
  "maritalStatus": "Solteiro",
  "profession": "Engenheiro",
  "mobilePhone": "+258 84 123 4567",
  "email": "joao@email.com",
  "phone": "+258 21 123 456",
  "street": "Avenida Principal",
  "neighborhood": "Centro",
  "city": "Maputo",
  "spouseName": "Ana Silva",
  "spouseBirthDate": "1992-05-20",
  "spouseFatherName": "Carlos Silva",
  "spouseMotherName": "Sofia Silva",
  "dependents": [
    {
      "name": "Pedro Silva",
      "relationship": "child",
      "profession": "Estudante",
      "age": 10
    }
  ],
  "workplace": "Empresa XYZ",
  "position": "Engenheiro Sênior",
  "workAddress": "Rua do Trabalho, 123",
  "workPhone": "+258 21 987 654",
  "additionalInformation": "Informações adicionais",
  "acceptsTerms": true
}
```

## 🗂️ Estrutura do Projeto

```
backend-spring/
├── src/
│   ├── main/
│   │   ├── java/com/anam/
│   │   │   ├── PortalAnamApplication.java
│   │   │   ├── controller/
│   │   │   │   └── MemberApplicationController.java
│   │   │   ├── dto/
│   │   │   │   └── MemberApplicationDTO.java
│   │   │   ├── entity/
│   │   │   │   ├── MemberApplication.java
│   │   │   │   └── ApplicationDependent.java
│   │   │   └── repository/
│   │   │       ├── MemberApplicationRepository.java
│   │   │       └── ApplicationDependentRepository.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── sql/
│   └── create-database-anam.sql
├── pom.xml
└── README.md
```

## 🔍 Validações

A aplicação valida automaticamente:
- Campos obrigatórios
- Formato de email
- Tipos de dados
- Relacionamentos entre entidades

## 📌 Notas

- A tabela `member_applications` armazena as candidaturas
- A tabela `application_dependents` armazena os dependentes de cada candidatura
- Todas as colunas estão em inglês
- O status padrão é "Pending" (Pendente, Approved, Rejected)
- A data de cadastro (`created_at`) é preenchida automaticamente

## 🛠️ Desenvolvimento

Para desenvolvimento com hot-reload, use:

```bash
mvn spring-boot:run
```

O Spring Boot DevTools está configurado para recarregar automaticamente as mudanças.

