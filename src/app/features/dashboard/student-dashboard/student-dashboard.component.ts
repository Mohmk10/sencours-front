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
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Bonjour, {{ userName }} 👋</h1>
        <p class="text-gray-600">Continuez votre apprentissage</p>
      </div>

      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!isLoading) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Cours inscrits</p>
                <p class="text-2xl font-bold">{{ enrollments.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Cours terminés</p>
                <p class="text-2xl font-bold">{{ completedCourses }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">En cours</p>
                <p class="text-2xl font-bold">{{ inProgressCourses }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrolled Courses -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <h2 class="text-xl font-bold">Mes cours</h2>
          </div>

          @if (enrollments.length === 0) {
            <div class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun cours</h3>
              <p class="mt-1 text-sm text-gray-500">Commencez par explorer notre catalogue.</p>
              <a routerLink="/courses" class="mt-4 inline-block text-blue-600 hover:underline">
                Découvrir les cours →
              </a>
            </div>
          } @else {
            <div class="divide-y">
              @for (enrollment of enrollments; track enrollment.id) {
                <div class="p-6 hover:bg-gray-50 transition">
                  <div class="flex items-center gap-4">
                    <div class="w-24 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
                      @if (enrollment.courseThumbnail) {
                        <img [src]="enrollment.courseThumbnail" class="w-full h-full object-cover rounded">
                      } @else {
                        <svg class="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      }
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900">{{ enrollment.courseTitle }}</h3>
                      <p class="text-sm text-gray-500">{{ enrollment.instructorName }}</p>
                      <div class="mt-2">
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Progression</span>
                          <span class="font-medium">{{ enrollment.progressPercentage || 0 }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div class="bg-blue-600 h-2 rounded-full transition-all" [style.width.%]="enrollment.progressPercentage || 0"></div>
                        </div>
                      </div>
                    </div>
                    <a [routerLink]="['/courses', enrollment.courseId]" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
