import { Routes } from '@angular/router';

export const paymentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'checkout/:auctionId',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
  }
];
