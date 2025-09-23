import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bids',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bids-container">
      <h1>My Bids</h1>
      <p>Bids component coming soon...</p>
    </div>
  `,
  styles: [`
    .bids-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class BidsComponent {}
