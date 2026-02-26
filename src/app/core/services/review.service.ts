import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Review, ReviewRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCourseReviews(courseId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/courses/${courseId}/reviews`);
  }

  createReview(courseId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/courses/${courseId}/reviews`, review);
  }

  createOrUpdate(courseId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/courses/${courseId}`, review);
  }

  updateReview(courseId: number, reviewId: number, review: ReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/courses/${courseId}/reviews/${reviewId}`, review);
  }

  deleteReview(courseId: number, reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}/reviews/${reviewId}`);
  }

  getMyReview(courseId: number): Observable<Review | null> {
    return this.http.get<Review | null>(`${this.apiUrl}/reviews/courses/${courseId}/my-review`).pipe(
      catchError(() => of(null))
    );
  }

  getCourseAverageRating(courseId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/courses/${courseId}/reviews/average`);
  }
}
