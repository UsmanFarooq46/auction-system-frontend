import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-location-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-step.component.html'
})
export class LocationStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) getFieldError!: (fieldName: string) => string;
}


