import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuctionService } from '../../../core/services/auction.service';
import { finalize } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/form/text-field/text-field.component';
import { CountdownComponent } from '../../../shared/components/countdown/countdown.component';

@Component({
  selector: 'app-place-bid',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TextFieldComponent, CountdownComponent],
  templateUrl: './place-bid.component.html',
  styleUrl: './place-bid.component.scss'
})
export class PlaceBidComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auctionService = inject(AuctionService);
  private fb = inject(FormBuilder);

  auction = signal<any>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  bidForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAuction(id);
    } else {
      this.router.navigate(['/auctions']);
    }
  }

  loadAuction(id: string): void {
    this.isLoading.set(true);
    this.auctionService.getAuctionById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.auction.set(res.data);
          // Set default bid amount to currentBid + 10
          const minNextBid = (res.data.currentBid || res.data.startingPrice) + 10;
          this.bidForm.patchValue({ amount: minNextBid });
          this.bidForm.get('amount')?.setValidators([
            Validators.required, 
            Validators.min(minNextBid)
          ]);
        },
        error: (err) => {
          console.error('Error loading auction:', err);
          this.error.set('Failed to load auction details.');
        }
      });
  }

  quickBid(extra: number): void {
    const current = this.auction()?.currentBid || this.auction()?.startingPrice || 0;
    this.bidForm.patchValue({ amount: current + extra });
  }

  onSubmit(): void {
    if (this.bidForm.invalid || !this.auction()) return;

    const amount = this.bidForm.value.amount;
    if (!amount) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    this.auctionService.placeBid(this.auction()._id, amount)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          this.success.set(true);
          this.auction.set(res.data);
          setTimeout(() => {
            this.router.navigate(['/auctions', this.auction()._id]);
          }, 3000);
        },
        error: (err) => {
          console.error('Error placing bid:', err);
          this.error.set(err.error?.message || 'Failed to place bid. Please try again.');
        }
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }
}
