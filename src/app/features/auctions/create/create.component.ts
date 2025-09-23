import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="create-auction-container">
      <h1>Create Auction</h1>
      <p>Create auction component coming soon...</p>
    </div>
  `,
  styles: [`
    .create-auction-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class CreateComponent {}
