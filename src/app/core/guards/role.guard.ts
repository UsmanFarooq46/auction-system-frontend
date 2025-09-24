import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectAuthUser } from '../../state/auth/auth.selectors';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(route: any) {
    return this.store.select(selectAuthUser).pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const requiredRoles = route.data?.['roles'] as UserRole[];
        
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }

        if (requiredRoles.includes(user.role)) {
          return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
