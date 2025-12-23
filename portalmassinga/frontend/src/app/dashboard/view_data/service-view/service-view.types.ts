// Service View Types

export interface AtendimentoConsolidado {
  id: string;
  tipoFormulario: 'fae' | 'agente-economico' | 'utilizador';
  grauSatisfacao: string;
  problemaResolvido: string;
  tipoProblema: string;
  servico: string;
  agradou: string;
  naoAgradou: string;
  provincia: string;
  observacoes: string;
  dataSubmissao: Date;
}

