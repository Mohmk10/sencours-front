import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enrollment, Progress } from '../models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollments`;

  enrollInCourse(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/courses/${courseId}`, {});
  }

  unenrollFromCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`);
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my-enrollments`);
  }

  isEnrolled(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/courses/${courseId}/check`);
  }

  getCourseProgress(courseId: number): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${environment.apiUrl}/progress/courses/${courseId}`);
  }

  markLessonComplete(lessonId: number): Observable<Progress> {
    return this.http.post<Progress>(`${environment.apiUrl}/progress/lessons/${lessonId}/complete`, {});
  }
}
