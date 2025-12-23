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
    
    console.log('📋 Carregando candidaturas...');
    
    this.apiClient.getApplications().subscribe({
      next: (response: any) => {
        console.log('✅ Resposta do servidor:', response);
        
        if (response.success) {
          if (response.data && Array.isArray(response.data)) {
            console.log(`📊 Total de candidaturas recebidas: ${response.data.length}`);
            
            this.members = response.data.map((app: any) => ({
              id: app.id,
              nome: app.nome,
              nomePai: app.nome_pai,
              nomeMae: app.nome_mae,
              dataNascimento: app.data_nascimento,
              estadoCivil: app.estado_civil,
              profissao: app.profissao,
              celular: app.celular,
              email: app.email,
              telefone: app.telefone,
              rua: app.rua,
              bairro: app.bairro,
              cidade: app.cidade,
              nomeConjuge: app.nome_conjuge,
              dataNascimentoConjuge: app.data_nascimento_conjuge,
              filiacaoPaiConjuge: app.filiacao_pai_conjuge,
              filiacaoMaeConjuge: app.filiacao_mae_conjuge,
              localTrabalho: app.local_trabalho,
              cargo: app.cargo,
              enderecoTrabalho: app.endereco_trabalho,
              telefoneTrabalho: app.telefone_trabalho,
              foto: app.foto,
              outrasInformacoes: app.outras_informacoes,
              dataCadastro: app.data_cadastro,
              status: app.status || 'Pendente',
              aceitaTermos: app.aceita_termos
            }));
            
            this.filteredMembers = [...this.members];
            console.log(`✅ ${this.members.length} candidaturas carregadas com sucesso`);
          } else {
            console.warn('⚠️ Resposta sem dados ou dados não é array:', response);
            this.members = [];
            this.filteredMembers = [];
            this.errorMessage = 'Nenhuma candidatura encontrada';
          }
        } else {
          console.error('❌ Resposta sem sucesso:', response);
          this.errorMessage = response.message || 'Erro ao carregar candidaturas';
          this.members = [];
          this.filteredMembers = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar candidaturas:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          status: error.status,
          error: error.error,
          url: error.url
        });
        
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
      `✅ Criar o membro na base de dados\n` +
      `✅ Criar uma conta de usuário para login\n\n` +
      `O membro poderá fazer login com:\n` +
      `📧 Email: ${memberEmail}\n` +
      `🔑 Senha padrão: membro123\n\n` +
      `(O membro deve alterar a senha após o primeiro login)`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoading = true;
    this.apiClient.approveApplication(applicationId).subscribe({
      next: (response: any) => {
        if (response.success) {
          const successMessage = `✅ Candidatura aprovada com sucesso!\n\n` +
            `O membro foi criado na base de dados e já pode fazer login:\n\n` +
            `📧 Email: ${memberEmail}\n` +
            `🔑 Senha: membro123\n\n` +
            `O membro deve ser informado sobre estas credenciais.`;
          
          alert(successMessage);
          this.loadMembers();
        } else {
          alert('Erro ao aprovar candidatura: ' + (response.message || 'Erro desconhecido'));
        }
        this.isLoading = false;
      },
      error: (error) => {
        alert('Erro ao aprovar candidatura: ' + (error.message || 'Erro desconhecido'));
        this.isLoading = false;
        console.error('Erro ao aprovar candidatura:', error);
      }
    });
  }

  rejectApplication(applicationId: string): void {
    const observacoes = prompt('Digite as observações para a rejeição (opcional):');
    
    this.isLoading = true;
    this.apiClient.rejectApplication(applicationId, observacoes || undefined).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Candidatura rejeitada com sucesso.');
          this.loadMembers();
        } else {
          alert('Erro ao rejeitar candidatura: ' + (response.message || 'Erro desconhecido'));
        }
        this.isLoading = false;
      },
      error: (error) => {
        alert('Erro ao rejeitar candidatura: ' + (error.message || 'Erro desconhecido'));
        this.isLoading = false;
        console.error('Erro ao rejeitar candidatura:', error);
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

