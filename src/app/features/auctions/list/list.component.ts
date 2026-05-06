import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuctionService } from '../../../core/services/auction.service';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';

@Component({
  selector: 'app-auctions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CountdownComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  private auctionService = inject(AuctionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  auctions = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadAuctions();
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

  loadAuctions(): void {
    this.isLoading.set(true);
    this.auctionService.getAuctions({})
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          console.log('Auctions loaded:', res.data?.auctions);
          this.auctions.set(res.data?.auctions || []);
        },
        error: (err) => console.error('Error loading auctions:', err)
      });
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
    }).format(price);
  }
}
