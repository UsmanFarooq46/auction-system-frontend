import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pricing-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pricing-step.component.html'
})
export class PricingStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) getFieldError!: (fieldName: string) => string;
}


