import { Routes } from '@angular/router';
import { authGuard } from '@mini-crm/shared/data-access';
import { notAuthGuard } from '@mini-crm/shared/data-access';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'connect',
    pathMatch: 'full',
  },
  {
    path: 'connect',
    canActivate: [notAuthGuard],
    loadChildren: () => import('@mini-crm/connect/feature').then((m) => m.connectRoutes),
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/companies/feature').then((m) => m.companiesRoutes),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/contacts/feature').then((m) => m.contactsRoutes),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('@mini-crm/orders/feature').then((m) => m.ordersRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('@mini-crm/not-found/feature').then((m) => m.PageNotFound),
  },
];
