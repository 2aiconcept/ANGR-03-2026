import { Routes } from '@angular/router';
import { companiesResolver } from '@mini-crm/companies/data-access';

export const companiesRoutes: Routes = [
  {
    path: '',
    resolve: [companiesResolver],

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
