import { Component, Input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '../../../../../shared/components/form/text-field/text-field.component';
import { SelectBoxComponent } from '../../../../../shared/components/form/select-box/select-box.component';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectBoxComponent],
  templateUrl: './basic-info-step.component.html'
})
export class BasicInfoStepComponent implements OnInit {
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

  public basicForm:FormGroup=new FormGroup({});
  @Input() conditions: Array<{ value: string; label: string }> = [];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
      category: ['', [Validators.required]],
      condition: ['', [Validators.required]],
    });
  }
  dataChange = output<{ title: string; description: string; category: string; condition: string }>();
  validChange = output<boolean>();
  @Input({ required: true }) getFieldError!: (fieldName: string) => string;

  ngOnInit(): void {
    this.form.get('title')?.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(100)]);
    this.form.get('description')?.addValidators([Validators.required, Validators.minLength(50), Validators.maxLength(1000)]);
    this.form.get('category')?.addValidators([Validators.required]);
    this.form.get('condition')?.addValidators([Validators.required]);
    this.form.updateValueAndValidity({ emitEvent: false });

    this.validChange.emit(this.form?.valid ?? false);
    this.dataChange.emit({
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      category: this.form.get('category')?.value,
      condition: this.form.get('condition')?.value,
    });

    this.form.valueChanges.subscribe(val => {
      this.dataChange.emit({
        title: val?.title,
        description: val?.description,
        category: val?.category,
        condition: val?.condition,
      });
      this.validChange.emit(this.form?.valid ?? false);
    });
  }
}


