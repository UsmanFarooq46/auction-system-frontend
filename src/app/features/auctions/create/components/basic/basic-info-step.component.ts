import { Component, inject, Input, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../../../shared/components/form/text-field/text-field.component';
import { SelectBoxComponent } from '../../../../../shared/components/form/select-box/select-box.component';
import { TextareaFieldComponent } from '../../../../../shared/components/form/textarea-field/textarea-field.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { defaultCategories, conditions } from './constants';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectBoxComponent, TextareaFieldComponent],
  templateUrl: './basic-info-step.component.html'
})
export class BasicInfoStepComponent implements OnInit, OnDestroy {
  
  private fb = inject(FormBuilder);
  isBasicFormValid = output<boolean>();
  proceed = output<{ title: string; description: string; category: string; condition: string }>();
  private destroy$ = new Subject<void>();

  basicForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    category: ['', [Validators.required]],
    condition: ['', [Validators.required]],
  });

  public defaultCategories = defaultCategories;
  public conditions = conditions;

  get form(): FormGroup {
    return this.basicForm as FormGroup;
  }


  ngOnInit(): void {
    this.isBasicFormValid.emit(this.form.valid);
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isBasicFormValid.emit(this.form.valid);
      });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const { title, description, category, condition } = this.form.value as {
        title: string; description: string; category: string; condition: string;
      };
      this.proceed.emit({ title, description, category, condition });
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
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }
}


