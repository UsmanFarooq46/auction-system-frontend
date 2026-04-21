import { Routes } from '@angular/router';

export const auctionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then(m => m.ListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.component').then(m => m.CreateAuctionComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent)
  }
];
