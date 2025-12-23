# Backend - Portal da Associação e Massinga

Backend API desenvolvido com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** com **Express**
- **TypeScript**
- **PostgreSQL** (banco de dados)
- **JWT** (autenticação)
- **bcryptjs** (hash de senhas)

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:4200
```

3. Criar banco de dados PostgreSQL:
```sql
CREATE DATABASE anam_portal;
```

4. Executar migrações (criar tabelas):
```bash
npm run db:migrate
```

5. Popular banco com dados iniciais:
```bash
npm run db:seed
```

## 🏃 Executar

### Desenvolvimento:
```bash
npm run dev
```

### Produção:
```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual (requer autenticação)

### Candidaturas de Membros
- `POST /api/member-applications` - Criar candidatura (público)
- `GET /api/member-applications` - Listar candidaturas (autenticado)
- `GET /api/member-applications/:id` - Buscar candidatura por ID
- `PUT /api/member-applications/:id/approve` - Aprovar candidatura (admin)
- `PUT /api/member-applications/:id/reject` - Rejeitar candidatura (admin)

### Membros
- `GET /api/members` - Listar membros (autenticado)
- `GET /api/members/:id` - Buscar membro por ID
- `PUT /api/members/:id` - Atualizar membro
- `DELETE /api/members/:id` - Desativar membro (admin)

### Health Check
- `GET /health` - Verificar status do servidor e banco de dados

## 🔐 Autenticação

As rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer <token>
```

## 👤 Usuários Padrão (após seed)

- **Admin**: `admin@anam.org` / `admin123`
- **Membro**: `guilherme@gmail.com` / `membro123`
- **Membro**: `maria@gmail.com` / `membro123`

## 📊 Estrutura do Banco de Dados

O banco de dados inclui as seguintes tabelas:
- `users` - Usuários do sistema
- `member_applications` - Candidaturas de membros
- `members` - Membros aprovados
- `dependents` - Dependentes dos membros
- `payments` - Pagamentos/cotas
- `projects` - Projetos disponíveis
- `project_applications` - Candidaturas a projetos
- `partners` - Parceiros
- `treasury` - Tesouraria (receitas e despesas)

## 🔄 Fluxo de Candidatura

1. Usuário preenche formulário de candidatura (`POST /api/member-applications`)
2. Candidatura é salva com status "Pendente"
3. Admin visualiza candidaturas pendentes no dashboard
4. Admin aprova candidatura (`PUT /api/member-applications/:id/approve`)
5. Sistema cria automaticamente:
   - Registro na tabela `members`
   - Usuário na tabela `users` (senha padrão: `membro123`)
6. Membro pode fazer login e acessar área de membros

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em produção
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:seed` - Popula banco com dados iniciais
