import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 backdrop-blur-sm" style="background: rgba(13,11,32,0.6);" (click)="close()"></div>

        <div class="relative bg-white w-full max-w-md overflow-hidden"
             style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold" style="color: var(--ink);">
                {{ existingReview ? 'Modifier votre avis' : 'Donner votre avis' }}
              </h2>
              <button (click)="close()" class="p-1.5 rounded-full transition-colors"
                      style="color: var(--ink-3);"
                      onmouseenter="this.style.background='var(--canvas)'"
                      onmouseleave="this.style.background='transparent'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p class="text-sm mt-0.5" style="color: var(--ink-3);">{{ courseTitle }}</p>
          </div>

          <!-- Body -->
          <div class="p-6">
            <!-- Étoiles -->
            <div class="text-center mb-6">
              <p class="text-sm mb-3" style="color: var(--ink-3);">Comment évaluez-vous ce cours ?</p>
              <div class="flex justify-center">
                <app-star-rating
                  [rating]="rating"
                  [interactive]="true"
                  [showValue]="false"
                  (ratingChange)="rating = $event">
                </app-star-rating>
              </div>
              @if (rating > 0) {
                <p class="mt-2 text-sm font-medium" [style.color]="getRatingColor()">
                  {{ getRatingLabel() }}
                </p>
              }
            </div>

            <!-- Commentaire -->
            <div class="mb-6">
              <label class="label">
                Votre commentaire <span class="font-normal" style="color: var(--ink-4);">(optionnel)</span>
              </label>
              <textarea
                [(ngModel)]="comment"
                rows="4"
                class="input resize-none"
                maxlength="500"
                placeholder="Partagez votre expérience avec ce cours..."></textarea>
              <p class="text-xs mt-1" style="color: var(--ink-4);">{{ comment.length }}/500 caractères</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button (click)="close()" class="btn btn-secondary flex-1">Annuler</button>
              <button
                (click)="submit()"
                [disabled]="rating === 0 || isSubmitting"
                class="btn btn-primary flex-1">
                @if (isSubmitting) {
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                {{ existingReview ? 'Modifier' : 'Publier' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ReviewModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() courseId!: number;
  @Input() courseTitle = '';
  @Input() existingReview: Review | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<Review>();

  private reviewService = inject(ReviewService);

  rating = 0;
  comment = '';
  isSubmitting = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.existingReview) {
      this.rating = this.existingReview.rating;
      this.comment = this.existingReview.comment || '';
    }
  }

  getRatingLabel(): string {
    const labels = ['', 'Très décevant', 'Décevant', 'Correct', 'Bien', 'Excellent !'];
    return labels[this.rating] || '';
  }

  getRatingColor(): string {
    const colors = ['', '#EF4444', '#F97316', 'var(--amber)', 'var(--green)', 'var(--green)'];
    return colors[this.rating] || 'var(--ink-3)';
  }

  submit() {
    if (this.rating === 0) return;
    this.isSubmitting = true;

    this.reviewService.createOrUpdate(this.courseId, {
      rating: this.rating,
      comment: this.comment.trim() || undefined
    }).subscribe({
      next: (review) => {
        this.isSubmitting = false;
        this.submitted.emit(review);
        this.close();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  close() {
    this.rating = 0;
    this.comment = '';
    this.isSubmitting = false;
    this.closed.emit();
  }
}
