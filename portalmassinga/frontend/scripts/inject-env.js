// Script para injetar variáveis de ambiente no index.html durante o build
const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../dist/associacao-portal/index.html');
const apiUrl = process.env.API_URL || 'https://portal-anam-backend.vercel.app/api';

if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace('API_URL_PLACEHOLDER', apiUrl);
  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log(`✅ Injected API_URL: ${apiUrl}`);
} else {
  console.warn('⚠️ index.html not found, skipping env injection');
}

