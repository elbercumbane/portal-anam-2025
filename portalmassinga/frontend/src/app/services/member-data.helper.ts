// Funções auxiliares para busca de dados de membros

import { STORAGE_KEYS } from './auth.data';

// Buscar dados do membro no localStorage pelo email
export function buscarMembroPorEmail(email: string): any | null {
  const armazenado = localStorage.getItem(STORAGE_KEYS.APLICACOES);
  if (armazenado) {
    try {
      const aplicacoes = JSON.parse(armazenado);
      const emailMinusculo = email.toLowerCase().trim();
      const encontrado = aplicacoes.find((app: any) => {
        if (!app.email) return false;
        return app.email.toLowerCase().trim() === emailMinusculo;
      });
      if (encontrado) {
        console.log('Membro encontrado pelo email:', email, encontrado);
      }
      return encontrado || null;
    } catch (erro) {
      console.error('Erro ao parsear aplicações:', erro);
      return null;
    }
  }
  return null;
}

// Buscar dados do membro no localStorage pelo nome (fallback)
export function buscarMembroPorNome(nome: string): any | null {
  const armazenado = localStorage.getItem(STORAGE_KEYS.APLICACOES);
  if (armazenado) {
    try {
      const aplicacoes = JSON.parse(armazenado);
      const nomeMinusculo = nome.toLowerCase().trim();
      const encontrado = aplicacoes.find((app: any) => {
        if (!app.nome) return false;
        return app.nome.toLowerCase().trim() === nomeMinusculo;
      });
      if (encontrado) {
        console.log('Membro encontrado pelo nome:', nome, encontrado);
      }
      return encontrado || null;
    } catch (erro) {
      console.error('Erro ao buscar por nome:', erro);
      return null;
    }
  }
  return null;
}

// Atualizar dados do membro no localStorage
export function atualizarDadosMembro(dadosMembro: any): void {
  const armazenado = localStorage.getItem(STORAGE_KEYS.APLICACOES);
  if (armazenado) {
    const aplicacoes = JSON.parse(armazenado);
    const indice = aplicacoes.findIndex((app: any) => app.id === dadosMembro.id);
    if (indice !== -1) {
      aplicacoes[indice] = dadosMembro;
      localStorage.setItem(STORAGE_KEYS.APLICACOES, JSON.stringify(aplicacoes));
      localStorage.setItem(STORAGE_KEYS.DADOS_MEMBRO, JSON.stringify(dadosMembro));
    }
  }
}

