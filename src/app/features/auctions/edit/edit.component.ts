import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../../../core/services/auction.service';
import { AuctionFormComponent } from '../create/auction-form.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-auction',
  standalone: true,
  imports: [CommonModule, AuctionFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="mb-8">
          <button (click)="goBack()" class="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Auctions
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Edit Auction</h1>
          <p class="text-gray-600 mt-1">Update your auction details and images.</p>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 font-medium">Loading auction items...</p>
          </div>
        } @else if (auction()) {
          <app-auction-form 
            [initialData]="auction()"
            (formSubmitted)="onFormSubmitted($event)">
          </app-auction-form>
        } @else {
          <div class="bg-white rounded-2xl p-12 text-center shadow-sm">
             <p class="text-red-500 font-medium">Auction not found or you don't have permission to edit it.</p>
             <button (click)="goBack()" class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg">Go Back</button>
          </div>
        }
      </div>
    </div>
  `
})
export class EditAuctionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private auctionService = inject(AuctionService);

  auction = signal<any>(null);
  isLoading = signal(true);
  isUpdating = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAuction(id);
    }
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
        }
      });
  }

  onFormSubmitted(formData: any): void {
    const id = this.auction()?._id;
    if (!id) return;

    this.isUpdating.set(true);
    
    // Convert to FormData for multipart upload
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'existingImages') {
        data.append(key, formData[key]);
      }
    });

    // Add new images
    formData.images?.forEach((file: File) => {
      data.append('images', file, file.name);
    });

    // Add existing images (as JSON string so backend knows what to keep)
    data.append('existingImages', JSON.stringify(formData.existingImages));

    this.auctionService.updateAuction(id, data)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: () => {
          alert('Auction updated successfully!');
          this.router.navigate(['/auctions/my-auctions']);
        },
        error: (err) => {
          console.error('Error updating auction:', err);
          alert('Failed to update auction: ' + (err.error?.message || 'Unknown error'));
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
