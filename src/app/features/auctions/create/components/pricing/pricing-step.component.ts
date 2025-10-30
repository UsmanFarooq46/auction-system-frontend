import { Component, inject, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pricing-step.component.html'
})
export class PricingStepComponent {
  private fb = inject(FormBuilder);
  isPricingFormValid = output<boolean>();
  proceed = output<{ startingPrice: number; reservePrice: number | null }>();
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    startingPrice: [null as number | null, [Validators.required, Validators.min(1)]],
    reservePrice: [null as number | null, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.isPricingFormValid.emit(this.form.valid);
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isPricingFormValid.emit(this.form.valid);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { startingPrice, reservePrice } = this.form.value as { startingPrice: number; reservePrice: number | null };
      this.proceed.emit({ startingPrice, reservePrice: reservePrice ?? null });
    }
  }
}


