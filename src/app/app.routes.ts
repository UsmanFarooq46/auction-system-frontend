import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [

    // Auth routes
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'auctions',
                loadChildren: () => import('./features/auctions/auctions.routes').then(m => m.auctionsRoutes)
            },
            {
                path: 'bids',
                loadChildren: () => import('./features/bids/bids.routes').then(m => m.bidsRoutes),
                canActivate: [AuthGuard]
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(m => m.usersRoutes),
                canActivate: [AuthGuard]
            },
            {
                path: 'payments',
                loadChildren: () => import('./features/payments/payments.routes').then(m => m.paymentsRoutes),
                canActivate: [AuthGuard]
            },
            {
                path: 'admin',
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
                canActivate: [AuthGuard, RoleGuard],
                data: { roles: [UserRole.ADMIN, UserRole.MODERATOR] }
            },
        ]
    },
    // Root route - redirect to login
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    // Wildcard route - redirect to login for any unknown routes
    {
        path: '**',
        redirectTo: '/login'
    }
];
