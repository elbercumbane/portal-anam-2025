import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { STORAGE_KEYS } from './auth.data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  // URL padrão para desenvolvimento - hardcoded como fallback final
  private readonly DEFAULT_API_URL = 'http://localhost:8081/api';
  
  // Método para obter a URL da API dinamicamente
  private getApiUrl(): string {
    // Em desenvolvimento (não produção), sempre usar environment.apiUrl ou padrão
    if (!environment.production) {
      // Tentar usar environment.apiUrl primeiro
      const envUrl = environment?.apiUrl;
      if (envUrl && 
          typeof envUrl === 'string' && 
          envUrl.trim() !== '' &&
          envUrl !== 'API_URL_PLACEHOLDER' && 
          !envUrl.includes('PLACEHOLDER')) {
        return envUrl.trim();
      }
      // Se environment.apiUrl não estiver válido, usar padrão hardcoded
      console.warn('⚠️ environment.apiUrl não está válido, usando URL padrão:', this.DEFAULT_API_URL);
      return this.DEFAULT_API_URL;
    }
    
    // Em produção, verificar se há uma URL injetada no window
    if (typeof window !== 'undefined' && (window as any).__API_URL__) {
      const windowUrl = (window as any).__API_URL__;
      // Se não for placeholder, usar a URL do window
      if (windowUrl && 
          typeof windowUrl === 'string' &&
          windowUrl.trim() !== '' &&
          windowUrl !== 'API_URL_PLACEHOLDER' && 
          !windowUrl.includes('PLACEHOLDER')) {
        return windowUrl.trim();
      }
    }
    
    // Fallback final: usar environment ou padrão hardcoded
    const envUrl = environment?.apiUrl;
    if (envUrl && 
        typeof envUrl === 'string' &&
        envUrl.trim() !== '' &&
        envUrl !== 'API_URL_PLACEHOLDER' && 
        !envUrl.includes('PLACEHOLDER')) {
      return envUrl.trim();
    }
    
    // Último recurso: usar URL padrão hardcoded
    return this.DEFAULT_API_URL;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  constructor(private http: HttpClient) {
    // Log da URL configurada ao inicializar o serviço
    const apiUrl = this.getApiUrl();
    console.log('🔧 API Client Service inicializado. URL:', apiUrl);
  }

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/auth/login`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/auth/me`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Member Application endpoints
  createApplication(data: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    
    // Logs de debug
    console.log('🔧 Environment production:', environment.production);
    console.log('🔧 Environment apiUrl:', environment?.apiUrl);
    console.log('🔧 Window __API_URL__:', typeof window !== 'undefined' ? (window as any).__API_URL__ : 'N/A');
    console.log('🔧 URL final resolvida:', apiUrl);
    console.log('🌐 Criando candidatura - URL completa:', `${apiUrl}/member-applications`);
    console.log('📤 Dados enviados:', data);
    
    // Validação rigorosa da URL
    if (!apiUrl || 
        apiUrl === 'API_URL_PLACEHOLDER' || 
        apiUrl.includes('PLACEHOLDER') ||
        apiUrl.trim() === '') {
      const errorMsg = `URL da API inválida: "${apiUrl}". Verifique o environment.ts. URL esperada: http://localhost:8080/api`;
      console.error('❌ ERRO:', errorMsg);
      return throwError(() => new Error(errorMsg));
    }
    
    return this.http.post(`${apiUrl}/member-applications`, data, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplications(): Observable<any> {
    const apiUrl = this.getApiUrl();
    const url = `${apiUrl}/member-applications`;
    const headers = this.getHeaders();
    
    return this.http.get<any[]>(url, { 
      headers,
      observe: 'body',
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  getApplicationById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/member-applications/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  approveApplication(applicationId: string, observacoes?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(
      `${apiUrl}/member-applications/${applicationId}/approve`,
      { observacoes },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  rejectApplication(applicationId: string, observacoes?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const body = observacoes ? { observations: observacoes } : null;
    return this.http.put(
      `${apiUrl}/member-applications/${applicationId}/reject`,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deactivateMemberApplication(applicationId: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(
      `${apiUrl}/member-applications/${applicationId}/deactivate`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateApplication(applicationId: string, data: Record<string, unknown>): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(
      `${apiUrl}/member-applications/${applicationId}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Member endpoints (tabela membros)
  criarMembro(data: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    
    console.log('🌐 Criando membro - URL completa:', `${apiUrl}/membros`);
    console.log('📤 Dados enviados:', data);
    
    return this.http.post(`${apiUrl}/membros`, data, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMembers(status?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const url = status
      ? `${apiUrl}/membros?status=${encodeURIComponent(status)}`
      : `${apiUrl}/membros`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  approveMember(memberId: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(
      `${apiUrl}/membros/${memberId}/aprovar`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  rejectMember(memberId: string, observacoes?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(
      `${apiUrl}/membros/${memberId}/rejeitar`,
      observacoes || null,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getMemberById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/membros/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // PDF member extraction
  uploadPdfMembers(file: File): Observable<any> {
    const apiUrl = this.getApiUrl();
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Only set Authorization header — let browser set Content-Type with multipart boundary
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    const headers = token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post(`${apiUrl}/membros/upload-pdf`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Health check
  healthCheck(): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl.replace('/api', '')}/health`)
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
    
    // Criar um erro customizado que preserva o status HTTP
    const customError: any = new Error(errorMessage);
    customError.status = error.status;
    customError.statusText = error.statusText;
    customError.url = error.url;
    customError.error = error.error;
    
    return throwError(() => customError);
  }

  // Home Content Management
  getHomeContent(activeOnly: boolean = false): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    const url = `${apiUrl}/home-content${activeOnly ? '?activeOnly=true' : ''}`;
    // Não requer autenticação para acesso público
    return this.http.get<any[]>(url)
      .pipe(catchError(this.handleError));
  }

  getHomeContentById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/home-content/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getHomeContentBySectionKey(sectionKey: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/home-content/section/${sectionKey}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createHomeContent(content: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/home-content`, content, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateHomeContent(id: string, content: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(`${apiUrl}/home-content/${id}`, content, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteHomeContent(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.delete(`${apiUrl}/home-content/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getHomeContentByPrefix(prefix: string): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/home-content/sections/${prefix}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  initializeHomeContent(): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/home-content/initialize`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  migrateImageUrl(): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/home-content/migrate-image-url`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Apoiante endpoints
  criarApoiante(data: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    
    console.log('🌐 Criando apoiante - URL completa:', `${apiUrl}/apoiantes`);
    console.log('📤 Dados enviados:', data);
    
    return this.http.post(`${apiUrl}/apoiantes`, data, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getApoiantes(status?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const url = status ? `${apiUrl}/apoiantes?status=${status}` : `${apiUrl}/apoiantes`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getApoianteById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/apoiantes/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getApoianteByEmail(email: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/apoiantes/email/${email}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Simpatizante endpoints
  criarSimpatizante(data: any): Observable<any> {
    const apiUrl = this.getApiUrl();
    
    console.log('🌐 Criando simpatizante - URL completa:', `${apiUrl}/simpatizantes`);
    console.log('📤 Dados enviados:', data);
    
    return this.http.post(`${apiUrl}/simpatizantes`, data, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getSimpatizantes(status?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const url = status ? `${apiUrl}/simpatizantes?status=${status}` : `${apiUrl}/simpatizantes`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getSimpatizanteById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/simpatizantes/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getSimpatizanteByEmail(email: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/simpatizantes/email/${email}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

