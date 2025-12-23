// Economic Agent Types

export interface AgenteEconomicoStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

export interface RatingItem {
  id: string;
  label: string;
  value: number;
}

export interface AgenteEconomicoStatistics {
  mediaGeral: number;
  totalAvaliacoes: number;
  avaliacaoMaxima: number;
  ultimaAvaliacao: string;
}

export interface Submission {
  id: string;
  instituicao: string;
  dataSubmissao: Date;
  status: string;
}

export interface AvaliacaoAgente {
  id: string;
  grauSatisfacao: string;
  problemaResolvido: string;
  tipoProblema: string;
  agradou: string;
  naoAgradou: string;
  provincia: string;
  observacoes?: string;
  dataSubmissao?: Date;
}

