import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-users-container">
      <h1>Admin - Users</h1>
      <p>Admin users component coming soon...</p>
    </div>
  `,
  styles: [`
    .admin-users-container {
      @apply max-w-6xl mx-auto px-4 py-8;
    }
  `]
})
export class UsersComponent {}
