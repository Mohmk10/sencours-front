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
    <div class="min-h-screen bg-[#F7F9FA]">

      <!-- Loading skeleton -->
      @if (isLoading) {
        <div class="bg-[#1C1D1F]">
          <div class="container-custom py-10">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 space-y-4">
                <div class="skeleton h-3 w-24 bg-gray-600"></div>
                <div class="skeleton h-8 w-3/4 bg-gray-600"></div>
                <div class="skeleton h-4 w-full bg-gray-600"></div>
                <div class="skeleton h-4 w-2/3 bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (!isLoading && course) {
        <!-- Dark hero -->
        <div class="bg-[#1C1D1F] text-white">
          <div class="container-custom py-10">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2">
                <p class="text-xs text-gray-400 mb-2">
                  <a routerLink="/courses" class="hover:text-white transition-colors">Catalogue</a>
                  <span class="mx-1">›</span>
                  <span>{{ course.categoryName }}</span>
                </p>

                <h1 class="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{{ course.title }}</h1>
                <p class="text-gray-300 text-sm leading-relaxed mb-4">{{ course.description }}</p>

                <!-- Rating row -->
                <div class="flex items-center flex-wrap gap-3 mb-4">
                  @if ((course.totalEnrollments || 0) > 50) {
                    <span class="badge badge-bestseller">Bestseller</span>
                  }
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-[#E59819] text-sm">{{ (course.averageRating || 0) | number:'1.1-1' }}</span>
                    <div class="flex gap-0.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-3.5 h-3.5"
                             [style.color]="star <= (course.averageRating || 0) ? '#E59819' : '#6A6F73'"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-xs text-gray-400">({{ course.totalEnrollments || 0 }} étudiants)</span>
                  </div>
                </div>

                <p class="text-sm text-gray-400">
                  Créé par <span class="text-[#A78BFA] font-medium">{{ course.instructorName }}</span>
                </p>
              </div>

              <!-- Enrollment card -->
              <div class="lg:block hidden">
                <div class="bg-white text-[#1C1D1F] border border-[#D1D7DC] shadow-lg">
                  <!-- Course thumbnail -->
                  <div class="aspect-video bg-gray-100 overflow-hidden">
                    @if (course.thumbnailUrl) {
                      <img [src]="course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full flex items-center justify-center bg-[#EDE9FE]">
                        <svg class="w-12 h-12 text-[#5624D0] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                    }
                  </div>

                  <div class="p-5">
                    <div class="text-2xl font-bold text-[#1C1D1F] mb-4">
                      @if (course.price === 0) { Gratuit }
                      @else { {{ course.price | number:'1.0-0' }} FCFA }
                    </div>

                    <div class="space-y-2">
                      @if (!authService.isAuthenticated()) {
                        <a routerLink="/login" class="btn-primary w-full text-center block">
                          Connectez-vous pour vous inscrire
                        </a>
                      } @else if (isEnrolled) {
                        <div class="flex items-center gap-2 p-3 bg-[#ECFDF5] border border-[#6EE7B7] text-[#065F46] text-sm font-medium mb-2">
                          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                          Vous êtes inscrit à ce cours
                        </div>
                        <button (click)="goToLearning()" class="btn-primary w-full">
                          Continuer l'apprentissage
                        </button>
                        <button (click)="unenroll()" [disabled]="enrollmentLoading"
                                class="w-full py-2.5 border border-[#EF4444] text-[#EF4444] text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
                          Se désinscrire
                        </button>
                      } @else {
                        <button (click)="enroll()" [disabled]="enrollmentLoading"
                                class="btn-primary w-full">
                          @if (enrollmentLoading) { Inscription... }
                          @else { S'inscrire maintenant }
                        </button>
                      }
                    </div>

                    @if (enrollmentError) {
                      <p class="mt-2 text-xs text-[#EF4444]">{{ enrollmentError }}</p>
                    }

                    <p class="text-xs text-[#6A6F73] text-center mt-3">Garantie satisfait ou remboursé 30 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile enrollment bar -->
        <div class="lg:hidden bg-white border-b border-[#D1D7DC] px-4 py-3 flex items-center justify-between">
          <div class="font-bold text-[#1C1D1F]">
            @if (course.price === 0) { Gratuit }
            @else { {{ course.price | number:'1.0-0' }} FCFA }
          </div>
          @if (!authService.isAuthenticated()) {
            <a routerLink="/login" class="btn-primary text-sm">Se connecter</a>
          } @else if (isEnrolled) {
            <button (click)="goToLearning()" class="btn-primary text-sm">Continuer</button>
          } @else {
            <button (click)="enroll()" [disabled]="enrollmentLoading" class="btn-primary text-sm">
              @if (enrollmentLoading) { ... } @else { S'inscrire }
            </button>
          }
        </div>

        <!-- Main content area -->
        <div class="container-custom py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">

              <!-- Course content / Sections -->
              <div class="bg-white border border-[#D1D7DC]">
                <div class="px-6 py-4 border-b border-[#D1D7DC]">
                  <h2 class="text-lg font-bold text-[#1C1D1F]">Contenu du cours</h2>
                  <p class="text-sm text-[#6A6F73] mt-0.5">{{ sections.length }} sections</p>
                </div>

                @if (sections.length === 0) {
                  <div class="px-6 py-8 text-center text-sm text-[#6A6F73]">
                    Aucun contenu disponible pour le moment.
                  </div>
                } @else {
                  <div class="divide-y divide-[#D1D7DC]">
                    @for (section of sections; track section.id; let i = $index) {
                      <div>
                        <button
                          (click)="toggleSection(i)"
                          class="w-full flex justify-between items-center px-6 py-4 bg-[#F7F9FA] hover:bg-gray-100 transition-colors text-left">
                          <div class="flex items-center gap-3">
                            <svg class="w-4 h-4 text-[#6A6F73] transition-transform flex-shrink-0" [class.rotate-90]="expandedSections[i]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                            <span class="font-semibold text-sm text-[#1C1D1F]">{{ section.title }}</span>
                          </div>
                          <span class="text-xs text-[#6A6F73] flex-shrink-0 ml-4">
                            {{ section.lessons?.length || 0 }} leçon{{ (section.lessons?.length || 0) !== 1 ? 's' : '' }}
                          </span>
                        </button>

                        @if (expandedSections[i]) {
                          <div class="px-6 py-2 space-y-1">
                            @if (section.lessons && section.lessons.length > 0) {
                              @for (lesson of section.lessons; track lesson.id) {
                                <div class="flex items-center gap-3 py-2 hover:bg-[#F7F9FA] px-2">
                                  <svg class="w-4 h-4 text-[#6A6F73] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    @if (lesson.type === 'VIDEO') {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    } @else {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    }
                                  </svg>
                                  <span class="flex-1 text-sm text-[#1C1D1F]">{{ lesson.title }}</span>
                                  @if (lesson.isFree) {
                                    <span class="text-xs text-[#5624D0] font-medium">Aperçu gratuit</span>
                                  }
                                  @if (lesson.duration) {
                                    <span class="text-xs text-[#6A6F73]">{{ lesson.duration }} min</span>
                                  }
                                </div>
                              }
                            } @else {
                              <p class="py-2 text-xs text-[#6A6F73]">Aucune leçon dans cette section</p>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Reviews -->
              <div class="bg-white border border-[#D1D7DC]">
                <div class="px-6 py-4 border-b border-[#D1D7DC] flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-bold text-[#1C1D1F]">Avis des étudiants</h2>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-3xl font-bold text-[#1C1D1F]">{{ (course.averageRating || 0) | number:'1.1-1' }}</span>
                      <div class="flex gap-0.5">
                        @for (star of [1,2,3,4,5]; track star) {
                          <svg class="w-4 h-4" [style.color]="star <= (course.averageRating || 0) ? '#E59819' : '#D1D7DC'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        }
                      </div>
                      <span class="text-sm text-[#6A6F73]">Note du cours</span>
                    </div>
                  </div>
                  @if (isEnrolled && !hasReviewed) {
                    <button (click)="showReviewForm = !showReviewForm"
                            class="btn-outline text-sm">
                      Laisser un avis
                    </button>
                  }
                </div>

                <!-- Review form -->
                @if (showReviewForm && isEnrolled) {
                  <div class="px-6 py-4 border-b border-[#D1D7DC] bg-[#F7F9FA]">
                    <h3 class="font-semibold text-sm text-[#1C1D1F] mb-3">Votre avis</h3>
                    <div class="mb-3">
                      <label class="block text-xs font-semibold text-[#1C1D1F] mb-1.5">Note</label>
                      <app-star-rating [rating]="newReview.rating" [interactive]="true" [showValue]="false"
                                       (ratingChange)="newReview.rating = $event" />
                    </div>
                    <div class="mb-3">
                      <label class="block text-xs font-semibold text-[#1C1D1F] mb-1.5">Commentaire (optionnel)</label>
                      <textarea [(ngModel)]="newReview.comment" rows="3"
                                class="w-full px-3 py-2 border border-[#D1D7DC] text-sm text-[#1C1D1F] focus:outline-none focus:ring-2 focus:ring-[#5624D0] resize-none"
                                placeholder="Partagez votre expérience..."></textarea>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="submitReview()" [disabled]="newReview.rating === 0 || reviewLoading"
                              class="btn-primary text-sm">
                        Publier l'avis
                      </button>
                      <button (click)="showReviewForm = false"
                              class="px-4 py-2 border border-[#D1D7DC] text-sm text-[#6A6F73] hover:bg-gray-100 transition-colors">
                        Annuler
                      </button>
                    </div>
                  </div>
                }

                <div class="px-6 py-4">
                  @if (reviews.length === 0) {
                    <div class="py-8 text-center">
                      <p class="text-sm text-[#6A6F73]">Aucun avis pour le moment. Soyez le premier !</p>
                    </div>
                  } @else {
                    <div class="space-y-5">
                      @for (review of reviews; track review.id) {
                        <div class="flex gap-3 pb-5 border-b border-[#F7F9FA] last:border-b-0 last:pb-0">
                          <div class="w-9 h-9 rounded-full bg-[#5624D0] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {{ review.userName.charAt(0).toUpperCase() }}
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <span class="font-semibold text-sm text-[#1C1D1F]">{{ review.userName }}</span>
                              <div class="flex gap-0.5">
                                @for (star of [1,2,3,4,5]; track star) {
                                  <svg class="w-3 h-3" [style.color]="star <= review.rating ? '#E59819' : '#D1D7DC'" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                }
                              </div>
                              <span class="text-xs text-[#6A6F73]">{{ review.createdAt | date:'dd/MM/yyyy' }}</span>
                            </div>
                            @if (review.comment) {
                              <p class="text-sm text-[#1C1D1F] leading-relaxed">{{ review.comment }}</p>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right sidebar - Instructor -->
            <div>
              <div class="bg-white border border-[#D1D7DC] p-5 sticky top-24">
                <h3 class="font-bold text-[#1C1D1F] mb-4">Votre instructeur</h3>
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 bg-[#5624D0] text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {{ course.instructorName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-[#1C1D1F] text-sm">{{ course.instructorName }}</p>
                    <p class="text-xs text-[#6A6F73]">Instructeur certifié</p>
                  </div>
                </div>
                <div class="text-xs text-[#6A6F73] space-y-1.5 pt-3 border-t border-[#D1D7DC]">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span>{{ course.totalEnrollments || 0 }} étudiants inscrits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Not found -->
      @if (!isLoading && !course) {
        <div class="container-custom py-24 text-center">
          <div class="w-16 h-16 bg-[#EDE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-[#1C1D1F] mb-2">Cours introuvable</h2>
          <p class="text-sm text-[#6A6F73] mb-6">Ce cours n'existe pas ou a été supprimé.</p>
          <a routerLink="/courses" class="btn-primary">Retour au catalogue</a>
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
    if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de ce cours ?')) return;
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
