import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="loader-container">
      <div class="spinner"></div>
      <p *ngIf="message" class="loader-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader-container {
      @apply flex flex-col items-center justify-center p-8;
    }
    
    .spinner {
      @apply w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin;
    }
    
    .loader-message {
      @apply mt-4 text-gray-600 text-sm;
    }
  `]
})
export class LoaderComponent {
  @Input() show = false;
  @Input() message = 'Loading...';
}
