import { Component } from '@angular/core';
import { ApiClientService } from '../../../services/api-client.service';

interface ExtractedMember {
  // Personal data
  foto: string | null;
  nomeCompleto: string;
  nomePai: string;
  nomeMae: string;
  dataNascimento: string;
  estadoCivil: string;
  profissao: string;
  // Contact
  celular: string;
  email: string;
  telefone: string | null;
  rua: string;
  bairro: string;
  cidade: string;
  // Spouse
  nomeConjuge: string | null;
  dataNascimentoConjuge: string | null;
  filiacaoPaiConjuge: string | null;
  filiacaoMaeConjuge: string | null;
  // Work
  localTrabalho: string | null;
  cargo: string | null;
  enderecoTrabalho: string | null;
  telefoneTrabalho: string | null;
  // Other
  outrasInformacoes: string | null;
  aceitaTermos: boolean;
  // UI state
  _index: number;
  _saved: boolean;
  _saving: boolean;
  _error: string | null;
}

@Component({
  selector: 'app-members-pdf-registration',
  templateUrl: './pdf-registration.component.html',
  styleUrls: ['./pdf-registration.component.scss']
})
export class MembersPdfRegistrationComponent {

  phase: 'upload' | 'loading' | 'review' = 'upload';
  isDragging = false;
  selectedFile: File | null = null;
  extractedMembers: ExtractedMember[] = [];
  processingMessage = 'A analisar o PDF com inteligência artificial...';
  overallError = '';
  savedCount = 0;

  readonly MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

  readonly maritalStatusOptions = [
    'Solteiro(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viúvo(a)',
    'União de Facto'
  ];

  constructor(private apiClient: ApiClientService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    this.overallError = '';

    if (file.type !== 'application/pdf') {
      this.overallError = 'O ficheiro deve ser um PDF.';
      return;
    }

    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      this.overallError = 'O ficheiro excede o limite de 20MB.';
      return;
    }

    this.selectedFile = file;
  }

  onProcessPdf(): void {
    if (!this.selectedFile) return;

    this.phase = 'loading';
    this.overallError = '';
    this.savedCount = 0;

    this.apiClient.uploadPdfMembers(this.selectedFile).subscribe({
      next: (response: any) => {
        this.extractedMembers = (response.members || []).map((m: any, i: number) => ({
          ...m,
          dataNascimento: m.dataNascimento || '',
          dataNascimentoConjuge: m.dataNascimentoConjuge || null,
          aceitaTermos: true,
          foto: null,
          _index: i,
          _saved: false,
          _saving: false,
          _error: null
        }));
        this.phase = 'review';
      },
      error: (err: any) => {
        this.overallError = err.message || 'Erro ao processar o PDF. Tente novamente.';
        this.phase = 'upload';
      }
    });
  }

  onSaveMember(member: ExtractedMember): void {
    member._saving = true;
    member._error = null;

    const payload = this.toMemberPayload(member);

    this.apiClient.criarMembro(payload).subscribe({
      next: () => {
        member._saved = true;
        member._saving = false;
        this.savedCount++;
      },
      error: (err: any) => {
        member._error = err.message || 'Erro ao guardar membro.';
        member._saving = false;
      }
    });
  }

  onSaveAll(): void {
    const unsaved = this.extractedMembers.filter(m => !m._saved && !m._saving);
    unsaved.forEach(m => this.onSaveMember(m));
  }

  onReset(): void {
    this.phase = 'upload';
    this.selectedFile = null;
    this.extractedMembers = [];
    this.overallError = '';
    this.savedCount = 0;
  }

  get allSaved(): boolean {
    return this.extractedMembers.length > 0 && this.extractedMembers.every(m => m._saved);
  }

  get anyUnsaved(): boolean {
    return this.extractedMembers.some(m => !m._saved && !m._saving);
  }

  isFieldEmpty(value: string | null | undefined): boolean {
    return !value || value.trim() === '';
  }

  private toMemberPayload(member: ExtractedMember): any {
    const { _index, _saved, _saving, _error, ...payload } = member;
    return payload;
  }
}
