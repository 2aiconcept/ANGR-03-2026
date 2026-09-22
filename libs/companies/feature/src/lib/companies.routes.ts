import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: 'list-companies',
    loadComponent: () => import('./pages/page-list-companies/page-list-companies'),
  },
  {
    path: 'add-company',
    loadComponent: () => import('./pages/page-add-company/page-add-company'),
  },
  {
    path: 'edit-company/:id',
    loadComponent: () => import('./pages/page-edit-company/page-edit-company'),
  },
];
