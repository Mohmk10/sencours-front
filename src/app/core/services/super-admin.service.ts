import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/super-admin`;

  createAdmin(request: CreateAdminRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admins`, request);
  }

  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admins`);
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admins/${id}`);
  }

  createInstructor(request: CreateAdminRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/instructors`, request);
  }
}
