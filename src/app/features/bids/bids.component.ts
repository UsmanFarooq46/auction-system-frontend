import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';
import { finalize } from 'rxjs';
import { CountdownComponent } from '../../shared/components/countdown/countdown.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bids',
  standalone: true,
  imports: [CommonModule, RouterModule, CountdownComponent],
  templateUrl: './bids.component.html',
  styleUrl: './bids.component.scss'
})
export class BidsComponent implements OnInit {
  private auctionService = inject(AuctionService);
  private authService = inject(AuthService);

  auctions = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMyBids();
  }

  loadMyBids(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.auctionService.getMyBids()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.auctions.set(res.data || []);
        },
        error: (err: any) => {
          console.error('Error loading my bids:', err);
          this.error.set('Failed to load your bids. Please try again.');
        }
      });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-700 border-green-200';
      case 'ended': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  }

  isOwner(auction: any): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !auction.seller) return false;
    const userId = user.id || (user as any)._id;
    const sellerId = auction.seller._id || auction.seller;
    return userId === sellerId;
  }
}
