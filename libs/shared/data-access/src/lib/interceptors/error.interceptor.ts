import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

// Réponses ENTRANTES : réagit aux erreurs HTTP globales, quel que soit l'écran.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Notre API répond 401 quand il n'y a pas de token, et 403 quand il est invalide ou expiré.
      // Dans les deux cas, la session n'est plus valable → logout() vide le token et redirige vers /connect.
      if (error.status === 401 || error.status === 403) {
        auth.logout();
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
