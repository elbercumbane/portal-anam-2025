# Portal da Associação e Massinga

Portal web completo da Associação e Massinga com frontend Angular e backend API.

## 📁 Estrutura do Projeto

```
portalmassinga/
├── frontend/          # Aplicação Angular (Frontend)
│   ├── src/          # Código fonte do Angular
│   ├── public/       # Assets públicos
│   ├── angular.json  # Configuração do Angular
│   └── package.json  # Dependências do frontend
├── backend/          # API Backend (a implementar)
│   ├── src/          # Código fonte do backend
│   └── package.json  # Dependências do backend
└── README.md         # Este arquivo
```

## 🖥️ Compatibilidade

Este projeto é compatível com:
- ✅ **Windows** (Windows 10/11)
- ✅ **macOS** (todas as versões suportadas)
- ✅ **Linux** (Ubuntu, CentOS, etc.)

## 📋 Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** (incluído com Node.js)
- **Git** (para controle de versão)

### Instalação do Node.js:
1. Acesse [https://nodejs.org/](https://nodejs.org/)
2. Baixe a versão LTS (recomendada)
3. Execute o instalador e siga as instruções

## 🚀 Instalação e Execução

### 1. Instalar Dependências

#### Frontend
```bash
cd frontend
npm install
```

#### Backend (quando implementado)
```bash
cd backend
npm install
```

### 2. Executar Aplicação

#### Frontend (Desenvolvimento)
```bash
cd frontend
npm start
```
A aplicação estará disponível em: **http://localhost:4200**

#### Backend (quando implementado)
```bash
cd backend
npm run dev
```

## 📁 Estrutura Detalhada

### Frontend (`frontend/`)
- **Angular 18.2.21** - Framework frontend
- **Angular Material** - Componentes UI
- **TypeScript** - Linguagem
- **SCSS** - Estilos

### Backend (`backend/`)
- **A implementar** - API RESTful
- Sugestões: Node.js + Express ou NestJS
- Banco de dados: MongoDB ou PostgreSQL

## 🛠️ Scripts Disponíveis

### Frontend
```bash
cd frontend

npm start              # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm test              # Executa testes
npm run lint          # Linting do código
```

### Backend
```bash
cd backend

npm run dev           # Inicia servidor de desenvolvimento
npm run build         # Compila TypeScript
npm test             # Executa testes
```

## 🔧 Resolução de Problemas

### Erro: "node não é reconhecido"
- Reinstale o Node.js do site oficial
- Verifique se o PATH está configurado corretamente
- Reinicie o terminal

### Erro de permissão durante npm install
- Execute o terminal como Administrador (Windows)
- Ou execute: `npm install --force`

### Problemas com dependências
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

## 📚 Tecnologias Utilizadas

### Frontend
- **Angular** 18.2.0
- **Angular Material** 18.2.14
- **GSAP** 3.13.0 (animações)
- **TypeScript** 5.5.2
- **SCSS** para estilos

### Backend
- **A definir** (sugerido: Node.js + Express/NestJS)

## 📝 Próximos Passos

1. ✅ Estrutura do projeto organizada
2. ⏳ Implementar backend API
3. ⏳ Configurar banco de dados
4. ⏳ Implementar autenticação
5. ⏳ Integrar frontend com backend

## 📄 Licença

Este projeto é propriedade da Associação e Massinga.

## 📖 Documentação Adicional

- [Frontend README](frontend/README.md) - Documentação do frontend
- [Backend README](backend/README.md) - Documentação do backend
