import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { STORAGE_KEYS } from './auth.data';
import { environment } from '../../environments/environment';

// Usar variável de ambiente ou fallback para localhost
const API_URL = (typeof window !== 'undefined' && (window as any).__API_URL__) 
  || environment.apiUrl 
  || 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${API_URL}/auth/me`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Member Application endpoints
  createApplication(data: any): Observable<any> {
    console.log('🌐 Criando candidatura:', `${API_URL}/member-applications`);
    console.log('📤 Dados enviados:', data);
    
    return this.http.post(`${API_URL}/member-applications`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplications(): Observable<any> {
    console.log('🌐 Buscando candidaturas:', `${API_URL}/member-applications`);
    const headers = this.getHeaders();
    console.log('🔑 Headers:', headers.keys());
    
    return this.http.get(`${API_URL}/member-applications`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${API_URL}/member-applications/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  approveApplication(applicationId: string, observacoes?: string): Observable<any> {
    return this.http.put(
      `${API_URL}/member-applications/${applicationId}/approve`,
      { observacoes },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  rejectApplication(applicationId: string, observacoes?: string): Observable<any> {
    return this.http.put(
      `${API_URL}/member-applications/${applicationId}/reject`,
      { observacoes },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Member endpoints
  getMembers(): Observable<any> {
    return this.http.get(`${API_URL}/members`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMemberById(id: string): Observable<any> {
    return this.http.get(`${API_URL}/members/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Health check
  healthCheck(): Observable<any> {
    return this.http.get(`${API_URL.replace('/api', '')}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = error.error.message || 'Erro de conexão';
    } else {
      // Erro do lado do servidor
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors && Array.isArray(error.error.errors)) {
        // Erros de validação
        errorMessage = error.error.errors.map((e: any) => e.msg || e.message).join(', ');
      } else {
        errorMessage = `Erro ${error.status}: ${error.statusText || 'Erro desconhecido'}`;
      }
    }
    
    console.error('API Error:', {
      message: errorMessage,
      status: error.status,
      url: error.url,
      error: error.error
    });
    
    return throwError(() => new Error(errorMessage));
  }
}

