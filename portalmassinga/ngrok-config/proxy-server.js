const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4202;

// CORS para permitir requisições do ngrok
app.use(cors({
  origin: true,
  credentials: true
}));

// Proxy para o backend (API)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> http://localhost:3000${req.url}`);
  }
}));

// Proxy para o frontend (Angular)
app.use('/', createProxyMiddleware({
  target: 'http://localhost:4201',
  changeOrigin: true,
  ws: true, // WebSocket support
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> http://localhost:4201${req.url}`);
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📡 Frontend: http://localhost:4201`);
  console.log(`📡 Backend: http://localhost:3000`);
  console.log(`🌐 Public: http://localhost:${PORT} (use ngrok on this port)`);
});

