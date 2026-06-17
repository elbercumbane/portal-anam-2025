import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { STORAGE_KEYS } from './auth.data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  // URL padrão para desenvolvimento - hardcoded como fallback final
  private readonly DEFAULT_API_URL = 'http://localhost:8080/api';
  
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
      'Content-Type': 'application/json'
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

  // Auth endpoints (login com email ou NUIT + senha)
  login(emailOrNuit: string, password: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/auth/login`, { emailOrNuit: emailOrNuit.trim(), password })
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

  /** Valida sessão sem derrubar o utilizador em falhas de rede. */
  validateSession(): Observable<{ valid: boolean; user?: any }> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/auth/me`, { headers: this.getHeaders() }).pipe(
      map((response: any) => ({
        valid: true,
        user: response?.user ?? response
      })),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          return of({ valid: false });
        }
        return of({ valid: true });
      })
    );
  }

  changePassword(newPassword: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/auth/change-password`, { newPassword }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
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
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplications(status?: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    let url = `${apiUrl}/member-applications`;
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    const headers = this.getHeaders();
    
    return this.http.get<any[]>(url, { 
      headers,
      observe: 'body',
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /** Conta candidaturas pendentes de aprovação */
  getPendingApplicationsCount(): Observable<number> {
    return this.getApplications('Pending').pipe(
      map((res: any) => {
        const arr = Array.isArray(res) ? res : (res?.data || res?.body || []);
        return Array.isArray(arr) ? arr.length : 0;
      })
    );
  }

  getApplicationById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/member-applications/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /** Situação de cotas por NUIT (página Pagar Cotas — público) */
  getQuotaStatusByNuit(nuit: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const trimmed = (nuit || '').trim();
    if (!trimmed) {
      return throwError(() => new Error('NUIT é obrigatório'));
    }
    return this.http.get(`${apiUrl}/quota-payments/status/by-nuit/${encodeURIComponent(trimmed)}`)
      .pipe(catchError(this.handleError));
  }

  /** Situação de cotas por ID do membro (utilizador autenticado) */
  getQuotaStatusByMemberId(memberId: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/quota-payments/status/member/${memberId}`)
      .pipe(catchError(this.handleError));
  }

  /** Busca candidatura por NUIT (para página Pagar Cotas) - endpoint público */
  getApplicationByNuit(nuit: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    const trimmed = (nuit || '').trim();
    if (!trimmed) {
      return throwError(() => new Error('NUIT é obrigatório'));
    }
    return this.http.get(`${apiUrl}/member-applications/by-nuit/${encodeURIComponent(trimmed)}`)
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

  /** Desativa uma candidatura/membro (soft delete) */
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

  /** Atualiza uma candidatura (edição) */
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

  // Member endpoints
  getMembers(): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/members`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMemberById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/members/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supporter registrations (Torne-se Apoiante)
  createSupporterRegistration(data: {
    fullName: string;
    email: string;
    phone: string;
    supportType: string;
    description: string;
    anonymous: boolean;
    wantsAccount?: boolean;
    phone2?: string;
    phoneWhatsApp?: boolean;
    phone2WhatsApp?: boolean;
    registrationDevice?: string;
    registrationBrowser?: string;
  }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/supporter-registrations`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  getSupporterRegistrations(): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/supporter-registrations`, {
      headers: this.getHeaders(),
      observe: 'body',
      responseType: 'json'
    }).pipe(catchError(this.handleError));
  }

  getSupporterRegistrationById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/supporter-registrations/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  patchSupporterRegistration(id: string, data: { fundsConfirmed?: boolean; accountCreated?: boolean }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.patch(`${apiUrl}/supporter-registrations/${id}`, data, {
      headers: { ...this.getHeaders(), 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  // Sympathizer registrations (Torne-se Simpatizante)
  createSympathizerRegistration(data: {
    fullName: string;
    email: string;
    phone?: string;
    nuit?: string;
    areaInterest: string;
    acceptCommunications: boolean;
    registrationDevice?: string;
    registrationBrowser?: string;
  }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/sympathizer-registrations`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  getSympathizerRegistrations(): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/sympathizer-registrations`, {
      headers: this.getHeaders(),
      observe: 'body',
      responseType: 'json'
    }).pipe(catchError(this.handleError));
  }

  getSympathizerRegistrationById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/sympathizer-registrations/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Event registrations (Inscrições em Eventos)
  createEventRegistration(data: {
    eventId: string;
    eventTitle: string;
    eventDate?: string;
    eventLocation?: string;
    fullName: string;
    email: string;
    phone: string;
    participantType: string;
    receiveWhatsApp?: boolean;
    registrationDevice?: string;
    registrationBrowser?: string;
  }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/event-registrations`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  getEventRegistrations(eventId?: string, participantType?: string): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    let params = new HttpParams();
    if (eventId && eventId.trim()) {
      params = params.set('eventId', eventId.trim());
    }
    if (participantType && participantType.trim()) {
      params = params.set('participantType', participantType.trim());
    }
    return this.http.get<any[]>(`${apiUrl}/event-registrations`, {
      headers: this.getHeaders(),
      params
    }).pipe(catchError(this.handleError));
  }

  getEventRegistrationById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/event-registrations/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Events (Gestão de Eventos - lista de eventos com contagem de inscrições)
  getEvents(): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/events`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getEventById(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.get(`${apiUrl}/events/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateEvent(id: string, data: Partial<{
    title: string;
    eventDate: string;
    eventDateStart: string;
    eventDateEnd: string;
    endDate: string;
    location: string;
    timeSlot: string;
    description: string;
    imageUrl: string;
    levelAccess: string;
  }>): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(`${apiUrl}/events/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  createEvent(data: {
    title: string;
    eventDateStart?: string;
    eventDateEnd?: string;
    endDate?: string;
    location?: string;
    timeSlot?: string;
    description?: string;
    imageUrl?: string;
    levelAccess?: string;
  }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/events`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  cancelEvent(id: string, message: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.request<any>('delete', `${apiUrl}/events/${id}`, {
      body: { message },
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  // Users (Gestão de Usuários)
  getUsers(): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/users`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createUser(data: { nuit?: string; email?: string; fullName?: string; role?: string }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/users`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, data: { email?: string; password?: string; fullName?: string; role?: string; active?: boolean }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.put(`${apiUrl}/users/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.delete(`${apiUrl}/users/${id}`, { headers: this.getHeaders() })
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

    // Ligação recusada ou falha de rede (status 0) = backend não está a correr ou inacessível
    if (error.status === 0 || error.status == null) {
      errorMessage = 'Não foi possível ligar ao servidor. Certifique-se de que o backend está a correr (na pasta backend execute: mvnw.cmd spring-boot:run).';
    } else if (error.error instanceof ErrorEvent) {
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

  // Home Content Management
  getHomeContent(activeOnly: boolean = false): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    const url = `${apiUrl}/home-content${activeOnly ? '?activeOnly=true' : ''}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() })
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

  // Quota payments (Gestão de Cotas)
  getMembersQuotaSummary(situacao?: 'COM_DIVIDAS' | 'EM_DIA', search?: string): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    const params = new URLSearchParams();
    if (situacao) params.set('situacao', situacao);
    if (search && search.trim()) params.set('search', search.trim());
    const query = params.toString();
    const url = `${apiUrl}/quota-payments/members-summary${query ? '?' + query : ''}`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getMemberQuotaStatement(memberId: string): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/quota-payments/member/${memberId}/statement`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createQuotaPayment(data: {
    memberApplicationId: string;
    year: number;
    months: number[];
    paymentDate?: string;
    paymentMethod: string;
    reference?: string;
  }): Observable<any> {
    const apiUrl = this.getApiUrl();
    return this.http.post(`${apiUrl}/quota-payments`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getHomeContentByPrefix(prefix: string): Observable<any[]> {
    const apiUrl = this.getApiUrl();
    return this.http.get<any[]>(`${apiUrl}/home-content/sections/${prefix}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

