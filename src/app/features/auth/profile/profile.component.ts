import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-profile-container">
      <h1>Auth Profile</h1>
      <p>Auth profile component coming soon...</p>
    </div>
  `,
  styles: [`
    .auth-profile-container {
      @apply max-w-md mx-auto px-4 py-8;
    }
  `]
})
export class ProfileComponent {}
