import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuctionFormComponent } from './auction-form.component';

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

  isSubmitting = signal(false);

  goBack(): void {
    this.router.navigate(['/auctions']);
  }

  onFormSubmitted(formData: any): void {
    this.isSubmitting.set(true);
    console.log('Auction form data:', formData);


    // Simulate API call for now
    setTimeout(() => {
      this.isSubmitting.set(false);
      alert('Auction created successfully!');
      this.router.navigate(['/auctions']);
    }, 2000);
  }
}
