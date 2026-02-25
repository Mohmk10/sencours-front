import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/users`;

  getAllUsers(page = 0, size = 10): Observable<PageResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<User>>(this.apiUrl, { params });
  }

  getUsersByRole(role: string, page = 0, size = 10): Observable<PageResponse<User>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/role/${role}`, { params });
  }

  searchUsers(search: string, page = 0, size = 10): Observable<PageResponse<User>> {
    const params = new HttpParams().set('search', search).set('page', page).set('size', size);
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/search`, { params });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
