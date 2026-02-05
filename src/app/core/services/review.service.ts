import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  getCourseReviews(courseId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/courses/${courseId}/reviews`);
  }

  createReview(courseId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/courses/${courseId}/reviews`, review);
  }

  updateReview(courseId: number, reviewId: number, review: ReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${environment.apiUrl}/courses/${courseId}/reviews/${reviewId}`, review);
  }

  deleteReview(courseId: number, reviewId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/courses/${courseId}/reviews/${reviewId}`);
  }

  getCourseAverageRating(courseId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/courses/${courseId}/reviews/average`);
  }
}
