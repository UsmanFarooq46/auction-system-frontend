import { Component, inject, OnInit, OnDestroy, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AuctionService } from '../../../core/services/auction.service';
import { UiService } from '../../../core/services/ui.service';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../state/auth/auth.selectors';
import { finalize, Subscription } from 'rxjs';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';
import { ImageUrlPipe } from '../../../shared/pipes/image-url.pipe';
import { PkrCurrencyPipe } from '../../../shared/pipes/pkr-currency.pipe';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CountdownComponent,
    ImageUrlPipe,
    PkrCurrencyPipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auctionService = inject(AuctionService);
  public uiService = inject(UiService);
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
    if (!user || !currentAuction || !currentAuction.seller) return false;

    const userId = (user._id || user.id)?.toString();
    const sellerId = (currentAuction.seller._id || currentAuction.seller)?.toString();

    return userId === sellerId;
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

  onBid(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/auctions/bid/${this.auction()._id}` } });
    } else {
      this.router.navigate(['/auctions/bid', this.auction()._id]);
    }
  }

  onChat(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/auctions/${this.auction()._id}` } });
      return;
    }

    const seller = this.auction().seller;
    const sellerId = seller?._id || seller?.id;
    if (!sellerId) {
      alert('Seller information is unavailable for this auction.');
      return;
    }

    const sellerName = `${seller?.firstName || ''} ${seller?.lastName || ''}`.trim() || 'Seller';
    this.router.navigate(['/chats', sellerId], {
      queryParams: {
        auctionId: this.auction()._id,
        sellerName
      }
    });
  }
}
