import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, PageResponse } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mes cours</h1>
          <p class="text-gray-600">Gérez vos cours et suivez vos statistiques</p>
        </div>
        <a routerLink="/courses/new" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau cours
        </a>
      </div>

      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!isLoading && pageResponse) {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm text-gray-500">Total cours</p>
            <p class="text-2xl font-bold">{{ pageResponse.totalElements }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm text-gray-500">Publiés</p>
            <p class="text-2xl font-bold text-green-600">{{ publishedCount }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm text-gray-500">Brouillons</p>
            <p class="text-2xl font-bold text-yellow-600">{{ draftCount }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-sm text-gray-500">Total étudiants</p>
            <p class="text-2xl font-bold text-blue-600">{{ totalStudents }}</p>
          </div>
        </div>

        @if (pageResponse.content.length === 0) {
          <div class="bg-white rounded-lg shadow p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun cours</h3>
            <p class="mt-1 text-sm text-gray-500">Créez votre premier cours pour commencer.</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cours</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiants</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (course of pageResponse.content; track course.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded mr-3 flex-shrink-0"></div>
                        <div>
                          <p class="font-medium text-gray-900">{{ course.title }}</p>
                          <p class="text-sm text-gray-500">{{ course.categoryName }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="getStatusClass(course.status)">{{ getStatusLabel(course.status) }}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-900">{{ course.price === 0 ? 'Gratuit' : (course.price | number:'1.0-0') + ' FCFA' }}</td>
                    <td class="px-6 py-4 text-gray-900">{{ course.totalEnrollments || 0 }}</td>
                    <td class="px-6 py-4">
                      @if (course.averageRating) {
                        <span class="text-yellow-500">★</span> {{ course.averageRating | number:'1.1-1' }}
                      } @else {
                        <span class="text-gray-400">-</span>
                      }
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <a [routerLink]="['/courses', course.id]" class="text-blue-600 hover:text-blue-800">Voir</a>
                        <a [routerLink]="['/courses', course.id, 'edit']" class="text-green-600 hover:text-green-800">Modifier</a>
                        <button (click)="deleteCourse(course)" class="text-red-600 hover:text-red-800">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <app-pagination [pageData]="pageResponse" (pageChange)="onPageChange($event)" />
        }
      }
    </div>
  `
})
export class InstructorDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  pageResponse: PageResponse<Course> | null = null;
  isLoading = true;
  currentPage = 0;

  get publishedCount(): number {
    return this.pageResponse?.content.filter(c => c.status === 'PUBLISHED').length || 0;
  }

  get draftCount(): number {
    return this.pageResponse?.content.filter(c => c.status === 'DRAFT').length || 0;
  }

  get totalStudents(): number {
    return this.pageResponse?.content.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0) || 0;
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.courseService.getInstructorCourses(user.id, this.currentPage, 10).subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCourses();
  }

  getStatusClass(status: string): string {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'PUBLISHED': return `${base} bg-green-100 text-green-800`;
      case 'DRAFT': return `${base} bg-yellow-100 text-yellow-800`;
      case 'ARCHIVED': return `${base} bg-gray-100 text-gray-800`;
      default: return base;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  }

  deleteCourse(course: Course) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${course.title}" ?`)) return;
    this.courseService.deleteCourse(course.id).subscribe({
      next: () => this.loadCourses(),
      error: (err) => console.error('Error deleting course', err)
    });
  }
}
