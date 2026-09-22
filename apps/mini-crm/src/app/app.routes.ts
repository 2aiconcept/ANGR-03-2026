import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'connect',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('@mini-crm/connect/feature').then((m) => m.connectRoutes),
    },
    {
        path: '',
        loadChildren: () => import('@mini-crm/companies/feature').then((m) => m.companiesRoutes),
    },
    {
        path: '',
        loadChildren: () => import('@mini-crm/contacts/feature').then((m) => m.contactsRoutes),
    },
    {
        path: '',
        loadChildren: () => import('@mini-crm/orders/feature').then((m) => m.ordersRoutes),
    },
    {
        path: '**',
        loadComponent: () => import('@mini-crm/not-found/feature').then((m) => m.PageNotFound)
    },
];


