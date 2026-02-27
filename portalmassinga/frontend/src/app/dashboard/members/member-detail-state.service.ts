import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MemberForDetail {
  id: string;
  nome: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;
  nuit?: string;
  celular?: string;
  email?: string;
  telefone?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  nomeConjuge?: string;
  dataNascimentoConjuge?: string;
  filiacaoPaiConjuge?: string;
  filiacaoMaeConjuge?: string;
  dependentes?: Array<{ nome: string; parentesco: string; profissao?: string; idade?: number }>;
  localTrabalho?: string;
  cargo?: string;
  enderecoTrabalho?: string;
  telefoneTrabalho?: string;
  foto?: string;
  dataCadastro?: string;
  status: string;
  aceitaTermos?: boolean;
  outrasInformacoes?: string;
}

@Injectable({ providedIn: 'root' })
export class MemberDetailStateService {
  private member$ = new BehaviorSubject<MemberForDetail | null>(null);

  setMember(member: MemberForDetail | null): void {
    this.member$.next(member);
  }

  getMember(): MemberForDetail | null {
    return this.member$.value;
  }

  clear(): void {
    this.member$.next(null);
  }
}
