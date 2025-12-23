export const environment = {
  production: true,
  // API_URL será injetada pelo Vercel via variável de ambiente
  apiUrl: (typeof window !== 'undefined' && (window as any).__API_URL__) || 'https://portal-anam-backend.vercel.app/api'
};

