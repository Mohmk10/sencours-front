import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'sencours_token';
  private userKey = 'sencours_user';

  constructor() {
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    const user: User = {
      id: response.userId,
      email: response.email,
      firstName: response.fullName.split(' ')[0],
      lastName: response.fullName.split(' ').slice(1).join(' '),
      role: response.role as User['role'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.userKey);
    if (userJson && this.getToken()) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }
}
