import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auction-detail-container">
      <h1>Auction Detail</h1>
      <p>Auction detail component coming soon...</p>
    </div>
  `,
  styles: [`
    .auction-detail-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class DetailComponent {}
