import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoriesPaginated(page = 0, size = 10): Observable<PageResponse<Category>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Category>>(`${this.apiUrl}/paginated`, { params });
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
