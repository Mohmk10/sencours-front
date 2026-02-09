import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course, PageResponse } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des cours</h1>

      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="loadCourses()" placeholder="Rechercher par titre..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="md:w-48">
            <select [(ngModel)]="selectedStatus" (change)="onStatusChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
          <button (click)="loadCourses()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Rechercher</button>
        </div>
      </div>

      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!isLoading && pageResponse) {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructeur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiants</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (course of pageResponse.content; track course.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-medium text-gray-900">{{ course.title }}</p>
                      <p class="text-sm text-gray-500">{{ course.categoryName }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-500">{{ course.instructorName }}</td>
                  <td class="px-6 py-4">
                    <select [value]="course.status" (change)="updateStatus(course, $event)" class="px-2 py-1 text-sm border rounded">
                      <option value="DRAFT">Brouillon</option>
                      <option value="PUBLISHED">Publié</option>
                      <option value="ARCHIVED">Archivé</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 text-gray-900">{{ course.price === 0 ? 'Gratuit' : (course.price | number:'1.0-0') + ' FCFA' }}</td>
                  <td class="px-6 py-4 text-gray-900">{{ course.totalEnrollments || 0 }}</td>
                  <td class="px-6 py-4 text-right">
                    <a [routerLink]="['/courses', course.id]" class="text-blue-600 hover:text-blue-800 mr-3">Voir</a>
                    <button (click)="deleteCourse(course)" class="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-pagination [pageData]="pageResponse" (pageChange)="onPageChange($event)" />
      }
    </div>
  `
})
export class CourseManagementComponent implements OnInit {
  private http = inject(HttpClient);

  pageResponse: PageResponse<Course> | null = null;
  isLoading = true;
  searchQuery = '';
  selectedStatus = '';
  currentPage = 0;

  ngOnInit() { this.loadCourses(); }

  loadCourses() {
    this.isLoading = true;
    let params = new HttpParams().set('page', this.currentPage).set('size', 10);
    let url = this.selectedStatus
      ? `${environment.apiUrl}/courses/status/${this.selectedStatus}/paginated`
      : `${environment.apiUrl}/courses/paginated`;

    this.http.get<PageResponse<Course>>(url, { params }).subscribe({
      next: (response) => { this.pageResponse = response; this.isLoading = false; },
      error: (err) => { console.error('Error loading courses', err); this.isLoading = false; }
    });
  }

  onStatusChange() { this.currentPage = 0; this.loadCourses(); }
  onPageChange(page: number) { this.currentPage = page; this.loadCourses(); }

  updateStatus(course: Course, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.http.put<Course>(`${environment.apiUrl}/courses/${course.id}`, { status: newStatus }).subscribe({
      next: () => { course.status = newStatus as Course['status']; },
      error: (err) => console.error('Error updating status', err)
    });
  }

  deleteCourse(course: Course) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${course.title}" ?`)) return;
    this.http.delete(`${environment.apiUrl}/courses/${course.id}`).subscribe({
      next: () => this.loadCourses(),
      error: (err) => console.error('Error deleting course', err)
    });
  }
}
