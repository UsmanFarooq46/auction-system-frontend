import { Component, inject, OnInit, OnDestroy, output, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../shared/components/form/text-field/text-field.component';
import { SelectBoxComponent } from '../../../shared/components/form/select-box/select-box.component';
import { TextareaFieldComponent } from '../../../shared/components/form/textarea-field/textarea-field.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { defaultCategories, conditions } from './components/basic/constants';

@Component({
  selector: 'app-auction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldComponent,
    SelectBoxComponent,
    TextareaFieldComponent
  ],
  templateUrl: './auction-form.component.html',
  styleUrl: './auction-form.component.scss'
})
export class AuctionFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLive = signal(false);

  initialData = input<any>(null);
  formSubmitted = output<any>();
  formValid = output<boolean>();

  public defaultCategories = defaultCategories;
  public conditions = conditions;

  durations = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' },
    { value: 0, label: 'Custom Scheduling' }
  ];

  selectedImages: File[] = [];
  previewImages: string[] = [];
  existingImages: string[] = [];

  form = this.fb.group({
    // Basic Info
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    category: ['', [Validators.required]],
    condition: ['', [Validators.required]],
    // Pricing
    startingPrice: [null as number | null, [Validators.required, Validators.min(1)]],
    reservePrice: [null as number | null, [Validators.min(1)]],
    // Timing
    duration: [null as number | null, [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    // Location
    location: ['', [Validators.required, Validators.minLength(5)]],
    isPublic: [true]
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.populateForm(data);
      }
    });
  }

  private populateForm(data: any): void {
    const startDt = new Date(data.startDate);
    const startIso = new Date(startDt.getTime() - startDt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    this.form.patchValue({
      title: data.title,
      description: data.description,
      category: data.category,
      condition: data.condition,
      startingPrice: data.startingPrice,
      reservePrice: data.reservePrice,
      duration: data.duration,
      startDate: startIso,
      location: data.location,
      isPublic: data.isPublic ?? true
    });

    // Check if live or ended
    if (data.status === 'live' || data.status === 'ended') {
      this.isLive.set(true);
      // Disable restricted fields
      this.form.get('title')?.disable();
      this.form.get('category')?.disable();
      this.form.get('condition')?.disable();
      this.form.get('startingPrice')?.disable();
      this.form.get('reservePrice')?.disable();
    }

    if (data.images && data.images.length > 0) {
      this.existingImages = data.images;
    }
  }

  ngOnInit(): void {
    // Set default start date
    const now = new Date();
    const start = now.toISOString().slice(0, 16);
    this.form.patchValue({ startDate: start });

    // Watch for duration/startDate changes to calculate endDate
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const duration = this.form.get('duration')?.value as number | null;
        const startDate = this.form.get('startDate')?.value as string | null;
        
        if (duration === 0) {
          this.formValid.emit(this.form.valid);
          return;
        }

        if (duration && startDate) {
          const startDt = new Date(startDate);
          const end = new Date(startDt.getTime() + duration * 24 * 60 * 60 * 1000);
          const endIso = new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          this.form.patchValue({ endDate: endIso }, { emitEvent: false });
        }

        this.formValid.emit(this.form.valid);
      });

    this.formValid.emit(this.form.valid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up preview URLs
    this.previewImages.forEach(url => URL.revokeObjectURL(url));
  }

  private fieldLabels: Record<string, string> = {
    title: 'Title',
    description: 'Description',
    category: 'Category',
    condition: 'Condition',
    startingPrice: 'Starting Price',
    reservePrice: 'Reserve Price',
    duration: 'Duration',
    startDate: 'Start Date',
    endDate: 'End Date',
    location: 'Location'
  };

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    const label = this.fieldLabels[fieldName] || fieldName;
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${label} is required`;
      if (field.errors['minlength']) return `${label} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${label} must be at most ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['min']) return `${label} must be greater than 0`;
    }
    return '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files);
    }
  }

  private handleFileSelection(files: FileList | File[]): void {
    const fileArray = Array.from(files);
    const totalImages = this.selectedImages.length + fileArray.length;

    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    this.selectedImages = [...this.selectedImages, ...fileArray];
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    this.previewImages = [...this.previewImages, ...newPreviews];
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.previewImages[index]);
    this.selectedImages = this.selectedImages.filter((_, i) => i !== index);
    this.previewImages = this.previewImages.filter((_, i) => i !== index);
  }

  removeExistingImage(index: number): void {
    this.existingImages = this.existingImages.filter((_, i) => i !== index);
  }

  getImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) return imagePath;
    const segments = imagePath.split(/[\\/]uploads[\\/]/);
    const cleanPath = segments.length > 1 ? segments[1] : segments[0];
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    const totalImages = this.selectedImages.length + this.existingImages.length;

    if (this.form.valid && totalImages > 0) {
      // Get values including disabled ones
      const formData = {
        ...this.form.getRawValue(),
        images: this.selectedImages,
        existingImages: this.existingImages
      };
      this.formSubmitted.emit(formData);
      return;
    }

    // Build a clear message explaining what still needs fixing
    const problems: string[] = [];
    Object.keys(this.form.controls).forEach((name) => {
      const control = this.form.get(name);
      if (control && control.enabled && control.invalid) {
        const label = this.fieldLabels[name] || name;
        if (control.errors?.['required']) {
          problems.push(`${label} is required`);
        } else if (control.errors?.['minlength']) {
          problems.push(`${label} must be at least ${control.errors['minlength'].requiredLength} characters`);
        } else if (control.errors?.['maxlength']) {
          problems.push(`${label} must be at most ${control.errors['maxlength'].requiredLength} characters`);
        } else if (control.errors?.['min']) {
          problems.push(`${label} must be greater than 0`);
        } else {
          problems.push(`${label} is invalid`);
        }
      }
    });

    if (totalImages === 0) {
      problems.push('At least one image is required');
    }

    alert('Please fix the following before submitting:\n\n• ' + problems.join('\n• '));

    // Scroll to the first invalid field so the user can see it
    const firstInvalid = document.querySelector('.border-red-500, [aria-invalid="true"]');
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


