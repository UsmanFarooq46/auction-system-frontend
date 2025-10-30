import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { output } from '@angular/core';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-step.component.html'
})
export class LocationStepComponent {
  private fb = inject(FormBuilder);

  isLocationFormValid = output<boolean>();
  proceed = output<{ location: string }>();

  form = this.fb.group({
    location: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.isLocationFormValid.emit(this.form.valid);
    this.form.valueChanges.subscribe(() => this.isLocationFormValid.emit(this.form.valid));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { location } = this.form.value as { location: string };
      this.proceed.emit({ location });
    }
  }
}


