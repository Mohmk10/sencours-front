import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Section, Review } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StarRatingComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (isLoading) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!isLoading && course) {
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2">
                <div class="text-sm mb-2">{{ course.categoryName }}</div>
                <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ course.title }}</h1>
                <p class="text-lg opacity-90 mb-4">{{ course.description }}</p>

                <div class="flex items-center gap-4 mb-4">
                  <app-star-rating [rating]="course.averageRating || 0" [showValue]="true" />
                  @if (course.totalEnrollments) {
                    <span>({{ course.totalEnrollments }} étudiants inscrits)</span>
                  }
                </div>

                <p class="text-sm">
                  Créé par <span class="font-semibold">{{ course.instructorName }}</span>
                </p>
              </div>

              <!-- Sidebar Card -->
              <div class="bg-white rounded-lg shadow-xl p-6 text-gray-900">
                @if (course.thumbnailUrl) {
                  <img [src]="course.thumbnailUrl" [alt]="course.title" class="w-full h-40 object-cover rounded mb-4">
                } @else {
                  <div class="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-4 flex items-center justify-center">
                    <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                }

                <div class="text-3xl font-bold mb-4">
                  @if (course.price === 0) {
                    Gratuit
                  } @else {
                    {{ course.price | number:'1.0-0' }} FCFA
                  }
                </div>

                @if (!authService.isAuthenticated()) {
                  <a routerLink="/login"
                     class="block w-full text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-2">
                    Connectez-vous pour vous inscrire
                  </a>
                } @else if (isEnrolled) {
                  <div class="space-y-2">
                    <div class="bg-green-100 text-green-800 text-center py-2 rounded-lg mb-2">
                      ✓ Vous êtes inscrit à ce cours
                    </div>
                    <button
                      (click)="goToLearning()"
                      class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Continuer l'apprentissage
                    </button>
                    <button
                      (click)="unenroll()"
                      [disabled]="enrollmentLoading"
                      class="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition">
                      Se désinscrire
                    </button>
                  </div>
                } @else {
                  <button
                    (click)="enroll()"
                    [disabled]="enrollmentLoading"
                    class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                    @if (enrollmentLoading) {
                      Inscription...
                    } @else {
                      S'inscrire maintenant
                    }
                  </button>
                }

                @if (enrollmentError) {
                  <div class="mt-2 text-red-600 text-sm">{{ enrollmentError }}</div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <!-- Sections & Lessons -->
              <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-bold mb-4">Contenu du cours</h2>

                @if (sections.length === 0) {
                  <p class="text-gray-500">Aucun contenu disponible pour le moment.</p>
                } @else {
                  <div class="space-y-4">
                    @for (section of sections; track section.id; let i = $index) {
                      <div class="border rounded-lg overflow-hidden">
                        <button
                          (click)="toggleSection(i)"
                          class="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition">
                          <span class="font-semibold">{{ section.title }}</span>
                          <span class="text-sm text-gray-500">
                            {{ section.lessons?.length || 0 }} leçons
                          </span>
                        </button>

                        @if (expandedSections[i]) {
                          <div class="p-4 space-y-2">
                            @if (section.lessons && section.lessons.length > 0) {
                              @for (lesson of section.lessons; track lesson.id) {
                                <div class="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    @if (lesson.type === 'VIDEO') {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    } @else {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    }
                                  </svg>
                                  <span class="flex-1">{{ lesson.title }}</span>
                                  @if (lesson.isFree) {
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Gratuit</span>
                                  }
                                  @if (lesson.duration) {
                                    <span class="text-sm text-gray-500">{{ lesson.duration }} min</span>
                                  }
                                </div>
                              }
                            } @else {
                              <p class="text-gray-500 text-sm">Aucune leçon dans cette section</p>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Reviews -->
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-bold">Avis des étudiants</h2>
                  @if (isEnrolled && !hasReviewed) {
                    <button
                      (click)="showReviewForm = !showReviewForm"
                      class="text-blue-600 hover:text-blue-800">
                      Laisser un avis
                    </button>
                  }
                </div>

                <!-- Review Form -->
                @if (showReviewForm && isEnrolled) {
                  <div class="bg-gray-50 p-4 rounded-lg mb-4">
                    <div class="mb-4">
                      <label class="block text-sm font-medium mb-2">Votre note</label>
                      <app-star-rating
                        [rating]="newReview.rating"
                        [interactive]="true"
                        [showValue]="false"
                        (ratingChange)="newReview.rating = $event" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
                      <textarea
                        [(ngModel)]="newReview.comment"
                        rows="3"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Partagez votre expérience..."></textarea>
                    </div>
                    <div class="flex gap-2">
                      <button
                        (click)="submitReview()"
                        [disabled]="newReview.rating === 0 || reviewLoading"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        Publier
                      </button>
                      <button
                        (click)="showReviewForm = false"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-100">
                        Annuler
                      </button>
                    </div>
                  </div>
                }

                @if (reviews.length === 0) {
                  <p class="text-gray-500">Aucun avis pour le moment.</p>
                } @else {
                  <div class="space-y-4">
                    @for (review of reviews; track review.id) {
                      <div class="border-b pb-4 last:border-b-0">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {{ review.userName.charAt(0) }}
                          </div>
                          <span class="font-medium">{{ review.userName }}</span>
                          <app-star-rating [rating]="review.rating" [showValue]="false" />
                        </div>
                        @if (review.comment) {
                          <p class="text-gray-700">{{ review.comment }}</p>
                        }
                        <p class="text-sm text-gray-500 mt-1">{{ review.createdAt | date:'dd/MM/yyyy' }}</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Instructor Info (sidebar) -->
            <div>
              <div class="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 class="font-bold mb-4">À propos de l'instructeur</h3>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                    {{ course.instructorName.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ course.instructorName }}</p>
                    <p class="text-sm text-gray-500">Instructeur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (!isLoading && !course) {
        <div class="container mx-auto px-4 py-20 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Cours introuvable</h2>
          <p class="text-gray-500 mb-4">Ce cours n'existe pas ou a été supprimé.</p>
          <a routerLink="/courses" class="text-blue-600 hover:underline">Retour aux cours</a>
        </div>
      }
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);

  course: Course | null = null;
  sections: Section[] = [];
  reviews: Review[] = [];
  isLoading = true;
  isEnrolled = false;
  hasReviewed = false;
  enrollmentLoading = false;
  enrollmentError = '';
  reviewLoading = false;
  showReviewForm = false;
  expandedSections: boolean[] = [];

  newReview = { rating: 0, comment: '' };

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  loadCourse(id: number) {
    this.isLoading = true;

    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loadSections(id);
        this.loadReviews(id);
        if (this.authService.isAuthenticated()) {
          this.checkEnrollment(id);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading course', err);
        this.isLoading = false;
      }
    });
  }

  loadSections(courseId: number) {
    this.courseService.getCourseSections(courseId).subscribe({
      next: (sections) => {
        this.sections = sections;
        this.expandedSections = new Array(sections.length).fill(false);
      },
      error: (err) => console.error('Error loading sections', err)
    });
  }

  loadReviews(courseId: number) {
    this.reviewService.getCourseReviews(courseId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.hasReviewed = reviews.some(r => r.userId === currentUser.id);
        }
      },
      error: (err) => console.error('Error loading reviews', err)
    });
  }

  checkEnrollment(courseId: number) {
    this.enrollmentService.isEnrolled(courseId).subscribe({
      next: (enrolled) => this.isEnrolled = enrolled,
      error: (err) => console.error('Error checking enrollment', err)
    });
  }

  toggleSection(index: number) {
    this.expandedSections[index] = !this.expandedSections[index];
  }

  enroll() {
    if (!this.course) return;

    this.enrollmentLoading = true;
    this.enrollmentError = '';

    this.enrollmentService.enrollInCourse(this.course.id).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.enrollmentLoading = false;
      },
      error: (err) => {
        this.enrollmentLoading = false;
        this.enrollmentError = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }

  unenroll() {
    if (!this.course) return;

    if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de ce cours ?')) {
      return;
    }

    this.enrollmentLoading = true;
    this.enrollmentError = '';

    this.enrollmentService.unenrollFromCourse(this.course.id).subscribe({
      next: () => {
        this.isEnrolled = false;
        this.enrollmentLoading = false;
      },
      error: (err) => {
        this.enrollmentLoading = false;
        this.enrollmentError = err.error?.message || 'Erreur lors de la désinscription';
      }
    });
  }

  goToLearning() {
    alert('Fonctionnalité de lecture de cours à venir !');
  }

  submitReview() {
    if (!this.course || this.newReview.rating === 0) return;

    this.reviewLoading = true;

    this.reviewService.createReview(this.course.id, this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.hasReviewed = true;
        this.showReviewForm = false;
        this.newReview = { rating: 0, comment: '' };
        this.reviewLoading = false;
      },
      error: (err) => {
        console.error('Error submitting review', err);
        this.reviewLoading = false;
      }
    });
  }
}
