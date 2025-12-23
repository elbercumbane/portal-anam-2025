# 🌐 Configuração Ngrok - Acesso Público

## 📋 O que é o Ngrok?

O ngrok é uma ferramenta que cria um túnel seguro para sua aplicação local, permitindo que outras pessoas acessem sua aplicação pela internet usando uma URL pública.

## 🔧 Instalação do Ngrok

### Windows:

1. **Baixar ngrok:**
   - Acesse: https://ngrok.com/download
   - Baixe a versão para Windows

2. **Instalar:**
   - Extraia o arquivo `ngrok.exe`
   - Adicione ao PATH do sistema OU coloque na pasta do projeto

3. **Verificar instalação:**
   ```cmd
   ngrok version
   ```

## 🚀 Como Usar

### Método 1 - Script Automático (Recomendado):

```cmd
# Execute este comando na pasta do projeto
start-ngrok-windows.bat
```

### Método 2 - PowerShell:

```powershell
.\start-ngrok.ps1
```

### Método 3 - Manual:

```cmd
# Terminal 1: Iniciar servidor Angular
npm run start:ngrok

# Terminal 2: Iniciar ngrok
ngrok http 4201
```

## 📱 URLs Geradas

Após executar o ngrok, você receberá URLs como:

- **HTTP**: `https://abc123.ngrok-free.app`
- **HTTPS**: `https://abc123.ngrok-free.app` (recomendado)

## 🔒 Configurações de Segurança

### Angular.json configurado com:
```json
"serve": {
  "options": {
    "host": "0.0.0.0",
    "disableHostCheck": true,
    "allowedHosts": "all"
  }
}
```

### Scripts disponíveis:
- `npm run start:public` - Servidor com acesso público
- `npm run start:ngrok` - Servidor otimizado para ngrok

## 🌍 Acesso de Outras Máquinas

### Para acessar de outros dispositivos:

1. **Mesma rede local:**
   - Use o IP da sua máquina: `http://192.168.1.100:4201`

2. **Internet (via ngrok):**
   - Use a URL do ngrok: `https://abc123.ngrok-free.app`

## ⚠️ Avisos Importantes

### Ngrok Gratuito:
- **Limitações**: 1 túnel simultâneo, URLs temporárias
- **Sessão**: URLs mudam a cada reinicialização
- **Uso**: Ideal para testes e demonstrações

### Ngrok Pago:
- **URLs fixas**: `https://meuapp.ngrok.io`
- **Múltiplos túneis**: Várias aplicações simultâneas
- **Domínio personalizado**: Use seu próprio domínio

## 🔧 Resolução de Problemas

### Erro: "Host header not allowed"
- ✅ **Solução**: Use `npm run start:ngrok` (já configurado)

### Erro: "ngrok not found"
- ✅ **Solução**: Instale o ngrok e adicione ao PATH

### Erro: "Port already in use"
- ✅ **Solução**: Use porta diferente: `ngrok http 4202`

### Erro: "Too many connections"
- ✅ **Solução**: Atualize para plano pago do ngrok

## 📊 Monitoramento

### Dashboard do Ngrok:
- Acesse: http://localhost:4040
- Veja estatísticas de tráfego
- Monitore requisições em tempo real

## 🎯 Exemplos de Uso

### Demonstração para cliente:
```cmd
# 1. Iniciar aplicação
npm run start:ngrok

# 2. Compartilhar URL do ngrok
# https://abc123.ngrok-free.app

# 3. Cliente acessa de qualquer lugar
```

### Teste em dispositivos móveis:
```cmd
# 1. Iniciar ngrok
ngrok http 4201

# 2. Usar URL HTTPS no celular
# https://abc123.ngrok-free.app
```

### Desenvolvimento remoto:
```cmd
# 1. Compartilhar com equipe
# 2. Testes simultâneos
# 3. Feedback em tempo real
```

## 📞 Suporte

Se encontrar problemas:

1. **Verifique se o ngrok está instalado**
2. **Confirme que o servidor Angular está rodando**
3. **Teste primeiro localmente**: http://localhost:4201
4. **Use o dashboard**: http://localhost:4040

---

**🎉 Agora sua aplicação pode ser acessada de qualquer lugar do mundo!**
