# Instruções para Configurar o Backend Spring Boot

## 📋 Passo a Passo

### 1. Criar a Base de Dados no pgAdmin4

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **"Databases"**
4. Selecione **"Create"** > **"Database..."**
5. No campo **"Database"**, digite: `anam`
6. Clique em **"Save"**

### 2. Executar o Script SQL

1. No pgAdmin4, clique com botão direito na base de dados **"anam"** que acabou de criar
2. Selecione **"Query Tool"**
3. Abra o arquivo `sql/create-database-anam.sql` (ou copie e cole o conteúdo)
4. Clique no botão **"Execute"** (ou pressione F5)
5. Verifique se as tabelas foram criadas:
   - `member_applications`
   - `application_dependents`

### 3. Configurar a Aplicação Spring Boot

1. Edite o arquivo `src/main/resources/application.properties`
2. Ajuste as credenciais do PostgreSQL conforme seu ambiente:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/anam
spring.datasource.username=postgres
spring.datasource.password=sua_senha_aqui
```

### 4. Compilar e Executar

Abra o terminal na pasta `backend` e execute:

```bash
# Windows (PowerShell)
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run
```

### 5. Testar a API

A aplicação estará rodando em: `http://localhost:8080/api`

Para testar, use Postman/Insomnia e os endpoints descritos no `README.md` (ex.: `POST /api/member-applications`).

## ✅ Verificação

Para verificar se tudo está funcionando:

1. A aplicação inicia sem erros
2. As tabelas existem no banco de dados
3. É possível criar uma candidatura via API
4. É possível listar as candidaturas via GET

## 🐛 Problemas Comuns

### Erro de conexão com o banco
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no `application.properties`
- Verifique se a base de dados `anam` foi criada

### Erro de tabela não encontrada
- Execute o script SQL novamente
- Verifique se está conectado à base de dados correta

### Erro de porta em uso
- Altere a porta no `application.properties`: `server.port=8081`

