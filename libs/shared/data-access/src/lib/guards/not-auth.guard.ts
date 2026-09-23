import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Réservé aux visiteurs non connectés (page de connexion) : un utilisateur déjà connecté est renvoyé vers l'app. */
export const notAuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/companies']);
};
