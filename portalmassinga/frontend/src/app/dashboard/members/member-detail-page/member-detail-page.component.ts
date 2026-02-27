import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiClientService } from '../../../services/api-client.service';
import { MemberDetailStateService, MemberForDetail } from '../member-detail-state.service';
import { ApproveMemberDialogComponent } from '../modals/approve-member-dialog/approve-member-dialog.component';
import { RejectMemberDialogComponent } from '../modals/reject-member-dialog/reject-member-dialog.component';

@Component({
  selector: 'app-member-detail-page',
  standalone: false,
  templateUrl: './member-detail-page.component.html',
  styleUrls: ['./member-detail-page.component.scss']
})
export class MemberDetailPageComponent implements OnInit {
  @Output() membersUpdated = new EventEmitter<void>();
  @Output() navigationClick = new EventEmitter<any>();
  @ViewChild('photoFileInput') photoFileInput!: ElementRef<HTMLInputElement>;

  member: MemberForDetail | null = null;
  editedMember: MemberForDetail | null = null;
  isEditing = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  photoPreview: string | null = null;
  photoFile: File | null = null;

  constructor(
    private stateService: MemberDetailStateService,
    private router: Router,
    private apiClient: ApiClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.member = this.stateService.getMember();
    if (this.member) {
      this.editedMember = JSON.parse(JSON.stringify(this.member));
    } else {
      // Buscar da API se tiver memberId na URL
      const memberId = new URLSearchParams(window.location.search).get('memberId');
      if (memberId) {
        this.loadMemberFromApi(memberId);
      } else {
        this.errorMessage = 'Membro não encontrado.';
      }
    }
  }

  private loadMemberFromApi(id: string): void {
    this.isLoading = true;
    this.apiClient.getApplicationById(id).subscribe({
      next: (app: any) => {
        this.member = this.mapApiToMember(app);
        this.editedMember = this.member ? JSON.parse(JSON.stringify(this.member)) : null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar dados do membro.';
        this.isLoading = false;
      }
    });
  }

