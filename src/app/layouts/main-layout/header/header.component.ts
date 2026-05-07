import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../state/auth/auth.selectors';
import { AuthActions } from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    this.store.select(selectAuthUser).subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  createAuction(): void {
    this.router.navigate(['/auctions/create']);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null') {
      const name = this.currentUser()?.firstName || 'User';
      return `https://ui-avatars.com/api/?name=${name}&background=002f34&color=fff`;
    }
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }
}
