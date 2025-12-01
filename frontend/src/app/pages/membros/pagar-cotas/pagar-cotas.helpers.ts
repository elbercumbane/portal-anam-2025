// ============ HELPERS PARA PAGAR COTAS ============

export interface Mes {
  value: number;
  label: string;
  selected: boolean;
}

export const MESES: Mes[] = [
  { value: 1, label: 'Janeiro', selected: false },
  { value: 2, label: 'Fevereiro', selected: false },
  { value: 3, label: 'Março', selected: false },
  { value: 4, label: 'Abril', selected: false },
  { value: 5, label: 'Maio', selected: false },
  { value: 6, label: 'Junho', selected: false },
  { value: 7, label: 'Julho', selected: false },
  { value: 8, label: 'Agosto', selected: false },
  { value: 9, label: 'Setembro', selected: false },
  { value: 10, label: 'Outubro', selected: false },
  { value: 11, label: 'Novembro', selected: false },
  { value: 12, label: 'Dezembro', selected: false }
];

export const VALOR_COTA = 1200;

export function validateMpesaNumber(control: any): { [key: string]: any } | null {
  if (!control.value) return null;
  const value = control.value.toString();
  if (value.length === 9 && (value.startsWith('84') || value.startsWith('85'))) {
    return null; // Válido
  }
  return { invalidMpesa: true };
}

export function validateEmolaNumber(control: any): { [key: string]: any } | null {
  if (!control.value) return null;
  const value = control.value.toString();
  if (value.length === 9 && (value.startsWith('87') || value.startsWith('86'))) {
    return null; // Válido
  }
  return { invalidEmola: true };
}

export function calcularValorTotal(
  tipoPagamento: 'mensal' | 'anual',
  quantidadeMeses: number,
  valorCota: number
): number {
  if (tipoPagamento === 'anual') {
    return valorCota * 12;
  }
  return valorCota * quantidadeMeses;
}

export function formatarMesesSelecionados(
  meses: Mes[],
  mesesSelecionados: number[],
  tipoPagamento: 'mensal' | 'anual'
): string {
  if (tipoPagamento === 'anual') {
    return 'Ano completo (12 meses)';
  }
  if (mesesSelecionados.length === 0) return '';
  return mesesSelecionados
    .map(v => meses.find(m => m.value === v)?.label)
    .join(', ');
}

