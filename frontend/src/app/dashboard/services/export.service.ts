import { Injectable } from '@angular/core';

export interface ExportColumn {
  key: string;
  label: string;
  transform?: (row: any) => string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  constructor() {}

  exportToCSV(data: any[], columns: ExportColumn[], filename: string): void {
    // Implementação básica - pode ser expandida depois
    console.log('Export to CSV:', filename, data.length, 'rows');
  }

  exportToExcel(filename: string, columns: ExportColumn[], data: any[], title?: string): void {
    // Implementação básica - pode ser expandida depois
    console.log('Export to Excel:', filename, title || '', data.length, 'rows');
  }

  exportToWord(filename: string, title: string, columns: ExportColumn[], data: any[]): void {
    // Implementação básica - pode ser expandida depois
    console.log('Export to Word:', filename, title, data.length, 'rows');
  }

  exportToPdf(filename: string, title: string, columns: ExportColumn[], data: any[]): void {
    // Implementação básica - pode ser expandida depois
    console.log('Export to PDF:', filename, title, data.length, 'rows');
  }
}

