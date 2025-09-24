import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-images-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './images-step.component.html'
})
export class ImagesStepComponent {
  @Input({ required: true }) previewImages: string[] = [];
  @Output() remove = new EventEmitter<number>();
  @Output() select = new EventEmitter<Event>();

  onRemove(index: number) {
    this.remove.emit(index);
  }

  onSelect(event: Event) {
    this.select.emit(event);
  }
}


