import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../state/auth/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private store = inject(Store);

  currentUser = signal<User | null>(null);

  constructor() {
    this.store.select(selectAuthUser).subscribe((user) => {
      console.log("user in header: ", user);
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
