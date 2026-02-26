import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Section, Review, Enrollment } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PaymentModalComponent } from '../../../shared/components/payment-modal/payment-modal.component';
import { ReviewModalComponent } from '../../../shared/components/review-modal/review-modal.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmModalComponent, PaymentModalComponent, ReviewModalComponent],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Loading skeleton -->
      @if (isLoading) {
        <div class="bg-white" style="border-bottom: 1px solid var(--border);">
          <div class="container-app py-10">
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
          <div class="container-app py-14">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                  @if (course.averageRating && course.averageRating > 0) {
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-sm" style="color: var(--amber-mid);">
                        {{ course.averageRating | number:'1.1-1' }}
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
                  } @else {
                    <span class="badge badge-success">Nouveau</span>
                  }

                  <span class="text-sm" style="color: var(--ink-3);">
                    Créé par <span class="font-semibold" style="color: var(--violet);">{{ getInstructorDisplayName() }}</span>
                  </span>
                </div>
              </div>

              <!-- Right: Enrollment card (desktop) -->
              <div class="hidden lg:block">
                <div class="enrollment-card bg-white sticky top-[73px]"
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
                      @if (isOwner) {
                        <a [routerLink]="['/courses', course.id, 'edit']" class="btn btn-primary w-full text-center">
                          Gérer ce cours
                        </a>
                        <p class="text-xs text-center mt-2" style="color: var(--ink-4);">
                          Vous êtes l'instructeur de ce cours
                        </p>
                      } @else if (!authService.isAuthenticated()) {
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
                        @if (showLearningNotice) {
                          <div class="flex items-start gap-2.5 p-3 mb-3 text-xs"
                               style="background: var(--amber-tint); color: var(--amber); border-radius: var(--r-md); border: 1px solid rgba(217,119,6,0.2);">
                            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            <span>Le lecteur de cours est en cours de développement. Retrouvez vos cours inscrits dans votre tableau de bord.</span>
                          </div>
                        }
                        <button (click)="goToLearning()" class="btn btn-primary w-full">
                          Continuer l'apprentissage
                        </button>
                        <button (click)="openUnenrollModal()" [disabled]="enrollmentLoading"
                                class="w-full py-2.5 text-sm font-semibold border transition-colors disabled:opacity-50"
                                style="border-radius: var(--r-sm); border-color: #EF4444; color: #EF4444;"
                                onmouseenter="this.style.background='#FEF2F2'"
                                onmouseleave="this.style.background='transparent'">
                          Se désinscrire
                        </button>
                      } @else {
                        @if (course.price === 0) {
                          <button (click)="enrollFree()" [disabled]="enrollmentLoading"
                                  class="btn btn-amber w-full">
                            @if (enrollmentLoading) { Inscription... } @else { S'inscrire gratuitement }
                          </button>
                        } @else {
                          <button (click)="openPaymentModal()" class="btn btn-amber w-full">
                            S'inscrire — {{ course.price | number:'1.0-0' }} FCFA
                          </button>
                        }
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
        <div class="lg:hidden bg-white sticky top-[73px] z-30"
             style="border-bottom: 1px solid var(--border);">
          <div class="container-app py-3 flex items-center justify-between">
            <span class="font-bold text-lg" style="color: var(--amber);">
              @if (course.price === 0) { Gratuit } @else { {{ course.price | number:'1.0-0' }} FCFA }
            </span>
            @if (isOwner) {
              <a [routerLink]="['/courses', course.id, 'edit']" class="btn btn-primary btn-sm">Gérer</a>
            } @else if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="btn btn-primary btn-sm">Se connecter</a>
            } @else if (isEnrolled) {
              <button (click)="goToLearning()" class="btn btn-primary btn-sm">Mon tableau de bord</button>
            } @else {
              @if (course.price === 0) {
                <button (click)="enrollFree()" [disabled]="enrollmentLoading" class="btn btn-primary btn-sm">
                  @if (enrollmentLoading) { ... } @else { S'inscrire }
                </button>
              } @else {
                <button (click)="openPaymentModal()" class="btn btn-amber btn-sm">
                  S'inscrire
                </button>
              }
            }
          </div>
        </div>

        <!-- Main content -->
        <div class="container-app py-14">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    @if (reviews.length > 0) {
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-3xl font-bold" style="color: var(--ink);">
                          {{ (course.averageRating || 0) | number:'1.1-1' }}
                        </span>
                        <div>
                          <div class="flex gap-0.5">
                            @for (star of [1,2,3,4,5]; track star) {
                              <svg class="w-4 h-4"
                                   [style.color]="star <= (course.averageRating || 0) ? 'var(--amber-mid)' : 'var(--border-2)'"
                                   fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            }
                          </div>
                          <p class="text-xs mt-0.5" style="color: var(--ink-4);">{{ reviews.length }} avis</p>
                        </div>
                      </div>
                    }
                  </div>
                  @if (isEnrolled && !myReview) {
                    <button (click)="openReviewModal()" class="btn btn-secondary btn-sm">
                      Donner mon avis
                    </button>
                  }
                </div>

                <!-- Mon avis -->
                @if (myReview) {
                  <div class="px-6 py-4" style="background: var(--violet-xlight); border-bottom: 1px solid var(--border);">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium" style="color: var(--violet);">Votre avis</span>
                      <button (click)="openReviewModal()" class="text-sm transition-colors"
                              style="color: var(--violet);"
                              onmouseenter="this.style.textDecoration='underline'"
                              onmouseleave="this.style.textDecoration='none'">
                        Modifier
                      </button>
                    </div>
                    <div class="flex gap-0.5 mb-1">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-3.5 h-3.5"
                             [style.color]="star <= myReview.rating ? 'var(--amber-mid)' : 'var(--border-2)'"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    @if (myReview.comment) {
                      <p class="text-sm" style="color: var(--ink-2);">{{ myReview.comment }}</p>
                    }
                  </div>
                }

                <!-- Reviews list -->
                <div class="px-6 py-4">
                  @if (reviews.length === 0) {
                    <div class="py-8 text-center">
                      <p class="text-sm" style="color: var(--ink-3);">Aucun avis pour le moment.</p>
                      @if (isEnrolled && !myReview) {
                        <button (click)="openReviewModal()" class="text-sm mt-2 transition-colors"
                                style="color: var(--violet);"
                                onmouseenter="this.style.textDecoration='underline'"
                                onmouseleave="this.style.textDecoration='none'">
                          Soyez le premier à donner votre avis !
                        </button>
                      }
                    </div>
                  } @else {
                    <div class="space-y-5">
                      @for (review of reviews; track review.id) {
                        @if (review.id !== myReview?.id) {
                          <div class="flex gap-3 pb-5 last:border-b-0" style="border-bottom: 1px solid var(--border);">
                            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                 style="background: var(--violet);">
                              {{ (review.userName || '?').charAt(0).toUpperCase() }}
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
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right: Instructor -->
            <div>
              <div class="bg-white p-5 sticky top-[73px]"
                   style="border: 1px solid var(--border); border-radius: var(--r-lg);">
                <h3 class="font-bold mb-4" style="color: var(--ink);">Votre instructeur</h3>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                       style="background: var(--violet);">
                    {{ getInstructorInitials() }}
                  </div>
                  <div>
                    <p class="font-semibold text-sm" style="color: var(--ink);">{{ getInstructorDisplayName() }}</p>
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
        <div class="container-app py-24 text-center">
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

      <!-- Modal Désinscription -->
      <app-confirm-modal
        [isOpen]="showUnenrollModal"
        title="Se désinscrire"
        message="Êtes-vous sûr de vouloir vous désinscrire de ce cours ?"
        type="warning"
        confirmText="Se désinscrire"
        (confirmed)="confirmUnenroll()"
        (cancelled)="showUnenrollModal = false">
      </app-confirm-modal>

      <!-- Modal Paiement -->
      @if (course) {
        <app-payment-modal
          [isOpen]="showPaymentModal"
          [courseId]="course.id"
          [courseTitle]="course.title"
          [price]="course.price"
          (closed)="showPaymentModal = false"
          (enrolled)="onPaymentSuccess($event)">
        </app-payment-modal>

        <!-- Modal Avis -->
        <app-review-modal
          [isOpen]="showReviewModal"
          [courseId]="course.id"
          [courseTitle]="course.title"
          [existingReview]="myReview"
          (closed)="showReviewModal = false"
          (submitted)="onReviewSubmitted($event)">
        </app-review-modal>
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
  isOwner = false;
  isEnrolled = false;
  enrollmentLoading = false;
  enrollmentError = '';
  expandedSections: boolean[] = [];

  showLearningNotice = false;
  showUnenrollModal = false;
  showPaymentModal = false;
  showReviewModal = false;
  myReview: Review | null = null;
  enrollment: Enrollment | null = null;

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
        const currentUser = this.authService.getCurrentUser();
        this.isOwner = currentUser?.id === course.instructorId;
        this.loadSections(id);
        this.loadReviews(id);
        if (this.authService.isAuthenticated() && !this.isOwner) {
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
          this.myReview = reviews.find(r => r.userId === currentUser.id) || null;
        }
      },
      error: (err) => console.error('Error loading reviews', err)
    });

    if (this.authService.isAuthenticated()) {
      this.reviewService.getMyReview(courseId).subscribe({
        next: (review) => {
          if (review) this.myReview = review;
        }
      });
    }
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

  enrollFree() {
    if (!this.course) return;
    this.enrollmentLoading = true;
    this.enrollmentError = '';
    this.enrollmentService.enrollFree(this.course.id).subscribe({
      next: (enrollment) => {
        this.isEnrolled = true;
        this.enrollment = enrollment;
        this.enrollmentLoading = false;
      },
      error: (err) => {
        this.enrollmentLoading = false;
        this.enrollmentError = err.error?.message || "Erreur lors de l'inscription";
      }
    });
  }

  openPaymentModal() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.showPaymentModal = true;
  }

  onPaymentSuccess(reference: string) {
    this.showPaymentModal = false;
    this.isEnrolled = true;
    if (this.course) {
      this.enrollmentService.getEnrollment(this.course.id).subscribe({
        next: (enrollment) => this.enrollment = enrollment
      });
    }
  }

  openUnenrollModal() {
    this.showUnenrollModal = true;
  }

  confirmUnenroll() {
    if (!this.course) return;
    this.showUnenrollModal = false;
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
    this.showLearningNotice = true;
    setTimeout(() => this.showLearningNotice = false, 6000);
  }

  getInstructorDisplayName(): string {
    if (!this.course) return 'Instructeur';
    if (this.course.instructorName) return this.course.instructorName;
    if (this.course.instructorFirstName && this.course.instructorLastName) {
      return `${this.course.instructorFirstName} ${this.course.instructorLastName}`;
    }
    if (this.course.instructorFirstName) return this.course.instructorFirstName;
    return 'Instructeur certifié';
  }

  getInstructorInitials(): string {
    const name = this.getInstructorDisplayName();
    if (name === 'Instructeur' || name === 'Instructeur certifié') return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  openReviewModal() {
    this.showReviewModal = true;
  }

  onReviewSubmitted(review: Review) {
    this.myReview = review;
    this.showReviewModal = false;
    if (this.course) {
      this.loadReviews(this.course.id);
    }
  }
}
