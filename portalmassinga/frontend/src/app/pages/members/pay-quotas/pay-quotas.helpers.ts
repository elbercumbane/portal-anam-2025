// ============ HELPERS PARA PAGAR COTAS ============

export interface Mes {
  value: number;
  label: string;
  selected: boolean;
}

export interface QuotaMonthItem {
  key: string;
  year: number;
  month: number;
  label: string;
  selected: boolean;
  paid: boolean;
}

export interface QuotaStatus {
  memberApplicationId: string;
  nome: string;
  email: string;
  celular: string;
  nuit: string;
  situacaoFinanceira: 'EM_DIA' | 'COM_DIVIDAS';
  mesesEmDivida: number;
  valorEmDivida: number;
  ultimoMesPago: string | null;
  mesesEmFalta: string[];
  mesesPagos: string[];
}

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function formatYearMonthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return `${NOMES_MESES[m - 1]} ${y}`;
}

export function parseYearMonth(key: string): { year: number; month: number } {
  const [y, m] = key.split('-').map(Number);
  return { year: y, month: m };
}

export function buildQuotaMonthItems(status: QuotaStatus): QuotaMonthItem[] {
  const unpaid = (status.mesesEmFalta || []).map(key => ({
    key,
    ...parseYearMonth(key),
    label: formatYearMonthLabel(key),
    selected: false,
    paid: false
  }));
  const paid = (status.mesesPagos || []).map(key => ({
    key,
    ...parseYearMonth(key),
    label: formatYearMonthLabel(key),
    selected: false,
    paid: true
  }));
  return [...unpaid, ...paid].sort((a, b) => a.key.localeCompare(b.key));
}

export function groupSelectedByYear(items: QuotaMonthItem[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const item of items.filter(i => i.selected && !i.paid)) {
    if (!map.has(item.year)) map.set(item.year, []);
    map.get(item.year)!.push(item.month);
  }
  for (const [, months] of map) {
    months.sort((a, b) => a - b);
  }
  return map;
}

/** Selecção contígua a partir do mês em falta mais antigo */
export function toggleSequentialMonth(unpaid: QuotaMonthItem[], item: QuotaMonthItem): void {
  const idx = unpaid.findIndex(m => m.key === item.key);
  if (idx < 0) return;
  if (item.selected) {
    for (let i = idx; i < unpaid.length; i++) unpaid[i].selected = false;
  } else {
    for (let i = 0; i <= idx; i++) unpaid[i].selected = true;
  }
}

export function selectAllUnpaidPrefix(unpaid: QuotaMonthItem[]): void {
  unpaid.forEach(m => { m.selected = true; });
}

export function clearUnpaidSelection(unpaid: QuotaMonthItem[]): void {
  unpaid.forEach(m => { m.selected = false; });
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

