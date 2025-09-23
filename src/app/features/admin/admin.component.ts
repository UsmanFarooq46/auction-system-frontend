import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h1>Admin Panel</h1>
      <p>Admin component coming soon...</p>
    </div>
  `,
  styles: [`
    .admin-container {
      @apply max-w-6xl mx-auto px-4 py-8;
    }
  `]
})
export class AdminComponent {}
