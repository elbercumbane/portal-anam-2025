# Frontend - Portal da Associação e Massinga

Aplicação frontend desenvolvida com Angular 18.2.21.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build:prod
```

A aplicação estará disponível em: **http://localhost:4200**

## 📁 Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── layout/         # Componentes de layout
│   │   ├── services/       # Serviços Angular
│   │   └── app.routes.ts   # Configuração de rotas
│   ├── assets/            # Assets estáticos
│   └── styles.scss        # Estilos globais
├── public/                # Arquivos públicos
└── angular.json           # Configuração do Angular
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia servidor de desenvolvimento (http://localhost:4200) |
| `npm run start:dev` | Inicia em modo desenvolvimento |
| `npm run start:prod` | Inicia em modo produção |
| `npm run build` | Build para produção |
| `npm run build:dev` | Build para desenvolvimento |
| `npm run build:prod` | Build otimizado para produção |
| `npm test` | Executa testes unitários |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com relatório de cobertura |
| `npm run clean` | Remove pasta dist |
| `npm run clean:all` | Remove node_modules, dist e limpa cache |
| `npm run lint` | Executa linting do código |
| `npm run serve:dist` | Serve arquivos de produção (http://localhost:8080) |

## 📚 Tecnologias

- **Angular** 18.2.0
- **Angular Material** 18.2.14
- **GSAP** 3.13.0 (animações)
- **TypeScript** 5.5.2
- **SCSS** para estilos

## 🔧 Scripts Windows

Para Windows, existem scripts automatizados na pasta raiz:
- `install-windows.bat` - Instala dependências
- `start-windows.bat` - Inicia aplicação
- `build-windows.bat` - Build para produção

