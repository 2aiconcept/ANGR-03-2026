import { Routes } from '@angular/router';

export const connectRoutes: Routes = [
  {
    path: 'connect',
    loadComponent: () => import('./pages/page-connect/page-connect').then((m) => m.PageConnect),
  },
];
