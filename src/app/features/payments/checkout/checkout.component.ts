import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      <p>Checkout component coming soon...</p>
    </div>
  `,
  styles: [`
    .checkout-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class CheckoutComponent {}
