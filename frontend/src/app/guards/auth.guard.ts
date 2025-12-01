import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Redirecionar para login e salvar a URL de destino
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Verificar se há cotas em falta
  const user = authService.getCurrentUser();
  if (user?.cotasEmFalta) {
    // Permitir acesso apenas à página de pagar cotas
    if (state.url.includes('/pagar-cotas')) {
      return true;
    }
    // Bloquear acesso a outras páginas se houver cotas em falta
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};

