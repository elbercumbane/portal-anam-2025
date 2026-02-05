# 🚀 Passo a Passo - Setup Completo Portal ANAM

## 📋 Guia Rápido para Novo Desenvolvedor

Este guia fornece instruções passo a passo para configurar o ambiente de desenvolvimento do Portal ANAM do zero.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [ ] **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- [ ] **Java JDK 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- [ ] **Node.js 18+** e **npm** ([Download](https://nodejs.org/))
- [ ] **Git** ([Download](https://git-scm.com/downloads))
- [ ] **IDE** (VS Code, IntelliJ IDEA, ou Eclipse)

---

## 📦 Passo 1: Clonar/Obter o Projeto

```bash
# Se o projeto já estiver na sua máquina, pule este passo
cd "C:\Users\Elber Elizio\Desktop\portal ANAM"
```

---

## 🗄️ Passo 2: Configurar PostgreSQL

### 2.1. Verificar se PostgreSQL está Instalado

**Windows PowerShell:**
```powershell
Get-Service -Name postgresql*
```

Se não estiver instalado, siga o guia: `INSTALAR-POSTGRESQL.md`

### 2.2. Verificar se PostgreSQL está Rodando

```powershell
# Verificar porta 5432
netstat -an | findstr 5432
```

Se não estiver rodando:
```powershell
# Iniciar serviço PostgreSQL
Start-Service postgresql-x64-XX  # Substitua XX pela versão
```

### 2.3. Criar Base de Dados

**Opção A: Via pgAdmin4 (Recomendado para iniciantes)**

1. Abra **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL (senha padrão geralmente é a que você definiu na instalação)
3. Clique com botão direito em **"Databases"** → **"Create"** → **"Database..."**
4. Preencha:
   - **Name:** `anam2025`
   - **Owner:** `postgres`
   - **Encoding:** `UTF8`
5. Clique em **"Save"**

**Opção B: Via Linha de Comando**

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar base de dados
CREATE DATABASE anam2025
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

# Sair
\q
```

**Opção C: Via Script Automático**

```bash
cd "portal-anam-2025\portalmassinga\backend\sql"
psql -U postgres -f create-database-anam2025.sql
```

---

## 🏗️ Passo 3: Criar Tabelas na Base de Dados

### 3.1. Executar Script Completo (Recomendado)

```bash
cd "portal-anam-2025\portalmassinga\backend\sql"
psql -U postgres -d anam2025 -f SCRIPT-SETUP-COMPLETO.sql
```

**Ou via pgAdmin4:**
1. Conecte-se à base de dados `anam2025`
2. Clique com botão direito → **"Query Tool"**
3. Abra o arquivo `SCRIPT-SETUP-COMPLETO.sql`
4. Execute (F5 ou botão "Execute")

### 3.2. Verificar se Tabelas Foram Criadas

```sql
-- Executar no pgAdmin4 Query Tool ou psql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Deve mostrar:**
- `apoiantes`
- `application_dependents`
- `home_content`
- `member_applications`
- `membros`
- `simpatizantes`

---

## ⚙️ Passo 4: Configurar Backend

### 4.1. Editar application.properties

**Arquivo:** `portal-anam-2025\portalmassinga\backend\src\main\resources\application.properties`

```properties
# ============================================
# CONFIGURAÇÃO DA BASE DE DADOS
# ============================================
spring.datasource.url=jdbc:postgresql://localhost:5432/anam2025
spring.datasource.username=postgres
spring.datasource.password=elber123  # ⚠️ ALTERE SE SUA SENHA FOR DIFERENTE
spring.datasource.driver-class-name=org.postgresql.Driver

# Configurações JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate  # Não criar tabelas automaticamente
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# ============================================
# CONFIGURAÇÃO DO SERVIDOR
# ============================================
server.port=8081
server.servlet.context-path=/api

# ============================================
# ENCODING UTF-8
# ============================================
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
```

**⚠️ IMPORTANTE:** Altere a senha (`spring.datasource.password`) se sua senha do PostgreSQL for diferente de `elber123`.

### 4.2. Verificar Dependências Maven

```bash
cd "portal-anam-2025\portalmassinga\backend"
.\mvnw.cmd dependency:resolve
```

---

## 🚀 Passo 5: Iniciar Backend

### 5.1. Compilar o Projeto

```bash
cd "portal-anam-2025\portalmassinga\backend"
.\mvnw.cmd clean install -DskipTests
```

### 5.2. Iniciar Backend

**Opção A: Via Script (Recomendado)**
```bash
# Windows
.\iniciar-backend-window.bat

# PowerShell
.\iniciar-backend.ps1
```

**Opção B: Manualmente**
```bash
.\mvnw.cmd spring-boot:run
```

### 5.3. Verificar se Backend Está Rodando

1. Abra o navegador
2. Acesse: `http://localhost:8081/api/home-content`
3. Deve retornar JSON (pode estar vazio `[]` inicialmente)

**Ou via PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/api/home-content" -Method GET
```

---

## 🎨 Passo 6: Configurar Frontend

### 6.1. Instalar Dependências

```bash
cd "portal-anam-2025\portalmassinga\frontend"
npm install
```

### 6.2. Verificar Configuração da API

**Arquivo:** `frontend/src/environments/environment.ts` ou `environment.development.ts`

Verifique se está configurado:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'  // Deve apontar para o backend
};
```

### 6.3. Iniciar Frontend

```bash
cd "portal-anam-2025\portalmassinga\frontend"
npm start
# ou
ng serve
```

O frontend deve iniciar em: `http://localhost:4200` ou `http://localhost:4201`

---

## 🧪 Passo 7: Testar Sistema

### 7.1. Testar Backend

```bash
# Testar endpoint de listagem
curl http://localhost:8081/api/home-content

# Ou via PowerShell
Invoke-RestMethod -Uri "http://localhost:8081/api/home-content" -Method GET
```

### 7.2. Testar Frontend

1. Acesse: `http://localhost:4201` (ou porta configurada)
2. A página inicial deve carregar
3. Acesse: `http://localhost:4201/dashboard`
4. Faça login (se necessário)
5. Navegue até "Gestão de Conteúdo" → "Página Inicial"

### 7.3. Testar Criação de Conteúdo

1. No dashboard, abra um slide do Hero
2. Digite algum texto
3. Clique em "Salvar Slide"
4. Verifique se aparece mensagem de sucesso
5. Recarregue a página inicial e verifique se o conteúdo aparece

---

## 📝 Passo 8: Inicializar Conteúdo Padrão (Opcional)

Se quiser ter conteúdo inicial na base de dados:

```bash
cd "portal-anam-2025\portalmassinga\backend\sql"
psql -U postgres -d anam2025 -f initialize-home-content.sql
```

---

## 🔧 Passo 9: Resolver Problemas Comuns

### Problema: Backend não inicia - Erro de conexão à BD

**Solução:**
1. Verificar se PostgreSQL está rodando
2. Verificar credenciais no `application.properties`
3. Verificar se a base de dados existe:
   ```sql
   SELECT datname FROM pg_database WHERE datname = 'anam2025';
   ```

### Problema: Erro 404 ao acessar API

**Solução:**
1. Verificar se backend está rodando na porta 8081
2. Verificar se o `context-path` está correto (`/api`)
3. Testar: `http://localhost:8081/api/home-content`

### Problema: Frontend não conecta ao backend

**Solução:**
1. Verificar `apiUrl` no `environment.ts`
2. Verificar CORS no backend (deve estar configurado)
3. Verificar se backend está rodando

### Problema: Erro ao salvar imagens (400 Bad Request)

**Solução:**
```bash
# Executar migração da coluna image_url
cd "portal-anam-2025\portalmassinga\backend\sql"
psql -U postgres -d anam2025 -f alter-image-url-to-text.sql

# Ou via API
POST http://localhost:8081/api/home-content/migrate-image-url
```

---

## 📚 Próximos Passos

Após concluir o setup:

1. ✅ Leia: `GUIA-COMPLETO-BASE-DADOS.md` para entender a estrutura
2. ✅ Explore o dashboard em `http://localhost:4201/dashboard`
3. ✅ Teste criar e editar conteúdo
4. ✅ Leia: `INSTRUCOES-PARAMETRIZACAO.md` para entender como parametrizar

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do backend no console
2. Verifique os logs do frontend no console do navegador (F12)
3. Consulte: `GUIA-COMPLETO-BASE-DADOS.md` → Seção Troubleshooting
4. Verifique se todas as tabelas foram criadas corretamente

---

**Boa sorte! 🚀**
