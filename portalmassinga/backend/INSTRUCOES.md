# Instruções para Configurar o Backend Spring Boot

## 📋 Passo a Passo

### 1. Conectar pgAdmin 4 e criar a base (se ainda não existir)

- **Conexão completa (ver também `CONECTAR-PGADMIN.md`):** Host `localhost`, Porta `5432`, Base `anam2025`, Utilizador `postgres`, Password (a mesma do `application.properties`).

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL (localhost:5432, user postgres)
3. Se a base **anam2025** ainda não existir: botão direito em **"Databases"** → **Create** → **Database...** → nome: `anam2025` → **Save**

### 2. Executar o Script SQL (se as tabelas ainda não existirem)

1. No pgAdmin4, clique com botão direito na base de dados **"anam2025"**
2. Selecione **"Query Tool"**
3. Abra o arquivo `sql/create-database-anam2025.sql` (ou copie e cole o conteúdo)
4. Clique no botão **"Execute"** (ou pressione F5)
5. Verifique se as tabelas foram criadas:
   - `member_applications`
   - `application_dependents`

### 3. Configurar a Aplicação Spring Boot

1. Edite o arquivo `src/main/resources/application.properties`
2. Ajuste as credenciais do PostgreSQL conforme seu ambiente:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/anam2025
spring.datasource.username=postgres
spring.datasource.password=sua_senha_aqui
```

### 4. Levantar o backend

Na pasta `backend`, execute:

```bash
.\mvnw.cmd spring-boot:run
```

O `mvnw.cmd` detecta automaticamente o JDK (17+) em locais comuns se `JAVA_HOME` não estiver definido. No Linux/Mac use `./mvnw spring-boot:run`.

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

### Backend não encontra o Java (JAVA_HOME)
- O projeto precisa de **JDK 17 ou superior** (ex.: [Eclipse Temurin](https://adoptium.net/)).
- O **`mvnw.cmd`** procura o Java em pastas comuns (`C:\Program Files\Java\jdk-*`, Eclipse Adoptium, Microsoft). Se não encontrar, defina **JAVA_HOME** manualmente:
  - **Windows:** Definições → Sistema → Variáveis de ambiente → Nova → Nome: `JAVA_HOME`, Valor: pasta do JDK (ex.: `C:\Program Files\Java\jdk-17`).
  - Na sessão atual (CMD): `set "JAVA_HOME=C:\Program Files\Java\jdk-17"` e depois `.\mvnw.cmd spring-boot:run`.

### Erro de conexão com o banco
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no `application.properties`
- Verifique se a base de dados `anam2025` foi criada

### Erro de tabela não encontrada
- Execute o script SQL novamente
- Verifique se está conectado à base de dados correta

### Erro de porta em uso
- Altere a porta no `application.properties`: `server.port=8081`

