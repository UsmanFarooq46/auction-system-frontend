import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasicInfoStepComponent } from './components/basic/basic-info-step.component';
import { PricingStepComponent } from './components/pricing/pricing-step.component';
import { TimingStepComponent } from './components/timing/timing-step.component';
import { LocationStepComponent } from './components/location/location-step.component';
import { ImagesStepComponent } from './components/images/images-step.component';

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
    PricingStepComponent,
    TimingStepComponent,
    LocationStepComponent,
    ImagesStepComponent
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
  basicValid = signal(false);

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

  //#region Validators steps
  isBasicFormValid(isValid: boolean) {
    this.basicValid.set(isValid);
  }
  //#endregion

  pricingValid = signal(false);
  timingValid = signal(false);
  locationValid = signal(false);
  imagesValid = signal(false);


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

    const progress = (completedFields / totalFields) * 100;
    this.formProgress.set(Math.round(progress));
  }

  // Step validation
  private isStepValid(step: number): boolean {
    switch (step) {
      case 1: // Basic Info
        return this.basicValid();
      case 2: // Pricing
        return this.pricingValid();
      case 3: // Timing
        return this.timingValid();
      case 4: // Location
        return this.locationValid();
      case 5: // Images
        return this.imagesValid();
      default:
        return false;
    }
  }

  // Receive basic form data from child, save, then advance
  onBasicProceed(data: { title: string; description: string; category: string; condition: string }): void {

    this.nextStep();
  }

  // Receive pricing data from child, save, then advance
  onPricingProceed(data: { startingPrice: number; reservePrice: number | null }): void {
    // store or send pricing data as needed
    this.nextStep();
  }

  onTimingProceed(data: { duration: number; startDate: string; endDate: string }): void {
    // store or use timing data
    this.nextStep();
  }

  onLocationProceed(data: { location: string }): void {
    // store or use location data
    this.nextStep();
  }

  // Navigation gating: only allow moving beyond step 1 if basic info is valid
  canNavigateTo(step: number): boolean {
    if (step <= 1) return true;
    return this.basicValid();
  }

  // Aggregate validity across all steps
  isAllValid(): boolean {
    const basic = this.basicValid();
    return basic;
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
    this.imagesValid.set(this.selectedImages().length > 0);
  }

  // Enhanced image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files);
    }
    this.imagesValid.set(this.selectedImages().length > 0);
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