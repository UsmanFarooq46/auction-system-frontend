import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payments-container">
      <h1>Payments</h1>
      <p>Payments component coming soon...</p>
    </div>
  `,
  styles: [`
    .payments-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class PaymentsComponent {}
