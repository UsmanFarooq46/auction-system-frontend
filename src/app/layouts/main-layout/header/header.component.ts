import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  
  currentUser = signal<User | null>(null);

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
