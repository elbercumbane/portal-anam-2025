import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
// ApiService removido - sem backend
// import * as XLSX from 'xlsx'; // Comentado temporariamente - instalar com: npm install xlsx

type AttendanceListType = 'ATENDIMENTO' | 'FORMACAO';

export interface AttendanceRecord {
  nome: string;
  contacto: string;
  'local de formacao': string;
  curso?: string;
  instituicao?: string;
  tipo?: AttendanceListType;
  [key: string]: any;
}

interface ValidatedBatch {
  file: File;
  records: AttendanceRecord[];
  detectedType?: AttendanceListType;
}

@Component({
  selector: 'app-attendance-upload',
  templateUrl: './attendance-upload.component.html',
  styleUrls: ['./attendance-upload.component.scss']
})
export class AttendanceUploadComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  // Estrutura esperada do Excel
  readonly REQUIRED_COLUMNS = ['nome', 'contacto', 'local de formacao'];
  readonly COLUMN_ALIASES: { [key: string]: string[] } = {
    'nome': ['nome', 'name', 'nomes'],
    'contacto': ['contacto', 'contato', 'telefone', 'phone', 'celular'],
    'local de formacao': ['local de formacao', 'local de formação', 'local', 'localizacao', 'localização', 'endereco', 'endereço']
  };
  readonly TYPE_COLUMN_ALIASES = ['tipo', 'tipo_lista', 'tipo da lista', 'categoria'];

  acceptedTypes = '.xls,.xlsx';
  isDragging = false;
  uploadedFiles: File[] = [];
  isProcessing = false;
  isUploading = false;
  validationErrors: string[] = [];
  listType: AttendanceListType = 'ATENDIMENTO';
  readyBatches: ValidatedBatch[] = [];
  previewRecords: AttendanceRecord[] = [];
  previewColumns: string[] = ['nome', 'contacto', 'local de formacao'];
  previewLimit = 25;

  ngOnInit(): void {}

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (!event.dataTransfer?.files) return;
    this.addFiles(Array.from(event.dataTransfer.files));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  private addFiles(files: File[]): void {
    const validFiles = files.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext === 'xls' || ext === 'xlsx';
    });

    if (validFiles.length !== files.length) {
      this.snackBar.open('Apenas ficheiros Excel (.xls ou .xlsx) são permitidos', 'Fechar', { duration: 3000 });
    }

    this.uploadedFiles.push(...validFiles);
    this.validateFiles(validFiles);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.validationErrors = [];
    this.resetPreview();
  }

  clearAll(): void {
    this.uploadedFiles = [];
    this.validationErrors = [];
    this.resetPreview();
  }

  private async validateFiles(files: File[]): Promise<void> {
    this.isProcessing = true;
    this.validationErrors = [];

    const validatedFiles: ValidatedBatch[] = [];

    try {
      for (const file of files) {
        const validation = await this.validateAndParseExcel(file);
        if (!validation.isValid) {
          this.validationErrors.push(`Arquivo "${file.name}": ${validation.error}`);
        } else if (validation.records) {
          validatedFiles.push({ file, records: validation.records, detectedType: validation.detectedType });
        }
      }

      if (this.validationErrors.length > 0) {
        this.snackBar.open('Erro na validação dos arquivos. Verifique os detalhes.', 'Fechar', { duration: 5000 });
        return;
      }

      this.readyBatches = [...this.readyBatches, ...validatedFiles];
      this.updatePreview(this.readyBatches);
      this.snackBar.open('Pré-visualização gerada. Confirme o envio abaixo.', 'Fechar', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } catch (error) {
      console.error('Erro ao validar arquivos:', error);
      this.snackBar.open('Erro ao validar arquivos', 'Fechar', { duration: 3000 });
    } finally {
      this.isProcessing = false;
  }
  }

  private async persistValidatedFiles(validatedFiles: ValidatedBatch[]): Promise<void> {
    if (validatedFiles.length === 0) {
      return;
    }

    this.isUploading = true;
    let totalRecords = 0;

    const failedFiles: string[] = [];

    try {
      for (const item of validatedFiles) {
        try {
          const targetType = item.detectedType ?? this.listType;
          // Sem backend - apenas simular upload
          console.log('Upload simulado (sem backend):', {
            listType: targetType,
            fileName: this.generateFileName(targetType),
            originalFileName: item.file.name,
            recordsCount: item.records.length
          });
          
          /* Código removido - sem backend
          await this.apiService.uploadAttendanceList({
            listType: targetType,
            fileName: this.generateFileName(targetType),
            originalFileName: item.file.name,
            fileType: item.file.type || 'application/vnd.ms-excel',
            fileSizeBytes: item.file.size,
            records: item.records.map(record => ({
              nome: record.nome,
              contacto: record.contacto,
              localFormacao: record['local de formacao']
            }))
          });
          */
          totalRecords += item.records.length;
        } catch (error) {
          console.error(`Erro ao processar "${item.file.name}"`, error);
          failedFiles.push(item.file.name);
        }
      }

      if (totalRecords > 0) {
        this.snackBar.open(`${totalRecords} registros processados (sem backend) para ${this.getListTypeLabel(this.listType)}`, 'Fechar', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.uploadedFiles = [];
        this.validationErrors = [];
      }

      if (failedFiles.length > 0 || totalRecords === 0) {
        const message = failedFiles.length > 0
          ? `Erro ao processar arquivos: ${failedFiles.join(', ')}`
          : 'Erro ao processar listas de presença. Tente novamente.';
        this.snackBar.open(message, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    } finally {
      this.isUploading = false;
    }
  }

  private validateAndParseExcel(file: File): Promise<{ isValid: boolean; error?: string; records?: AttendanceRecord[]; detectedType?: AttendanceListType }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // XLSX não está instalado - funcionalidade desabilitada temporariamente
          // Para habilitar: npm install xlsx @types/xlsx
          resolve({ isValid: false, error: 'Funcionalidade Excel desabilitada. Instale xlsx: npm install xlsx @types/xlsx' });
          return;
          
          /* TODO: Descomentar quando instalar xlsx
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            resolve({ isValid: false, error: 'Não foi possível ler a folha do Excel' });
            return;
          }
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, { header: 1, raw: false, defval: '' }) as (string | number)[][];
          const cleanedRows = rows.filter((row: any[]) => row.some((cell: any) => (cell?.toString().trim() || '') !== ''));

          if (cleanedRows.length === 0) {
            resolve({ isValid: false, error: 'Ficheiro vazio' });
            return;
          }

          const headerRow = cleanedRows[0].map((cell: any) => cell?.toString().trim().toLowerCase() || '');
          const missingColumns: string[] = [];

          this.REQUIRED_COLUMNS.forEach(requiredCol => {
            const found = headerRow.find((h: string) => {
              const aliases = this.COLUMN_ALIASES[requiredCol] || [];
              return aliases.includes(h) || h === requiredCol;
            });
            if (!found) {
              missingColumns.push(requiredCol);
            }
          });

          if (missingColumns.length > 0) {
            resolve({
              isValid: false,
              error: `Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`
            });
            return;
          }

          const typeHeaderIndex = headerRow.findIndex((h: string) => this.TYPE_COLUMN_ALIASES.includes(h));
          const cursoIndex = headerRow.findIndex((h: string) => h === 'curso');
          const instituicaoIndex = headerRow.findIndex((h: string) => h === 'instituição' || h === 'instituicao');
          const detectedTypes = new Set<AttendanceListType>();
          const records: AttendanceRecord[] = [];

          for (let i = 1; i < cleanedRows.length; i++) {
            const row = cleanedRows[i];
            const record: AttendanceRecord = {
              nome: '',
              contacto: '',
              'local de formacao': ''
            };

            let hasError = false;
            let errorMsg = '';

            this.REQUIRED_COLUMNS.forEach(requiredCol => {
              const headerIndex = headerRow.findIndex((h: string) => {
                const aliases = this.COLUMN_ALIASES[requiredCol] || [];
                return aliases.includes(h) || h === requiredCol;
              });

              if (headerIndex >= 0) {
                const value = row[headerIndex]?.toString().trim() || '';
                if (value === '') {
                  hasError = true;
                  errorMsg = `Linha ${i + 1}: Campo "${requiredCol}" está vazio`;
                  return;
                }
                if (requiredCol === 'local de formacao') {
                  record['local de formacao'] = value;
                } else if (requiredCol === 'nome') {
                  record.nome = value;
                } else if (requiredCol === 'contacto') {
                  record.contacto = value;
                }
              }
            });

            if (hasError) {
              resolve({ isValid: false, error: errorMsg });
              return;
            }

            if (typeHeaderIndex >= 0) {
              const rawType = row[typeHeaderIndex]?.toString().trim();
              if (rawType) {
                const normalized = this.normalizeListType(rawType);
                if (normalized) {
                  detectedTypes.add(normalized);
                  record.tipo = normalized;
                } else {
                  resolve({ isValid: false, error: `Linha ${i + 1}: Valor de tipo inválido "${rawType}"` });
                  return;
                }
              }
            }

            if (cursoIndex >= 0) {
              const cursoValue = row[cursoIndex]?.toString().trim();
              if (cursoValue) {
                record.curso = cursoValue;
              }
            }

            if (instituicaoIndex >= 0) {
              const instituicaoValue = row[instituicaoIndex]?.toString().trim();
              if (instituicaoValue) {
                record.instituicao = instituicaoValue;
              }
            }

            records.push(record);
          }

          if (typeHeaderIndex >= 0 && detectedTypes.size > 1) {
            resolve({ isValid: false, error: 'Arquivo contém mais de um tipo de lista. Separe Atendimento e Formação em ficheiros distintos.' });
            return;
          }

          const detectedType = detectedTypes.size === 1 ? Array.from(detectedTypes)[0] : undefined;

          resolve({ isValid: true, records, detectedType });
          */
        } catch (error) {
          resolve({ isValid: false, error: `Erro ao processar: ${error}` });
        }
      };
      reader.onerror = () => resolve({ isValid: false, error: 'Erro ao ler ficheiro' });
      reader.readAsArrayBuffer(file);
    });
  }

  downloadTemplate(type: AttendanceListType): void {
    const headersBase = ['Tipo', 'Nome', 'Contacto', 'Local de Formação'];
    const headers = type === 'FORMACAO' ? [...headersBase, 'Curso', 'Instituição'] : headersBase;
    const baseLabel = this.getListTypeLabel(type);

    const exampleRows = type === 'FORMACAO'
      ? [
          [baseLabel, 'João Silva', '+258 84 123 4567', 'Sala A - Maputo', 'Curso de Gestão', 'Instituto Nacional'],
          [baseLabel, 'Maria Santos', '+258 85 987 6543', 'Sala B - Beira', 'Curso de Estatística', 'Instituto Nacional'],
          [baseLabel, 'Pedro Costa', '+258 86 555 1234', 'Sala C - Nampula', 'Curso de Auditoria', 'Instituto Nacional']
        ]
      : [
          [baseLabel, 'João Silva', '+258 84 123 4567', 'Sala A - Maputo'],
          [baseLabel, 'Maria Santos', '+258 85 987 6543', 'Sala B - Beira'],
          [baseLabel, 'Pedro Costa', '+258 86 555 1234', 'Sala C - Nampula']
        ];

    // XLSX não está instalado - funcionalidade desabilitada temporariamente
    // Para habilitar: npm install xlsx @types/xlsx
    this.snackBar.open('Funcionalidade Excel desabilitada. Instale xlsx: npm install xlsx @types/xlsx', 'Fechar', { duration: 5000 });
    return;
    
    /* Código comentado até instalar xlsx
    const worksheetData = [headers, ...exampleRows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const fileSuffix = type === 'ATENDIMENTO' ? 'atendimento' : 'formacao';
    XLSX.writeFile(workbook, `template_lista_presenca_${fileSuffix}.xlsx`);

    this.snackBar.open('Template Excel baixado com sucesso!', 'Fechar', { duration: 3000 });
    */
  }

  formatSize(bytes: number): string {
    const units = ['bytes', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIdx = 0;
    while (size >= 1024 && unitIdx < units.length - 1) {
      size /= 1024;
      unitIdx++;
    }
    return `${size.toFixed(unitIdx === 0 ? 0 : 1)} ${units[unitIdx]}`;
  }

  goBackToDashboard(): void {
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  goToView(): void {
    this.navigationClick.emit({ id: 'attendance-lists-view', label: 'Ver Listas', icon: 'visibility', route: 'dashboard/attendance-lists/view', active: true });
  }

  setListType(type: AttendanceListType): void {
    this.listType = type;
  }

  private generateFileName(type: AttendanceListType): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const suffix = type === 'ATENDIMENTO' ? 'atendimento' : 'formacao';
    return `lista-presenca-${suffix}-${timestamp}.xlsx`;
  }

  private normalizeListType(value?: string): AttendanceListType | undefined {
    if (!value) {
      return undefined;
    }
    const normalized = value.trim().toUpperCase();
    if (normalized.startsWith('AT')) {
      return 'ATENDIMENTO';
    }
    if (normalized.startsWith('FO') || normalized.startsWith('FR')) {
      return 'FORMACAO';
    }
    return undefined;
  }

  getListTypeLabel(type: AttendanceListType): string {
    return type === 'ATENDIMENTO' ? 'Atendimento' : 'Formação';
  }

  get totalReadyRecords(): number {
    return this.readyBatches.reduce((sum, batch) => sum + batch.records.length, 0);
  }

  get hasPreview(): boolean {
    return this.readyBatches.length > 0 && this.previewRecords.length > 0;
  }

  getPreviewColumnLabel(column: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      contacto: 'Contacto',
      'local de formacao': 'Local de Formação',
      curso: 'Curso',
      instituicao: 'Instituição',
      tipo: 'Tipo'
    };
    return labels[column] || column;
  }

  async uploadReadyBatches(): Promise<void> {
    if (this.readyBatches.length === 0 || this.isUploading) {
      return;
    }
    await this.persistValidatedFiles(this.readyBatches);
    this.resetPreview();
  }

  private resetPreview(): void {
    this.readyBatches = [];
    this.previewRecords = [];
    this.previewColumns = ['nome', 'contacto', 'local de formacao'];
  }

  private updatePreview(batches: ValidatedBatch[]): void {
    if (!batches || batches.length === 0) {
      this.resetPreview();
      return;
    }

    const columnsSet = new Set<string>(['nome', 'contacto', 'local de formacao']);
    batches.forEach(batch => {
      batch.records.forEach(record => {
        if (record.curso) {
          columnsSet.add('curso');
        }
        if (record.instituicao) {
          columnsSet.add('instituicao');
        }
        if (record.tipo) {
          columnsSet.add('tipo');
        }
      });
    });

    this.previewColumns = Array.from(columnsSet);

    const combined: AttendanceRecord[] = [];
    for (const batch of batches) {
      for (const record of batch.records) {
        if (combined.length >= this.previewLimit) {
          break;
        }
        combined.push(record);
      }
      if (combined.length >= this.previewLimit) {
        break;
      }
    }

    this.previewRecords = combined;
  }

  constructor(private snackBar: MatSnackBar) {}
}
