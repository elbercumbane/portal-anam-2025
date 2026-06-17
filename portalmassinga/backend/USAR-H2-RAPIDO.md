# Usar H2 Database (Rápido, Sem Instalação)

## 🚀 Solução Rápida para Desenvolvimento

O H2 Database é um banco de dados Java puro que funciona como arquivo local. **Não requer instalação** e é perfeito para desenvolvimento!

## ✅ Vantagens do H2

- ✅ **Sem instalação** - Funciona imediatamente
- ✅ **Muito rápido** - Banco em arquivo local
- ✅ **Compatível com PostgreSQL** - Migração fácil depois
- ✅ **Interface web** - Visualize dados em http://localhost:8080/api/h2-console

## 🔧 Como Usar H2 (Modo Rápido)

### Opção 1: Automático (Recomendado)

O backend já está configurado para usar H2 automaticamente se PostgreSQL não estiver disponível!

1. **Inicie o backend:**
   ```bash
   cd portalmassinga/backend
   .\mvnw.cmd spring-boot:run
   ```

2. **O Spring Boot vai:**
   - Tentar conectar ao PostgreSQL primeiro
   - Se falhar, usar H2 automaticamente
   - Criar a tabela `membros` automaticamente

3. **Pronto!** A aplicação está funcionando!

### Opção 2: Forçar H2 Manualmente

Edite `src/main/resources/application.properties` e comente as linhas do PostgreSQL:

```properties
# Comentar estas linhas:
# spring.datasource.url=jdbc:postgresql://localhost:5432/ANAM
# spring.datasource.username=postgres
# spring.datasource.password=santos133
# spring.datasource.driver-class-name=org.postgresql.Driver

# Descomentar estas linhas:
spring.datasource.url=jdbc:h2:file:./data/anam;AUTO_SERVER=TRUE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

## 📊 Visualizar Dados no H2 Console

1. Inicie o backend
2. Acesse: http://localhost:8080/api/h2-console
3. Preencha:
   - JDBC URL: `jdbc:h2:file:./data/anam`
   - Username: `sa`
   - Password: (deixe vazio)
4. Clique em "Connect"
5. Execute queries SQL:
   ```sql
   SELECT * FROM membros;
   ```

## 📁 Onde os Dados São Salvos

Os dados são salvos em:
```
portalmassinga/backend/data/anam.mv.db
```

Este arquivo contém todos os dados do banco H2.

## 🔄 Migrar para PostgreSQL Depois

Quando quiser migrar para PostgreSQL:

1. Instale o PostgreSQL
2. Crie a base de dados `ANAM`
3. Execute o script SQL: `sql/create-database-anam.sql`
4. Altere o `application.properties` para usar PostgreSQL
5. Os dados do H2 podem ser exportados e importados no PostgreSQL

## ✅ Testar Agora

1. Inicie o backend:
   ```bash
   cd portalmassinga/backend
   .\mvnw.cmd spring-boot:run
   ```

2. Inicie o frontend:
   ```bash
   cd portalmassinga/frontend
   npm start
   ```

3. Acesse o formulário de cadastro e teste!

**Tudo funciona imediatamente sem precisar instalar PostgreSQL!** 🎉
