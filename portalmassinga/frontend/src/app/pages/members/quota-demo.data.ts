/** Dados de demonstração para apresentação — Pagar Cotas e Consultar Recibos */

import type { QuotaStatus } from './pay-quotas/pay-quotas.helpers';

export interface DemoNuit {
  nuit: string;
  nome: string;
  situacao: 'EM_DIA' | 'COM_DIVIDAS' | 'NAO_MEMBRO';
  descricao: string;
}

export type MemberDemoNuit = DemoNuit & { situacao: 'EM_DIA' | 'COM_DIVIDAS' };

export interface DemoLoginAcesso {
  label: string;
  email: string;
  password: string;
  destino: string;
}

export const DEMO_NUITS: MemberDemoNuit[] = [
  {
    nuit: '400111222',
    nome: 'Ana Machel Demo',
    situacao: 'EM_DIA',
    descricao: 'Cotas em dia — sem meses em falta'
  },
  {
    nuit: '400333444',
    nome: 'Carlos Cumbane Demo',
    situacao: 'COM_DIVIDAS',
    descricao: 'Com meses em falta — pode pagar'
  }
];

/** NUIT simulado: pessoa que quer pagar mas ainda não é membro */
export const DEMO_NUIT_NAO_MEMBRO: DemoNuit = {
  nuit: '400999888',
  nome: 'João Visitante',
  situacao: 'NAO_MEMBRO',
  descricao: 'Não é membro — deve associar-se primeiro'
};

export function isNonMemberDemoNuit(nuit: string): boolean {
  return (nuit || '').trim() === DEMO_NUIT_NAO_MEMBRO.nuit;
}

/** NUIT com recibos simulados para Consultar Recibos */
export const DEMO_NUIT_RECIBOS = '400111222';

/** Senha padrão do sistema: anam + ano corrente (ex: anam2026) */
export const SENHA_PADRAO_SISTEMA = 'anam' + new Date().getFullYear();

export const DEMO_ACESSOS_LOGIN: DemoLoginAcesso[] = [
  { label: 'Admin (Dashboard)', email: 'admin@anam.co.mz', password: SENHA_PADRAO_SISTEMA, destino: 'Dashboard' },
  { label: 'Membro em dia', email: 'ana.demo@anam.co.mz', password: SENHA_PADRAO_SISTEMA, destino: 'Área de Membros' },
  { label: 'Membro c/ cotas', email: 'carlos.demo@anam.co.mz', password: SENHA_PADRAO_SISTEMA, destino: 'Bloqueado até pagar' }
];

/** Celular demo para OTP em Consultar Recibos — máscara: 8464*****97 */
export const DEMO_RECIBOS_CELULAR = '846412397';

export function maskPhoneNumber(phone: string): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('258')) digits = digits.slice(3);
  if (digits.length < 6) return '****';
  return `${digits.slice(0, 4)}*****${digits.slice(-2)}`;
}

/** OTP determinístico para demo: últimos 5 dígitos do telefone */
export function generateOtpFromPhone(phone: string): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('258')) digits = digits.slice(3);
  return digits.slice(-5).padStart(5, '0');
}

export const DEMO_RECIBOS = [
  {
    id: 'PAY-DEMO-001',
    numeroMembro: DEMO_NUIT_RECIBOS,
    nomeMembro: 'Ana Machel Demo',
    emailMembro: 'ana.demo@anam.co.mz',
    dataPagamento: new Date('2025-03-15T10:30:00'),
    meses: ['Janeiro 2025', 'Fevereiro 2025', 'Março 2025'],
    valorTotal: 3600,
    metodoPagamento: 'M-Pesa',
    numeroTelefone: DEMO_RECIBOS_CELULAR,
    status: 'pago' as const
  },
  {
    id: 'PAY-DEMO-002',
    numeroMembro: DEMO_NUIT_RECIBOS,
    nomeMembro: 'Ana Machel Demo',
    emailMembro: 'ana.demo@anam.co.mz',
    dataPagamento: new Date('2025-05-02T14:00:00'),
    meses: ['Abril 2025', 'Maio 2025'],
    valorTotal: 2400,
    metodoPagamento: 'Emola',
    numeroTelefone: DEMO_RECIBOS_CELULAR,
    status: 'pago' as const
  }
];

export function seedDemoReceiptsIfEmpty(): void {
  try {
    const stored = localStorage.getItem('payment_receipts');
    const receipts = stored ? JSON.parse(stored) : [];
    const hasDemo = receipts.some((r: { id?: string }) => r.id?.startsWith('PAY-DEMO'));
    if (!hasDemo) {
      const toStore = DEMO_RECIBOS.map(r => ({
        ...r,
        dataPagamento: r.dataPagamento.toISOString()
      }));
      localStorage.setItem('payment_receipts', JSON.stringify([...toStore, ...receipts]));
    }
  } catch {
    /* ignore */
  }
}

/** IDs fixos — devem coincidir com QuotaDemoDataLoader no backend */
const DEMO_MEMBER_IDS: Record<string, string> = {
  '400111222': 'a1111111-1111-1111-1111-111111111111',
  '400333444': 'a2222222-2222-2222-2222-222222222222'
};

/** Situação demo local quando a API ainda não está disponível */
export function buildDemoQuotaStatus(nuit: string): QuotaStatus | null {
  const demo = DEMO_NUITS.find(d => d.nuit === nuit);
  if (!demo) return null;

  const memberId = DEMO_MEMBER_IDS[nuit];
  const mesesPagos: string[] = [];
  const mesesEmFalta: string[] = [];

  if (demo.situacao === 'EM_DIA') {
    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth() + 1;
    for (let y = 2025; y <= endYear; y++) {
      const startM = y === 2025 ? 1 : 1;
      const lastM = y === endYear ? endMonth : 12;
      for (let m = startM; m <= lastM; m++) {
        mesesPagos.push(`${y}-${String(m).padStart(2, '0')}`);
      }
    }
  } else {
    const now = new Date();
    mesesPagos.push('2025-01', '2025-02');
    for (let y = 2025; y <= now.getFullYear(); y++) {
      const startM = y === 2025 ? 3 : 1;
      const lastM = y === now.getFullYear() ? now.getMonth() + 1 : 12;
      for (let m = startM; m <= lastM; m++) {
        mesesEmFalta.push(`${y}-${String(m).padStart(2, '0')}`);
      }
    }
  }

  return {
    memberApplicationId: memberId,
    nome: demo.nome,
    email: nuit === '400111222' ? 'ana.demo@anam.co.mz' : 'carlos.demo@anam.co.mz',
    celular: nuit === '400111222' ? DEMO_RECIBOS_CELULAR : '871234567',
    nuit,
    situacaoFinanceira: demo.situacao,
    mesesEmDivida: mesesEmFalta.length,
    valorEmDivida: mesesEmFalta.length * 1200,
    ultimoMesPago: mesesPagos.length ? mesesPagos[mesesPagos.length - 1] : null,
    mesesEmFalta,
    mesesPagos
  };
}
