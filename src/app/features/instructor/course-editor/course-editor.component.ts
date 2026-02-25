import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { SectionService, SectionCreateRequest } from '../../../core/services/section.service';
import { LessonService, LessonCreateRequest, QuizQuestion } from '../../../core/services/lesson.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { Course, Section, Lesson } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { getYouTubeThumbnail } from '../../../shared/utils/video.utils';

@Component({
  selector: 'app-course-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmModalComponent],
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">

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
                      <button (click)="openDeleteSectionModal(section)"
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

                            <!-- Thumbnail or type icon -->
                            <div class="w-14 h-9 rounded overflow-hidden flex items-center justify-center flex-shrink-0"
                                 [style.background]="getLessonTypeBg(lesson.type)">
                              @if (getLessonThumbnail(lesson)) {
                                <img [src]="getLessonThumbnail(lesson)" alt="" class="w-full h-full object-cover">
                              } @else if (lesson.type === 'VIDEO' || lesson.type === 'VIDEO_UPLOAD') {
                                <svg class="w-4 h-4" [style.color]="getLessonTypeColor(lesson.type)" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              } @else if (lesson.type === 'QUIZ') {
                                <svg class="w-4 h-4" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                              } @else if (lesson.type === 'PDF') {
                                <svg class="w-4 h-4" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                              } @else if (lesson.type === 'IMAGE') {
                                <svg class="w-4 h-4" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                              } @else {
                                <svg class="w-4 h-4" [style.color]="getLessonTypeColor(lesson.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                              }
                            </div>

                            <div class="flex-1 min-w-0">
                              <span class="text-sm font-medium truncate block" style="color: var(--ink);">
                                {{ lesson.title }}
                              </span>
                              <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs font-medium"
                                      [style.color]="getLessonTypeColor(lesson.type)">
                                  {{ getLessonTypeLabel(lesson.type) }}
                                </span>
                                @if (lesson.duration) {
                                  <span class="text-xs" style="color: var(--ink-4);">{{ lesson.duration }} min</span>
                                }
                                @if (lesson.isFree) {
                                  <span class="text-xs font-medium" style="color: var(--violet);">Aperçu</span>
                                }
                              </div>
                            </div>

                            <div class="flex gap-0.5 flex-shrink-0">
                              <button (click)="openLessonModal(section.id, lesson)"
                                      class="btn btn-ghost btn-sm" title="Modifier">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                              <button (click)="openDeleteLessonModal(section, lesson)"
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

          </div><!-- end left column -->

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="card p-6">
              <h3 class="font-semibold mb-4" style="color: var(--ink);">Informations du cours</h3>
              <dl class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <dt style="color: var(--ink-3);">Statut</dt>
                  <dd>
                    <span class="badge"
                          [class.badge-success]="course?.status === 'PUBLISHED'"
                          [class.badge-warning]="course?.status === 'DRAFT'"
                          [class.badge-neutral]="course?.status === 'ARCHIVED'">
                      {{ getStatusLabel(course?.status) }}
                    </span>
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt style="color: var(--ink-3);">Prix</dt>
                  <dd class="font-medium" style="color: var(--ink);">{{ course?.price === 0 ? 'Gratuit' : (course?.price | number) + ' FCFA' }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt style="color: var(--ink-3);">Sections</dt>
                  <dd class="font-medium" style="color: var(--ink);">{{ sections.length }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt style="color: var(--ink-3);">Leçons</dt>
                  <dd class="font-medium" style="color: var(--ink);">{{ totalLessons }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt style="color: var(--ink-3);">Durée totale</dt>
                  <dd class="font-medium" style="color: var(--ink);">{{ totalDuration }} min</dd>
                </div>
              </dl>
            </div>

            <div class="card p-6">
              <h3 class="font-semibold mb-4" style="color: var(--ink);">Actions</h3>
              <div class="space-y-3">
                @if (course?.status === 'DRAFT') {
                  <button (click)="publishCourse()" [disabled]="isPublishing" class="btn btn-primary w-full">
                    @if (isPublishing) { Publication... } @else { Publier le cours }
                  </button>
                } @else if (course?.status === 'PUBLISHED') {
                  <button (click)="unpublishCourse()" [disabled]="isPublishing" class="btn btn-secondary w-full">
                    @if (isPublishing) { En cours... } @else { Passer en brouillon }
                  </button>
                }
                <a [routerLink]="['/courses', courseId]" class="btn btn-secondary w-full text-center">
                  Voir la page du cours
                </a>
              </div>
            </div>
          </div>
        </div><!-- end grid -->
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
                    <option value="VIDEO">Vidéo (URL)</option>
                    <option value="VIDEO_UPLOAD">Vidéo (upload)</option>
                    <option value="TEXT">Texte</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="PDF">PDF</option>
                    <option value="IMAGE">Image</option>
                  </select>
                </div>
                <div>
                  <label class="label">Durée (minutes)</label>
                  <input type="number" [(ngModel)]="lessonForm.duration" min="0" class="input"
                         placeholder="0">
                </div>
              </div>

              @switch (lessonForm.type) {
                @case ('VIDEO') {
                  <div>
                    <label class="label">URL de la vidéo</label>
                    <input type="text" [(ngModel)]="lessonForm.videoUrl" class="input"
                           placeholder="https://youtu.be/... ou https://www.youtube.com/watch?v=...">
                    <p class="mt-1 text-xs" style="color: var(--ink-4);">Lien YouTube, Vimeo ou tout autre hébergeur vidéo.</p>
                  </div>
                }
                @case ('VIDEO_UPLOAD') {
                  <div>
                    <label class="label">Fichier vidéo <span style="color: #EF4444;">*</span></label>
                    @if (!lessonForm.filePath && !isUploading) {
                      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed cursor-pointer transition-colors hover:border-violet-500 hover:bg-violet-50"
                             style="border-color: var(--border-2); border-radius: var(--r-lg);">
                        <svg class="w-8 h-8 mb-2" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p class="text-sm" style="color: var(--ink-3);">Cliquez pour sélectionner une vidéo</p>
                        <p class="text-xs" style="color: var(--ink-4);">MP4, WebM, MOV (max. 500 MB)</p>
                        <input type="file" class="hidden" accept="video/*" (change)="onFileSelected($event, 'video')">
                      </label>
                    }
                    @if (isUploading) {
                      <div class="p-4" style="border: 1px solid var(--border); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3 mb-2">
                          <svg class="animate-spin w-5 h-5" style="color: var(--violet);" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm" style="color: var(--ink);">Upload en cours...</span>
                        </div>
                        <div class="w-full h-2 rounded-full" style="background: var(--border);">
                          <div class="h-2 rounded-full transition-all" style="background: var(--violet);" [style.width.%]="uploadProgress"></div>
                        </div>
                        <p class="text-xs mt-1" style="color: var(--ink-4);">{{ uploadProgress }}%</p>
                      </div>
                    }
                    @if (lessonForm.filePath && !isUploading) {
                      <div class="flex items-center justify-between p-4"
                           style="border: 1px solid var(--green); background: var(--green-tint); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-sm font-medium" style="color: var(--green);">Vidéo uploadée</span>
                        </div>
                        <button type="button" (click)="removeFile()" class="text-sm" style="color: #EF4444;">Supprimer</button>
                      </div>
                    }
                  </div>
                }
                @case ('TEXT') {
                  <div>
                    <label class="label">Contenu du texte <span style="color: #EF4444;">*</span></label>
                    <textarea [(ngModel)]="lessonForm.content" rows="6" class="input resize-none"
                              placeholder="Écrivez le contenu de votre leçon..."></textarea>
                  </div>
                }
                @case ('QUIZ') {
                  <div>
                    <label class="label">Quiz</label>
                    <div class="p-4" style="border: 1px solid var(--border); border-radius: var(--r-md);">
                      <div class="flex items-center justify-between mb-4">
                        <span class="text-xs" style="color: var(--ink-3);">{{ quizQuestions.length }} question(s)</span>
                        <button type="button" (click)="addQuestion()" class="text-sm font-medium" style="color: var(--violet);">+ Ajouter une question</button>
                      </div>
                      @for (question of quizQuestions; track question.id; let qi = $index) {
                        <div class="p-4 mb-3" style="border: 1px solid var(--border); border-radius: var(--r-md);">
                          <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-semibold" style="color: var(--ink);">Question {{ qi + 1 }}</span>
                            <button type="button" (click)="removeQuestion(qi)" class="text-xs" style="color: #EF4444;">Supprimer</button>
                          </div>
                          <select [(ngModel)]="question.type" class="input mb-3">
                            <option value="multiple_choice">Choix multiple (une réponse)</option>
                            <option value="multiple_answers">Choix multiple (plusieurs réponses)</option>
                            <option value="true_false">Vrai / Faux</option>
                          </select>
                          <input type="text" [(ngModel)]="question.question" class="input mb-3" placeholder="Votre question...">
                          @if (question.type !== 'true_false') {
                            <div class="space-y-2 mb-3">
                              @for (option of question.options; track $index; let oi = $index) {
                                <div class="flex items-center gap-2">
                                  <input [type]="question.type === 'multiple_choice' ? 'radio' : 'checkbox'" [name]="'q' + qi" [checked]="isCorrectAnswer(question, oi)" (change)="setCorrectAnswer(question, oi)" class="flex-shrink-0">
                                  <input type="text" [(ngModel)]="question.options![oi]" class="input flex-1" [placeholder]="'Option ' + (oi + 1)">
                                  @if (question.options!.length > 2) {
                                    <button type="button" (click)="removeOption(question, oi)" class="text-sm flex-shrink-0" style="color: #EF4444;">&#215;</button>
                                  }
                                </div>
                              }
                              <button type="button" (click)="addOption(question)" class="text-sm" style="color: var(--violet);">+ Ajouter une option</button>
                            </div>
                          } @else {
                            <div class="flex items-center gap-4 mb-3">
                              <label class="flex items-center gap-2 text-sm" style="color: var(--ink);">
                                <input type="radio" [name]="'tf' + qi" [checked]="question.correctAnswer === true" (change)="question.correctAnswer = true"> Vrai
                              </label>
                              <label class="flex items-center gap-2 text-sm" style="color: var(--ink);">
                                <input type="radio" [name]="'tf' + qi" [checked]="question.correctAnswer === false" (change)="question.correctAnswer = false"> Faux
                              </label>
                            </div>
                          }
                          <input type="text" [(ngModel)]="question.explanation" class="input" placeholder="Explication (optionnel)">
                        </div>
                      }
                      @if (quizQuestions.length === 0) {
                        <p class="text-center py-4 text-sm" style="color: var(--ink-3);">Aucune question. Ajoutez-en une pour créer le quiz.</p>
                      }
                    </div>
                  </div>
                }
                @case ('PDF') {
                  <div>
                    <label class="label">Document PDF <span style="color: #EF4444;">*</span></label>
                    @if (!lessonForm.filePath && !isUploading) {
                      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed cursor-pointer transition-colors hover:border-violet-500 hover:bg-violet-50"
                             style="border-color: var(--border-2); border-radius: var(--r-lg);">
                        <svg class="w-8 h-8 mb-2" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-sm" style="color: var(--ink-3);">Cliquez pour sélectionner un PDF</p>
                        <p class="text-xs" style="color: var(--ink-4);">PDF uniquement (max. 50 MB)</p>
                        <input type="file" class="hidden" accept=".pdf" (change)="onFileSelected($event, 'pdf')">
                      </label>
                    }
                    @if (isUploading) {
                      <div class="p-4" style="border: 1px solid var(--border); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3 mb-2">
                          <svg class="animate-spin w-5 h-5" style="color: var(--violet);" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm" style="color: var(--ink);">Upload en cours...</span>
                        </div>
                        <div class="w-full h-2 rounded-full" style="background: var(--border);">
                          <div class="h-2 rounded-full transition-all" style="background: var(--violet);" [style.width.%]="uploadProgress"></div>
                        </div>
                        <p class="text-xs mt-1" style="color: var(--ink-4);">{{ uploadProgress }}%</p>
                      </div>
                    }
                    @if (lessonForm.filePath && !isUploading) {
                      <div class="flex items-center justify-between p-4"
                           style="border: 1px solid var(--green); background: var(--green-tint); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-sm font-medium" style="color: var(--green);">PDF uploadé</span>
                        </div>
                        <button type="button" (click)="removeFile()" class="text-sm" style="color: #EF4444;">Supprimer</button>
                      </div>
                    }
                    <p class="mt-2 text-xs" style="color: var(--ink-4);">Ou collez une URL directe :</p>
                    <input type="url" [(ngModel)]="lessonForm.filePath" class="input mt-1" placeholder="https://exemple.com/document.pdf">
                  </div>
                }
                @case ('IMAGE') {
                  <div>
                    <label class="label">Image <span style="color: #EF4444;">*</span></label>
                    @if (!lessonForm.filePath && !isUploading) {
                      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed cursor-pointer transition-colors hover:border-violet-500 hover:bg-violet-50"
                             style="border-color: var(--border-2); border-radius: var(--r-lg);">
                        <svg class="w-8 h-8 mb-2" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-sm" style="color: var(--ink-3);">Cliquez pour sélectionner une image</p>
                        <p class="text-xs" style="color: var(--ink-4);">JPG, PNG, GIF (max. 10 MB)</p>
                        <input type="file" class="hidden" accept="image/*" (change)="onFileSelected($event, 'image')">
                      </label>
                    }
                    @if (isUploading) {
                      <div class="p-4" style="border: 1px solid var(--border); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3 mb-2">
                          <svg class="animate-spin w-5 h-5" style="color: var(--violet);" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm" style="color: var(--ink);">Upload en cours...</span>
                        </div>
                        <div class="w-full h-2 rounded-full" style="background: var(--border);">
                          <div class="h-2 rounded-full transition-all" style="background: var(--violet);" [style.width.%]="uploadProgress"></div>
                        </div>
                        <p class="text-xs mt-1" style="color: var(--ink-4);">{{ uploadProgress }}%</p>
                      </div>
                    }
                    @if (lessonForm.filePath && !isUploading) {
                      <div class="flex items-center justify-between p-4"
                           style="border: 1px solid var(--green); background: var(--green-tint); border-radius: var(--r-md);">
                        <div class="flex items-center gap-3">
                          <svg class="w-5 h-5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-sm font-medium" style="color: var(--green);">Image uploadée</span>
                        </div>
                        <button type="button" (click)="removeFile()" class="text-sm" style="color: #EF4444;">Supprimer</button>
                      </div>
                    }
                    <p class="mt-2 text-xs" style="color: var(--ink-4);">Ou collez une URL directe :</p>
                    <input type="url" [(ngModel)]="lessonForm.filePath" class="input mt-1" placeholder="https://exemple.com/image.jpg">
                  </div>
                }
              }

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

      <!-- Modal Suppression Section -->
      <app-confirm-modal
        [isOpen]="showDeleteSectionModal"
        title="Supprimer la section"
        [message]="'Supprimer la section &quot;' + selectedSectionForDelete?.title + '&quot; et toutes ses leçons ?'"
        type="danger"
        confirmText="Supprimer"
        (confirmed)="confirmDeleteSection()"
        (cancelled)="showDeleteSectionModal = false; selectedSectionForDelete = null">
      </app-confirm-modal>

      <!-- Modal Suppression Leçon -->
      <app-confirm-modal
        [isOpen]="showDeleteLessonModal"
        title="Supprimer la leçon"
        [message]="'Supprimer la leçon &quot;' + selectedLessonForDelete?.title + '&quot; ?'"
        type="danger"
        confirmText="Supprimer"
        (confirmed)="confirmDeleteLesson()"
        (cancelled)="showDeleteLessonModal = false; selectedLessonForDelete = null">
      </app-confirm-modal>

      <!-- Modal Erreur -->
      <app-confirm-modal
        [isOpen]="showErrorModal"
        title="Erreur"
        [message]="errorModalMessage"
        type="danger"
        confirmText="Fermer"
        [showCancel]="false"
        (confirmed)="showErrorModal = false"
        (cancelled)="showErrorModal = false">
      </app-confirm-modal>

    </div>
  `
})
export class CourseEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private sectionService = inject(SectionService);
  private lessonService = inject(LessonService);
  private fileUploadService = inject(FileUploadService);

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

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Delete section modal
  showDeleteSectionModal = false;
  selectedSectionForDelete: Section | null = null;

  // Delete lesson modal
  showDeleteLessonModal = false;
  selectedLessonForDelete: Lesson | null = null;
  selectedSectionForLesson: Section | null = null;

  // Error modal
  showErrorModal = false;
  errorModalMessage = '';

  // File upload
  isUploading = false;
  uploadProgress = 0;
  selectedFile: File | null = null;

  // Sidebar
  isPublishing = false;

  get totalLessons(): number {
    return this.sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  }

  get totalDuration(): number {
    return this.sections.reduce((sum, s) =>
      sum + (s.lessons?.reduce((lSum, l) => lSum + (l.duration || 0), 0) || 0), 0);
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

  openDeleteSectionModal(section: Section) {
    this.selectedSectionForDelete = section;
    this.showDeleteSectionModal = true;
  }

  confirmDeleteSection() {
    if (!this.selectedSectionForDelete) return;
    this.sectionService.deleteSection(this.selectedSectionForDelete.id).subscribe({
      next: () => {
        this.showDeleteSectionModal = false;
        this.selectedSectionForDelete = null;
        this.loadSections();
      },
      error: (err) => {
        this.showDeleteSectionModal = false;
        this.selectedSectionForDelete = null;
        this.errorModalMessage = err.error?.message || 'Impossible de supprimer cette section';
        this.showErrorModal = true;
      }
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
      videoUrl: lesson.videoUrl || '',
      filePath: lesson.filePath || '',
      quizData: lesson.quizData
    } : this.emptyLessonForm();

    if (lesson && lesson.type === 'QUIZ' && lesson.quizData) {
      try {
        const parsed = JSON.parse(lesson.quizData);
        this.quizQuestions = parsed.questions || [];
      } catch { this.quizQuestions = []; }
    } else {
      this.quizQuestions = [];
    }

    this.showLessonModal = true;
  }

  closeLessonModal() {
    this.showLessonModal = false;
    this.editingLesson = null;
    this.targetSectionId = null;
    this.lessonForm = this.emptyLessonForm();
    this.quizQuestions = [];
    this.isUploading = false;
    this.uploadProgress = 0;
    this.selectedFile = null;
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
      videoUrl: this.lessonForm.type === 'VIDEO' ? (this.lessonForm.videoUrl || undefined) : undefined,
      filePath: (this.lessonForm.type === 'VIDEO_UPLOAD' || this.lessonForm.type === 'PDF' || this.lessonForm.type === 'IMAGE')
        ? (this.lessonForm.filePath || undefined)
        : undefined
    };

    if (this.lessonForm.type === 'QUIZ' && this.quizQuestions.length > 0) {
      request.quizData = JSON.stringify({ title: 'Quiz', passingScore: 70, questions: this.quizQuestions });
    }

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

  openDeleteLessonModal(section: Section, lesson: Lesson) {
    this.selectedSectionForLesson = section;
    this.selectedLessonForDelete = lesson;
    this.showDeleteLessonModal = true;
  }

  confirmDeleteLesson() {
    if (!this.selectedLessonForDelete || !this.selectedSectionForLesson) return;
    const section = this.selectedSectionForLesson;
    const lessonId = this.selectedLessonForDelete.id;
    this.lessonService.deleteLesson(lessonId).subscribe({
      next: () => {
        this.showDeleteLessonModal = false;
        if (section.lessons) {
          section.lessons = section.lessons.filter(l => l.id !== lessonId);
        }
        this.selectedLessonForDelete = null;
        this.selectedSectionForLesson = null;
      },
      error: (err) => {
        this.showDeleteLessonModal = false;
        this.selectedLessonForDelete = null;
        this.selectedSectionForLesson = null;
        this.errorModalMessage = err.error?.message || 'Impossible de supprimer cette leçon';
        this.showErrorModal = true;
      }
    });
  }

  // ---- Quiz methods ----

  addQuestion() {
    this.quizQuestions.push({
      id: Date.now(),
      type: 'multiple_choice',
      question: '',
      options: ['', ''],
      correctAnswer: 0,
      explanation: ''
    });
  }

  removeQuestion(index: number) {
    this.quizQuestions.splice(index, 1);
  }

  addOption(question: QuizQuestion) {
    if (!question.options) question.options = [];
    question.options.push('');
  }

  removeOption(question: QuizQuestion, index: number) {
    question.options?.splice(index, 1);
  }

  isCorrectAnswer(question: QuizQuestion, optionIndex: number): boolean {
    if (question.type === 'multiple_choice') {
      return question.correctAnswer === optionIndex;
    }
    if (question.type === 'multiple_answers') {
      return question.correctAnswers?.includes(optionIndex) || false;
    }
    return false;
  }

  setCorrectAnswer(question: QuizQuestion, optionIndex: number) {
    if (question.type === 'multiple_choice') {
      question.correctAnswer = optionIndex;
    } else if (question.type === 'multiple_answers') {
      if (!question.correctAnswers) question.correctAnswers = [];
      const idx = question.correctAnswers.indexOf(optionIndex);
      if (idx === -1) question.correctAnswers.push(optionIndex);
      else question.correctAnswers.splice(idx, 1);
    }
  }

  // ---- Publish / Unpublish ----

  publishCourse() {
    if (!this.course) return;
    this.isPublishing = true;
    this.courseService.updateCourseStatus(this.courseId, 'PUBLISHED').subscribe({
      next: (updated) => {
        this.course = updated;
        this.isPublishing = false;
      },
      error: (err) => {
        this.isPublishing = false;
        this.errorModalMessage = err.error?.message || 'Erreur lors de la publication';
        this.showErrorModal = true;
      }
    });
  }

  unpublishCourse() {
    if (!this.course) return;
    this.isPublishing = true;
    this.courseService.updateCourseStatus(this.courseId, 'DRAFT').subscribe({
      next: (updated) => {
        this.course = updated;
        this.isPublishing = false;
      },
      error: (err) => {
        this.isPublishing = false;
        this.errorModalMessage = err.error?.message || 'Erreur lors du changement de statut';
        this.showErrorModal = true;
      }
    });
  }

  // ---- File upload ----

  onFileSelected(event: Event, type: 'video' | 'image' | 'pdf') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadFile(type);
    }
  }

  uploadFile(type: 'video' | 'image' | 'pdf') {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.uploadProgress = 0;

    this.fileUploadService.uploadFile(this.selectedFile, type).subscribe({
      next: (result) => {
        this.uploadProgress = result.progress;
        if (result.response) {
          this.lessonForm.filePath = result.response.url;
          this.isUploading = false;
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.errorModalMessage = err.error?.message || "Erreur lors de l'upload";
        this.showErrorModal = true;
      }
    });
  }

  removeFile() {
    if (this.lessonForm.filePath) {
      this.fileUploadService.deleteFile(this.lessonForm.filePath).subscribe({
        next: () => {
          this.lessonForm.filePath = '';
          this.selectedFile = null;
        },
        error: () => {
          this.lessonForm.filePath = '';
          this.selectedFile = null;
        }
      });
    }
  }

  // ---- Helpers ----

  private emptyLessonForm(): LessonCreateRequest {
    return { title: '', content: '', type: 'VIDEO', duration: 0, isFree: false, videoUrl: '', filePath: '', quizData: undefined };
  }

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Publié';
      case 'DRAFT': return 'Brouillon';
      case 'ARCHIVED': return 'Archivé';
      default: return status || '';
    }
  }

  getLessonThumbnail(lesson: Lesson): string | null {
    if (lesson.type === 'VIDEO' && lesson.videoUrl) {
      return getYouTubeThumbnail(lesson.videoUrl, 'medium');
    }
    return null;
  }

  getLessonTypeLabel(type: string): string {
    switch (type) {
      case 'VIDEO': return 'Vidéo';
      case 'VIDEO_UPLOAD': return 'Vidéo upload';
      case 'TEXT': return 'Texte';
      case 'QUIZ': return 'Quiz';
      case 'PDF': return 'PDF';
      case 'IMAGE': return 'Image';
      default: return type;
    }
  }

  getLessonTypeBg(type: string): string {
    switch (type) {
      case 'VIDEO':
      case 'VIDEO_UPLOAD': return 'var(--violet-tint)';
      case 'QUIZ': return 'var(--amber-tint)';
      case 'PDF': return 'rgba(249,115,22,0.1)';
      case 'IMAGE': return 'rgba(168,85,247,0.1)';
      default: return 'var(--green-tint)';
    }
  }

  getLessonTypeColor(type: string): string {
    switch (type) {
      case 'VIDEO':
      case 'VIDEO_UPLOAD': return 'var(--violet)';
      case 'QUIZ': return 'var(--amber)';
      case 'PDF': return '#F97316';
      case 'IMAGE': return '#A855F7';
      default: return 'var(--green)';
    }
  }
}
