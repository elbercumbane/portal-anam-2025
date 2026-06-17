# 🚀 Como Levantar o Backend

Existem **duas formas** de levantar o backend:

## Opção 1: Com Docker (Recomendado para produção)

### Pré-requisitos
- Docker Desktop instalado e **rodando**

### Passos

1. **Iniciar Docker Desktop**
   - Abra o Docker Desktop
   - Aguarde até aparecer "Docker Desktop is running"

2. **Executar script:**
   ```batch
   LEVANTAR-COM-DOCKER.bat
   ```
   
   Ou via PowerShell:
   ```powershell
   .\LEVANTAR-COM-DOCKER.ps1
   ```

### O que o Docker faz:
- ✅ Cria container PostgreSQL automaticamente
- ✅ Cria base de dados e tabelas
- ✅ Compila e inicia o backend
- ✅ Tudo isolado e configurado automaticamente

### URLs quando estiver pronto:
- Backend: `http://localhost:8081/api`
- Membros: `http://localhost:8081/api/membros`

### Comandos úteis:
```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Parar tudo
docker-compose down

# Ver status
docker-compose ps
```

---

## Opção 2: Sem Docker (Mais rápido para desenvolvimento)

### Pré-requisitos
- Java 17 instalado
- PostgreSQL instalado e rodando
- Base de dados `anam` criada

### Passos

1. **Configurar Java 17** (se ainda não configurado):
   ```powershell
   .\configurar-java17.ps1
   ```

2. **Verificar PostgreSQL está rodando**

3. **Iniciar backend:**
   ```batch
   iniciar-backend-window.bat
   ```
   
   Ou via PowerShell:
   ```powershell
   .\iniciar-backend-com-java17.ps1
   ```

### URLs quando estiver pronto:
- Backend: `http://localhost:8081/api`
- Membros: `http://localhost:8081/api/membros`

---

## 🔍 Verificar se está funcionando

Teste no navegador ou via PowerShell:

```powershell
# Testar API raiz
Invoke-RestMethod -Uri "http://localhost:8081/api" -Method GET

# Testar endpoint de membros
Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET
```

---

## 🐛 Solução de Problemas

### Docker Desktop não está rodando
- Abra o Docker Desktop manualmente
- Aguarde até aparecer "Docker Desktop is running"
- Execute o script novamente

### Porta 8081 já está em uso
- Pare o processo usando a porta:
  ```powershell
  $port = Get-NetTCPConnection -LocalPort 8081
  Stop-Process -Id $port.OwningProcess -Force
  ```

### Erro de conexão com PostgreSQL
- Verifique se PostgreSQL está rodando
- Verifique credenciais no `application.properties`
- Verifique se a base de dados `anam` existe

### Backend não inicia
- Verifique os logs na janela do backend
- Verifique se Java 17 está configurado: `java -version`
- Verifique se Maven está funcionando: `.\mvnw.cmd --version`

---

## 📝 Nota

**Recomendação:**
- Use **Docker** para ambiente de produção ou quando quiser isolamento completo
- Use **sem Docker** para desenvolvimento rápido quando já tem tudo configurado
