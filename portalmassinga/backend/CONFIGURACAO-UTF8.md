# Configuração UTF-8 para Suporte a Acentos e Caracteres Especiais

Este documento descreve todas as configurações implementadas para garantir suporte completo a UTF-8 e caracteres especiais (acentos, ç, etc.) em todo o sistema.

## ✅ Configurações Implementadas

### 1. Base de Dados PostgreSQL

- **Encoding do Banco**: UTF-8 (verificado e confirmado)
- **Encoding do Servidor**: UTF-8
- **Locale**: pt_BR.UTF-8 (configurado no Docker Compose)

### 2. Docker Compose (PostgreSQL)

```yaml
environment:
  POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=pt_BR.UTF-8"
  LANG: pt_BR.UTF-8
  LC_ALL: pt_BR.UTF-8
```

### 3. Spring Boot - application.properties

```properties
# Encoding UTF-8 para HTTP
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
spring.http.encoding.force=true
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
spring.messages.encoding=UTF-8

# Encoding UTF-8 para JDBC
spring.datasource.url=jdbc:postgresql://localhost:5432/anam?useUnicode=true&characterEncoding=UTF-8&stringtype=unspecified
spring.datasource.hikari.connection-init-sql=SET NAMES 'UTF8'

# Encoding UTF-8 para Hibernate
spring.jpa.properties.hibernate.connection.characterEncoding=UTF-8
spring.jpa.properties.hibernate.connection.useUnicode=true
spring.jpa.properties.hibernate.connection.CharSet=UTF-8
```

### 4. Docker Compose (Backend Spring Boot)

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/anam?useUnicode=true&characterEncoding=UTF-8&stringtype=unspecified
  SPRING_HTTP_ENCODING_CHARSET: UTF-8
  SPRING_HTTP_ENCODING_ENABLED: true
  SPRING_HTTP_ENCODING_FORCE: true
  JAVA_TOOL_OPTIONS: -Dfile.encoding=UTF-8 -Duser.language=pt -Duser.country=BR
```

### 5. Dockerfile (Backend)

```dockerfile
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8 -Duser.language=pt -Duser.country=BR"
ENV LANG=pt_BR.UTF-8
ENV LC_ALL=pt_BR.UTF-8

ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-Duser.language=pt", "-Duser.country=BR", "-jar", "app.jar"]
```

### 6. WebConfig.java (Backend)

- `CharacterEncodingFilter` configurado para forçar UTF-8 em todas as requisições/respostas
- `StringHttpMessageConverter` configurado com `StandardCharsets.UTF_8`

### 7. Frontend Angular

- **index.html**: `<meta charset="UTF-8">` e `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`
- **api-client.service.ts**: Headers HTTP com `Content-Type: application/json; charset=UTF-8`

## 🔍 Como Verificar

### Verificar Encoding do Banco de Dados

```sql
-- Verificar encoding do banco
SELECT datname, pg_encoding_to_char(encoding) FROM pg_database WHERE datname = 'anam';

-- Verificar encoding do servidor
SHOW server_encoding;

-- Verificar encoding do cliente
SHOW client_encoding;
```

### Testar com Caracteres Especiais

Teste inserindo dados com acentos:
- "Associação"
- "São"
- "José"
- "Apoiante"
- "Simpatizante"
- "Desenvolvimento"

## 📝 Notas Importantes

1. **Todas as tabelas herdam o encoding do banco de dados**
   - Se o banco está em UTF-8, todas as tabelas também estarão

2. **PostgreSQL usa UTF-8 por padrão**
   - Não é necessário especificar encoding por tabela ou coluna

3. **Reiniciar serviços após mudanças**
   - Após alterar configurações, reinicie o backend e o PostgreSQL:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## ✅ Status

- ✅ Banco de dados PostgreSQL: UTF-8
- ✅ Spring Boot: UTF-8 configurado
- ✅ Docker Compose: UTF-8 configurado
- ✅ Dockerfile: UTF-8 configurado
- ✅ WebConfig: UTF-8 configurado
- ✅ Frontend: UTF-8 configurado

Todas as configurações estão implementadas e prontas para suportar acentos e caracteres especiais!
