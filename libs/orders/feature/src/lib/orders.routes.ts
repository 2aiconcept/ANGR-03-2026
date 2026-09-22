import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  {
    path: 'list-orders',
    loadComponent: () =>
      import('./pages/page-list-orders/page-list-orders').then((m) => m.PageListOrders),
  },
  {
    path: 'add-order',
    loadComponent: () =>
      import('./pages/page-add-order/page-add-order').then((m) => m.PageAddOrder),
  },
  {
    path: 'edit-order/:id',
    loadComponent: () =>
      import('./pages/page-edit-order/page-edit-order').then((m) => m.PageEditOrder),
  },
];
