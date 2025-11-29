# Portal da Associação e Massinga

Portal web da Associação e Massinga desenvolvido com Angular 18.2.21.

## 🖥️ Compatibilidade

Esta aplicação foi desenvolvida no macOS e está totalmente compatível com:
- ✅ **Windows** (Windows 10/11)
- ✅ **macOS** (todas as versões suportadas)
- ✅ **Linux** (Ubuntu, CentOS, etc.)

## 📋 Pré-requisitos

### Para Windows:
- **Node.js** versão 18 ou superior
- **npm** (incluído com Node.js)
- **PowerShell** 5.1+ (recomendado) ou **Command Prompt**

### Para macOS/Linux:
- **Node.js** versão 18 ou superior
- **npm** (incluído com Node.js)

### Instalação do Node.js:
1. Acesse [https://nodejs.org/](https://nodejs.org/)
2. Baixe a versão LTS (recomendada)
3. Execute o instalador e siga as instruções

## 🚀 Instalação e Execução

### Windows (Método Automático)

#### Opção 1: Usando PowerShell (Recomendado)
```powershell
# Execute como Administrador se necessário
.\setup-windows.ps1
```

#### Opção 2: Usando arquivos .bat
```cmd
# 1. Instalar dependências
install-windows.bat

# 2. Iniciar aplicação
start-windows.bat

# 3. Build para produção
build-windows.bat
```

### Windows (Método Manual)
```cmd
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm start
```

### macOS/Linux
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm start
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

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── layout/        # Componentes de layout
│   ├── services/      # Serviços Angular
│   └── app.routes.ts  # Configuração de rotas
├── public/
│   └── assets/        # Imagens, ícones e outros assets
└── styles.scss        # Estilos globais
```

## 🔧 Resolução de Problemas

### Windows

#### Erro: "node não é reconhecido"
- Reinstale o Node.js do site oficial
- Verifique se o PATH está configurado corretamente
- Reinicie o terminal/Command Prompt

#### Erro de permissão durante npm install
- Execute o terminal como Administrador
- Ou execute: `npm install --force`

#### Antivírus bloqueando instalação
- Desative temporariamente o antivírus
- Adicione a pasta do projeto às exceções

#### Problemas com PowerShell
- Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Ou use Command Prompt (.bat) em vez de PowerShell

### macOS/Linux
- Se houver problemas de permissão, use `sudo` com cuidado
- Para limpar cache: `npm cache clean --force`

## 🌐 Acesso à Aplicação

### Acesso Local:
- **Desenvolvimento**: http://localhost:4200
- **Porta alternativa**: http://localhost:4201
- **Produção**: http://localhost:8080 (após build)

### Acesso Público (ngrok):

Para permitir acesso de outras máquinas/redes:

#### Opção 1 - Script Automático:
```cmd
# Windows (.bat)
start-ngrok-windows.bat

# Windows (PowerShell)
.\start-ngrok.ps1
```

#### Opção 2 - Manual:
```cmd
# 1. Iniciar servidor para acesso público
npm run start:ngrok

# 2. Em outro terminal, iniciar ngrok
ngrok http 4201
```

#### Opção 3 - Comando direto:
```cmd
npm run start:public
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📦 Build de Produção

```bash
# Build para produção
npm run build:prod

# Os arquivos estarão em: dist/associacao-portal/
```

## 🆘 Suporte

Para problemas específicos do Windows:
1. Verifique se o Node.js está instalado corretamente
2. Execute os scripts .bat como Administrador
3. Desative temporariamente o antivírus
4. Verifique se há conflitos de porta (4200, 8080)

## 📚 Tecnologias Utilizadas

- **Angular** 18.2.0
- **Angular Material** 18.2.14
- **GSAP** 3.13.0 (animações)
- **TypeScript** 5.5.2
- **SCSS** para estilos

## 📄 Licença

Este projeto é propriedade da Associação e Massinga.
