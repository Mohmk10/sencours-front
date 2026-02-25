import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SuspensionAppeal {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminResponse: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewedByName: string | null;
}

@Injectable({ providedIn: 'root' })
export class SuspensionAppealService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appeals`;

  submitAppeal(reason: string): Observable<SuspensionAppeal> {
    return this.http.post<SuspensionAppeal>(this.apiUrl, { reason });
  }

  getMyAppeals(): Observable<SuspensionAppeal[]> {
    return this.http.get<SuspensionAppeal[]>(`${this.apiUrl}/my`);
  }

  getPendingAppeals(): Observable<SuspensionAppeal[]> {
    return this.http.get<SuspensionAppeal[]>(`${this.apiUrl}/pending`);
  }

  reviewAppeal(id: number, status: 'APPROVED' | 'REJECTED', adminResponse: string): Observable<SuspensionAppeal> {
    return this.http.patch<SuspensionAppeal>(`${this.apiUrl}/${id}`, { status, adminResponse });
  }
}
