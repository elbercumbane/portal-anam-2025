import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario, STORAGE_KEYS } from './auth.data';
import { buscarMembroPorEmail, buscarMembroPorNome, atualizarDadosMembro } from './member-data.helper';
import { ApiClientService } from './api-client.service';

// Re-exportar User para compatibilidade
export type User = Usuario;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private apiClient: ApiClientService
  ) {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem(STORAGE_KEYS.USUARIO_ATUAL);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    
    if (usuarioSalvo && token) {
      this.currentUserSubject.next(JSON.parse(usuarioSalvo));
      // Verificar se o token ainda é válido
      this.validateToken();
    }
  }

  login(emailOrNuit: string, password: string): Observable<{ success: boolean; message?: string; user?: Usuario }> {
    return this.apiClient.login(emailOrNuit, password).pipe(
      map((response: any) => {
        if (response.success && response.token && response.user) {
          // Salvar token
          localStorage.setItem(STORAGE_KEYS.TOKEN_AUTH, response.token);
          localStorage.setItem(STORAGE_KEYS.LOGIN_TIMESTAMP, Date.now().toString());
          const usuario: Usuario = {
            email: response.user.email,
            nome: response.user.nome || response.user.full_name,
            role: response.user.role || 'membro',
            memberId: response.user.memberId || response.user.member_id,
            mustChangePassword: response.user.mustChangePassword === true,
            cotasEmFalta: response.user.cotasEmFalta
          };
          localStorage.setItem(STORAGE_KEYS.USUARIO_ATUAL, JSON.stringify(usuario));
          this.currentUserSubject.next(usuario);
          if (usuario.memberId) this.loadMemberData(usuario.memberId);
          return { success: true, user: usuario };
        }
        // success=false (ex: membro com cotas em atraso)
        const usuario = response.user ? {
          email: response.user.email,
          nome: response.user.nome || response.user.full_name,
          role: response.user.role || 'membro',
          memberId: response.user.memberId || response.user.member_id,
          mustChangePassword: response.user.mustChangePassword === true,
          cotasEmFalta: response.user.cotasEmFalta
        } as Usuario : undefined;
        return { success: false, message: response.message || 'Erro ao fazer login', user: usuario };
      }),
      catchError((error) => {
        let errorMessage = 'Erro ao conectar com o servidor';
        
        if (error.error) {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.map((e: any) => e.msg || e.message).join(', ');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => ({ success: false, message: errorMessage }));
      })
    );
  }

  private validateToken(): void {
    this.apiClient.validateSession().subscribe({
      next: (result) => {
        if (!result.valid) {
          this.logout();
          return;
        }

        const user = result.user;
        if (!user) {
          return;
        }

        const usuario: Usuario = {
          email: user.email,
          nome: user.nome || user.full_name || user.fullName,
          role: user.role || 'membro',
          memberId: user.memberId || user.member_id,
          mustChangePassword: user.mustChangePassword === true
        };
        this.currentUserSubject.next(usuario);
        localStorage.setItem(STORAGE_KEYS.USUARIO_ATUAL, JSON.stringify(usuario));
      }
    });
  }

  private loadMemberData(memberId: string): void {
    this.apiClient.getMemberById(memberId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          localStorage.setItem(STORAGE_KEYS.DADOS_MEMBRO, JSON.stringify(response.data));
        }
      },
      error: (error) => {
        console.warn('Erro ao carregar dados do membro:', error);
      }
    });
  }

  // Obter dados completos do membro logado
  getCurrentMemberData(): any | null {
    // Primeiro tentar buscar do currentMemberData
    const armazenado = localStorage.getItem(STORAGE_KEYS.DADOS_MEMBRO);
    if (armazenado) {
      try {
        return JSON.parse(armazenado);
      } catch (erro) {
        console.error('Erro ao parsear currentMemberData:', erro);
      }
    }
    
    // Tentar buscar pelo email do usuário atual
    const usuario = this.getCurrentUser();
    if (usuario?.email) {
      const dadosMembro = buscarMembroPorEmail(usuario.email);
      if (dadosMembro) {
        localStorage.setItem(STORAGE_KEYS.DADOS_MEMBRO, JSON.stringify(dadosMembro));
        return dadosMembro;
      }
    }
    
    // Fallback: tentar buscar pelo nome
    if (usuario?.nome) {
      const dadosMembro = buscarMembroPorNome(usuario.nome);
      if (dadosMembro) {
        localStorage.setItem(STORAGE_KEYS.DADOS_MEMBRO, JSON.stringify(dadosMembro));
        return dadosMembro;
      }
    }
    
    return null;
  }

  // Atualizar dados do membro
  updateMemberData(dadosMembro: any): void {
    atualizarDadosMembro(dadosMembro);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USUARIO_ATUAL);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.DADOS_MEMBRO);
    localStorage.removeItem(STORAGE_KEYS.LOGIN_TIMESTAMP);
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userName');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('userProvince');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
  }

  isAuthenticated(): boolean {
    if (this.currentUserSubject.value !== null) {
      return true;
    }
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    const usuarioSalvo = localStorage.getItem(STORAGE_KEYS.USUARIO_ATUAL);
    return !!(token && usuarioSalvo);
  }

  getCurrentUser(): Usuario | null {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }

    const usuarioSalvo = localStorage.getItem(STORAGE_KEYS.USUARIO_ATUAL);
    if (!usuarioSalvo) {
      return null;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo) as Usuario;
      this.currentUserSubject.next(usuario);
      return usuario;
    } catch {
      return null;
    }
  }

  changePassword(newPassword: string): Observable<{ success: boolean; message?: string }> {
    return this.apiClient.changePassword(newPassword).pipe(
      map((res: any) => {
        if (res?.success !== false) {
          const user = this.getCurrentUser();
          if (user) {
            const updated = { ...user, mustChangePassword: false };
            localStorage.setItem(STORAGE_KEYS.USUARIO_ATUAL, JSON.stringify(updated));
            this.currentUserSubject.next(updated);
          }
        }
        return { success: res?.success !== false, message: res?.message };
      }),
      catchError((err) => throwError(() => ({ success: false, message: err?.message || 'Erro ao alterar senha' })))
    );
  }
}
