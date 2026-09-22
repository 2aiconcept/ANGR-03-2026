import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/page-list-companies/page-list-companies'),
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/page-add-company/page-add-company'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/page-edit-company/page-edit-company'),
  },
];
