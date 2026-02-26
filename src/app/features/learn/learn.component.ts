import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from '../../core/services/course.service';
import { ProgressService } from '../../core/services/progress.service';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ProgressStateService } from '../../core/services/progress-state.service';
import { Course, Section, Lesson, Progress } from '../../core/models';
import { getEmbedUrl, isYouTubeUrl } from '../../shared/utils/video.utils';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (isLoading) {
      <div class="h-screen flex items-center justify-center" style="background: var(--canvas);">
        <div class="text-center">
          <div class="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-3"
               style="border-color: var(--violet); border-top-color: transparent;"></div>
          <p class="text-sm" style="color: var(--ink-3);">Chargement du cours...</p>
        </div>
      </div>
    }

    @if (!isLoading && course) {
      <div class="h-[calc(100vh-72px)] flex overflow-hidden" style="background: var(--canvas);">

        <!-- Sidebar -->
        <aside class="w-80 flex-shrink-0 bg-white flex flex-col overflow-hidden"
               [class.hidden]="!sidebarOpen"
               [class.md:flex]="true"
               style="border-right: 1px solid var(--border);">

          <!-- Sidebar header -->
          <div class="px-5 py-4 flex-shrink-0" style="border-bottom: 1px solid var(--border);">
            <a [routerLink]="['/courses', course.id]" class="flex items-center gap-2 text-xs mb-2 transition-colors"
               style="color: var(--violet);"
               onmouseenter="this.style.textDecoration='underline'"
               onmouseleave="this.style.textDecoration='none'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour au cours
            </a>
            <h2 class="font-bold text-sm leading-tight" style="color: var(--ink);">{{ course.title }}</h2>

            <!-- Progress bar -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-xs mb-1" style="color: var(--ink-3);">
                <span>{{ completedLessonIds.size }}/{{ totalLessons }} leçons</span>
                <span class="font-medium" style="color: var(--violet);">{{ progressPercent }}%</span>
              </div>
              <div class="w-full h-1.5 overflow-hidden" style="background: var(--border); border-radius: var(--r-sm);">
                <div class="h-full transition-all" style="background: var(--violet); border-radius: var(--r-sm);"
                     [style.width.%]="progressPercent"></div>
              </div>
            </div>
          </div>

          <!-- Sections list -->
          <div class="flex-1 overflow-y-auto">
            @for (section of sections; track section.id; let si = $index) {
              <div>
                <button (click)="toggleSection(si)"
                        class="w-full flex justify-between items-center px-5 py-3 text-left transition-colors"
                        style="background: var(--canvas);"
                        onmouseenter="this.style.background='var(--violet-xlight)'"
                        onmouseleave="this.style.background='var(--canvas)'">
                  <div class="flex items-center gap-2 min-w-0">
                    <svg class="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                         [class.rotate-90]="expandedSections[si]"
                         style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span class="font-semibold text-xs truncate" style="color: var(--ink);">
                      {{ section.title }}
                    </span>
                  </div>
                  <span class="text-[10px] flex-shrink-0 ml-2" style="color: var(--ink-4);">
                    {{ getSectionCompletedCount(section) }}/{{ section.lessons?.length || 0 }}
                  </span>
                </button>

                @if (expandedSections[si]) {
                  <div class="pb-1">
                    @if (section.lessons && section.lessons.length > 0) {
                      @for (lesson of section.lessons; track lesson.id) {
                        <button (click)="selectLesson(lesson)"
                                class="w-full flex items-center gap-2.5 px-5 py-2.5 text-left transition-colors"
                                [style.background]="currentLesson?.id === lesson.id ? 'var(--violet-xlight)' : 'transparent'"
                                onmouseenter="this.style.background=this.style.background === 'var(--violet-xlight)' ? 'var(--violet-xlight)' : 'var(--canvas)'"
                                onmouseleave="this.style.background=currentLesson?.id === lesson.id ? 'var(--violet-xlight)' : 'transparent'">

                          <!-- Completion indicator -->
                          @if (completedLessonIds.has(lesson.id)) {
                            <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                 style="background: var(--green);">
                              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                              </svg>
                            </div>
                          } @else if (currentLesson?.id === lesson.id) {
                            <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                 style="border: 2px solid var(--violet); background: var(--violet-tint);">
                              <div class="w-2 h-2 rounded-full" style="background: var(--violet);"></div>
                            </div>
                          } @else {
                            <div class="w-5 h-5 rounded-full flex-shrink-0"
                                 style="border: 2px solid var(--border-2);"></div>
                          }

                          <div class="flex-1 min-w-0">
                            <p class="text-xs truncate"
                               [style.color]="currentLesson?.id === lesson.id ? 'var(--violet)' : 'var(--ink-2)'"
                               [style.fontWeight]="currentLesson?.id === lesson.id ? '600' : '400'">
                              {{ lesson.title }}
                            </p>
                            <div class="flex items-center gap-2 mt-0.5">
                              <span class="text-[10px]" style="color: var(--ink-4);">
                                @switch (lesson.type) {
                                  @case ('VIDEO') { Vidéo }
                                  @case ('VIDEO_UPLOAD') { Vidéo }
                                  @case ('TEXT') { Texte }
                                  @case ('PDF') { PDF }
                                  @case ('IMAGE') { Image }
                                  @case ('QUIZ') { Quiz }
                                }
                              </span>
                              @if (lesson.duration) {
                                <span class="text-[10px]" style="color: var(--ink-4);">{{ lesson.duration }} min</span>
                              }
                            </div>
                          </div>
                        </button>
                      }
                    }
                  </div>
                }
              </div>
            }
          </div>
        </aside>

        <!-- Main content area -->
        <main class="flex-1 flex flex-col overflow-hidden">
          <!-- Top bar -->
          <div class="flex items-center justify-between px-5 py-3 bg-white flex-shrink-0"
               style="border-bottom: 1px solid var(--border);">
            <div class="flex items-center gap-3 min-w-0">
              <!-- Sidebar toggle (mobile) -->
              <button (click)="sidebarOpen = !sidebarOpen"
                      class="md:hidden p-1.5 rounded transition-colors"
                      style="color: var(--ink-3);"
                      onmouseenter="this.style.background='var(--canvas)'"
                      onmouseleave="this.style.background='transparent'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <div class="min-w-0">
                <p class="text-sm font-semibold truncate" style="color: var(--ink);">
                  {{ currentLesson?.title || 'Sélectionnez une leçon' }}
                </p>
                @if (currentSectionTitle) {
                  <p class="text-xs truncate" style="color: var(--ink-4);">{{ currentSectionTitle }}</p>
                }
              </div>
            </div>

            <!-- Mark complete button -->
            @if (currentLesson) {
              <div class="flex items-center gap-2 flex-shrink-0">
                @if (completedLessonIds.has(currentLesson.id)) {
                  <span class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--green);">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Terminé
                  </span>
                } @else {
                  <button (click)="markAsCompleted()" [disabled]="markingComplete"
                          class="btn btn-secondary btn-sm">
                    @if (markingComplete) {
                      <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    Marquer comme terminé
                  </button>
                }
              </div>
            }
          </div>

          <!-- Content area -->
          <div class="flex-1 overflow-y-auto">
            @if (!currentLesson) {
              <!-- No lesson selected -->
              <div class="h-full flex items-center justify-center">
                <div class="text-center px-6">
                  <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                       style="background: var(--violet-tint);">
                    <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="font-bold mb-1" style="color: var(--ink);">Prêt à apprendre ?</h3>
                  <p class="text-sm" style="color: var(--ink-3);">Sélectionnez une leçon dans le menu pour commencer.</p>
                </div>
              </div>
            } @else {
              <!-- Video content (YouTube) -->
              @if (currentLesson.type === 'VIDEO' && currentLesson.videoUrl && youtubeEmbedUrl) {
                <div class="w-full bg-black">
                  <div class="max-w-5xl mx-auto">
                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                      <iframe
                        [src]="youtubeEmbedUrl"
                        class="absolute inset-0 w-full h-full"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                      </iframe>
                    </div>
                  </div>
                </div>
              }

              <!-- Video content (uploaded) -->
              @if (currentLesson.type === 'VIDEO_UPLOAD' && currentLesson.filePath) {
                <div class="w-full bg-black">
                  <div class="max-w-5xl mx-auto">
                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                      <video [src]="currentLesson.filePath"
                             controls
                             class="absolute inset-0 w-full h-full"
                             controlsList="nodownload">
                      </video>
                    </div>
                  </div>
                </div>
              }

              <!-- Text content -->
              @if (currentLesson.type === 'TEXT') {
                <div class="max-w-3xl mx-auto px-6 py-8">
                  <div class="prose prose-sm max-w-none" style="color: var(--ink-2);">
                    <div [innerHTML]="currentLesson.content || ''"></div>
                  </div>
                </div>
              }

              <!-- PDF content -->
              @if (currentLesson.type === 'PDF' && currentLesson.filePath) {
                <div class="w-full h-full">
                  <iframe [src]="sanitizedFileUrl" class="w-full h-full" style="min-height: 70vh;"></iframe>
                </div>
              }

              <!-- Image content -->
              @if (currentLesson.type === 'IMAGE' && currentLesson.filePath) {
                <div class="max-w-4xl mx-auto px-6 py-8 text-center">
                  <img [src]="currentLesson.filePath" [alt]="currentLesson.title"
                       class="max-w-full rounded-lg mx-auto"
                       style="box-shadow: var(--shadow-md);">
                </div>
              }

              <!-- Quiz placeholder -->
              @if (currentLesson.type === 'QUIZ') {
                <div class="max-w-3xl mx-auto px-6 py-8">
                  <div class="card p-8 text-center">
                    <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                         style="background: var(--amber-tint);">
                      <svg class="w-7 h-7" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 class="font-bold mb-2" style="color: var(--ink);">Quiz</h3>
                    <p class="text-sm" style="color: var(--ink-3);">Le module quiz sera disponible prochainement.</p>
                  </div>
                </div>
              }

              <!-- No video URL fallback -->
              @if (currentLesson.type === 'VIDEO' && (!currentLesson.videoUrl || !youtubeEmbedUrl)) {
                <div class="max-w-3xl mx-auto px-6 py-8">
                  <div class="card p-8 text-center">
                    <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                         style="background: var(--violet-tint);">
                      <svg class="w-7 h-7" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <h3 class="font-bold mb-2" style="color: var(--ink);">Vidéo non disponible</h3>
                    <p class="text-sm" style="color: var(--ink-3);">La vidéo de cette leçon n'est pas encore disponible.</p>
                  </div>
                </div>
              }

              <!-- Lesson description below video -->
              @if (currentLesson.content && (currentLesson.type === 'VIDEO' || currentLesson.type === 'VIDEO_UPLOAD')) {
                <div class="max-w-3xl mx-auto px-6 py-6">
                  <h3 class="font-bold mb-3" style="color: var(--ink);">Description</h3>
                  <div class="text-sm leading-relaxed" style="color: var(--ink-2);">
                    <div [innerHTML]="currentLesson.content"></div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Bottom navigation bar -->
          @if (currentLesson) {
            <div class="flex items-center justify-between px-5 py-3 bg-white flex-shrink-0"
                 style="border-top: 1px solid var(--border);">
              <button (click)="goToPrevious()" [disabled]="!hasPrevious"
                      class="btn btn-ghost btn-sm"
                      [style.opacity]="hasPrevious ? '1' : '0.4'">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Précédent
              </button>

              <span class="text-xs hidden sm:block" style="color: var(--ink-4);">
                Leçon {{ currentLessonIndex + 1 }} sur {{ totalLessons }}
              </span>

              <button (click)="goToNext()" [disabled]="!hasNext"
                      class="btn btn-primary btn-sm"
                      [style.opacity]="hasNext ? '1' : '0.4'">
                Suivant
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          }
        </main>
      </div>
    }

    <!-- Error state -->
    @if (!isLoading && !course) {
      <div class="h-screen flex items-center justify-center" style="background: var(--canvas);">
        <div class="text-center px-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
               style="background: var(--violet-tint);">
            <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold mb-2" style="color: var(--ink);">Cours introuvable</h2>
          <p class="text-sm mb-6" style="color: var(--ink-3);">Vous n'avez pas accès à ce cours ou il n'existe pas.</p>
          <a routerLink="/courses" class="btn btn-primary">Retour au catalogue</a>
        </div>
      </div>
    }
  `
})
export class LearnComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private courseService = inject(CourseService);
  private progressService = inject(ProgressService);
  private enrollmentService = inject(EnrollmentService);
  private progressState = inject(ProgressStateService);
  private authService = inject(AuthService);

  course: Course | null = null;
  sections: Section[] = [];
  currentLesson: Lesson | null = null;
  currentSectionTitle = '';
  isLoading = true;
  sidebarOpen = true;
  markingComplete = false;

  expandedSections: boolean[] = [];
  completedLessonIds = new Set<number>();
  allLessons: Lesson[] = [];

  youtubeEmbedUrl: SafeResourceUrl | null = null;
  sanitizedFileUrl: SafeResourceUrl | null = null;

  get totalLessons(): number {
    return this.allLessons.length;
  }

  get progressPercent(): number {
    if (this.totalLessons === 0) return 0;
    return Math.round((this.completedLessonIds.size / this.totalLessons) * 100);
  }

  get currentLessonIndex(): number {
    if (!this.currentLesson) return -1;
    return this.allLessons.findIndex(l => l.id === this.currentLesson!.id);
  }

  get hasPrevious(): boolean {
    return this.currentLessonIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentLessonIndex < this.totalLessons - 1;
  }

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  loadCourse(id: number) {
    this.isLoading = true;

    this.enrollmentService.checkEnrollment(id).subscribe({
      next: (res) => {
        if (!res.enrolled) {
          this.router.navigate(['/courses', id]);
          return;
        }

        this.courseService.getCourseById(id).subscribe({
          next: (course) => {
            this.course = course;
            this.loadSections(id);
            this.loadProgress(id);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.router.navigate(['/courses', id]);
      }
    });
  }

  loadSections(courseId: number) {
    this.courseService.getCourseSections(courseId).subscribe({
      next: (sections) => {
        this.sections = sections;
        this.expandedSections = new Array(sections.length).fill(false);

        this.allLessons = [];
        for (const section of sections) {
          if (section.lessons) {
            this.allLessons.push(...section.lessons);
          }
        }

        if (this.allLessons.length > 0) {
          this.expandedSections[0] = true;
          this.selectLesson(this.allLessons[0]);
        }
      }
    });
  }

  loadProgress(courseId: number) {
    this.progressService.getCourseProgress(courseId).subscribe({
      next: (progressList) => {
        this.completedLessonIds.clear();
        for (const p of progressList) {
          if (p.completed) {
            this.completedLessonIds.add(p.lessonId);
          }
        }

        // Auto-select first incomplete lesson
        if (this.completedLessonIds.size > 0 && this.allLessons.length > 0) {
          const firstIncomplete = this.allLessons.find(l => !this.completedLessonIds.has(l.id));
          if (firstIncomplete) {
            this.selectLesson(firstIncomplete);
            this.expandSectionContainingLesson(firstIncomplete);
          }
        }
      }
    });
  }

  selectLesson(lesson: Lesson) {
    this.currentLesson = lesson;
    this.youtubeEmbedUrl = null;
    this.sanitizedFileUrl = null;

    // Find section title
    for (const section of this.sections) {
      if (section.lessons?.some(l => l.id === lesson.id)) {
        this.currentSectionTitle = section.title;
        break;
      }
    }

    // Prepare YouTube embed URL
    if (lesson.type === 'VIDEO' && lesson.videoUrl && isYouTubeUrl(lesson.videoUrl)) {
      const embedUrl = getEmbedUrl(lesson.videoUrl);
      if (embedUrl) {
        this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }

    // Prepare PDF URL
    if (lesson.type === 'PDF' && lesson.filePath) {
      this.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(lesson.filePath);
    }

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }

  toggleSection(index: number) {
    this.expandedSections[index] = !this.expandedSections[index];
  }

  markAsCompleted() {
    if (!this.currentLesson) return;
    this.markingComplete = true;

    this.progressService.markAsCompleted(this.currentLesson.id).subscribe({
      next: () => {
        this.completedLessonIds.add(this.currentLesson!.id);
        this.markingComplete = false;

        // Notify other components with computed progress
        if (this.course) {
          this.progressState.notifyProgressUpdate({
            courseId: this.course.id,
            percent: this.progressPercent,
            completedLessons: this.completedLessonIds.size,
            totalLessons: this.totalLessons
          });
        }

        // Auto-advance to next lesson
        if (this.hasNext) {
          setTimeout(() => this.goToNext(), 500);
        }
      },
      error: () => {
        this.markingComplete = false;
      }
    });
  }

  goToPrevious() {
    const idx = this.currentLessonIndex;
    if (idx > 0) {
      const lesson = this.allLessons[idx - 1];
      this.selectLesson(lesson);
      this.expandSectionContainingLesson(lesson);
    }
  }

  goToNext() {
    const idx = this.currentLessonIndex;
    if (idx < this.totalLessons - 1) {
      const lesson = this.allLessons[idx + 1];
      this.selectLesson(lesson);
      this.expandSectionContainingLesson(lesson);
    }
  }

  getSectionCompletedCount(section: Section): number {
    if (!section.lessons) return 0;
    return section.lessons.filter(l => this.completedLessonIds.has(l.id)).length;
  }

  private expandSectionContainingLesson(lesson: Lesson) {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].lessons?.some(l => l.id === lesson.id)) {
        this.expandedSections[i] = true;
        break;
      }
    }
  }
}
