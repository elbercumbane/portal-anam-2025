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
    
    this.apiClient.getApplications().subscribe({
      next: (response: any) => {
        let applications: any[] = [];
        
        if (Array.isArray(response)) {
          applications = response;
        } else if (response && typeof response === 'object' && response !== null) {
          if (Array.isArray(response.data)) {
            applications = response.data;
          } else if (Array.isArray(response.body)) {
            applications = response.body;
          } else {
            const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
            if (arrayKeys.length > 0) {
              applications = response[arrayKeys[0]];
            } else if (Object.keys(response).length === 0 || response === null) {
              applications = [];
            } else {
              this.members = [];
              this.filteredMembers = [];
              this.errorMessage = `Formato de resposta inesperado. O servidor deve retornar um array, mas retornou: ${JSON.stringify(response).substring(0, 200)}`;
              this.isLoading = false;
              return;
            }
          }
        } else if (response === null || response === undefined) {
          applications = [];
        } else {
          this.members = [];
          this.filteredMembers = [];
          this.errorMessage = `Formato de resposta não suportado. Tipo: ${typeof response}`;
          this.isLoading = false;
          return;
        }
        
        if (applications.length === 0) {
          this.members = [];
          this.filteredMembers = [];
          this.isLoading = false;
          return;
        }
        
        // Mapear campos do backend (inglês/camelCase) para o formato do frontend
        this.members = applications.map((app: any) => {
          // Converter status do backend (inglês) para português
          const statusMap: { [key: string]: string } = {
            'Pending': 'Pendente',
            'Approved': 'Aprovado',
            'Rejected': 'Rejeitado'
          };
          const backendStatus = app.status || 'Pending';
          const status = statusMap[backendStatus] || backendStatus;
          
          // Mapear dependentes do formato backend (inglês) para frontend (português)
          const dependentesMapeados = (app.dependents || []).map((dep: any) => ({
            nome: dep.name || dep.nome,
            parentesco: dep.relationship || dep.parentesco,
            profissao: dep.profession || dep.profissao,
            idade: dep.age || dep.idade
          }));
          
          return {
            id: app.id,
            nome: app.fullName || app.nome,
            nomePai: app.fatherName || app.nomePai || app.nome_pai,
            nomeMae: app.motherName || app.nomeMae || app.nome_mae,
            dataNascimento: app.birthDate || app.dataNascimento || app.data_nascimento,
            estadoCivil: app.maritalStatus || app.estadoCivil || app.estado_civil,
            profissao: app.profession || app.profissao,
            celular: app.mobilePhone || app.celular,
            email: app.email,
            telefone: app.phone || app.telefone,
            rua: app.street || app.rua,
            bairro: app.neighborhood || app.bairro,
            cidade: app.city || app.cidade,
            nomeConjuge: app.spouseName || app.nomeConjuge || app.nome_conjuge,
            dataNascimentoConjuge: app.spouseBirthDate || app.dataNascimentoConjuge || app.data_nascimento_conjuge,
            filiacaoPaiConjuge: app.spouseFatherName || app.filiacaoPaiConjuge || app.filiacao_pai_conjuge,
            filiacaoMaeConjuge: app.spouseMotherName || app.filiacaoMaeConjuge || app.filiacao_mae_conjuge,
            localTrabalho: app.workplace || app.localTrabalho || app.local_trabalho,
            cargo: app.position || app.cargo,
            enderecoTrabalho: app.workAddress || app.enderecoTrabalho || app.endereco_trabalho,
            telefoneTrabalho: app.workPhone || app.telefoneTrabalho || app.telefone_trabalho,
            foto: app.photo || app.foto,
            outrasInformacoes: app.additionalInformation || app.outrasInformacoes || app.outras_informacoes,
            dataCadastro: app.createdAt || app.dataCadastro || app.data_cadastro,
            status: status,
            aceitaTermos: app.acceptsTerms || app.aceitaTermos || app.aceita_termos,
            dependentes: dependentesMapeados
          };
        });
        
        this.filteredMembers = [...this.members];
        this.isLoading = false;
      },
      error: (error) => {
        let errorMsg = 'Erro ao carregar candidaturas do servidor';
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
    
    // Nota: A edição de candidaturas não está implementada no backend
    // Por enquanto, apenas atualizamos localmente
    alert('Nota: A edição de candidaturas ainda não está disponível no backend. As alterações não foram salvas.');
    this.isEditing = false;
  }

  updateMemberStatus(memberId: string, newStatus: string): void {
    if (newStatus === 'Aprovado') {
      this.approveApplication(memberId);
    } else if (newStatus === 'Rejeitado') {
      this.rejectApplication(memberId);
    }
    // Fechar modal após ação
    if (this.showDetailsModal) {
      setTimeout(() => {
        this.closeDetailsModal();
      }, 100);
    }
  }

  approveApplication(applicationId: string): void {
    const member = this.members.find(m => m.id === applicationId);
    const memberEmail = member?.email || 'o email cadastrado';
    
    const confirmMessage = `Tem certeza que deseja aprovar esta candidatura?\n\n` +
      `Isso irá:\n` +
      `✅ Atualizar o status da candidatura para "Aprovado"\n\n` +
      `📧 Email: ${memberEmail}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoading = true;
    this.apiClient.approveApplication(applicationId).subscribe({
      next: (response: any) => {
        const successMessage = `✅ Candidatura aprovada com sucesso!\n\n` +
          `O status foi atualizado para "Aprovado".\n\n` +
          `📧 Email: ${memberEmail}`;
        
        alert(successMessage);
        // Recarregar lista para atualizar status
        this.loadMembers();
      },
      error: (error) => {
        alert('Erro ao aprovar candidatura: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        this.isLoading = false;
      }
    });
  }

  rejectApplication(applicationId: string): void {
    const observacoes = prompt('Digite as observações para a rejeição (opcional):');
    
    this.isLoading = true;
    // O backend espera um objeto com "observations" no body
    this.apiClient.rejectApplication(applicationId, observacoes || undefined).subscribe({
      next: (response: any) => {
        alert('Candidatura rejeitada com sucesso.');
        // Recarregar lista para atualizar status
        this.loadMembers();
      },
      error: (error) => {
        alert('Erro ao rejeitar candidatura: ' + (error.error?.message || error.message || 'Erro desconhecido'));
        this.isLoading = false;
      }
    });
  }

  deleteMember(memberId: string): void {
    if (confirm('Tem certeza que deseja excluir esta candidatura?')) {
      // Nota: A exclusão de candidaturas não está implementada no backend
      alert('Nota: A exclusão de candidaturas ainda não está disponível no backend.');
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

