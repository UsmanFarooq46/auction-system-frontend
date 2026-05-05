import { Component, Input, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'countdown-container ' + mode" [class.urgent]="isUrgent()">
      @if (mode === 'list') {
        <div class="list-wrapper">
          <span class="label">Ends in:</span>
          <span class="time">{{ timeLeft() }}</span>
        </div>
      } @else {
        <span class="time">{{ timeLeft() }}</span>
      }
    </div>
  `,
  styles: [`
    .countdown-container {
      display: inline-flex;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    
    .list {
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(8px);
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .list .list-wrapper {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    
    .list .label {
      font-size: 0.6rem;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.05em;
      opacity: 0.7;
      margin-bottom: 0.125rem;
    }
    
    .list .time {
      font-size: 0.875rem;
      font-weight: 900;
      letter-spacing: -0.025em;
    }
    
    .detail {
      font-size: inherit;
      color: inherit;
      font-weight: inherit;
    }
    
    .urgent {
      background: rgba(239, 68, 68, 0.9) !important;
      color: white !important;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input({ required: true }) endDate!: string | Date;
  @Input() mode: 'list' | 'detail' = 'list';
  
  private platformId = inject(PLATFORM_ID);
  
  timeLeft = signal<string>('...');
  isUrgent = signal<boolean>(false);
  private subscription?: Subscription;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private startTimer(): void {
    this.subscription = interval(1000).subscribe(() => {
      const end = new Date(this.endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (isNaN(end)) {
        this.timeLeft.set('Invalid');
        this.subscription?.unsubscribe();
        return;
      }

      if (diff <= 0) {
        this.timeLeft.set('Ended');
        this.subscription?.unsubscribe();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.isUrgent.set(diff < (1000 * 60 * 60)); // Less than 1 hour

      let timeStr = '';
      if (this.mode === 'detail') {
        if (days > 0) timeStr += `${days}d `;
        timeStr += `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
      } else {
        // Compact mode for list
        if (days > 0) {
          timeStr = `${days}d ${hours}h`;
        } else if (hours > 0) {
          timeStr = `${hours}h ${minutes}m`;
        } else {
          timeStr = `${minutes}m ${seconds}s`;
        }
      }
      this.timeLeft.set(timeStr);
    });
  }
}
