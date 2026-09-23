import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

// Requêtes SORTANTES : ajoute le token JWT dans l'en-tête Authorization.
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).token();

  // Pas de token (utilisateur non connecté) : la requête part telle quelle.
  if (!token) {
    return next(req);
  }

  // Une requête est immuable : on la clone pour lui ajouter l'en-tête.
  const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(authReq);
};
