# Setup Automático Completo - Portal ANAM

Este guia explica como configurar automaticamente a base de dados PostgreSQL e iniciar o backend do Portal ANAM.

## 🚀 Início Rápido

### Opção 1: Script Automático (Recomendado)

Execute o script que faz **TUDO automaticamente**:

```batch
cd portalmassinga\backend
SETUP-COMPLETO-AUTOMATICO.bat
```

Ou via PowerShell:

```powershell
cd portalmassinga\backend
.\SETUP-COMPLETO-AUTOMATICO.ps1
```

O script irá:
1. ✅ Detectar PostgreSQL instalado
2. ✅ Criar base de dados `ANAM` (se não existir)
3. ✅ Criar tabela `membros` para o formulário
4. ✅ Iniciar o backend Spring Boot

### Opção 2: Via pgAdmin (Manual)

Se preferir usar o pgAdmin diretamente:

1. **Abrir pgAdmin**
2. **Criar Base de Dados:**
   - Clique com botão direito em "Databases" > "Create" > "Database"
   - Nome: `ANAM`
   - Clique em "Save"

3. **Executar Script SQL:**
   - Clique com botão direito na base de dados `ANAM` > "Query Tool"
   - Abra o arquivo: `sql\create-database-anam.sql`
   - Execute o script (F5)

4. **Iniciar Backend:**
   ```batch
   cd portalmassinga\backend
   start-backend.bat
   ```

## 📋 Pré-requisitos

- ✅ PostgreSQL instalado (qualquer versão 12+)
- ✅ pgAdmin instalado (opcional, para visualização)
- ✅ Java JDK 17 ou superior
- ✅ Maven (ou usar o Maven Wrapper incluído)

## 🔧 Configuração

### Verificar Senha do PostgreSQL

O arquivo `application.properties` está configurado com:
- **Usuário:** `postgres`
- **Senha:** `santos133`
- **Base de Dados:** `ANAM`
- **Porta:** `5432`

Se sua senha for diferente, edite:
```
portalmassinga\backend\src\main\resources\application.properties
```

Altere a linha:
```properties
spring.datasource.password=sua_senha_aqui
```

## 📊 Estrutura da Tabela

A tabela `membros` contém os seguintes campos:

### Dados Pessoais (Obrigatórios)
- `nome_completo` - Nome completo
- `nome_pai` - Nome do pai
- `nome_mae` - Nome da mãe
- `data_nascimento` - Data de nascimento
- `estado_civil` - Estado civil
- `profissao` - Profissão
- `foto` - Foto (Base64 ou URL)

### Contatos (Obrigatórios)
- `celular` - Celular
- `email` - Email (único)
- `telefone` - Telefone (opcional)
- `rua` - Rua/Avenida
- `bairro` - Bairro
- `cidade` - Cidade

### Informações do Cônjuge (Opcional)
- `nome_conjuge`
- `data_nascimento_conjuge`
- `filiacao_pai_conjuge`
- `filiacao_mae_conjuge`

### Trabalho (Opcional)
- `local_trabalho`
- `cargo`
- `endereco_trabalho`
- `telefone_trabalho`

### Outros
- `outras_informacoes` - Texto livre
- `aceita_termos` - Aceitação de termos (boolean)
- `status` - Status: Pendente, Aprovado, Rejeitado
- `data_cadastro` - Data de cadastro (automático)
- `data_aprovacao` - Data de aprovação
- `observacoes` - Observações

## 🌐 Endpoints da API

Após iniciar o backend, a API estará disponível em:

- **Base URL:** `http://localhost:8080/api`

### Endpoints de Membros

- **POST** `/membros` - Criar novo membro
  ```json
  {
    "nomeCompleto": "João Silva",
    "nomePai": "José Silva",
    "nomeMae": "Maria Silva",
    "dataNascimento": "1990-01-01",
    "estadoCivil": "Solteiro",
    "profissao": "Engenheiro",
    "celular": "+244 923 456 789",
    "email": "joao@example.com",
    "rua": "Rua Principal",
    "bairro": "Centro",
    "cidade": "Luanda",
    "aceitaTermos": true
  }
  ```

- **GET** `/membros` - Listar todos os membros
- **GET** `/membros/{id}` - Buscar membro por ID
- **PUT** `/membros/{id}` - Atualizar membro
- **DELETE** `/membros/{id}` - Deletar membro

## 🔍 Verificação

### Verificar se PostgreSQL está rodando:
```powershell
Get-NetTCPConnection -LocalPort 5432
```

### Verificar se backend está rodando:
```powershell
Get-NetTCPConnection -LocalPort 8080
```

Ou acesse: http://localhost:8080/api/membros

### Verificar tabela no pgAdmin:
1. Abra pgAdmin
2. Conecte-se ao servidor PostgreSQL
3. Expanda: Servers > PostgreSQL > Databases > ANAM > Schemas > public > Tables
4. Você deve ver a tabela `membros`

## 🐛 Solução de Problemas

### Erro: "PostgreSQL não encontrado"
- Certifique-se de que o PostgreSQL está instalado
- Verifique se está em: `C:\Program Files\PostgreSQL\`

### Erro: "Falha na conexão"
- Verifique a senha do usuário `postgres`
- Certifique-se de que o serviço PostgreSQL está rodando
- Verifique se a porta 5432 está livre

### Erro: "Porta 8080 já está em uso"
- Feche outros processos usando a porta 8080
- Ou altere a porta no `application.properties`:
  ```properties
  server.port=8081
  ```

### Erro: "Tabela não criada"
- O Hibernate criará automaticamente ao iniciar o backend
- Ou execute manualmente o script SQL no pgAdmin

### Backend não inicia
- Verifique se o Java está instalado: `java -version`
- Verifique se o Maven está funcionando: `.\mvnw.cmd --version`
- Verifique os logs no console

## 📝 Notas Importantes

1. **Hibernate Auto-Update:** O `application.properties` está configurado com `spring.jpa.hibernate.ddl-auto=update`, o que significa que o Hibernate criará/atualizará as tabelas automaticamente se necessário.

2. **Senha:** Por segurança, não commite a senha do PostgreSQL no repositório. Use variáveis de ambiente em produção.

3. **Backup:** Sempre faça backup da base de dados antes de fazer alterações importantes.

## 🎯 Próximos Passos

Após configurar o backend:
1. Inicie o frontend (se ainda não iniciou)
2. Teste o formulário de tornar-se membro
3. Verifique os dados no pgAdmin

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend no console
2. Verifique os logs do PostgreSQL
3. Consulte a documentação do Spring Boot e PostgreSQL
