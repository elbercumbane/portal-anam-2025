# Configuração do Ngrok

Esta pasta contém todas as configurações relacionadas ao ngrok para desenvolvimento local.

## 📁 Estrutura

- `ngrok.exe` - Executável do ngrok
- `ngrok.yml` - Arquivo de configuração do ngrok
- `proxy-server.js` - Servidor proxy para combinar frontend e backend
- `*.log` - Logs do ngrok

## 🚀 Uso

### Iniciar túnel ngrok

```bash
# Navegar para a pasta
cd ngrok-config

# Iniciar túnel para o proxy (porta 4202)
ngrok.exe http 4202 --config=ngrok.yml
```

### Configuração

O arquivo `ngrok.yml` contém:
- Authtoken configurado
- Configuração de múltiplos túneis (frontend e backend)
- Headers para pular aviso do navegador

## ⚠️ Nota

O ngrok é apenas para desenvolvimento local. Para produção, use o deploy no Vercel conforme descrito em `DEPLOY-VERCEL.md`.

