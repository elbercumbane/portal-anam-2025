# Instruções para Renomear as Pastas do Backend

## ⚠️ Importante

A pasta `backend` está sendo usada por outro processo (IDE, terminal, ou processo Node.js). Você precisa **fechar tudo** antes de executar o script.

## 📋 Passo a Passo

### 1. Fechar todos os processos que usam a pasta `backend`

- Feche o **IDE** (VS Code, IntelliJ, etc.)
- Feche todos os **terminais** que possam estar rodando o backend Node.js
- Verifique o **Gerenciador de Tarefas** e encerre qualquer processo Node.js

### 2. Executar o script

Abra o **PowerShell** na pasta raiz do projeto e execute:

```powershell
.\renomear-backend.ps1
```

### 3. Verificar o resultado

Após executar o script, você deve ter:
- ✅ Pasta `backend` (Spring Boot) - **MANTIDA**
- ❌ Pasta `backend-spring` - **REMOVIDA** (renomeada para `backend`)
- ❌ Pasta `backend` antiga (Node.js) - **REMOVIDA**

## 🔄 Alternativa Manual

Se o script não funcionar, você pode fazer manualmente:

1. Feche o IDE e todos os processos
2. No **Explorador de Arquivos**, renomeie:
   - `backend` → `backend-old`
   - `backend-spring` → `backend`
3. Delete a pasta `backend-old`

## ✅ Resultado Final

Você terá apenas uma pasta chamada `backend` contendo o projeto Spring Boot.

