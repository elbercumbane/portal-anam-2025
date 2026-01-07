import { CanActivateFn } from '@angular/router';

// Guard desabilitado - sempre permite acesso
export const authGuard: CanActivateFn = (route, state) => {
  // Sempre permite acesso, sem verificação de autenticação
  return true;
};

