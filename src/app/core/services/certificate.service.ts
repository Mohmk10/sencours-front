import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Certificate {
  id: number;
  certificateNumber: string;
  courseId: number;
  courseTitle: string;
  courseThumbnail: string;
  instructorName: string;
  userId: number;
  userName: string;
  issuedAt: string;
  completionDate: string;
}

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  downloadCertificate(courseId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificates/courses/${courseId}/download`, {
      responseType: 'blob'
    });
  }

  getCertificate(courseId: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/courses/${courseId}`);
  }

  getMyCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/certificates/my-certificates`);
  }

  verifyCertificate(certificateNumber: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/verify/${certificateNumber}`);
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
