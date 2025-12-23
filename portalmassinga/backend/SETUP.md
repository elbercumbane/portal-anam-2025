# 🚀 Guia Rápido de Configuração

## Passo a Passo para Configurar o Backend

### 1. Instalar PostgreSQL

Certifique-se de que o PostgreSQL está instalado e rodando:
- Windows: Baixe de https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql` ou baixe do site oficial
- Linux: `sudo apt-get install postgresql`

### 2. Criar Arquivo .env

Copie o arquivo de exemplo e configure:
```bash
cp env.example.txt .env
```

Edite o `.env` com suas credenciais do PostgreSQL:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Inicializar Banco de Dados

Este comando cria o database e todas as tabelas automaticamente:
```bash
npm run db:init
```

### 5. Popular com Dados Iniciais

Cria usuários padrão para teste:
```bash
npm run db:seed
```

### 6. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## ✅ Verificar se Está Funcionando

Acesse: `http://localhost:3000/health`

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 🔐 Usuários Padrão (após seed)

- **Admin**: `admin@anam.org` / `admin123`
- **Membro**: `guilherme@gmail.com` / `membro123`
- **Membro**: `maria@gmail.com` / `membro123`

## 📡 Testar API

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anam.org","password":"admin123"}'
```

### Criar Candidatura:
```bash
curl -X POST http://localhost:3000/api/member-applications \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "nome_pai": "Pedro Silva",
    "nome_mae": "Maria Silva",
    "data_nascimento": "1990-01-01",
    "estado_civil": "Solteiro",
    "profissao": "Engenheiro",
    "celular": "+258841234567",
    "email": "joao@example.com",
    "rua": "Rua Principal",
    "bairro": "Centro",
    "cidade": "Maputo",
    "aceita_termos": true
  }'
```

## 🔄 Fluxo Completo

1. ✅ Backend configurado e rodando
2. ✅ Candidatura criada via API (ou frontend)
3. ✅ Admin aprova candidatura no dashboard
4. ✅ Sistema cria automaticamente:
   - Membro na tabela `members`
   - Usuário na tabela `users` (senha: `membro123`)
5. ✅ Membro pode fazer login e acessar área de membros

## 🆘 Problemas Comuns

### Erro: "database does not exist"
- Execute `npm run db:init` novamente

### Erro: "password authentication failed"
- Verifique as credenciais no arquivo `.env`

### Erro: "port already in use"
- Altere a porta no `.env` ou pare o processo que está usando a porta 3000

### Erro ao conectar ao PostgreSQL
- Verifique se o PostgreSQL está rodando
- Windows: Serviços → PostgreSQL
- Mac/Linux: `sudo service postgresql status`

