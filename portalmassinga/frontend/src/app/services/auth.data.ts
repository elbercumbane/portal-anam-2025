// Dados de autenticação e interfaces

// Interface do usuário
export interface Usuario {
  email: string;
  nome: string;
  role: string;
  memberId?: string;
  mustChangePassword?: boolean;
  cotasEmFalta?: {
    meses: number;
    dataVencimento: string;
    valorTotal: number;
  };
}

// Interface da conta de teste
export interface ContaTeste {
  email: string;
  password: string;
  nome: string;
  role: string;
  cotasEmFalta: {
    meses: number;
    dataVencimento: string;
    valorTotal: number;
  } | null;
}

// Contas de teste para desenvolvimento
export const CONTAS_TESTE: ContaTeste[] = [
  {
    email: 'guilherme@gmail.com',
    password: '123456',
    nome: 'Guilherme Silva',
    role: 'membro',
    cotasEmFalta: null
  },
  {
    email: 'elber@gmail.com',
    password: '123456',
    nome: 'Elber Cumbane',
    role: 'membro',
    cotasEmFalta: {
      meses: 3,
      dataVencimento: '2024-12-31',
      valorTotal: 3600
    }
  },
  {
    email: 'martasozinh@gmail.com',
    password: '123456',
    nome: 'Marta Fabiano dos Anjos Sozinho',
    role: 'membro',
    cotasEmFalta: null
  }
];

// Chaves do localStorage
export const STORAGE_KEYS = {
  USUARIO_ATUAL: 'currentUser',
  TOKEN_AUTH: 'authToken',
  DADOS_MEMBRO: 'currentMemberData',
  APLICACOES: 'anam_applications',
  LOGIN_TIMESTAMP: 'loginTimestamp'
};

