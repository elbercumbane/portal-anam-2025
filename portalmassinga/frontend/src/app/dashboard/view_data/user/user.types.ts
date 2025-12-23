// User Types

export interface UtilizadorStats {
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

export interface UtilizadorStatistics {
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

