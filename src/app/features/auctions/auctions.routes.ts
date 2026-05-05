import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

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
    path: 'my-auctions',
    loadComponent: () => import('./my-auctions/my-auctions.component').then(m => m.MyAuctionsComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit/edit.component').then(m => m.EditAuctionComponent)
  },
  {
    path: 'bid/:id',
    loadComponent: () => import('./place-bid/place-bid.component').then(m => m.PlaceBidComponent),
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent)
  }
];
