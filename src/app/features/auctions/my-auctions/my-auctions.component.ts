import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuctionService } from '../../../core/services/auction.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-auctions.component.html',
  styleUrl: './my-auctions.component.scss'
})
export class MyAuctionsComponent implements OnInit {
  private auctionService = inject(AuctionService);
  
  auctions = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMyAuctions();
  }

  loadMyAuctions(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.auctionService.getMyAuctions()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          console.log('My auctions loaded:', response);
          this.auctions.set(response.data || []);
        },
        error: (err) => {
          console.error('Error loading my auctions:', err);
          this.error.set('Failed to load your auctions. Please try again later.');
        }
      });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null') {
      return 'https://ui-avatars.com/api/?name=User&background=002f34&color=fff';
    }
    if (imagePath.startsWith('http')) return imagePath;

    // Remove anything before and including 'uploads/'
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }
}
