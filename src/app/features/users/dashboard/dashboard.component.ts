import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>User Dashboard</h1>
      <p>Dashboard component coming soon...</p>
    </div>
  `,
  styles: [`
    @reference 'tailwindcss';
    .dashboard-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  `]
})
export class DashboardComponent {}
