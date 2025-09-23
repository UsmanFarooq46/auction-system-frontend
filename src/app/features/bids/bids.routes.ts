import { Routes } from '@angular/router';

export const bidsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./bids.component').then(m => m.BidsComponent)
  }
];
