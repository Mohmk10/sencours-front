import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson } from '../models';

export interface LessonCreateRequest {
  title: string;
  content?: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  duration?: number;
  orderIndex?: number;
  isFree: boolean;
  videoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createLesson(sectionId: number, request: LessonCreateRequest): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/sections/${sectionId}/lessons`, request);
  }

  updateLesson(lessonId: number, request: LessonCreateRequest): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/lessons/${lessonId}`, request);
  }

  deleteLesson(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lessons/${lessonId}`);
  }
}
