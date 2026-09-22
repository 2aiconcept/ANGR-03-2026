import { InjectionToken } from '@angular/core';

/**
 * URL de base de l'API, fournie par l'application (voir apps/mini-crm/src/app/app.config.ts).
 * Un jeton d'injection évite qu'une lib importe directement les environments de l'app,
 * ce qui créerait une dépendance circulaire (app -> lib -> app).
 */
export const API_URL = new InjectionToken<string>('API_URL');
