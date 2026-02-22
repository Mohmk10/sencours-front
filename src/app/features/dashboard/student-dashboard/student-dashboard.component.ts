import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Enrollment } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Gradient header -->
      <div class="page-header-brand">
        <div class="container-app">
          <p class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase;">Tableau de bord</p>
          <h1 class="text-4xl font-bold text-white">
            Bonjour, <span style="color: var(--amber-mid);">{{ currentUser?.firstName }}</span>
          </h1>
          <p class="mt-3 text-base" style="color: rgba(255,255,255,0.6);">
            Continuez votre parcours d'apprentissage
          </p>
        </div>
      </div>

      <div class="container-app py-12">

        <!-- Stat cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div class="card stat-card stat-card-violet">
            <div class="flex items-center justify-between mb-2">
              <svg class="w-5 h-5" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ enrollments.length }}</p>
            <p class="stat-card-label mt-1">Cours inscrits</p>
          </div>
          <div class="card stat-card stat-card-green">
            <div class="flex items-center justify-between mb-2">
              <svg class="w-5 h-5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ completedCount }}</p>
            <p class="stat-card-label mt-1">Terminés</p>
          </div>
          <div class="card stat-card stat-card-amber">
            <div class="flex items-center justify-between mb-2">
              <svg class="w-5 h-5" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <p class="stat-card-value">{{ inProgressCount }}</p>
            <p class="stat-card-label mt-1">En cours</p>
          </div>
        </div>

        <!-- Section header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold" style="color: var(--ink);">Mes cours</h2>
            <p class="text-sm mt-0.5" style="color: var(--ink-3);">{{ enrollments.length }} cours en cours d'apprentissage</p>
          </div>
          <a routerLink="/courses" class="btn btn-secondary btn-sm">
            Explorer le catalogue
          </a>
        </div>

        @if (isLoading) {
          <div class="space-y-3">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white" style="border: 1px solid var(--border); border-radius: var(--r-lg);">
                <div class="flex gap-0 overflow-hidden" style="border-radius: var(--r-lg);">
                  <div class="skeleton w-36 h-24 flex-shrink-0 rounded-none"></div>
                  <div class="flex-1 p-4 space-y-2.5">
                    <div class="skeleton h-4 w-3/4"></div>
                    <div class="skeleton h-3 w-1/2"></div>
                    <div class="skeleton h-2 w-full mt-3"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (enrollments.length === 0) {
          <div class="card py-20 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                 style="background: var(--violet-tint);">
              <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2" style="color: var(--ink);">Commencez votre apprentissage</h3>
            <p class="text-sm mb-6" style="color: var(--ink-3);">Vous n'êtes inscrit à aucun cours pour le moment</p>
            <a routerLink="/courses" class="btn btn-primary">Découvrir les cours</a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (enrollment of enrollments; track enrollment.id) {
              <a [routerLink]="['/courses', enrollment.courseId]"
                 class="enrollment-card bg-white flex overflow-hidden"
                 style="border: 1px solid var(--border); border-radius: var(--r-lg);">

                <!-- Thumbnail -->
                <div class="w-44 h-28 flex-shrink-0 overflow-hidden" style="background: var(--violet-tint);">
                  @if (enrollment.courseThumbnail) {
                    <img [src]="enrollment.courseThumbnail" [alt]="enrollment.courseTitle"
                         class="w-full h-full object-cover">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, #EDE9FE, #DDD6FE);">
                      <svg class="w-8 h-8 opacity-30" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                  }
                </div>

                <!-- Content -->
                <div class="flex-1 px-5 py-4 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 class="font-semibold text-sm line-clamp-2 leading-snug mb-1" style="color: var(--ink);">
                      {{ enrollment.courseTitle }}
                    </h3>
                    <p class="text-xs" style="color: var(--ink-3);">{{ enrollment.instructorName }}</p>
                  </div>

                  <!-- Progress bar -->
                  <div class="mt-4">
                    <div class="flex justify-between text-xs mb-2">
                      <span style="color: var(--ink-3);">Progression</span>
                      <span class="font-semibold" style="color: var(--ink);">{{ enrollment.progress || 0 }}%</span>
                    </div>
                    <div class="h-2 rounded-full overflow-hidden" style="background: var(--border);">
                      <div class="h-full rounded-full transition-all duration-300"
                           [style.width.%]="enrollment.progress || 0"
                           [style.background]="(enrollment.progress || 0) === 100 ? 'var(--gradient-green)' : 'var(--gradient-brand)'">
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Arrow -->
                <div class="flex items-center px-5">
                  <svg class="w-4 h-4" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </a>
            }
          </div>
        }
      </div>

      <style>
        .enrollment-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .enrollment-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }
      </style>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  enrollments: Enrollment[] = [];
  isLoading = true;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get completedCount(): number {
    return this.enrollments.filter(e => (e.progress || 0) === 100).length;
  }

  get inProgressCount(): number {
    return this.enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;
  }

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