  private mapApiToMember(app: any): MemberForDetail {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Pendente', 'Approved': 'Aprovado', 'Rejected': 'Rejeitado', 'Inactive': 'Inativo'
    };
    const status = statusMap[app.status] || app.status;
    const dependentes = (app.dependents || []).map((d: any) => ({
      nome: d.name || d.nome,
      parentesco: d.relationship || d.parentesco,
      profissao: d.profession || d.profissao,
      idade: d.age || d.idade
    }));
    return {
      id: app.id,
      nome: app.fullName || app.nome,
      nomePai: app.fatherName || app.nomePai,
      nomeMae: app.motherName || app.nomeMae,
      dataNascimento: app.birthDate || app.dataNascimento,
      estadoCivil: app.maritalStatus || app.estadoCivil,
      profissao: app.profession || app.profissao,
      nuit: app.nuit,
      celular: app.mobilePhone || app.celular,
      email: app.email,
      telefone: app.phone || app.telefone,
      rua: app.street || app.rua,
      bairro: app.neighborhood || app.bairro,
      cidade: app.city || app.cidade,
      nomeConjuge: app.spouseName || app.nomeConjuge,
      dataNascimentoConjuge: app.spouseBirthDate || app.dataNascimentoConjuge,
      filiacaoPaiConjuge: app.spouseFatherName || app.filiacaoPaiConjuge,
      filiacaoMaeConjuge: app.spouseMotherName || app.filiacaoMaeConjuge,
      localTrabalho: app.workplace || app.localTrabalho,
      cargo: app.position || app.cargo,
      enderecoTrabalho: app.workAddress || app.enderecoTrabalho,
      telefoneTrabalho: app.workPhone || app.telefoneTrabalho,
      foto: app.photo || app.foto,
      dataCadastro: app.createdAt || app.dataCadastro,
      status,
      aceitaTermos: app.acceptsTerms || app.aceitaTermos,
      outrasInformacoes: app.additionalInformation || app.outrasInformacoes,
      dependentes
    };
  }

  goBack(): void {
    this.stateService.clear();
    this.router.navigate(['/dashboard'], { queryParams: {} });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.editedMember && this.member) {
      this.editedMember = JSON.parse(JSON.stringify(this.member));
      this.photoPreview = null;
      this.photoFile = null;
    }
  }

  triggerPhotoInput(): void {
    this.photoFileInput?.nativeElement?.click();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('A foto deve ter no máximo 2MB', 'Fechar', { duration: 3000, panelClass: ['snackbar-error'] });
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Selecione uma imagem válida (JPG, PNG, etc.)', 'Fechar', { duration: 3000, panelClass: ['snackbar-error'] });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
        this.photoFile = file;
        if (this.editedMember) this.editedMember.foto = this.photoPreview;
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  getDisplayPhoto(): string | null {
    if (this.photoPreview) return this.photoPreview;
    if (this.isEditing && this.editedMember?.foto) return this.editedMember.foto;
    return this.member?.foto || null;
  }

  saveMemberChanges(): void {
    if (!this.editedMember || !this.member) return;
    const m = this.editedMember;
    if (!m.nome || !m.nomePai || !m.nomeMae || !m.dataNascimento || !m.estadoCivil || !m.profissao ||
        !m.celular || !m.email || !m.rua || !m.bairro || !m.cidade) {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000, panelClass: ['snackbar-error'] });
      return;
    }
    this.isSaving = true;
    const payload = this.mapToBackendFormat(m);
    this.apiClient.updateApplication(this.member.id, payload).subscribe({
      next: (app: unknown) => {
        this.member = this.mapApiToMember(app as Record<string, unknown>);
        this.editedMember = JSON.parse(JSON.stringify(this.member));
        this.photoPreview = null;
        this.photoFile = null;
        this.isEditing = false;
        this.isSaving = false;
        this.snackBar.open('Dados salvos com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.membersUpdated.emit();
      },
      error: (e: unknown) => {
        this.snackBar.open('Erro ao salvar: ' + ((e as Error)?.message || 'Erro desconhecido'), 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
        this.isSaving = false;
      }
    });
  }

  private mapToBackendFormat(m: MemberForDetail): Record<string, unknown> {
    const dependents = (m.dependentes || [])
      .filter(d => d.nome && d.parentesco)
      .map(d => ({
        name: d.nome,
        relationship: d.parentesco,
        profession: d.profissao || null,
        age: d.idade || null
      }));
    return {
      photo: this.photoPreview || m.foto || null,
      fullName: m.nome,
      fatherName: m.nomePai,
      motherName: m.nomeMae,
      birthDate: m.dataNascimento,
      maritalStatus: m.estadoCivil,
      profession: m.profissao,
      nuit: m.nuit || null,
      mobilePhone: m.celular,
      email: m.email,
      phone: m.telefone || null,
      street: m.rua,
      neighborhood: m.bairro,
      city: m.cidade,
      spouseName: m.nomeConjuge || null,
      spouseBirthDate: m.dataNascimentoConjuge || null,
      spouseFatherName: m.filiacaoPaiConjuge || null,
      spouseMotherName: m.filiacaoMaeConjuge || null,
      workplace: m.localTrabalho || null,
      position: m.cargo || null,
      workAddress: m.enderecoTrabalho || null,
      workPhone: m.telefoneTrabalho || null,
      additionalInformation: m.outrasInformacoes || null,
      acceptsTerms: m.aceitaTermos ?? false,
      dependents
    };
  }

  approveMember(): void {
    if (!this.member) return;
    const dialogRef = this.dialog.open(ApproveMemberDialogComponent, {
      width: '420px',
      data: { memberName: this.member.nome, memberEmail: this.member.email }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.apiClient.approveApplication(this.member!.id).subscribe({
          next: () => {
            this.member!.status = 'Aprovado';
            this.membersUpdated.emit();
          },
          error: (e: unknown) => {
            this.snackBar.open('Erro: ' + ((e as Error)?.message || 'Erro desconhecido'), 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }

  rejectMember(): void {
    if (!this.member) return;
    const dialogRef = this.dialog.open(RejectMemberDialogComponent, {
      width: '440px',
      data: { memberName: this.member.nome, memberEmail: this.member.email }
    });
    dialogRef.afterClosed().subscribe(obs => {
      if (obs !== null) {
        this.apiClient.rejectApplication(this.member!.id, obs).subscribe({
          next: () => {
            this.member!.status = 'Rejeitado';
            this.membersUpdated.emit();
          },
          error: (e: unknown) => {
            this.snackBar.open('Erro: ' + ((e as Error)?.message || 'Erro desconhecido'), 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
          }
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    return status === 'Aprovado' ? 'status-approved' : status === 'Rejeitado' ? 'status-rejected' :
      status === 'Inativo' ? 'status-inactive' : 'status-pending';
  }

  getEstadoCivilLabel(v?: string): string {
    if (!v) return '-';
    const m: Record<string, string> = { solteiro: 'Solteiro(a)', casado: 'Casado(a)', uniao_marital: 'União Marital', viuvo: 'Viúvo(a)', divorciado: 'Divorciado(a)' };
    return m[v.toLowerCase()] || v;
  }

  getParentescoLabel(v?: string): string {
    if (!v) return '-';
    const m: Record<string, string> = { filho: 'Filho(a)', enteado: 'Enteado(a)', outro: 'Outro', child: 'Filho(a)', stepchild: 'Enteado(a)' };
    return m[v.toLowerCase?.() || v] || v;
  }

  getDependentesEdicao(): Array<{ nome: string; parentesco: string; profissao?: string; idade?: number }> {
    if (!this.editedMember) return [];
    if (!this.editedMember.dependentes) this.editedMember.dependentes = [];
    return this.editedMember.dependentes;
  }

  addDependente(): void {
    if (!this.editedMember) return;
    if (!this.editedMember.dependentes) this.editedMember.dependentes = [];
    this.editedMember.dependentes.push({ nome: '', parentesco: '' });
  }

  removeDependente(index: number): void {
    if (!this.editedMember?.dependentes) return;
    this.editedMember.dependentes.splice(index, 1);
  }
}
