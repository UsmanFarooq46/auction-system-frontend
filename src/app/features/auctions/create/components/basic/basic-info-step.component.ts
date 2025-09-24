import { Component, inject, Input, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../../../shared/components/form/text-field/text-field.component';
import { SelectBoxComponent } from '../../../../../shared/components/form/select-box/select-box.component';
import { TextareaFieldComponent } from '../../../../../shared/components/form/textarea-field/textarea-field.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectBoxComponent, TextareaFieldComponent],
  templateUrl: './basic-info-step.component.html'
})
export class BasicInfoStepComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);

  @Input({ required: true }) form!: FormGroup;
  public defaultCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'art-collectibles', label: 'Art & Collectibles' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'antiques', label: 'Antiques' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'other', label: 'Other' }
  ];
  
  public conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  public basicForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    category: ['', [Validators.required]],
    condition: ['', [Validators.required]],
  });

  // @Input() conditions: Array<{ value: string; label: string }> = [];

  validChange = output<boolean>();
  @Input({ required: true }) getFieldError!: (fieldName: string) => string;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form.get('title')?.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(100)]);
    this.form.get('description')?.addValidators([Validators.required, Validators.minLength(50), Validators.maxLength(1000)]);
    this.form.get('category')?.addValidators([Validators.required]);
    this.form.get('condition')?.addValidators([Validators.required]);
    this.form.updateValueAndValidity({ emitEvent: false });

    this.validChange.emit(this.form?.valid ?? false);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validChange.emit(this.form?.valid ?? false);
      });
  }

  onSubmit(): void {
    console.log("in onSubmit");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


