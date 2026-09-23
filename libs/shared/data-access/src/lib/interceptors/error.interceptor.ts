import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

// Réponses ENTRANTES : si l'API répond 401 (token absent ou expiré), on déconnecte.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 : token absent ou expiré → logout() vide le token et redirige vers /connect.
      if (error.status === 401) {
        auth.logout();
      }
      // 403 : connecté mais pas les droits → retour à la liste, sans déconnecter.
      if (error.status === 403) {
        router.navigate(['/companies']);
      }
      // 404 : la ressource demandée n'existe pas → page not-found.
      if (error.status === 404) {
        router.navigate(['/not-found']);
      }
      // On renvoie l'erreur pour que le service qui a fait l'appel puisse aussi la traiter.
      return throwError(() => error);
    }),
  );
};
