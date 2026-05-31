import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuctionService } from '../../core/services/auction.service';
import { AuthService } from '../../core/services/auth.service';
import { CountdownComponent } from '../../shared/components/countdown/countdown.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CountdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private auctionService = inject(AuctionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Real featured auctions loaded from the API
  featuredAuctions = signal<any[]>([]);
  isLoading = signal(true);

  // Real stats derived from the API
  activeAuctionsCount = signal<number | null>(null);

  // Real categories (matches the backend category enum / create form options)
  categories = [
    { value: 'electronics', name: 'Electronics', icon: '📱' },
    { value: 'art-collectibles', name: 'Art & Collectibles', icon: '🎨' },
    { value: 'jewelry', name: 'Jewelry', icon: '💎' },
    { value: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { value: 'real-estate', name: 'Real Estate', icon: '🏠' },
    { value: 'antiques', name: 'Antiques', icon: '🏺' },
    { value: 'books', name: 'Books', icon: '📚' },
    { value: 'clothing', name: 'Clothing & Accessories', icon: '👗' },
    { value: 'sports', name: 'Sports & Recreation', icon: '⚽' },
    { value: 'other', name: 'Other', icon: '📦' }
  ];

  ngOnInit(): void {
    this.loadFeaturedAuctions();
  }

  loadFeaturedAuctions(): void {
    this.isLoading.set(true);
    this.auctionService.getAuctions({ limit: 4 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.featuredAuctions.set(res.data?.auctions || []);
          this.activeAuctionsCount.set(res.data?.pagination?.total ?? null);
        },
        error: (err) => console.error('Error loading featured auctions:', err)
      });
  }

  isOwner(auction: any): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !auction.seller) return false;

    const userId = (user.id || (user as any)._id)?.toString();
    const sellerId = (auction.seller._id || auction.seller)?.toString();

    return userId === sellerId;
  }

  onBid(auction: any): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/auctions/bid', auction._id]);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/auctions/bid/${auction._id}` }
      });
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Remove anything before and including 'uploads/'
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price || 0);
  }
}
