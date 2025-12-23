#!/bin/bash

# Script de build para Vercel que injeta variáveis de ambiente

# Criar arquivo de configuração com API_URL
cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://portal-anam-backend.vercel.app/api'
};
EOF

# Executar build do Angular
npm run build

