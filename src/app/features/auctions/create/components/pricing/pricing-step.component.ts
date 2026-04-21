import { Component, inject, OnInit, OnDestroy, output, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class PricingStepComponent implements OnInit, OnDestroy, OnChanges {
  private fb = inject(FormBuilder);
  isPricingFormValid = output<boolean>();
  proceed = output<{ startingPrice: number; reservePrice: number | null }>();
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    startingPrice: [null as number | null, [Validators.required, Validators.min(1)]],
    reservePrice: [null as number | null, [Validators.min(1)]],
  });

  @Input() initialValue?: { startingPrice: number | null; reservePrice: number | null };

  ngOnInit(): void {
    if (this.initialValue) {
      this.form.patchValue({
        startingPrice: this.initialValue.startingPrice ?? 0,
        reservePrice: this.initialValue.reservePrice ?? 0,
      });
    } else {
      this.form.patchValue({ startingPrice: 0, reservePrice: 0 });
    }
    this.isPricingFormValid.emit(this.form.valid);
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isPricingFormValid.emit(this.form.valid);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue']) {
      if (this.initialValue) {
        this.form.patchValue({
          startingPrice: this.initialValue.startingPrice ?? 0,
          reservePrice: this.initialValue.reservePrice ?? 0,
        });
      } else {
        // Ensure 0 is shown when no saved data exists
        this.form.patchValue({ startingPrice: 0, reservePrice: 0 });
      }
    }
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


