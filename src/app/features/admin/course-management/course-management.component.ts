import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course, PageResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-[#1C1D1F]">Gestion des cours</h1>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="loadCourses()"
            class="input"
            placeholder="Rechercher par titre...">
        </div>
        <select [(ngModel)]="selectedStatus" (change)="onStatusChange()" class="input w-48">
          <option value="">Tous les statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
          <option value="ARCHIVED">Archivé</option>
        </select>
      </div>

      @if (isLoading) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="flex items-center gap-4 p-4">
              <div class="skeleton w-16 h-10 rounded flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-1/2"></div>
                <div class="skeleton h-3 w-1/4"></div>
              </div>
              <div class="skeleton h-6 w-20"></div>
            </div>
          }
        </div>
      } @else if (!pageResponse?.content?.length) {
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <h3 class="empty-state-title">Aucun cours trouvé</h3>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Instructeur</th>
                <th>Statut</th>
                <th>Prix</th>
                <th>Étudiants</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (course of pageResponse?.content; track course.id) {
                <tr>
                  <td>
                    <div>
                      <p class="font-medium text-[#1C1D1F] truncate max-w-xs">{{ course.title }}</p>
                      <p class="text-xs text-[#6A6F73]">{{ course.categoryName }}</p>
                    </div>
                  </td>
                  <td class="text-[#6A6F73]">{{ course.instructorName }}</td>
                  <td>
                    <select
                      [value]="course.status"
                      (change)="updateStatus(course, $event)"
                      class="text-sm border border-[#E4E8EB] rounded px-2 py-1 bg-white text-[#1C1D1F] focus:outline-none focus:border-[#5624D0]">
                      <option value="DRAFT">Brouillon</option>
                      <option value="PUBLISHED">Publié</option>
                      <option value="ARCHIVED">Archivé</option>
                    </select>
                  </td>
                  <td>
                    @if (course.price === 0) {
                      <span class="text-[#1E6B55] font-medium">Gratuit</span>
                    } @else {
                      {{ course.price | number:'1.0-0' }} FCFA
                    }
                  </td>
                  <td>{{ course.totalEnrollments || 0 }}</td>
                  <td>
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/courses', course.id]" class="btn btn-ghost btn-sm" title="Voir">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </a>
                      <button (click)="deleteCourse(course)" class="btn btn-ghost btn-sm text-[#C4302B]" title="Supprimer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (pageResponse && pageResponse.totalPages > 1) {
          <div class="flex justify-center mt-6">
            <div class="flex items-center gap-1">
              <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-ghost btn-sm">Précédent</button>
              <span class="px-4 text-sm text-[#6A6F73]">Page {{ currentPage + 1 }} sur {{ pageResponse.totalPages }}</span>
              <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage >= pageResponse.totalPages - 1" class="btn btn-ghost btn-sm">Suivant</button>
            </div>
          </div>
        }
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
    const url = this.selectedStatus
      ? `${environment.apiUrl}/courses/status/${this.selectedStatus}/paginated`
      : `${environment.apiUrl}/courses/paginated`;

    this.http.get<PageResponse<Course>>(url, { params }).subscribe({
      next: (response) => { this.pageResponse = response; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  onStatusChange() { this.currentPage = 0; this.loadCourses(); }

  onPageChange(page: number) { this.currentPage = page; this.loadCourses(); }

  updateStatus(course: Course, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.http.put<Course>(`${environment.apiUrl}/courses/${course.id}`, { status: newStatus }).subscribe({
      next: () => { course.status = newStatus as Course['status']; }
    });
  }

  deleteCourse(course: Course) {
    if (!confirm(`Supprimer "${course.title}" ?`)) return;
    this.http.delete(`${environment.apiUrl}/courses/${course.id}`).subscribe({
      next: () => this.loadCourses()
    });
  }
}
