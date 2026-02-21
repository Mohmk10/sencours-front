import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models';

export interface InstructorApplication {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  motivation: string;
  expertise?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ApplicationCreateRequest {
  motivation: string;
  expertise?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface ApplicationReviewRequest {
  approved: boolean;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class InstructorApplicationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createApplication(request: ApplicationCreateRequest): Observable<InstructorApplication> {
    return this.http.post<InstructorApplication>(`${this.apiUrl}/instructor-applications`, request);
  }

  getMyApplication(): Observable<InstructorApplication> {
    return this.http.get<InstructorApplication>(`${this.apiUrl}/instructor-applications/my-application`);
  }

  hasPendingApplication(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/instructor-applications/check`);
  }

  getAllApplications(page = 0, size = 10, status?: string): Observable<PageResponse<InstructorApplication>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<InstructorApplication>>(`${this.apiUrl}/admin/instructor-applications`, { params });
  }

  reviewApplication(id: number, request: ApplicationReviewRequest): Observable<InstructorApplication> {
    return this.http.put<InstructorApplication>(`${this.apiUrl}/admin/instructor-applications/${id}/review`, request);
  }

  getPendingCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/admin/instructor-applications/pending-count`);
  }
}
