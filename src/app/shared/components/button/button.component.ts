import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    @reference 'tailwindcss';
    .btn {
      @apply px-4 py-2 rounded font-medium transition-colors duration-200;
    }
    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400;
    }
    .btn-secondary {
      @apply bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100;
    }
    .btn-danger {
      @apply bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400;
    }
    .btn-sm {
      @apply px-3 py-1.5 text-sm;
    }
    .btn-lg {
      @apply px-6 py-3 text-lg;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const baseClasses = 'btn';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = `btn-${this.size}`;
    
    return `${baseClasses} ${variantClass} ${sizeClass}`.trim();
  }
}
