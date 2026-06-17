# 🧪 Como Testar o Formulário Corrigido

## ✅ Checklist de Teste

### 1. Verificar Backend está Rodando

```bash
# Verificar containers Docker
cd portalmassinga\backend
docker-compose ps

# Ou verificar porta
# Deve mostrar processo na porta 8081
```

### 2. Testar API Diretamente

**No navegador:**
- Acesse: `http://localhost:8081/api/membros`
- Deve retornar uma lista (pode estar vazia inicialmente)

**Via PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET
```

### 3. Testar Formulário no Frontend

1. **Inicie o frontend** (se não estiver rodando):
   ```bash
   cd portalmassinga\frontend
   npm start
   ```

2. **Acesse o formulário:**
   - URL: `http://localhost:4200/associar`
   - Ou: `http://localhost:4200/torne-se-membro`

3. **Preencha o formulário:**
   - Todos os campos obrigatórios (marcados com *)
   - Aceite os termos e condições
   - Clique em "Submeter Candidatura"

4. **Resultados Esperados:**

   **✅ Se Sucesso:**
   - Pop-up verde aparece: "Formulário Enviado com Sucesso!"
   - Formulário é limpo automaticamente
   - Dados são salvos na tabela `membros`

   **❌ Se Erro:**
   - Pop-up vermelho aparece: "Formulário Não Foi Enviado"
   - Mensagem de erro específica é mostrada
   - Formulário não é limpo (pode corrigir e tentar novamente)

### 4. Verificar Dados Salvos

**Opção 1: Script Automático**
```batch
cd portalmassinga\backend
VERIFICAR-MEMBROS.bat
```

**Opção 2: Via API**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET
```

**Opção 3: Via pgAdmin**
1. Abra pgAdmin
2. Conecte-se ao PostgreSQL (localhost:5432)
3. Navegue: Databases > anam > Schemas > public > Tables > membros
4. Clique direito > View/Edit Data > All Rows

### 5. Verificar Logs (se houver problemas)

**Logs do Backend:**
```bash
cd portalmassinga\backend
docker-compose logs -f backend
```

**Console do Navegador:**
- Pressione F12 no navegador
- Aba "Console"
- Veja mensagens de log e erros

## 🔍 Mensagens de Debug

O formulário agora mostra logs no console:
- `📤 Enviando candidatura...` - Quando inicia envio
- `✅ Resposta do servidor:` - Quando recebe resposta
- `❌ Erro ao criar candidatura:` - Quando há erro

## ⚠️ Problemas Comuns

### Pop-up não aparece
- Verifique o console do navegador (F12)
- Verifique se há erros de JavaScript

### Dados não são salvos
- Verifique se backend está rodando
- Verifique logs do backend: `docker-compose logs backend`
- Verifique se a URL está correta: `http://localhost:8081/api/membros`

### Erro de CORS
- Backend já está configurado para aceitar CORS
- Se persistir, verifique se frontend está em `http://localhost:4200`

### Email já cadastrado
- O sistema verifica emails duplicados
- Use um email diferente ou verifique membros existentes

## 📝 Campos Obrigatórios

Certifique-se de preencher:
- ✅ Nome Completo
- ✅ Nome do Pai
- ✅ Nome da Mãe
- ✅ Data de Nascimento
- ✅ Estado Civil
- ✅ Profissão
- ✅ Celular
- ✅ Email (único)
- ✅ Rua/Avenida
- ✅ Bairro
- ✅ Cidade
- ✅ Aceitar Termos

## 🎨 Cores dos Pop-ups

- **Sucesso:** Verde (#4CAF50) - harmonioso com a página
- **Erro:** Vermelho (#dc3545) - contrastante e visível
