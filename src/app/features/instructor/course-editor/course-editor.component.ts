import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { SectionService, SectionCreateRequest } from '../../../core/services/section.service';
import { LessonService, LessonCreateRequest } from '../../../core/services/lesson.service';
import { Course, Section, Lesson } from '../../../core/models';

@Component({
  selector: 'app-course-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="page-header-brand">
        <div class="container-app">
          <a routerLink="/dashboard/instructor"
             class="inline-flex items-center gap-1.5 text-xs mb-4 transition-opacity hover:opacity-100"
             style="color: rgba(255,255,255,0.5);">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Tableau de bord instructeur
          </a>
          <p class="text-xs font-bold mb-2 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">
            Gestion du contenu
          </p>
          @if (isLoading) {
            <div class="h-7 w-1/2 rounded" style="background: rgba(255,255,255,0.12);"></div>
          } @else {
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 class="text-2xl font-bold text-white line-clamp-2">{{ course?.title }}</h1>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="badge text-xs"
                      [class.badge-success]="course?.status === 'PUBLISHED'"
                      [class.badge-warning]="course?.status === 'DRAFT'"
                      [class.badge-neutral]="course?.status === 'ARCHIVED'">
                  {{ getStatusLabel(course?.status) }}
                </span>
                <a [routerLink]="['/courses', courseId, 'info']"
                   class="btn btn-secondary btn-sm">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Modifier les informations
                </a>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="container-app py-12">
        <div class="max-w-3xl mx-auto">

          <!-- Sections card -->
          <div class="card overflow-hidden">
            <div class="px-6 py-4 flex items-center justify-between" style="border-bottom: 1px solid var(--border);">
              <div>
                <h2 class="font-semibold" style="color: var(--ink);">Sections & Leçons</h2>
                <p class="text-xs mt-0.5" style="color: var(--ink-3);">
                  {{ sections.length }} section{{ sections.length !== 1 ? 's' : '' }} —
                  {{ totalLessons }} leçon{{ totalLessons !== 1 ? 's' : '' }}
                </p>
              </div>
              <button (click)="openSectionModal()" class="btn btn-primary btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter une section
              </button>
            </div>

            @if (isSectionsLoading) {
              <div class="p-6 space-y-3">
                @for (i of [1,2,3]; track i) {
                  <div class="skeleton h-12 w-full rounded-lg"></div>
                }
              </div>
            } @else if (sections.length === 0) {
              <div class="empty-state py-16">
                <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
                <h3 class="empty-state-title">Aucune section</h3>
                <p class="empty-state-description">Créez votre première section pour organiser vos leçons</p>
                <button (click)="openSectionModal()" class="btn btn-primary">Créer une section</button>
              </div>
            } @else {
              @for (section of sections; track section.id; let i = $index) {
                <div style="border-bottom: 1px solid var(--border);" class="last:border-b-0">

                  <!-- Section header row -->
                  <div class="flex items-center px-6 py-3.5"
                       style="background: var(--canvas);">
                    <button (click)="toggleSection(i)"
                            class="flex items-center gap-3 flex-1 text-left min-w-0">
                      <svg class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                           [class.rotate-90]="expandedSections[i]"
                           style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      <span class="font-semibold text-sm truncate" style="color: var(--ink);">{{ section.title }}</span>
                      <span class="text-xs flex-shrink-0 ml-1" style="color: var(--ink-4);">
                        {{ section.lessons?.length || 0 }} leçon{{ (section.lessons?.length || 0) !== 1 ? 's' : '' }}
                      </span>
                    </button>
                    <div class="flex gap-0.5 ml-3 flex-shrink-0">
                      <button (click)="openSectionModal(section)"
                              class="btn btn-ghost btn-sm" title="Modifier">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="deleteSection(section)"
                              class="btn btn-ghost btn-sm" style="color: #EF4444;" title="Supprimer">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Lessons list (expanded) -->
                  @if (expandedSections[i]) {
                    <div class="px-6 pt-2 pb-4 space-y-1.5 bg-white">

                      @if (!section.lessons?.length) {
                        <p class="text-xs py-3 text-center" style="color: var(--ink-4);">
                          Aucune leçon — ajoutez-en une ci-dessous
                        </p>
                      } @else {
                        @for (lesson of section.lessons; track lesson.id) {
                          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                               style="border: 1px solid var(--border);">

                            <!-- Type icon -->
                            <div class="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                                 [style.background]="getLessonTypeBg(lesson.type)">
                              @if (lesson.type === 'VIDEO') {
                                <svg class="w-3.5 h-3.5" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              } @else if (lesson.type === 'QUIZ') {
                                <svg class="w-3.5 h-3.5" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              } @else {
                                <svg class="w-3.5 h-3.5" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                              }
                            </div>

                            <span class="flex-1 text-sm font-medium truncate" style="color: var(--ink);">
                              {{ lesson.title }}
                            </span>

                            <div class="flex items-center gap-2 flex-shrink-0">
                              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                    [style.background]="getLessonTypeBg(lesson.type)"
                                    [style.color]="getLessonTypeColor(lesson.type)">
                                {{ lesson.type }}
                              </span>
                              @if (lesson.isFree) {
                                <span class="badge badge-primary" style="font-size: 10px;">Aperçu</span>
                              }
                              @if (lesson.duration) {
                                <span class="text-xs" style="color: var(--ink-4);">{{ lesson.duration }}min</span>
                              }
                              <button (click)="openLessonModal(section.id, lesson)"
                                      class="btn btn-ghost btn-sm" title="Modifier">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                              <button (click)="deleteLesson(section, lesson)"
                                      class="btn btn-ghost btn-sm" style="color: #EF4444;" title="Supprimer">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        }
                      }

                      <!-- Add lesson button -->
                      <button (click)="openLessonModal(section.id, null)"
                              class="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mt-1"
                              style="color: var(--violet); border: 1.5px dashed var(--violet-mid);"
                              onmouseenter="this.style.background='var(--violet-xlight)'"
                              onmouseleave="this.style.background='transparent'">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Ajouter une leçon
                      </button>
                    </div>
                  }
                </div>
              }
            }
          </div>

        </div>
      </div>

      <!-- ==============================
           MODAL : SECTION
           ============================== -->
      @if (showSectionModal) {
        <div class="fixed inset-0 flex items-center justify-center z-50 p-4"
             style="background: rgba(13,11,32,0.6);" (click)="closeSectionModal()">
          <div class="bg-white w-full max-w-md" style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);"
               (click)="$event.stopPropagation()">
            <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
              <h3 class="text-base font-bold" style="color: var(--ink);">
                {{ editingSection ? 'Modifier la section' : 'Nouvelle section' }}
              </h3>
            </div>
            <div class="p-6">
              <label class="label">Titre de la section <span style="color: #EF4444;">*</span></label>
              <input type="text" [(ngModel)]="sectionTitle" class="input"
                     placeholder="Ex: Introduction au cours"
                     (keyup.enter)="saveSection()">
            </div>
            <div class="px-6 pb-6 flex gap-3" style="border-top: 1px solid var(--border); padding-top: 20px;">
              <button (click)="closeSectionModal()" class="btn btn-secondary flex-1">Annuler</button>
              <button (click)="saveSection()" [disabled]="!sectionTitle.trim() || isSavingSection"
                      class="btn btn-primary flex-1">
                @if (isSavingSection) { Enregistrement... } @else { Enregistrer }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ==============================
           MODAL : LEÇON
           ============================== -->
      @if (showLessonModal) {
        <div class="fixed inset-0 flex items-center justify-center z-50 p-4"
             style="background: rgba(13,11,32,0.6);" (click)="closeLessonModal()">
          <div class="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
               style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);"
               (click)="$event.stopPropagation()">
            <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
              <h3 class="text-base font-bold" style="color: var(--ink);">
                {{ editingLesson ? 'Modifier la leçon' : 'Nouvelle leçon' }}
              </h3>
            </div>
            <div class="p-6 space-y-4">

              <div>
                <label class="label">Titre <span style="color: #EF4444;">*</span></label>
                <input type="text" [(ngModel)]="lessonForm.title" class="input"
                       placeholder="Ex: Les bases de HTML">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Type <span style="color: #EF4444;">*</span></label>
                  <select [(ngModel)]="lessonForm.type" class="input">
                    <option value="VIDEO">Vidéo</option>
                    <option value="TEXT">Texte</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>
                <div>
                  <label class="label">Durée (minutes)</label>
                  <input type="number" [(ngModel)]="lessonForm.duration" min="0" class="input"
                         placeholder="0">
                </div>
              </div>

              @if (lessonForm.type === 'VIDEO') {
                <div>
                  <label class="label">URL de la vidéo</label>
                  <input type="text" [(ngModel)]="lessonForm.videoUrl" class="input"
                         placeholder="https://youtu.be/... ou https://www.youtube.com/watch?v=...">
                  <p class="mt-1 text-xs" style="color: var(--ink-4);">
                    Lien YouTube, Vimeo ou tout autre hébergeur vidéo.
                  </p>
                </div>
              }

              <div>
                <label class="label">Description <span class="font-normal" style="color: var(--ink-4);">(optionnel)</span></label>
                <textarea [(ngModel)]="lessonForm.content" rows="3" class="input resize-none"
                          placeholder="Décrivez le contenu de cette leçon..."></textarea>
              </div>

              <div class="flex items-center gap-3 p-3"
                   style="background: var(--violet-xlight); border-radius: var(--r-md);">
                <input type="checkbox" [(ngModel)]="lessonForm.isFree"
                       id="lesson-free-check"
                       class="w-4 h-4 accent-violet-700 cursor-pointer">
                <div>
                  <label for="lesson-free-check" class="text-sm font-medium cursor-pointer" style="color: var(--ink);">
                    Aperçu gratuit
                  </label>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">
                    Les non-inscrits pourront accéder à cette leçon.
                  </p>
                </div>
              </div>

            </div>
            <div class="px-6 pb-6 flex gap-3" style="border-top: 1px solid var(--border); padding-top: 20px;">
              <button (click)="closeLessonModal()" class="btn btn-secondary flex-1">Annuler</button>
              <button (click)="saveLesson()" [disabled]="!lessonForm.title.trim() || isSavingLesson"
                      class="btn btn-primary flex-1">
                @if (isSavingLesson) { Enregistrement... } @else { Enregistrer }
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class CourseEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private sectionService = inject(SectionService);
  private lessonService = inject(LessonService);

  courseId!: number;
  course: Course | null = null;
  sections: Section[] = [];
  isLoading = true;
  isSectionsLoading = false;
  expandedSections: boolean[] = [];

  // Section modal
  showSectionModal = false;
  editingSection: Section | null = null;
  sectionTitle = '';
  isSavingSection = false;

  // Lesson modal
  showLessonModal = false;
  editingLesson: Lesson | null = null;
  targetSectionId: number | null = null;
  lessonForm: LessonCreateRequest = this.emptyLessonForm();
  isSavingLesson = false;

  get totalLessons(): number {
    return this.sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  }

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadSections();
  }

  loadCourse() {
    this.isLoading = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/instructor']);
      }
    });
  }

  loadSections() {
    this.isSectionsLoading = true;
    this.sectionService.getSectionsByCourse(this.courseId).subscribe({
      next: (sections) => {
        this.sections = sections;
        this.expandedSections = new Array(sections.length).fill(false);
        this.isSectionsLoading = false;
      },
      error: () => this.isSectionsLoading = false
    });
  }

  toggleSection(index: number) {
    this.expandedSections[index] = !this.expandedSections[index];
  }

  // ---- Section modal ----

  openSectionModal(section?: Section) {
    this.editingSection = section || null;
    this.sectionTitle = section?.title || '';
    this.showSectionModal = true;
  }

  closeSectionModal() {
    this.showSectionModal = false;
    this.editingSection = null;
    this.sectionTitle = '';
  }

  saveSection() {
    if (!this.sectionTitle.trim()) return;
    this.isSavingSection = true;

    const request: SectionCreateRequest = { title: this.sectionTitle.trim() };
    const obs = this.editingSection
      ? this.sectionService.updateSection(this.editingSection.id, request)
      : this.sectionService.createSection(this.courseId, request);

    obs.subscribe({
      next: () => {
        this.isSavingSection = false;
        this.closeSectionModal();
        this.loadSections();
      },
      error: () => this.isSavingSection = false
    });
  }

  deleteSection(section: Section) {
    if (!confirm(`Supprimer la section "${section.title}" et toutes ses leçons ?`)) return;
    this.sectionService.deleteSection(section.id).subscribe({
      next: () => this.loadSections(),
      error: (err) => alert(err.error?.message || 'Impossible de supprimer cette section')
    });
  }

  // ---- Lesson modal ----

  openLessonModal(sectionId: number, lesson?: Lesson | null) {
    this.targetSectionId = sectionId;
    this.editingLesson = lesson || null;
    this.lessonForm = lesson ? {
      title: lesson.title,
      content: lesson.content || '',
      type: lesson.type,
      duration: lesson.duration || 0,
      isFree: lesson.isFree,
      videoUrl: lesson.videoUrl || ''
    } : this.emptyLessonForm();
    this.showLessonModal = true;
  }

  closeLessonModal() {
    this.showLessonModal = false;
    this.editingLesson = null;
    this.targetSectionId = null;
    this.lessonForm = this.emptyLessonForm();
  }

  saveLesson() {
    if (!this.lessonForm.title.trim()) return;
    this.isSavingLesson = true;

    const request: LessonCreateRequest = {
      title: this.lessonForm.title.trim(),
      content: this.lessonForm.content || undefined,
      type: this.lessonForm.type,
      duration: this.lessonForm.duration || undefined,
      isFree: this.lessonForm.isFree,
      videoUrl: this.lessonForm.type === 'VIDEO' ? (this.lessonForm.videoUrl || undefined) : undefined
    };

    const obs = this.editingLesson
      ? this.lessonService.updateLesson(this.editingLesson.id, request)
      : this.lessonService.createLesson(this.targetSectionId!, request);

    obs.subscribe({
      next: () => {
        this.isSavingLesson = false;
        this.closeLessonModal();
        this.loadSections();
      },
      error: () => this.isSavingLesson = false
    });
  }

  deleteLesson(section: Section, lesson: Lesson) {
    if (!confirm(`Supprimer la leçon "${lesson.title}" ?`)) return;
    this.lessonService.deleteLesson(lesson.id).subscribe({
      next: () => {
        if (section.lessons) {
          section.lessons = section.lessons.filter(l => l.id !== lesson.id);
        }
      },
      error: (err) => alert(err.error?.message || 'Impossible de supprimer cette leçon')
    });
  }

  // ---- Helpers ----

  private emptyLessonForm(): LessonCreateRequest {
    return { title: '', content: '', type: 'VIDEO', duration: 0, isFree: false, videoUrl: '' };
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'ARCHIVED': return 'Archivé';
      default: return status || '';
    }
  }

  getLessonTypeBg(type: string): string {
    switch (type) {
      case 'VIDEO': return 'var(--violet-tint)';
      case 'QUIZ': return 'var(--amber-tint)';
      default: return 'var(--green-tint)';
    }
  }

  getLessonTypeColor(type: string): string {
    switch (type) {
      case 'VIDEO': return 'var(--violet)';
      case 'QUIZ': return 'var(--amber)';
      default: return 'var(--green)';
    }
  }
}
