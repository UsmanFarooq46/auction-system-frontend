import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Reactive list of currently visible toasts
  readonly toasts = signal<Toast[]>([]);

  private nextId = 0;
  private readonly defaultDuration = 4000;

  /** Show a success (green) toast */
  success(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  /** Show an error (red) toast */
  error(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  /** Show an info (blue) toast */
  info(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  /** Show a warning (amber) toast */
  warning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  /** Dismiss a toast immediately */
  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private show(type: ToastType, message: string, duration = this.defaultDuration): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
}
