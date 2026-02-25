import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = authService.getCurrentUser();

  // Si l'utilisateur est suspendu, rediriger vers la page de suspension
  if (user && !user.isActive) {
    router.navigate(['/suspended']);
    return false;
  }

  return true;
};
