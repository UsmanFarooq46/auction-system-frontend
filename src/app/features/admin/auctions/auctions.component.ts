import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-auctions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-auctions-container">
      <h1>Admin - Auctions</h1>
      <p>Admin auctions component coming soon...</p>
    </div>
  `,
  styles: [`
    @reference 'tailwindcss';
    .admin-auctions-container {
      @apply max-w-6xl mx-auto px-4 py-8;
    }
  `]
})
export class AuctionsComponent {}
