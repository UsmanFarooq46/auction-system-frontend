import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasicInfoStepComponent } from './components/basic/basic-info-step.component';
// import { PricingStepComponent } from './components/pricing/pricing-step.component';
// import { TimingStepComponent } from './components/timing/timing-step.component';
// import { LocationStepComponent } from './components/location/location-step.component';
// import { ImagesStepComponent } from './components/images/images-step.component';

interface AuctionFormData {
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  reservePrice: number;
  duration: number;
  startDate: string;
  endDate: string;
  images: File[];
  condition: string;
  location: string;
}

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInfoStepComponent,
    // PricingStepComponent,
    // TimingStepComponent,
    // LocationStepComponent,
    // ImagesStepComponent
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateAuctionComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSubmitting = signal(false);
  selectedImages = signal<File[]>([]);
  previewImages = signal<string[]>([]);
  currentStep = signal(1);
  totalSteps = signal(5);
  isDragOver = signal(false);
  showPreview = signal(false);
  estimatedValue = signal(0);
  formProgress = signal(0);
  basicValid = false;

  auctionForm: FormGroup;

  

  conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  durations = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' }
  ];

  // Computed properties
  progressPercentage = computed(() => (this.formProgress() / 100) * 100);
  canProceed = computed(() => this.isStepValid(this.currentStep()));
  stepTitle = computed(() => {
    const titles = ['Basic Info', 'Pricing', 'Timing', 'Location', 'Images'];
    return titles[this.currentStep() - 1] || 'Complete';
  });

  constructor() {
    this.auctionForm = this.fb.group({
      // basic step fields are now managed inside child; keep here for final aggregation if needed
      title: [''],
      description: [''],
      category: [''],
      startingPrice: ['', [Validators.required, Validators.min(1)]],
      reservePrice: ['', [Validators.min(1)]],
      duration: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      condition: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Set default start date to now
    const now = new Date();
    const startDate = now.toISOString().slice(0, 16);
    this.auctionForm.patchValue({ startDate });

    // Auto-calculate end date when duration changes
    this.auctionForm.get('duration')?.valueChanges.subscribe(duration => {
      if (duration && this.auctionForm.get('startDate')?.value) {
        this.calculateEndDate();
      }
    });

    this.auctionForm.get('startDate')?.valueChanges.subscribe(() => {
      if (this.auctionForm.get('duration')?.value) {
        this.calculateEndDate();
      }
    });

    // Watch form changes for progress calculation
    this.auctionForm.valueChanges.subscribe(() => {
      this.calculateFormProgress();
    });

    // Watch starting price for estimated value
    this.auctionForm.get('startingPrice')?.valueChanges.subscribe(price => {
      if (price) {
        this.estimatedValue.set(price * 1.5); // Estimate 50% higher than starting price
      }
    });
  }

  private calculateEndDate(): void {
    const startDate = this.auctionForm.get('startDate')?.value;
    const duration = this.auctionForm.get('duration')?.value;
    
    if (startDate && duration) {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + (duration * 24 * 60 * 60 * 1000));
      this.auctionForm.patchValue({ endDate: end.toISOString().slice(0, 16) });
    }
  }


  removeImage(index: number): void {
    const currentImages = this.selectedImages();
    const currentPreviews = this.previewImages();
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(currentPreviews[index]);
    
    const newImages = currentImages.filter((_, i) => i !== index);
    const newPreviews = currentPreviews.filter((_, i) => i !== index);
    
    this.selectedImages.set(newImages);
    this.previewImages.set(newPreviews);
  }

  onSubmit(): void {
    if (this.auctionForm.valid && this.selectedImages().length > 0) {
      this.isSubmitting.set(true);
      
      const formData: AuctionFormData = {
        ...this.auctionForm.value,
        images: this.selectedImages()
      };

      console.log('Creating auction:', formData);
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        alert('Auction created successfully!');
        this.router.navigate(['/auctions']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
      if (this.selectedImages().length === 0) {
        alert('Please select at least one image');
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.auctionForm.controls).forEach(key => {
      const control = this.auctionForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.auctionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/auctions']);
  }

  // Step navigation methods
  nextStep(): void {
    if (this.currentStep() < this.totalSteps()) {
      this.currentStep.set(this.currentStep() + 1);
      this.scrollToTop();
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      this.scrollToTop();
    }
  }

  goToStep(step: number): void {
    if (step < 1 || step > this.totalSteps()) return;
    if (!this.canNavigateTo(step)) return;
    this.currentStep.set(step);
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Form progress calculation
  private calculateFormProgress(): void {
    const totalFields = 10; // Total number of form fields
    let completedFields = 0;

    // Check each field
    const fields = ['title', 'description', 'category', 'startingPrice', 'duration', 'startDate', 'condition', 'location'];
    fields.forEach(field => {
      if (this.auctionForm.get(field)?.valid) {
        completedFields++;
      }
    });

    // Add images (counts as 2 fields)
    if (this.selectedImages().length > 0) {
      completedFields += 2;
    }

    const progress = (completedFields / totalFields) * 100;
    this.formProgress.set(Math.round(progress));
  }

  // Step validation
  private isStepValid(step: number): boolean {
    switch (step) {
      case 1: // Basic Info
        return !!(this.auctionForm.get('title')?.valid && 
               this.auctionForm.get('description')?.valid && 
               this.auctionForm.get('category')?.valid && 
               this.auctionForm.get('condition')?.valid);
      case 2: // Pricing
        return !!this.auctionForm.get('startingPrice')?.valid;
      case 3: // Timing
        return !!(this.auctionForm.get('duration')?.valid && 
               this.auctionForm.get('startDate')?.valid);
      case 4: // Location
        return !!this.auctionForm.get('location')?.valid;
      case 5: // Images
        return this.selectedImages().length > 0;
      default:
        return false;
    }
  }

  // Navigation gating: only allow moving beyond step 1 if basic info is valid
  canNavigateTo(step: number): boolean {
    if (step <= 1) return true;
    return this.basicValid;
  }

  // Aggregate validity across all steps
  isAllValid(): boolean {
    const basic = this.basicValid;
    const pricing = !!this.auctionForm.get('startingPrice')?.valid;
    const timing = !!(this.auctionForm.get('duration')?.valid && this.auctionForm.get('startDate')?.valid);
    const location = !!this.auctionForm.get('location')?.valid;
    const imagesOk = this.selectedImages().length > 0;
    return basic && pricing && timing && location && imagesOk;
  }

  private firstInvalidStep(): number {
    if (!this.basicValid) return 1;
    if (!this.auctionForm.get('startingPrice')?.valid) return 2;
    if (!(this.auctionForm.get('duration')?.valid && this.auctionForm.get('startDate')?.valid)) return 3;
    if (!this.auctionForm.get('location')?.valid) return 4;
    if (this.selectedImages().length === 0) return 5;
    return 0;
  }

  // Drag and drop handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files);
    }
  }

  private handleFileSelection(files: FileList | File[]): void {
    const fileArray = Array.from(files);
    const currentImages = this.selectedImages();
    
    // Limit to 10 images total
    const totalImages = currentImages.length + fileArray.length;
    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newImages = [...currentImages, ...fileArray];
    this.selectedImages.set(newImages);

    // Create preview URLs
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    this.previewImages.set([...this.previewImages(), ...newPreviews]);
  }

  // Enhanced image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files);
    }
  }

  // Quick actions
  setQuickDuration(days: number): void {
    this.auctionForm.patchValue({ duration: days });
  }

  setQuickPrice(price: number): void {
    this.auctionForm.patchValue({ startingPrice: price });
  }

  // Preview functionality
  togglePreview(): void {
    this.showPreview.set(!this.showPreview());
  }

  // Auto-save functionality (simulated)
  autoSave(): void {
    console.log('Auto-saving form data...');
    // In real app, save to localStorage or send to server
  }

  // Step button styling
  getStepButtonClasses(step: number): string {
    const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200';
    
    if (step === this.currentStep()) {
      return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
    } else if (step < this.currentStep()) {
      return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
    } else {
      return `${baseClasses} text-gray-500 hover:text-gray-700 hover:bg-gray-50`;
    }
  }

  // Step titles
  getStepTitle(step: number): string {
    const titles = ['Basic Info', 'Pricing', 'Timing', 'Location', 'Images'];
    return titles[step - 1] || 'Complete';
  }

  // Helper methods for sidebar
  // getCategoryLabel(value: string): string {
  //   const category = this.categories.find(cat => cat.value === value);
  //   return category ? category.label : '';
  // }

  getDurationLabel(value: number): string {
    const duration = this.durations.find(dur => dur.value === value);
    return duration ? duration.label : '';
  }
}