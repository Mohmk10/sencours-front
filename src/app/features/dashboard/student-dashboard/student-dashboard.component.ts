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
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#1C1D1F] py-10">
        <div class="container-app">
          <h1 class="text-2xl font-bold text-white">Bonjour, {{ currentUser?.firstName }}</h1>
          <p class="mt-1 text-[#A1A1A1]">Continuez votre parcours d'apprentissage</p>
        </div>
      </div>

      <div class="container-app py-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="card stat-card">
            <p class="stat-card-label">Cours inscrits</p>
            <p class="stat-card-value">{{ enrollments.length }}</p>
            <div class="stat-card-accent bg-[#5624D0]"></div>
          </div>
          <div class="card stat-card">
            <p class="stat-card-label">Terminés</p>
            <p class="stat-card-value text-[#1E6B55]">{{ completedCount }}</p>
            <div class="stat-card-accent bg-[#1E6B55]"></div>
          </div>
          <div class="card stat-card">
            <p class="stat-card-label">En cours</p>
            <p class="stat-card-value text-[#B4690E]">{{ inProgressCount }}</p>
            <div class="stat-card-accent bg-[#B4690E]"></div>
          </div>
        </div>

        <!-- Section title -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-[#1C1D1F]">Mes cours</h2>
          <a routerLink="/courses" class="link text-sm flex items-center gap-1">
            Explorer le catalogue
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        @if (isLoading) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="card overflow-hidden">
                <div class="flex">
                  <div class="skeleton w-32 h-24 flex-shrink-0"></div>
                  <div class="flex-1 p-4 space-y-2">
                    <div class="skeleton h-4 w-3/4"></div>
                    <div class="skeleton h-3 w-1/2"></div>
                    <div class="skeleton h-2 w-full mt-4"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (enrollments.length === 0) {
          <div class="card">
            <div class="empty-state">
              <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 class="empty-state-title">Commencez votre apprentissage</h3>
              <p class="empty-state-description">Vous n'êtes inscrit à aucun cours pour le moment</p>
              <a routerLink="/courses" class="btn btn-primary">Découvrir les cours</a>
            </div>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (enrollment of enrollments; track enrollment.id) {
              <a [routerLink]="['/courses', enrollment.courseId]" class="card overflow-hidden group hover:shadow-md transition-shadow">
                <div class="flex">
                  <!-- Thumbnail -->
                  <div class="w-32 h-24 flex-shrink-0 bg-[#F3EFFC] overflow-hidden">
                    @if (enrollment.courseThumbnail) {
                      <img [src]="enrollment.courseThumbnail" [alt]="enrollment.courseTitle" class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-[#5624D0] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                    }
                  </div>

                  <!-- Content -->
                  <div class="flex-1 p-4 min-w-0">
                    <h3 class="font-semibold text-[#1C1D1F] text-sm line-clamp-2 group-hover:text-[#5624D0] transition-colors">
                      {{ enrollment.courseTitle }}
                    </h3>
                    <p class="text-xs text-[#6A6F73] mt-1">{{ enrollment.instructorName }}</p>

                    <!-- Progress bar -->
                    <div class="mt-3">
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-[#6A6F73]">Progression</span>
                        <span class="font-medium text-[#1C1D1F]">{{ enrollment.progress || 0 }}%</span>
                      </div>
                      <div class="h-1.5 bg-[#E4E8EB] rounded-full overflow-hidden">
                        <div class="h-full bg-[#5624D0] rounded-full transition-all duration-300"
                             [style.width.%]="enrollment.progress || 0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
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
