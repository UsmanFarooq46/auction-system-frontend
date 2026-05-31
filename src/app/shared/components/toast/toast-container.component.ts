import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm font-medium animate-toast-in"
          [class]="styles(toast)"
          role="alert"
        >
          <span class="text-lg leading-none">{{ icon(toast) }}</span>
          <span class="flex-1 leading-snug">{{ toast.message }}</span>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="text-current opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(1rem); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-toast-in { animation: toast-in 0.25s ease-out; }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  styles(toast: Toast): string {
    switch (toast.type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error':   return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default:        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  icon(toast: Toast): string {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error':   return '⛔';
      case 'warning': return '⚠️';
      default:        return 'ℹ️';
    }
  }
}
