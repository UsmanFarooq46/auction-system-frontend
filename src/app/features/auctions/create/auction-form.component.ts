import { Component, inject, OnInit, OnDestroy, output } from '@angular/core';
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

  formSubmitted = output<any>();
  formValid = output<boolean>();

  public defaultCategories = defaultCategories;
  public conditions = conditions;

  durations = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' }
  ];

  selectedImages: File[] = [];
  previewImages: string[] = [];

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
    location: ['', [Validators.required, Validators.minLength(5)]]
  });

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

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
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

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid && this.selectedImages.length > 0) {
      const formData = {
        ...this.form.value,
        images: this.selectedImages
      };
      this.formSubmitted.emit(formData);
    } else {
      if (this.selectedImages.length === 0) {
        alert('Please select at least one image');
      }
    }
  }
}


