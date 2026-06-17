# 📱 Integração SMS com MozeSMS - Portal ANAM

## 📋 Visão Geral

Este documento descreve a implementação do sistema de SMS para notificações automáticas no Portal ANAM usando a API do MozeSMS.

## 🎯 Funcionalidades Implementadas

### 1. **SMS de Cadastro Pendente**
Quando um novo membro se cadastra, recebe automaticamente um SMS informando que seu pedido está aguardando aprovação.

### 2. **SMS de Aprovação com Credenciais**
Quando um membro é aprovado no dashboard, recebe um SMS com:
- Email de acesso
- Senha temporária gerada automaticamente

### 3. **Lembrete de Cotas (5 dias antes)**
Job agendado que executa diariamente às 9:00 AM e envia SMS para membros com cotas próximas do vencimento (5 dias antes).

### 4. **Bloqueio por Falta de Pagamento**
Membros com cotas vencidas não conseguem fazer login na área de membros.

## 📦 Qual Pacote Escolher?

### Análise dos Pacotes MozeSMS:

| Pacote | Volume | Preço/SMS | Melhor Para |
|--------|--------|-----------|-------------|
| **Básico** | Até 99k/mês | 1.35 MT | Pequenas associações (< 100 membros) |
| **Profissional** | 100k-249k/mês | 1.20 MT | Associações médias (100-200 membros) |
| **Empresarial** | 250k+/mês | 1.00 MT | Associações grandes (> 200 membros) |

### 💡 Recomendação

**Para o Portal ANAM, recomendamos o pacote PROFISSIONAL:**

**Motivos:**
1. **Custo-benefício**: Economia de 11% comparado ao Básico
2. **Volume adequado**: 
   - SMS de cadastro: ~10-50/mês (novos membros)
   - SMS de aprovação: ~10-50/mês
   - Lembretes de cotas: ~50-200/mês (dependendo do número de membros)
   - **Total estimado: 70-300 SMS/mês**
3. **Crescimento**: Permite crescimento sem precisar mudar de plano imediatamente

**Cálculo de Custo Mensal (Exemplo com 150 membros):**
- 20 novos cadastros/mês × 1 SMS = 20 SMS
- 20 aprovações/mês × 1 SMS = 20 SMS  
- 150 membros × 1 lembrete/mês = 150 SMS
- **Total: ~190 SMS/mês × 1.20 MT = 228 MT/mês**

## ⚙️ Configuração

### 1. Obter API Key do MozeSMS

1. Acesse https://mozesms.com/
2. Crie uma conta ou faça login
3. Vá em "API Documentation" ou "Configurações"
4. Copie sua API Key

### 2. Configurar no Backend

Edite o arquivo `application.properties`:

```properties
# Configurações SMS - MozeSMS
sms.mozesms.api.url=https://api.mozesms.com/v1/send
sms.mozesms.api.key=SUA_API_KEY_AQUI
sms.mozesms.api.sender=ANAM
sms.enabled=true

# Configurações de Cotas
quota.valor.padrao=500.00
```

### 3. Ajustar URL da API (se necessário)

A URL da API pode variar. Consulte a documentação oficial do MozeSMS em:
- https://mozesms.com/
- Ou entre em contato: info@mozesms.com / +258 84 588 8195

## 📁 Arquivos Criados/Modificados

### Backend

**Novos Arquivos:**
- `service/SmsService.java` - Serviço de envio de SMS
- `entity/Quota.java` - Entidade para gerenciar cotas
- `entity/User.java` - Entidade para gerenciar usuários e senhas
- `repository/QuotaRepository.java` - Repository de cotas
- `repository/UserRepository.java` - Repository de usuários
- `service/QuotaService.java` - Serviço de gerenciamento de cotas
- `scheduler/QuotaReminderScheduler.java` - Job agendado para lembretes

**Arquivos Modificados:**
- `controller/MembroController.java` - Integração SMS no cadastro e aprovação
- `controller/AuthController.java` - Verificação de cotas no login
- `PortalAnamApplication.java` - Habilitado @EnableScheduling
- `application.properties` - Configurações SMS e cotas

