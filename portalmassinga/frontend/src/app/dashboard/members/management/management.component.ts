import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';

interface Member {
  id: string;
  nome: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;
  celular?: string;
  email?: string;
  telefone?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  // Cônjuge
  nomeConjuge?: string;
  dataNascimentoConjuge?: string;
  filiacaoPaiConjuge?: string;
  filiacaoMaeConjuge?: string;
  // Dependentes
  dependentes?: Array<{
    nome: string;
    parentesco: string;
    profissao?: string;
    idade?: number;
  }>;
  // Trabalho
  localTrabalho?: string;
  cargo?: string;
  enderecoTrabalho?: string;
  telefoneTrabalho?: string;
  // Outros
  foto?: string;
  dataCadastro?: string;
  status: string;
  aceitaTermos?: boolean;
  outrasInformacoes?: string;
}

@Component({
  selector: 'app-members-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class MembersManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  members: Member[] = [];
  filteredMembers: Member[] = [];
  selectedMember: Member | null = null;
  editedMember: Member | null = null; // Cópia para edição
  showDetailsModal = false;
  isEditing = false;
  searchTerm = '';
  statusFilter = 'all'; // all, pendente, aprovado, rejeitado
  isLoading = false;
  errorMessage = '';

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiClient.getMembers().subscribe({
      next: (response: any) => {
        const membros = this.extractMembersArray(response);
        if (membros === null) {
          this.members = [];
          this.filteredMembers = [];
          this.isLoading = false;
          return;
        }

        this.members = membros.map((membro: any) => this.mapMembroFromApi(membro));
        this.filteredMembers = [...this.members];
        this.isLoading = false;
      },
      error: (error) => {
        let errorMsg = 'Erro ao carregar membros do servidor';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }

        if (error.status === 401) {
          errorMsg = 'Não autenticado. Faça login novamente.';
        } else if (error.status === 403) {
          errorMsg = 'Acesso negado. Você precisa ser admin.';
        }

        this.errorMessage = errorMsg;
        this.members = [];
        this.filteredMembers = [];
        this.isLoading = false;
      }
    });
  }

  private extractMembersArray(response: any): any[] | null {
    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object') {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response.body)) {
        return response.body;
      }

      const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
      if (arrayKeys.length > 0) {
        return response[arrayKeys[0]];
      }

      if (Object.keys(response).length === 0 || response === null) {
        return [];
      }

      this.errorMessage = `Formato de resposta inesperado. O servidor deve retornar um array, mas retornou: ${JSON.stringify(response).substring(0, 200)}`;
      return null;
    }

    if (response === null || response === undefined) {
      return [];
    }

    this.errorMessage = `Formato de resposta não suportado. Tipo: ${typeof response}`;
    return null;
  }

  private mapMembroFromApi(membro: any): Member {
    const statusMap: Record<string, string> = {
      Pending: 'Pendente',
      Approved: 'Aprovado',
      Rejected: 'Rejeitado'
    };
    const backendStatus = membro.status || 'Pendente';
    const status = statusMap[backendStatus] || backendStatus;

    return {
      id: membro.id,
      nome: membro.nomeCompleto || membro.nome,
      nomePai: membro.nomePai,
      nomeMae: membro.nomeMae,
      dataNascimento: membro.dataNascimento,
      estadoCivil: membro.estadoCivil,
      profissao: membro.profissao,
      celular: membro.celular,
      email: membro.email,
      telefone: membro.telefone,
      rua: membro.rua,
      bairro: membro.bairro,
      cidade: membro.cidade,
      nomeConjuge: membro.nomeConjuge,
      dataNascimentoConjuge: membro.dataNascimentoConjuge,
      filiacaoPaiConjuge: membro.filiacaoPaiConjuge,
      filiacaoMaeConjuge: membro.filiacaoMaeConjuge,
      localTrabalho: membro.localTrabalho,
      cargo: membro.cargo,
      enderecoTrabalho: membro.enderecoTrabalho,
      telefoneTrabalho: membro.telefoneTrabalho,
      foto: membro.foto,
      outrasInformacoes: membro.outrasInformacoes,
      dataCadastro: membro.dataCadastro,
      status,
      aceitaTermos: membro.aceitaTermos,
      dependentes: []
    };
  }

  filterMembers(): void {
    this.filteredMembers = this.members.filter(member => {
      const matchesSearch = !this.searchTerm || 
        member.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.celular?.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || 
        member.status?.toLowerCase() === this.statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterMembers();
  }

  onStatusFilterChange(): void {
    this.filterMembers();
  }

  viewMemberDetails(member: Member): void {
    this.selectedMember = member;
    this.editedMember = JSON.parse(JSON.stringify(member)); // Cópia profunda
    this.isEditing = false;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMember = null;
    this.editedMember = null;
    this.isEditing = false;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.editedMember) {
      // Se cancelar edição, restaurar dados originais
      this.editedMember = JSON.parse(JSON.stringify(this.selectedMember!));
    }
  }

  saveMemberChanges(): void {
    if (!this.editedMember || !this.selectedMember) return;
    
    // Validar campos obrigatórios
    if (!this.editedMember.nome || !this.editedMember.nomePai || !this.editedMember.nomeMae ||
        !this.editedMember.dataNascimento || !this.editedMember.estadoCivil || !this.editedMember.profissao ||
        !this.editedMember.celular || !this.editedMember.email || !this.editedMember.rua ||
        !this.editedMember.bairro || !this.editedMember.cidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Nota: A edição de membros não está implementada no backend
    alert('Nota: A edição de membros ainda não está disponível no backend. As alterações não foram salvas.');
    this.isEditing = false;
  }

  updateMemberStatus(memberId: string, newStatus: string): void {
    if (newStatus === 'Aprovado') {
      this.approveMember(memberId);
    } else if (newStatus === 'Rejeitado') {
      this.rejectMember(memberId);
    }
    // Fechar modal após ação
    if (this.showDetailsModal) {
      setTimeout(() => {
        this.closeDetailsModal();
      }, 100);
    }
  }

  approveMember(memberId: string): void {
    const member = this.members.find(m => m.id === memberId);
    const memberEmail = member?.email || 'o email cadastrado';

    const confirmMessage = `Tem certeza que deseja aprovar este membro?\n\n` +
      `Isso irá:\n` +
      `✅ Atualizar o status para "Aprovado"\n` +
      `✅ Criar credenciais de acesso à área de membros\n\n` +
      `📧 Email: ${memberEmail}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoading = true;
    this.apiClient.approveMember(memberId).subscribe({
      next: () => {
        alert(`✅ Membro aprovado com sucesso!\n\n📧 Email: ${memberEmail}`);
        this.loadMembers();
      },
      error: (error) => {
        alert('Erro ao aprovar membro: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        this.isLoading = false;
      }
    });
  }

  rejectMember(memberId: string): void {
    const observacoes = prompt('Digite as observações para a rejeição (opcional):');

    this.isLoading = true;
    this.apiClient.rejectMember(memberId, observacoes || undefined).subscribe({
      next: () => {
        alert('Membro rejeitado com sucesso.');
        this.loadMembers();
      },
      error: (error) => {
        alert('Erro ao rejeitar membro: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        this.isLoading = false;
      }
    });
  }

  deactivateMember(member: Member): void {
    if (!confirm(`Tem certeza que deseja desativar ${member.nome}?`)) {
      return;
    }
    this.isLoading = true;
    this.apiClient.deactivateMemberApplication(member.id).subscribe({
      next: () => {
        alert('Membro desativado com sucesso.');
        this.loadMembers();
      },
      error: (error) => {
        alert('Erro ao desativar membro: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        this.isLoading = false;
      }
    });
  }

  deleteMember(memberId: string): void {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      alert('Nota: A exclusão de membros ainda não está disponível no backend.');
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'status-approved';
      case 'Rejeitado':
        return 'status-rejected';
      case 'Pendente':
      default:
        return 'status-pending';
    }
  }

  getTotalMembers(): number {
    return this.members.length;
  }

  getPendingMembers(): number {
    return this.members.filter(m => m.status === 'Pendente').length;
  }

  getApprovedMembers(): number {
    return this.members.filter(m => m.status === 'Aprovado').length;
  }

  getEstadoCivilLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'uniao_marital': 'União Marital',
      'viuvo': 'Viúvo(a)',
      'divorciado': 'Divorciado(a)'
    };
    return labels[value.toLowerCase()] || value;
  }

  getParentescoLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'filho': 'Filho(a)',
      'enteado': 'Enteado(a)',
      'outro': 'Outro'
    };
    return labels[value] || value;
  }
}

