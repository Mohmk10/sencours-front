import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseCreateRequest, CourseUpdateRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  // Public endpoints (cours publiés)
  getPublishedCourses(page = 0, size = 10, sort = 'createdAt', direction = 'desc'): Observable<PageResponse<Course>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('direction', direction);
    return this.http.get<PageResponse<Course>>(`${this.apiUrl}/status/PUBLISHED/paginated`, { params });
  }

  searchPublishedCourses(title: string, page = 0, size = 10): Observable<PageResponse<Course>> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<Course>>(`${this.apiUrl}/search/paginated`, { params });
  }

  getCoursesByCategory(categoryId: number, page = 0, size = 10): Observable<PageResponse<Course>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Course>>(`${this.apiUrl}/category/${categoryId}/paginated`, { params });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Authenticated endpoints
  createCourse(course: CourseCreateRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, course: CourseUpdateRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCourseStatus(courseId: number, status: 'DRAFT' | 'PUBLISHED'): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${courseId}/status`, { status });
  }

  getInstructorCourses(instructorId: number, page = 0, size = 10): Observable<PageResponse<Course>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Course>>(`${this.apiUrl}/instructor/${instructorId}/paginated`, { params });
  }

  // Pour récupérer les sections d'un cours
  getCourseSections(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/courses/${courseId}/sections`);
  }
}
