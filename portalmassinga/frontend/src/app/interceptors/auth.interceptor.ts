import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { STORAGE_KEYS } from '../services/auth.data';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Adicionar token a todas as requisições (exceto login)
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN_AUTH);
    
    let authReq = req;
    if (token && !req.url.includes('/auth/login')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Removidos redirecionamentos para login
        // Apenas log de erros, sem redirecionamento
        if (error.status === 401) {
          console.warn('Token inválido ou expirado');
        }

        if (error.status === 403) {
          console.warn('Acesso negado');
        }

        return throwError(() => error);
      })
    );
  }
}

