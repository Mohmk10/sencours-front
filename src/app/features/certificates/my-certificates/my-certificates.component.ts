import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CertificateService, Certificate } from '../../../core/services/certificate.service';

@Component({
  selector: 'app-my-certificates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="page-header-brand">
        <div class="container-app">
          <p class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase;">Accomplissements</p>
          <h1 class="text-4xl font-bold text-white">Mes Certificats</h1>
          <p class="mt-3 text-base" style="color: rgba(255,255,255,0.6);">
            Vos preuves de réussite sur SenCours
          </p>
        </div>
      </div>

      <div class="container-app py-14">

        @if (isLoading) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="card overflow-hidden">
                <div class="skeleton h-40 rounded-none"></div>
                <div class="p-5 space-y-3">
                  <div class="skeleton h-4 w-3/4"></div>
                  <div class="skeleton h-3 w-1/2"></div>
                  <div class="skeleton h-3 w-1/3"></div>
                  <div class="flex gap-2 mt-4">
                    <div class="skeleton h-9 flex-1"></div>
                    <div class="skeleton h-9 w-24"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (certificates.length === 0) {
          <!-- Empty state -->
          <div class="card py-20 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                 style="background: var(--violet-tint);">
              <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2" style="color: var(--ink);">Aucun certificat pour le moment</h3>
            <p class="text-sm mb-6" style="color: var(--ink-3);">Terminez un cours a 100% pour obtenir votre premier certificat</p>
            <a routerLink="/courses" class="btn btn-primary">Explorer les cours</a>
          </div>
        } @else {
          <!-- Stats banner -->
          <div class="card p-6 mb-10 overflow-hidden" style="background: var(--gradient-brand); border: none;">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                   style="background: rgba(255,255,255,0.15);">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm" style="color: rgba(255,255,255,0.7);">Total des certificats obtenus</p>
                <p class="text-3xl font-bold text-white">{{ certificates.length }}</p>
              </div>
            </div>
          </div>

          <!-- Certificate cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (cert of certificates; track cert.id) {
              <div class="card overflow-hidden cert-card">
                <!-- Thumbnail -->
                <div class="relative h-40 overflow-hidden" style="background: var(--gradient-dark);">
                  @if (cert.courseThumbnail) {
                    <img [src]="cert.courseThumbnail" [alt]="cert.courseTitle"
                         class="w-full h-full object-cover" style="opacity: 0.5;">
                  }
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center text-white">
                      <svg class="w-10 h-10 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                      </svg>
                      <p class="text-sm font-semibold">Certificat obtenu</p>
                    </div>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-5">
                  <h3 class="font-bold text-sm line-clamp-2 leading-snug mb-1" style="color: var(--ink);">{{ cert.courseTitle }}</h3>
                  <p class="text-xs mb-3" style="color: var(--ink-3);">Par {{ cert.instructorName }}</p>

                  <div class="flex items-center gap-4 text-xs mb-4" style="color: var(--ink-4);">
                    <span class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {{ cert.completionDate | date:'dd/MM/yyyy' }}
                    </span>
                    <span class="font-mono text-[10px] px-2 py-0.5" style="background: var(--canvas); border-radius: var(--r-sm);">
                      {{ cert.certificateNumber }}
                    </span>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <button
                      (click)="downloadCertificate(cert)"
                      [disabled]="downloadingId === cert.id"
                      class="btn btn-primary btn-sm flex-1 justify-center">
                      @if (downloadingId === cert.id) {
                        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      } @else {
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      }
                      Telecharger
                    </button>
                    <a [routerLink]="['/courses', cert.courseId]"
                       class="btn btn-secondary btn-sm">
                      Voir le cours
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <style>
        .cert-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .cert-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
      </style>
    </div>
  `
})
export class MyCertificatesComponent implements OnInit {
  private certificateService = inject(CertificateService);

  certificates: Certificate[] = [];
  isLoading = true;
  downloadingId: number | null = null;

  ngOnInit() {
    this.loadCertificates();
  }

  loadCertificates() {
    this.isLoading = true;
    this.certificateService.getMyCertificates().subscribe({
      next: (certs) => {
        this.certificates = certs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  downloadCertificate(cert: Certificate) {
    this.downloadingId = cert.id;

    this.certificateService.downloadCertificate(cert.courseId).subscribe({
      next: (blob) => {
        this.certificateService.downloadBlob(blob, `certificat-${cert.certificateNumber}.pdf`);
        this.downloadingId = null;
      },
      error: () => {
        this.downloadingId = null;
      }
    });
  }
}
