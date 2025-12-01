import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  nome: string;
  role: string;
  cotasEmFalta?: {
    meses: number;
    dataVencimento: string;
    valorTotal: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Contas de teste
  private testAccounts = [
    {
      email: 'guilherme@gmail.com',
      password: '123456',
      nome: 'Guilherme Silva',
      role: 'membro',
      cotasEmFalta: null
    },
    {
      email: 'elber@gmail.com',
      password: '123456',
      nome: 'Elber Cumbane',
      role: 'membro',
      cotasEmFalta: {
        meses: 3,
        dataVencimento: '2024-12-31',
        valorTotal: 3600
      }
    }
  ];

  constructor(private router: Router) {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message?: string; user?: User }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Verificar credenciais de teste
        const account = this.testAccounts.find(acc => acc.email === email && acc.password === password);
        
        if (account) {
          const user: User = {
            email: account.email,
            nome: account.nome,
            role: account.role,
            cotasEmFalta: account.cotasEmFalta || undefined
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('authToken', 'mock-token-' + Date.now());
          this.currentUserSubject.next(user);
          
          observer.next({ success: true, user });
          observer.complete();
        } else {
          observer.next({ success: false, message: 'Email ou senha incorretos' });
          observer.complete();
        }
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}

