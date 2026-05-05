import { Component, inject, OnInit, OnDestroy, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AuctionService } from '../../../core/services/auction.service';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../state/auth/auth.selectors';
import { finalize, Subscription } from 'rxjs';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CountdownComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auctionService = inject(AuctionService);
  private store = inject(Store);
  private platformId = inject(PLATFORM_ID);

  auction = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentUser = signal<any>(null);
  selectedImageIndex = signal(0);
  
  private authSubscription?: Subscription;

  isOwner = computed(() => {
    const user = this.currentUser();
    const currentAuction = this.auction();
    return user && currentAuction && (user._id === currentAuction.seller?._id || user._id === currentAuction.seller);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAuction(id);
    }

    this.authSubscription = this.store.select(selectAuthUser).subscribe(user => {
      this.currentUser.set(user);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  loadAuction(id: string): void {
    this.isLoading.set(true);
    this.auctionService.getAuctionById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.auction.set(res.data);
        },
        error: (err) => {
          console.error('Error loading auction:', err);
          this.error.set('Could not load auction details.');
        }
      });
  }


  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
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

  onBid(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/auctions/bid/${this.auction()._id}` } });
    } else {
      this.router.navigate(['/auctions/bid', this.auction()._id]);
    }
  }
}
