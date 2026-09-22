import { Routes } from '@angular/router';

export const contactsRoutes: Routes = [
  {
    path: 'list-contacts',
    loadComponent: () =>
      import('./pages/page-list-contacts/page-list-contacts').then((m) => m.PageListContacts),
  },
  {
    path: 'add-contact',
    loadComponent: () =>
      import('./pages/page-add-contact/page-add-contact').then((m) => m.PageAddContact),
  },
  {
    path: 'edit-contact/:id',
    loadComponent: () =>
      import('./pages/page-edit-contact/page-edit-contact').then((m) => m.PageEditContact),
  },
];