## 🔄 Fluxo de Funcionamento

### 1. Cadastro de Novo Membro

```
Membro preenche formulário
    ↓
POST /api/membros
    ↓
Membro salvo com status "Pendente"
    ↓
SMS enviado: "Seu pedido está aguardando aprovação"
```

### 2. Aprovação de Membro

```
Admin aprova no dashboard
    ↓
PUT /api/membros/{id}/aprovar
    ↓
Status muda para "Aprovado"
    ↓
Usuário criado com senha temporária
    ↓
SMS enviado: "Aprovado! Email: X, Senha: Y"
```

### 3. Lembrete de Cotas

```
Job executa diariamente às 9:00 AM
    ↓
Busca cotas com vencimento em 5 dias
    ↓
Para cada cota encontrada:
    ↓
SMS enviado: "Lembrete: Cota vence no dia X"
```

### 4. Login com Verificação de Cotas

```
Membro tenta fazer login
    ↓
Verifica credenciais
    ↓
Verifica se membro está aprovado
    ↓
Verifica se tem cotas vencidas
    ↓
Se tem cotas vencidas → BLOQUEADO
Se não tem → ACESSO PERMITIDO
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
Armazena credenciais de acesso dos membros:
- `id` (UUID)
- `membro_id` (UUID, FK para membros)
- `email` (String, único)
- `senha` (String - em produção, usar hash BCrypt)
- `role` (String: "membro" ou "admin")
- `ativo` (Boolean)

### Tabela `quotas`
Armazena informações de cotas dos membros:
- `id` (UUID)
- `membro_id` (UUID, FK para membros)
- `mes_referencia` (Integer: 1-12)
- `ano_referencia` (Integer)
- `valor` (BigDecimal)
- `data_vencimento` (LocalDate)
- `data_pagamento` (LocalDate, nullable)
- `status` (String: "Pendente", "Paga", "Vencida")
- `lembrete_enviado` (Boolean)
- `data_lembrete` (LocalDateTime, nullable)

## 🔒 Segurança

### ⚠️ IMPORTANTE - Melhorias Necessárias para Produção:

1. **Hash de Senhas**: Atualmente as senhas são armazenadas em texto plano. **Implementar BCrypt:**
   ```java
   @Autowired
   private PasswordEncoder passwordEncoder;
   
   // Ao criar usuário:
   user.setSenha(passwordEncoder.encode(senha));
   
   // Ao verificar login:
   passwordEncoder.matches(password, user.getSenha())
   ```

2. **JWT Tokens**: Substituir tokens simples por JWT tokens seguros.

3. **Rate Limiting**: Implementar limite de tentativas de login.

4. **Validação de Números**: Validar números de telefone antes de enviar SMS.

## 🧪 Testes

### Testar Envio de SMS

1. Configure a API Key no `application.properties`
2. Certifique-se que `sms.enabled=true`
3. Cadastre um novo membro
4. Verifique os logs do backend para confirmar envio
5. Verifique se o SMS foi recebido no telefone

### Testar Job de Lembretes

1. Crie cotas com data de vencimento em 5 dias
2. Aguarde o horário agendado (9:00 AM) ou modifique o cron para testar
3. Verifique os logs do backend
4. Verifique se os SMS foram enviados

## 📞 Suporte MozeSMS

- **Email**: info@mozesms.com
- **Telefone**: +258 84 588 8195
- **WhatsApp**: +258 84 588 8195
- **Website**: https://mozesms.com/

## 📝 Notas Importantes

1. **Formato de Telefone**: O sistema normaliza números para formato Moçambique (258XXXXXXXXX)
2. **Falhas de SMS**: Se o SMS falhar, o cadastro/aprovação não é afetado (não bloqueia o processo)
3. **Custos**: Monitore o uso de SMS para controlar custos
4. **Desabilitar SMS**: Para desabilitar temporariamente, altere `sms.enabled=false`

## 🚀 Próximos Passos

1. Obter API Key do MozeSMS
2. Configurar no `application.properties`
3. Testar com um cadastro real
4. Implementar hash de senhas (BCrypt)
5. Implementar JWT tokens
6. Monitorar uso e custos de SMS
