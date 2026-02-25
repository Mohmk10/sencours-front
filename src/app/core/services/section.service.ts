import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Section } from '../models';

export interface SectionCreateRequest {
  title: string;
  orderIndex?: number;
}

@Injectable({ providedIn: 'root' })
export class SectionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSectionsByCourse(courseId: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/courses/${courseId}/sections`);
  }

  createSection(courseId: number, request: SectionCreateRequest): Observable<Section> {
    return this.http.post<Section>(`${this.apiUrl}/courses/${courseId}/sections`, request);
  }

  updateSection(sectionId: number, request: SectionCreateRequest): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/sections/${sectionId}`, request);
  }

  deleteSection(sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sections/${sectionId}`);
  }
}
