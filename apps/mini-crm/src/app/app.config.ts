import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from '@mini-crm/shared/data-access';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideRouter(routes)
    provideRouter(routes,  withPreloading(PreloadAllModules)),
    provideHttpClient(),
    { provide: API_URL, useValue: environment.apiBaseUrl },
  ]
};
