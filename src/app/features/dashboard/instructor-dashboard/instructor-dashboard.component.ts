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
    <div class="bg-[#F7F9FA] min-h-screen">
      <!-- Header -->
      <div class="bg-[#1C1D1F] text-white">
        <div class="container-custom py-10">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold">Espace instructeur</h1>
              <p class="text-gray-400 text-sm mt-1">Gérez vos cours et suivez vos performances</p>
            </div>
            <a routerLink="/courses/new" class="btn-primary flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Créer un cours
            </a>
          </div>
        </div>
      </div>

      <div class="container-custom py-8">
        <!-- Loading skeleton -->
        @if (isLoading) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white border border-[#D1D7DC] p-5">
                <div class="skeleton h-3 w-20 mb-3"></div>
                <div class="skeleton h-7 w-12"></div>
              </div>
            }
          </div>
        }

        @if (!isLoading && pageResponse) {
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <div class="bg-white border border-[#D1D7DC] p-5">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Total cours</p>
              <p class="text-2xl font-bold text-[#1C1D1F]">{{ pageResponse.totalElements }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#5624D0]"></div>
            </div>
            <div class="bg-white border border-[#D1D7DC] p-5">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Publiés</p>
              <p class="text-2xl font-bold text-[#1E6B55]">{{ publishedCount }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#1E6B55]"></div>
            </div>
            <div class="bg-white border border-[#D1D7DC] p-5">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Brouillons</p>
              <p class="text-2xl font-bold text-[#F69C08]">{{ draftCount }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#F69C08]"></div>
            </div>
            <div class="bg-white border border-[#D1D7DC] p-5">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Étudiants</p>
              <p class="text-2xl font-bold text-[#5624D0]">{{ totalStudents }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#5624D0]"></div>
            </div>
          </div>

          <!-- Courses table -->
          @if (pageResponse.content.length === 0) {
            <div class="bg-white border border-[#D1D7DC] py-16 text-center">
              <div class="w-16 h-16 bg-[#EDE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 class="font-bold text-[#1C1D1F] mb-1">Aucun cours créé</h3>
              <p class="text-sm text-[#6A6F73] mb-5">Créez votre premier cours et commencez à enseigner.</p>
              <a routerLink="/courses/new" class="btn-primary">Créer mon premier cours</a>
            </div>
          } @else {
            <div class="bg-white border border-[#D1D7DC] overflow-hidden">
              <div class="px-6 py-4 border-b border-[#D1D7DC]">
                <h2 class="font-bold text-[#1C1D1F]">Mes cours</h2>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-[#F7F9FA] border-b border-[#D1D7DC]">
                      <th class="px-6 py-3 text-left text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Cours</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Statut</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Prix</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Étudiants</th>
                      <th class="px-6 py-3 text-left text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Note</th>
                      <th class="px-6 py-3 text-right text-xs font-bold text-[#6A6F73] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#F7F9FA]">
                    @for (course of pageResponse.content; track course.id) {
                      <tr class="hover:bg-[#F7F9FA] transition-colors">
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="w-14 h-10 bg-[#EDE9FE] border border-[#D1D7DC] flex-shrink-0 flex items-center justify-center">
                              <svg class="w-5 h-5 text-[#5624D0] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                              </svg>
                            </div>
                            <div class="min-w-0">
                              <p class="font-semibold text-[#1C1D1F] text-sm truncate max-w-xs">{{ course.title }}</p>
                              <p class="text-xs text-[#6A6F73] mt-0.5">{{ course.categoryName }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span [class]="getStatusClass(course.status)">{{ getStatusLabel(course.status) }}</span>
                        </td>
                        <td class="px-6 py-4 text-sm text-[#1C1D1F] font-medium">
                          {{ course.price === 0 ? 'Gratuit' : (course.price | number:'1.0-0') + ' FCFA' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-[#1C1D1F]">{{ course.totalEnrollments || 0 }}</td>
                        <td class="px-6 py-4">
                          @if (course.averageRating) {
                            <div class="flex items-center gap-1">
                              <svg class="w-3.5 h-3.5 text-[#E59819]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              <span class="text-sm font-medium text-[#1C1D1F]">{{ course.averageRating | number:'1.1-1' }}</span>
                            </div>
                          } @else {
                            <span class="text-xs text-[#6A6F73]">—</span>
                          }
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex justify-end items-center gap-3">
                            <a [routerLink]="['/courses', course.id]"
                               class="text-xs font-semibold text-[#5624D0] hover:underline">Voir</a>
                            <a [routerLink]="['/courses', course.id, 'edit']"
                               class="text-xs font-semibold text-[#1C1D1F] hover:text-[#5624D0] transition-colors">Modifier</a>
                            <button (click)="deleteCourse(course)"
                                    class="text-xs font-semibold text-[#EF4444] hover:text-red-700 transition-colors">Supprimer</button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mt-4">
              <app-pagination [pageData]="pageResponse" (pageChange)="onPageChange($event)" />
            </div>
          }
        }
      </div>
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
    const base = 'badge';
    switch (status) {
      case 'PUBLISHED': return `${base} badge-success`;
      case 'DRAFT': return `${base} badge-warning`;
      case 'ARCHIVED': return `${base} text-[#6A6F73] bg-gray-100`;
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
