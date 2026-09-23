import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL, errorInterceptor, tokenInterceptor } from '@mini-crm/shared/data-access';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideRouter(routes)
    provideRouter(routes,  withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
    { provide: API_URL, useValue: environment.apiBaseUrl },
  ]
};
