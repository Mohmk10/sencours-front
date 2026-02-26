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
        <div class="absolute inset-0 backdrop-blur-sm" style="background: rgba(0,0,0,0.8);" (click)="close()"></div>

        <div class="relative w-full max-w-5xl overflow-hidden animate-scale-in"
             style="background: var(--ink); border-radius: var(--r-xl); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div>
              <span class="inline-block px-2 py-0.5 text-xs font-medium mb-1"
                    style="background: rgba(139,92,246,0.2); color: var(--violet-light); border-radius: var(--r-sm);">
                Aperçu gratuit
              </span>
              <h3 class="text-white font-semibold text-lg">{{ lesson.title }}</h3>
            </div>
            <button (click)="close()" class="p-2 rounded-full transition-colors"
                    style="color: rgba(255,255,255,0.6);"
                    onmouseenter="this.style.background='rgba(255,255,255,0.1)'; this.style.color='white'"
                    onmouseleave="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.6)'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Player / Content -->
          <div class="aspect-video bg-black relative">
            @if (lesson.type === 'VIDEO' && lesson.videoUrl && embedUrl) {
              <iframe
                [src]="embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            } @else if (lesson.type === 'VIDEO_UPLOAD' && lesson.filePath) {
              <video
                [src]="lesson.filePath"
                class="w-full h-full"
                controls
                autoplay>
              </video>
            } @else if (lesson.type === 'TEXT' && lesson.content) {
              <div class="p-8 text-white overflow-y-auto h-full" style="background: var(--ink);">
                <div class="text-sm leading-relaxed" [innerHTML]="lesson.content"></div>
              </div>
            } @else if (lesson.type === 'PDF' && lesson.filePath) {
              <iframe
                [src]="sanitizedFileUrl"
                class="w-full h-full bg-white">
              </iframe>
            } @else if (lesson.type === 'IMAGE' && lesson.filePath) {
              <div class="w-full h-full flex items-center justify-center" style="background: var(--ink);">
                <img [src]="lesson.filePath" [alt]="lesson.title" class="max-w-full max-h-full object-contain">
              </div>
            } @else {
              <div class="w-full h-full flex items-center justify-center" style="color: rgba(255,255,255,0.4);">
                <div class="text-center">
                  <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-sm">Contenu non disponible</p>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-5 py-4" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="text-sm" style="color: rgba(255,255,255,0.5);">
              @if (lesson.duration) {
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Durée : {{ lesson.duration }} minutes
                </span>
              }
            </div>
            <button (click)="onEnrollClick()" class="btn btn-amber flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              S'inscrire au cours complet
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes scale-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
  `]
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
    return this.sanitizer.bypassSecurityTrustResourceUrl(url + '?autoplay=1&rel=0');
  }

  get sanitizedFileUrl(): SafeResourceUrl | null {
    if (!this.lesson?.filePath) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson.filePath);
  }

  close() {
    this.closed.emit();
  }

  onEnrollClick() {
    this.enrollClicked.emit();
    this.close();
  }
}
