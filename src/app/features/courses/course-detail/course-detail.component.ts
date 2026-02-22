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
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Loading skeleton -->
      @if (isLoading) {
        <div class="bg-white" style="border-bottom: 1px solid var(--border);">
          <div class="container-custom py-10">
            <div class="max-w-2xl space-y-4">
              <div class="skeleton h-3 w-24"></div>
              <div class="skeleton h-8 w-3/4"></div>
              <div class="skeleton h-4 w-full"></div>
              <div class="skeleton h-4 w-2/3"></div>
            </div>
          </div>
        </div>
      }

      @if (!isLoading && course) {
        <!-- White hero section -->
        <div class="bg-white" style="border-bottom: 1px solid var(--border);">
          <div class="container-custom py-10">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <!-- Left: Course info -->
              <div class="lg:col-span-2">
                <!-- Breadcrumb -->
                <nav class="flex items-center gap-1.5 text-xs mb-5" style="color: var(--ink-3);">
                  <a routerLink="/courses" class="hover:underline transition-colors" style="color: var(--violet);">Catalogue</a>
                  <span>›</span>
                  <span>{{ course.categoryName }}</span>
                </nav>

                <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4" style="color: var(--ink);">
                  {{ course.title }}
                </h1>

                <p class="text-base leading-relaxed mb-5" style="color: var(--ink-3);">
                  {{ course.description }}
                </p>

                <!-- Metadata row -->
                <div class="flex items-center flex-wrap gap-4">
                  @if ((course.totalEnrollments || 0) > 50) {
                    <span class="badge badge-bestseller">Bestseller</span>
                  }

                  <!-- Rating -->
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-sm" style="color: var(--amber-mid);">
                      {{ (course.averageRating || 0) | number:'1.1-1' }}
                    </span>
                    <div class="flex gap-0.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-3.5 h-3.5"
                             [style.color]="star <= (course.averageRating || 0) ? 'var(--amber-mid)' : 'var(--border-2)'"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-xs" style="color: var(--ink-4);">({{ course.totalEnrollments || 0 }} étudiants)</span>
                  </div>

                  <span class="text-sm" style="color: var(--ink-3);">
                    Par <span class="font-semibold" style="color: var(--violet);">{{ course.instructorName }}</span>
                  </span>
                </div>
              </div>

              <!-- Right: Enrollment card (desktop) -->
              <div class="hidden lg:block">
                <div class="enrollment-card bg-white sticky top-20"
                     style="border: 1px solid var(--border-2); border-radius: var(--r-xl); box-shadow: var(--shadow-lg); overflow: hidden;">

                  <!-- Thumbnail -->
                  <div class="aspect-video overflow-hidden" style="background: var(--surface-raised);">
                    @if (course.thumbnailUrl) {
                      <img [src]="course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full flex items-center justify-center" style="background: var(--violet-tint);">
                        <svg class="w-12 h-12" style="color: var(--violet); opacity: 0.35;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                    }
                  </div>

                  <!-- Price header gradient -->
                  <div class="px-6 py-5" style="background: var(--gradient-brand);">
                    @if (course.price === 0) {
                      <span class="text-3xl font-bold text-white">Gratuit</span>
                    } @else {
                      <span class="text-3xl font-bold" style="color: var(--amber-mid);">
                        {{ course.price | number:'1.0-0' }} FCFA
                      </span>
                    }
                  </div>

                  <!-- CTA -->
                  <div class="p-6">
                    <div class="space-y-2.5">
                      @if (!authService.isAuthenticated()) {
                        <a routerLink="/login" class="btn btn-primary w-full">
                          Se connecter pour s'inscrire
                        </a>
                      } @else if (isEnrolled) {
                        <div class="flex items-center gap-2 p-3 text-sm font-medium mb-3"
                             style="background: var(--green-tint); color: var(--green); border-radius: var(--r-md);">
                          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                          Vous êtes inscrit à ce cours
                        </div>
                        <button (click)="goToLearning()" class="btn btn-primary w-full">
                          Continuer l'apprentissage
                        </button>
                        <button (click)="unenroll()" [disabled]="enrollmentLoading"
                                class="w-full py-2.5 text-sm font-semibold border transition-colors disabled:opacity-50"
                                style="border-radius: var(--r-sm); border-color: #EF4444; color: #EF4444;"
                                onmouseenter="this.style.background='#FEF2F2'"
                                onmouseleave="this.style.background='transparent'">
                          Se désinscrire
                        </button>
                      } @else {
                        <button (click)="enroll()" [disabled]="enrollmentLoading"
                                class="btn btn-amber w-full">
                          @if (enrollmentLoading) { Inscription... } @else { S'inscrire maintenant }
                        </button>
                      }
                    </div>

                    @if (enrollmentError) {
                      <p class="mt-3 text-xs" style="color: #EF4444;">{{ enrollmentError }}</p>
                    }

                    <p class="text-xs text-center mt-4" style="color: var(--ink-4);">
                      Garantie satisfait ou remboursé 30 jours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile enrollment bar -->
        <div class="lg:hidden bg-white sticky top-14 z-30 px-4 py-3 flex items-center justify-between"
             style="border-bottom: 1px solid var(--border);">
          <span class="font-bold text-lg" style="color: var(--amber);">
            @if (course.price === 0) { Gratuit } @else { {{ course.price | number:'1.0-0' }} FCFA }
          </span>
          @if (!authService.isAuthenticated()) {
            <a routerLink="/login" class="btn btn-primary btn-sm">Se connecter</a>
          } @else if (isEnrolled) {
            <button (click)="goToLearning()" class="btn btn-primary btn-sm">Continuer</button>
          } @else {
            <button (click)="enroll()" [disabled]="enrollmentLoading" class="btn btn-primary btn-sm">
              @if (enrollmentLoading) { ... } @else { S'inscrire }
            </button>
          }
        </div>

        <!-- Main content -->
        <div class="container-custom py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-5">

              <!-- Course sections accordion -->
              <div class="bg-white" style="border: 1px solid var(--border); border-radius: var(--r-lg);">
                <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
                  <h2 class="text-lg font-bold" style="color: var(--ink);">Contenu du cours</h2>
                  <p class="text-sm mt-0.5" style="color: var(--ink-3);">{{ sections.length }} section{{ sections.length !== 1 ? 's' : '' }}</p>
                </div>

                @if (sections.length === 0) {
                  <div class="px-6 py-10 text-center text-sm" style="color: var(--ink-3);">
                    Aucun contenu disponible pour le moment.
                  </div>
                } @else {
                  <div>
                    @for (section of sections; track section.id; let i = $index) {
                      <div style="border-bottom: 1px solid var(--border);" class="last:border-b-0">
                        <button
                          (click)="toggleSection(i)"
                          class="w-full flex justify-between items-center px-6 py-4 text-left transition-colors"
                          style="background: var(--canvas);"
                          onmouseenter="this.style.background='var(--violet-xlight)'"
                          onmouseleave="this.style.background='var(--canvas)'">
                          <div class="flex items-center gap-3">
                            <svg class="w-4 h-4 flex-shrink-0 transition-transform"
                                 [class.rotate-90]="expandedSections[i]"
                                 style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                            <span class="font-semibold text-sm" style="color: var(--ink);">{{ section.title }}</span>
                          </div>
                          <span class="text-xs flex-shrink-0 ml-4" style="color: var(--ink-3);">
                            {{ section.lessons?.length || 0 }} leçon{{ (section.lessons?.length || 0) !== 1 ? 's' : '' }}
                          </span>
                        </button>

                        @if (expandedSections[i]) {
                          <div class="px-6 py-2 space-y-0.5">
                            @if (section.lessons && section.lessons.length > 0) {
                              @for (lesson of section.lessons; track lesson.id) {
                                <div class="flex items-center gap-3 py-2.5 px-2 rounded transition-colors"
                                     onmouseenter="this.style.background='var(--canvas)'"
                                     onmouseleave="this.style.background='transparent'">
                                  <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    @if (lesson.type === 'VIDEO') {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    } @else {
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    }
                                  </svg>
                                  <span class="flex-1 text-sm" style="color: var(--ink-2);">{{ lesson.title }}</span>
                                  @if (lesson.isFree) {
                                    <span class="text-xs font-medium" style="color: var(--violet);">Aperçu gratuit</span>
                                  }
                                  @if (lesson.duration) {
                                    <span class="text-xs" style="color: var(--ink-4);">{{ lesson.duration }} min</span>
                                  }
                                </div>
                              }
                            } @else {
                              <p class="py-2.5 text-xs" style="color: var(--ink-3);">Aucune leçon dans cette section</p>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Reviews -->
              <div class="bg-white" style="border: 1px solid var(--border); border-radius: var(--r-lg);">
                <div class="px-6 py-5 flex items-center justify-between" style="border-bottom: 1px solid var(--border);">
                  <div>
                    <h2 class="text-lg font-bold" style="color: var(--ink);">Avis des étudiants</h2>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-3xl font-bold" style="color: var(--ink);">
                        {{ (course.averageRating || 0) | number:'1.1-1' }}
                      </span>
                      <div class="flex gap-0.5">
                        @for (star of [1,2,3,4,5]; track star) {
                          <svg class="w-4 h-4"
                               [style.color]="star <= (course.averageRating || 0) ? 'var(--amber-mid)' : 'var(--border-2)'"
                               fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        }
                      </div>
                    </div>
                  </div>
                  @if (isEnrolled && !hasReviewed) {
                    <button (click)="showReviewForm = !showReviewForm" class="btn btn-secondary btn-sm">
                      Laisser un avis
                    </button>
                  }
                </div>

                <!-- Review form -->
                @if (showReviewForm && isEnrolled) {
                  <div class="px-6 py-5" style="background: var(--canvas); border-bottom: 1px solid var(--border);">
                    <h3 class="font-semibold text-sm mb-4" style="color: var(--ink);">Votre avis</h3>
                    <div class="mb-4">
                      <label class="label">Note</label>
                      <app-star-rating [rating]="newReview.rating" [interactive]="true" [showValue]="false"
                                       (ratingChange)="newReview.rating = $event" />
                    </div>
                    <div class="mb-4">
                      <label class="label">Commentaire (optionnel)</label>
                      <textarea [(ngModel)]="newReview.comment" rows="3"
                                class="input resize-none"
                                placeholder="Partagez votre expérience..."></textarea>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="submitReview()" [disabled]="newReview.rating === 0 || reviewLoading"
                              class="btn btn-primary btn-sm">
                        Publier l'avis
                      </button>
                      <button (click)="showReviewForm = false" class="btn btn-ghost btn-sm">
                        Annuler
                      </button>
                    </div>
                  </div>
                }

                <!-- Reviews list -->
                <div class="px-6 py-4">
                  @if (reviews.length === 0) {
                    <div class="py-8 text-center">
                      <p class="text-sm" style="color: var(--ink-3);">Aucun avis pour le moment. Soyez le premier !</p>
                    </div>
                  } @else {
                    <div class="space-y-5">
                      @for (review of reviews; track review.id) {
                        <div class="flex gap-3 pb-5" style="border-bottom: 1px solid var(--border);" class="last:border-b-0">
                          <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                               style="background: var(--violet);">
                            {{ review.userName.charAt(0).toUpperCase() }}
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1.5">
                              <span class="font-semibold text-sm" style="color: var(--ink);">{{ review.userName }}</span>
                              <div class="flex gap-0.5">
                                @for (star of [1,2,3,4,5]; track star) {
                                  <svg class="w-3 h-3"
                                       [style.color]="star <= review.rating ? 'var(--amber-mid)' : 'var(--border-2)'"
                                       fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                }
                              </div>
                              <span class="text-xs" style="color: var(--ink-4);">{{ review.createdAt | date:'dd/MM/yyyy' }}</span>
                            </div>
                            @if (review.comment) {
                              <p class="text-sm leading-relaxed" style="color: var(--ink-2);">{{ review.comment }}</p>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right: Instructor -->
            <div>
              <div class="bg-white p-5 sticky top-24"
                   style="border: 1px solid var(--border); border-radius: var(--r-lg);">
                <h3 class="font-bold mb-4" style="color: var(--ink);">Votre instructeur</h3>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                       style="background: var(--violet);">
                    {{ course.instructorName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-sm" style="color: var(--ink);">{{ course.instructorName }}</p>
                    <p class="text-xs" style="color: var(--ink-3);">Instructeur certifié</p>
                  </div>
                </div>
                <div class="text-xs space-y-1.5 pt-3" style="border-top: 1px solid var(--border); color: var(--ink-3);">
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
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
               style="background: var(--violet-tint);">
            <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-2" style="color: var(--ink);">Cours introuvable</h2>
          <p class="text-sm mb-6" style="color: var(--ink-3);">Ce cours n'existe pas ou a été supprimé.</p>
          <a routerLink="/courses" class="btn btn-primary">Retour au catalogue</a>
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
