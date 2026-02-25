import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  url: string;
  filename: string;
  type: string;
  size: string;
}

export interface UploadProgress {
  progress: number;
  response?: UploadResponse;
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  uploadFile(file: File, type: 'video' | 'image' | 'pdf'): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<UploadResponse>(`${this.apiUrl}/files/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<UploadResponse>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            return { progress };
          case HttpEventType.Response:
            return { progress: 100, response: event.body! };
          default:
            return { progress: 0 };
        }
      })
    );
  }

  deleteFile(url: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files`, { params: { url } });
  }
}
