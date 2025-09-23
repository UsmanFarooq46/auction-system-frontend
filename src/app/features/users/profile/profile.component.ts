import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h1>User Profile</h1>
      <p>Profile component coming soon...</p>
    </div>
  `,
  styles: [`
    .profile-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class ProfileComponent {}
