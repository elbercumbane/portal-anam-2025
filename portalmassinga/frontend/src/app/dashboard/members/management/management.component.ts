import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiClientService } from '../../../services/api-client.service';
import { MemberDetailStateService } from '../member-detail-state.service';
import { ApproveMemberDialogComponent } from '../modals/approve-member-dialog/approve-member-dialog.component';
import { RejectMemberDialogComponent } from '../modals/reject-member-dialog/reject-member-dialog.component';
import { DeactivateMemberDialogComponent } from '../modals/deactivate-member-dialog/deactivate-member-dialog.component';

interface Member {
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
  @Output() membersUpdated = new EventEmitter<void>();  // Emitido quando aprovar/rejeitar/desativar

  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm = '';
  statusFilter = 'all'; // all, pendente, aprovado, rejeitado
  isLoading = false;
  errorMessage = '';

  constructor(
    private apiClient: ApiClientService,
    private dialog: MatDialog,
    private router: Router,
    private memberDetailState: MemberDetailStateService,
    private snackBar: MatSnackBar
  ) {}

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
            'Rejected': 'Rejeitado',
            'Inactive': 'Inativo'
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
            nuit: app.nuit,
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
    this.memberDetailState.setMember(member);
    this.router.navigate(['/dashboard'], { queryParams: { view: 'membro', memberId: member.id } });
  }

  updateMemberStatus(memberId: string, newStatus: string): void {
    if (newStatus === 'Aprovado') {
      this.approveApplication(memberId);
    } else if (newStatus === 'Rejeitado') {
      this.rejectApplication(memberId);
    }
  }

  approveApplication(applicationId: string): void {
    const member = this.members.find(m => m.id === applicationId);
    const memberEmail = member?.email || '';
    const memberName = member?.nome || '';

    const dialogRef = this.dialog.open(ApproveMemberDialogComponent, {
      width: '420px',
      data: { memberName, memberEmail },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.executeApprove(applicationId, memberEmail);
    });
  }

  private executeApprove(applicationId: string, memberEmail: string): void {
    this.isLoading = true;
    this.apiClient.approveApplication(applicationId).subscribe({
      next: (response: any) => {
        this.snackBar.open('Candidatura aprovada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadMembers();
        this.membersUpdated.emit();
      },
      error: (error) => {
        this.snackBar.open('Erro ao aprovar candidatura: ' + (error.error?.message || error.message || 'Erro desconhecido'), 'Fechar', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
        this.isLoading = false;
      }
    });
  }

  rejectApplication(applicationId: string): void {
    const member = this.members.find(m => m.id === applicationId);
    const dialogRef = this.dialog.open(RejectMemberDialogComponent, {
      width: '440px',
      data: {
        memberName: member?.nome || '',
        memberEmail: member?.email || ''
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(observacoes => {
      if (observacoes === null) return; // Cancelou
      this.executeReject(applicationId, observacoes);
    });
  }

  private executeReject(applicationId: string, observacoes?: string): void {
    this.isLoading = true;
    // O backend espera um objeto com "observations" no body
    this.apiClient.rejectApplication(applicationId, observacoes || undefined).subscribe({
      next: (response: any) => {
        this.snackBar.open('Candidatura rejeitada com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.loadMembers();
        this.membersUpdated.emit();
      },
      error: (error) => {
        this.snackBar.open('Erro ao rejeitar candidatura: ' + (error.error?.message || error.message || 'Erro desconhecido'), 'Fechar', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
        this.isLoading = false;
      }
    });
  }

  deactivateMember(member: Member): void {
    const dialogRef = this.dialog.open(DeactivateMemberDialogComponent, {
      width: '400px',
      data: { memberName: member.nome },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.executeDeactivate(member.id);
    });
  }

  private executeDeactivate(memberId: string): void {
    this.apiClient.deactivateMemberApplication(memberId).subscribe({
      next: () => {
        this.loadMembers();
        this.membersUpdated.emit();
      },
      error: (err) => {
        this.snackBar.open('Erro ao desativar: ' + (err.message || 'Erro desconhecido'), 'Fechar', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'status-approved';
      case 'Rejeitado':
        return 'status-rejected';
      case 'Inativo':
        return 'status-inactive';
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
}

