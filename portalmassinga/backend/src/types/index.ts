// Types and Interfaces

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string;
  role: string;
  department?: string;
  province?: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
  member_id?: string;
}

export interface MemberApplication {
  id?: string;
  nome: string;
  nome_pai: string;
  nome_mae: string;
  data_nascimento: string;
  estado_civil: string;
  profissao: string;
  celular: string;
  email: string;
  telefone?: string;
  rua: string;
  bairro: string;
  cidade: string;
  nome_conjuge?: string;
  data_nascimento_conjuge?: string;
  filiacao_pai_conjuge?: string;
  filiacao_mae_conjuge?: string;
  local_trabalho?: string;
  cargo?: string;
  endereco_trabalho?: string;
  telefone_trabalho?: string;
  foto?: string;
  outras_informacoes?: string;
  aceita_termos: boolean;
  status?: string;
  data_cadastro?: Date;
  data_aprovacao?: Date;
  aprovado_por?: string;
  observacoes?: string;
  dependentes?: Dependent[];
}

export interface Dependent {
  id?: string;
  member_id?: string;
  nome: string;
  parentesco: string;
  profissao?: string;
  idade?: number;
}

export interface Member {
  id?: string;
  nome: string;
  nome_pai: string;
  nome_mae: string;
  data_nascimento: string;
  estado_civil: string;
  profissao: string;
  celular: string;
  email: string;
  telefone?: string;
  rua: string;
  bairro: string;
  cidade: string;
  nome_conjuge?: string;
  data_nascimento_conjuge?: string;
  filiacao_pai_conjuge?: string;
  filiacao_mae_conjuge?: string;
  local_trabalho?: string;
  cargo?: string;
  endereco_trabalho?: string;
  telefone_trabalho?: string;
  foto?: string;
  outras_informacoes?: string;
  status?: string;
  data_cadastro?: Date;
  data_aprovacao?: Date;
  application_id?: string;
  created_by?: string;
  updated_at?: Date;
  dependentes?: Dependent[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    nome: string;
    role: string;
    memberId?: string;
  };
}

export interface ApproveApplicationRequest {
  applicationId: string;
  observacoes?: string;
}

