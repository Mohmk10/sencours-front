import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { Course, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Gradient header -->
      <div class="page-header-brand">
        <div class="container-app">
          <p class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase;">Tableau de bord</p>
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 class="text-4xl font-bold text-white">Espace instructeur</h1>
              <p class="mt-3 text-base" style="color: rgba(255,255,255,0.6);">
                Gérez vos cours et suivez vos performances
              </p>
            </div>
            <a routerLink="/courses/new" class="btn btn-amber flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Créer un cours
            </a>
          </div>
        </div>
      </div>

      <div class="container-app py-14">

        <!-- Stat cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="card stat-card stat-card-violet">
            <div class="mb-2">
              <svg class="w-5 h-5" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ pageResponse?.totalElements || 0 }}</p>
            <p class="stat-card-label mt-1">Total cours</p>
          </div>
          <div class="card stat-card stat-card-green">
            <div class="mb-2">
              <svg class="w-5 h-5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ publishedCount }}</p>
            <p class="stat-card-label mt-1">Publiés</p>
          </div>
          <div class="card stat-card stat-card-amber">
            <div class="mb-2">
              <svg class="w-5 h-5" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ draftCount }}</p>
            <p class="stat-card-label mt-1">Brouillons</p>
          </div>
          <div class="card stat-card stat-card-slate">
            <div class="mb-2">
              <svg class="w-5 h-5" style="color: var(--ink-2);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ totalStudents }}</p>
            <p class="stat-card-label mt-1">Total étudiants</p>
          </div>
        </div>

        <!-- Courses table -->
        <div class="card overflow-hidden">
          <div class="px-6 py-4" style="border-bottom: 1px solid var(--border);">
            <h2 class="font-semibold" style="color: var(--ink);">Mes cours</h2>
          </div>

          @if (isLoading) {
            <div class="p-6 space-y-4">
              @for (i of [1,2,3]; track i) {
                <div class="flex items-center gap-4">
                  <div class="skeleton w-20 h-12 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1 space-y-2">
                    <div class="skeleton h-4 w-1/2"></div>
                    <div class="skeleton h-3 w-1/4"></div>
                  </div>
                  <div class="skeleton h-6 w-16 rounded-full"></div>
                </div>
              }
            </div>
          } @else if (!pageResponse?.content?.length) {
            <div class="empty-state">
              <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 class="empty-state-title">Aucun cours créé</h3>
              <p class="empty-state-description">Créez votre premier cours et commencez à enseigner</p>
              <a routerLink="/courses/new" class="btn btn-primary">Créer mon premier cours</a>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Cours</th>
                    <th>Statut</th>
                    <th>Prix</th>
                    <th>Étudiants</th>
                    <th>Note</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (course of pageResponse?.content; track course.id) {
                    <tr>
                      <td>
                        <div class="flex items-center gap-3">
                          <div class="w-16 h-10 flex-shrink-0 overflow-hidden"
                               style="border-radius: var(--r-sm); background: var(--violet-tint);">
                            @if (course.thumbnailUrl) {
                              <img [src]="course.thumbnailUrl" class="w-full h-full object-cover">
                            }
                          </div>
                          <div class="min-w-0">
                            <p class="font-medium truncate max-w-xs" style="color: var(--ink);">{{ course.title }}</p>
                            <p class="text-xs" style="color: var(--ink-3);">{{ course.categoryName }}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'badge-success': course.status === 'PUBLISHED',
                          'badge-warning': course.status === 'DRAFT',
                          'badge-neutral': course.status === 'ARCHIVED'
                        }">{{ getStatusLabel(course.status) }}</span>
                      </td>
                      <td>
                        @if (course.price === 0) {
                          <span class="font-medium" style="color: var(--green);">Gratuit</span>
                        } @else {
                          <span class="font-medium" style="color: var(--amber);">
                            {{ course.price | number:'1.0-0' }} FCFA
                          </span>
                        }
                      </td>
                      <td style="color: var(--ink-2);">{{ course.totalEnrollments || 0 }}</td>
                      <td>
                        @if (course.averageRating) {
                          <div class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" style="color: var(--amber-mid);" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span class="text-sm font-medium" style="color: var(--ink);">{{ course.averageRating | number:'1.1-1' }}</span>
                          </div>
                        } @else {
                          <span style="color: var(--ink-4);">—</span>
                        }
                      </td>
                      <td>
                        <div class="flex items-center justify-end gap-0.5">
                          <a [routerLink]="['/courses', course.id]"
                             class="btn btn-ghost btn-sm" title="Voir">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </a>
                          <a [routerLink]="['/courses', course.id, 'edit']"
                             class="btn btn-ghost btn-sm" title="Modifier">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </a>
                          <button (click)="deleteCourse(course)"
                                  class="btn btn-ghost btn-sm" title="Supprimer" style="color: #EF4444;">
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
          }
        </div>
      </div>
    </div>
  `
})
export class InstructorDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);

  pageResponse: PageResponse<Course> | null = null;
  isLoading = true;

  get publishedCount(): number {
    return this.pageResponse?.content?.filter(c => c.status === 'PUBLISHED').length || 0;
  }

  get draftCount(): number {
    return this.pageResponse?.content?.filter(c => c.status === 'DRAFT').length || 0;
  }

  get totalStudents(): number {
    return this.pageResponse?.content?.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0) || 0;
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) return;

    this.courseService.getInstructorCourses(userId, 0, 50).subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
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
    if (!confirm(`Supprimer le cours "${course.title}" ?`)) return;
    this.courseService.deleteCourse(course.id).subscribe({
      next: () => this.loadCourses()
    });
  }
}
