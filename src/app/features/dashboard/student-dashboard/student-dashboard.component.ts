import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Enrollment } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-[#F7F9FA] min-h-screen">
      <!-- Header -->
      <div class="bg-[#1C1D1F] text-white">
        <div class="container-custom py-10">
          <h1 class="text-2xl font-bold">Bonjour, {{ userName }}</h1>
          <p class="text-gray-400 text-sm mt-1">Continuez votre parcours d'apprentissage</p>
        </div>
      </div>

      <div class="container-custom py-8">
        <!-- Loading skeleton -->
        @if (isLoading) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white border border-[#D1D7DC] p-6">
                <div class="skeleton h-3 w-24 mb-3"></div>
                <div class="skeleton h-7 w-12"></div>
              </div>
            }
          </div>
        }

        @if (!isLoading) {
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div class="bg-white border border-[#D1D7DC] p-6">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Cours inscrits</p>
              <p class="text-3xl font-bold text-[#1C1D1F]">{{ enrollments.length }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#5624D0]"></div>
            </div>
            <div class="bg-white border border-[#D1D7DC] p-6">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Terminés</p>
              <p class="text-3xl font-bold text-[#1E6B55]">{{ completedCourses }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#1E6B55]"></div>
            </div>
            <div class="bg-white border border-[#D1D7DC] p-6">
              <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">En cours</p>
              <p class="text-3xl font-bold text-[#F69C08]">{{ inProgressCourses }}</p>
              <div class="mt-3 w-8 h-0.5 bg-[#F69C08]"></div>
            </div>
          </div>

          <!-- My courses -->
          <div class="bg-white border border-[#D1D7DC]">
            <div class="px-6 py-4 border-b border-[#D1D7DC] flex items-center justify-between">
              <h2 class="font-bold text-[#1C1D1F]">Mes cours</h2>
              <a routerLink="/courses" class="text-sm text-[#5624D0] font-semibold hover:underline">
                Explorer le catalogue →
              </a>
            </div>

            @if (enrollments.length === 0) {
              <div class="py-16 text-center px-6">
                <div class="w-16 h-16 bg-[#EDE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <h3 class="font-bold text-[#1C1D1F] mb-1">Commencez votre apprentissage</h3>
                <p class="text-sm text-[#6A6F73] mb-5">Vous n'êtes inscrit à aucun cours pour le moment.</p>
                <a routerLink="/courses" class="btn-primary">Découvrir les cours</a>
              </div>
            } @else {
              <div class="divide-y divide-[#F7F9FA]">
                @for (enrollment of enrollments; track enrollment.id) {
                  <div class="p-5 hover:bg-[#F7F9FA] transition-colors">
                    <div class="flex items-center gap-4">
                      <!-- Thumbnail -->
                      <div class="w-20 h-14 bg-[#EDE9FE] border border-[#D1D7DC] flex-shrink-0 overflow-hidden">
                        @if (enrollment.courseThumbnail) {
                          <img [src]="enrollment.courseThumbnail" class="w-full h-full object-cover">
                        } @else {
                          <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-[#5624D0] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </div>
                        }
                      </div>

                      <!-- Info -->
                      <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-[#1C1D1F] text-sm truncate">{{ enrollment.courseTitle }}</h3>
                        <p class="text-xs text-[#6A6F73] mt-0.5">{{ enrollment.instructorName }}</p>
                        <div class="mt-2.5">
                          <div class="flex justify-between text-xs mb-1">
                            <span class="text-[#6A6F73]">Progression</span>
                            <span class="font-semibold text-[#1C1D1F]">{{ enrollment.progressPercentage || 0 }}%</span>
                          </div>
                          <div class="w-full bg-[#D1D7DC] h-1.5">
                            <div class="bg-[#5624D0] h-1.5 transition-all"
                                 [style.width.%]="enrollment.progressPercentage || 0"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Action -->
                      <a [routerLink]="['/courses', enrollment.courseId]"
                         class="flex-shrink-0 px-4 py-2 border border-[#1C1D1F] text-sm font-semibold text-[#1C1D1F] hover:bg-[#1C1D1F] hover:text-white transition-colors">
                        Continuer
                      </a>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);

  enrollments: Enrollment[] = [];
  isLoading = true;

  get userName(): string {
    return this.authService.getCurrentUser()?.firstName || 'Étudiant';
  }

  get completedCourses(): number {
    return this.enrollments.filter(e => (e.progressPercentage || 0) === 100).length;
  }

  get inProgressCourses(): number {
    return this.enrollments.filter(e => (e.progressPercentage || 0) > 0 && (e.progressPercentage || 0) < 100).length;
  }

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.isLoading = true;
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading enrollments', err);
        this.isLoading = false;
      }
    });
  }
}
