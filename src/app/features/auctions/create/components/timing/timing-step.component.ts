import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-timing-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timing-step.component.html'
})
export class TimingStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() durations: Array<{ value: number; label: string }> = [];
  @Input({ required: true }) getFieldError!: (fieldName: string) => string;
}


