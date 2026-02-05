import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center">
      @for (star of [1,2,3,4,5]; track star) {
        <svg
          (click)="interactive && onRate(star)"
          [class.cursor-pointer]="interactive"
          [class.text-yellow-400]="star <= (hoverRating || rating)"
          [class.text-gray-300]="star > (hoverRating || rating)"
          (mouseenter)="interactive && (hoverRating = star)"
          (mouseleave)="interactive && (hoverRating = 0)"
          class="w-5 h-5 fill-current"
          viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      }
      @if (showValue && rating > 0) {
        <span class="ml-2 text-sm text-gray-600">{{ rating | number:'1.1-1' }}</span>
      }
    </div>
  `
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() interactive = false;
  @Input() showValue = true;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating = 0;

  onRate(star: number) {
    this.rating = star;
    this.ratingChange.emit(star);
  }
}
