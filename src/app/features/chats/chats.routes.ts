import { Routes } from '@angular/router';

export const chatsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./inbox/inbox.component').then((m) => m.InboxComponent),
  },
  {
    path: 'conversation/:conversationId',
    loadComponent: () => import('./inbox/inbox.component').then((m) => m.InboxComponent),
  },
  {
    path: ':sellerId',
    loadComponent: () => import('./inbox/inbox.component').then((m) => m.InboxComponent),
  },
];
