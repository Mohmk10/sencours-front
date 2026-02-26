import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Progress } from '../models';

export interface ProgressRequest {
  completed?: boolean;
  watchTimeSeconds?: number;
  lastPositionSeconds?: number;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/progress`;

  updateProgress(lessonId: number, request: ProgressRequest): Observable<Progress> {
    return this.http.put<Progress>(`${this.apiUrl}/lessons/${lessonId}`, request);
  }

  markAsCompleted(lessonId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/lessons/${lessonId}/complete`, {});
  }

  getProgress(lessonId: number): Observable<Progress> {
    return this.http.get<Progress>(`${this.apiUrl}/lessons/${lessonId}`);
  }

  getCourseProgress(courseId: number): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.apiUrl}/courses/${courseId}`);
  }
}
