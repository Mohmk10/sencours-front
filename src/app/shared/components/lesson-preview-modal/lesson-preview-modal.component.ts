import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Lesson } from '../../../core/models';
import { getEmbedUrl } from '../../utils/video.utils';

@Component({
  selector: 'app-lesson-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen && lesson) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.8);" (click)="close()"></div>

        <div class="relative w-full max-w-4xl overflow-hidden"
             style="background: var(--ink); border-radius: var(--r-xl); box-shadow: var(--shadow-lg);"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div>
              <p class="text-xs font-medium" style="color: var(--violet-light);">Aperçu gratuit</p>
              <h3 class="text-white font-semibold text-sm mt-0.5">{{ lesson.title }}</h3>
            </div>
            <button (click)="close()" class="p-2 rounded-full transition-colors"
                    style="color: rgba(255,255,255,0.6);"
                    onmouseenter="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseleave="this.style.background='transparent'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Player -->
          <div class="aspect-video bg-black">
            @if (lesson.type === 'VIDEO' && lesson.videoUrl && embedUrl) {
              <iframe
                [src]="embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            } @else if (lesson.type === 'VIDEO_UPLOAD' && lesson.filePath) {
              <video
                [src]="lesson.filePath"
                class="w-full h-full"
                controls
                autoplay>
              </video>
            } @else if (lesson.type === 'TEXT') {
              <div class="p-8 text-white overflow-y-auto max-h-[60vh]">
                <div class="text-sm leading-relaxed" [innerHTML]="lesson.content"></div>
              </div>
            } @else if (lesson.type === 'IMAGE' && lesson.filePath) {
              <div class="flex items-center justify-center h-full p-6">
                <img [src]="lesson.filePath" [alt]="lesson.title" class="max-w-full max-h-full object-contain">
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-5 py-4" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <p class="text-sm" style="color: rgba(255,255,255,0.5);">
              @if (lesson.duration) {
                Durée : {{ lesson.duration }} minutes
              }
            </p>
            <button (click)="onEnrollClick()" class="btn btn-amber">
              S'inscrire au cours complet
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class LessonPreviewModalComponent {
  @Input() isOpen = false;
  @Input() lesson: Lesson | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() enrollClicked = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);

  get embedUrl(): SafeResourceUrl | null {
    if (!this.lesson?.videoUrl) return null;
    const url = getEmbedUrl(this.lesson.videoUrl);
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1');
  }

  close() {
    this.closed.emit();
  }

  onEnrollClick() {
    this.enrollClicked.emit();
    this.close();
  }
}
