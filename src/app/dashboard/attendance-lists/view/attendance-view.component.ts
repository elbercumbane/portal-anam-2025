import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// ApiService removido - sem backend

type AttendanceListType = 'ATENDIMENTO' | 'FORMACAO';

export interface AttendanceListRecord {
  id: number;
  batchId: string;
  listType: AttendanceListType;
  participantName: string;
  participantContact: string;
  trainingLocation: string;
  province?: string;
  uploadedAt: string;
  fileName?: string;
  originalFileName?: string;
  [key: string]: any;
}

export interface AttendanceListPageResponse {
  records: AttendanceListRecord[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

@Component({
  selector: 'app-attendance-view',
  templateUrl: './attendance-view.component.html',
  styleUrls: ['./attendance-view.component.scss']
})
export class AttendanceViewComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  displayedColumns: string[] = ['participantName', 'participantContact', 'trainingLocation', 'province', 'uploadedAt'];
  attendanceRecords: AttendanceListRecord[] = [];
  isLoading = false;
  listType: AttendanceListType = 'ATENDIMENTO';
  totalRegistros = 0;
  
  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;
  pageIndex = 0;

  constructor(
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadAttendanceLists();
  }

  async loadAttendanceLists(): Promise<void> {
    this.isLoading = true;
    try {
      // Sem backend - dados vazios
      this.attendanceRecords = [];
      this.totalRegistros = 0;
      this.totalPaginas = 1;
      this.paginaAtual = 1;
      this.itensPorPagina = 10;
    } catch (error) {
      console.error('Erro ao carregar listas de presença:', error);
      this.attendanceRecords = [];
      this.totalRegistros = 0;
      this.totalPaginas = 1;
      this.paginaAtual = 1;
    } finally {
      this.isLoading = false;
    }
  }

  async paginaAnterior(): Promise<void> {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      await this.loadAttendanceLists();
    }
  }

  async proximaPagina(): Promise<void> {
    if (this.pageIndex < this.totalPaginas - 1) {
      this.pageIndex++;
      await this.loadAttendanceLists();
    }
  }

  async setListType(type: AttendanceListType): Promise<void> {
    if (this.listType === type) {
      return;
    }
    this.listType = type;
    this.pageIndex = 0;
    await this.loadAttendanceLists();
  }

  getColumnLabel(column: string): string {
    const labels: { [key: string]: string } = {
      'participantName': 'Nome',
      'participantContact': 'Contacto',
      'trainingLocation': 'Local de Formação',
      'province': 'Província',
      'uploadedAt': 'Data de Upload'
    };
    return labels[column] || column;
  }

  getCellValue(record: AttendanceListRecord, column: string): string {
    if (column === 'uploadedAt') {
      return record.uploadedAt;
    }
    const value = (record as any)[column];
    return value !== undefined && value !== null && value !== '' ? value : '-';
  }

  goBackToDashboard(): void {
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  async refresh(): Promise<void> {
    await this.loadAttendanceLists();
  }
}
