import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson } from '../models';

export type LessonType = 'VIDEO' | 'VIDEO_UPLOAD' | 'TEXT' | 'QUIZ' | 'PDF' | 'IMAGE';

export interface LessonCreateRequest {
  title: string;
  content?: string;
  type: LessonType;
  duration?: number;
  orderIndex?: number;
  isFree: boolean;
  videoUrl?: string;
  filePath?: string;
  quizData?: string;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'multiple_answers';
  question: string;
  options?: string[];
  correctAnswer?: number | boolean;
  correctAnswers?: number[];
  explanation?: string;
}

export interface QuizData {
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createLesson(sectionId: number, request: LessonCreateRequest): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/sections/${sectionId}/lessons`, request);
  }

  getLessonsBySection(sectionId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/sections/${sectionId}/lessons`);
  }

  getLesson(lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/lessons/${lessonId}`);
  }

  updateLesson(lessonId: number, request: LessonCreateRequest): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/lessons/${lessonId}`, request);
  }

  deleteLesson(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lessons/${lessonId}`);
  }

  getPreview(lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/lessons/${lessonId}/preview`);
  }
}
