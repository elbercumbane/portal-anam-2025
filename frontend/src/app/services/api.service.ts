import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface HomeHeaderTexts {
  title: string;
  subtitle: string;
}

export interface HomeCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface Problema {
  tipo: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor() {}

  // Métodos básicos para evitar erros de compilação
  get(endpoint: string): Promise<any> {
    return Promise.resolve([]);
  }

  post(endpoint: string, data: any): Promise<any> {
    return Promise.resolve({});
  }

  put(endpoint: string, data: any): Promise<any> {
    return Promise.resolve({});
  }

  delete(endpoint: string): Promise<any> {
    return Promise.resolve({});
  }

  // Métodos específicos do dashboard
  getFaeList(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getEconomicAgentList(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getUserEvaluationList(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getTrainingList(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getUsers(): Promise<any[]> {
    return Promise.resolve([]);
  }

  getAttendanceLists(type?: string, page?: number, size?: number): Promise<any> {
    return Promise.resolve({
      records: [],
      totalElements: 0,
      totalPages: 0,
      page: page || 0,
      size: size || 10
    });
  }

  uploadAttendanceList(file: File, type: string): Promise<any> {
    return Promise.resolve({ success: true, message: 'Upload simulado' });
  }
}

