import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-timing-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timing-step.component.html'
})
export class TimingStepComponent {
  private fb = inject(FormBuilder);

  durations: Array<{ value: number; label: string }> = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' }
  ];

  isTimingFormValid = output<boolean>();
  proceed = output<{ duration: number; startDate: string; endDate: string }>();
  private destroy$ = new Subject<void>();

  form = this.fb.group({
    duration: [null as number | null, [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // default startDate now
    const now = new Date();
    const start = now.toISOString().slice(0, 16);
    this.form.patchValue({ startDate: start });

    // recalc end date on duration or start change
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
        this.isTimingFormValid.emit(this.form.valid);
      });

    this.isTimingFormValid.emit(this.form.valid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
    }
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { duration, startDate, endDate } = this.form.value as { duration: number; startDate: string; endDate: string };
      this.proceed.emit({ duration, startDate, endDate });
    }
  }
}


