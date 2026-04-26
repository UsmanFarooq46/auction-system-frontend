import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuctionFormComponent } from './auction-form.component';
import { AuctionService } from '../../../core/services/auction.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [
    CommonModule,
    AuctionFormComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateAuctionComponent {
  private router = inject(Router);
  private auctionService = inject(AuctionService);

  isSubmitting = signal(false);

  goBack(): void {
    this.router.navigate(['/auctions']);
  }

  onFormSubmitted(formData: any): void {
    console.log('onFormSubmitted called with data:', formData);
    this.isSubmitting.set(true);
    
    console.log('Calling auctionService.createAuction...');
    this.auctionService.createAuction(formData)
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: (response) => {
          console.log('Auction created successfully:', response);
          alert('Auction successfully created via API!');
          // this.router.navigate(['/auctions']);
        },
        error: (error) => {
          console.error('Error creating auction:', error);
          const message = error.error?.message || 'Failed to create auction. Please try again.';
          alert(message);
        }
      });
  }
}
