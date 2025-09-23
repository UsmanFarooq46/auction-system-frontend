import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="register-container">
      <h1>Register</h1>
      <p>Register component coming soon...</p>
    </div>
  `,
  styles: [`
    .register-container {
      @apply max-w-md mx-auto px-4 py-8;
    }
  `]
})
export class RegisterComponent {}
