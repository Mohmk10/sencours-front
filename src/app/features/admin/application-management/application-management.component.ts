import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstructorApplicationService, InstructorApplication } from '../../../core/services/instructor-application.service';
import { PageResponse } from '../../../core/models';

@Component({
  selector: 'app-application-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="px-8 py-5" style="border-bottom: 1px solid var(--border);">
        <h1 class="text-base font-semibold" style="color: var(--ink);">Candidatures instructeurs</h1>
      </div>
      <div class="p-8">

      <!-- Status filter pills -->
      <div class="flex flex-wrap gap-2.5 mb-8">
        @for (filter of statusFilters; track filter.value) {
          <button
            (click)="onStatusFilter(filter.value)"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors"
            style="border-radius: var(--r-full);"
            [style.background]="selectedStatus === filter.value ? 'var(--violet)' : 'white'"
            [style.color]="selectedStatus === filter.value ? 'white' : 'var(--ink-2)'"
            [style.border]="selectedStatus === filter.value ? '1px solid var(--violet)' : '1px solid var(--border-2)'">
            {{ filter.label }}
            @if (filter.value === 'PENDING' && pendingCount > 0) {
              <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                    [style.background]="selectedStatus === 'PENDING' ? 'rgba(255,255,255,0.25)' : '#EF4444'"
                    [style.color]="'white'">
                {{ pendingCount }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Review modal -->
      @if (reviewingApplication) {
        <div class="fixed inset-0 flex items-center justify-center z-50 p-4"
             style="background: rgba(13,11,32,0.6);">
          <div class="bg-white w-full max-w-md"
               style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);">
            <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
              <h3 class="text-base font-bold" style="color: var(--ink);">Examiner la candidature</h3>
              <p class="text-sm mt-0.5" style="color: var(--ink-3);">{{ reviewingApplication.userFullName }}</p>
            </div>
            <div class="p-6">
              <label class="label">Commentaire (optionnel)</label>
              <textarea
                [(ngModel)]="reviewComment"
                rows="3"
                class="input resize-none"
                placeholder="Message pour le candidat..."></textarea>
            </div>
            <div class="px-6 pb-6 flex gap-3">
              <button
                (click)="submitReview(true)"
                [disabled]="isReviewing"
                class="flex-1 py-2.5 px-4 font-semibold text-sm text-white transition-colors disabled:opacity-50"
                style="background: var(--green); border-radius: var(--r-sm);"
                onmouseenter="this.style.opacity='0.9'"
                onmouseleave="this.style.opacity='1'">
                Approuver
              </button>
              <button
                (click)="submitReview(false)"
                [disabled]="isReviewing"
                class="flex-1 py-2.5 px-4 font-semibold text-sm text-white transition-colors disabled:opacity-50"
                style="background: #EF4444; border-radius: var(--r-sm);"
                onmouseenter="this.style.opacity='0.9'"
                onmouseleave="this.style.opacity='1'">
                Rejeter
              </button>
              <button
                (click)="closeReviewModal()"
                [disabled]="isReviewing"
                class="btn btn-ghost px-4">
                Annuler
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Content -->
      @if (isLoading) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="flex items-center gap-4 p-3">
              <div class="skeleton w-9 h-9 rounded-full flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-1/3"></div>
                <div class="skeleton h-3 w-1/4"></div>
              </div>
              <div class="skeleton h-5 w-20 rounded-full"></div>
              <div class="skeleton h-8 w-24 rounded-md"></div>
            </div>
          }
        </div>
      } @else if (!pageResponse?.content?.length) {
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="empty-state-title">Aucune candidature</h3>
          <p class="empty-state-description">
            @if (selectedStatus) { Aucune candidature avec ce statut }
            @else { Aucune candidature reçue pour le moment }
          </p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Expertise</th>
                <th>Statut</th>
                <th>Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (application of pageResponse?.content; track application.id) {
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                           style="background: var(--violet-tint);">
                        <span class="text-sm font-bold" style="color: var(--violet);">
                          {{ getInitials(application.userFullName) }}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-medium truncate" style="color: var(--ink);">{{ application.userFullName }}</p>
                        <p class="text-xs truncate" style="color: var(--ink-3);">{{ application.userEmail }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm truncate max-w-[180px]" style="color: var(--ink-2);">
                      {{ application.expertise || '—' }}
                    </p>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-warning': application.status === 'PENDING',
                      'badge-success': application.status === 'APPROVED',
                      'badge-error': application.status === 'REJECTED'
                    }">{{ getStatusLabel(application.status) }}</span>
                  </td>
                  <td>
                    <span class="text-sm" style="color: var(--ink-3);">{{ application.createdAt | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td>
                    <div class="flex items-center justify-end gap-1">
                      <button (click)="viewDetails(application)" class="btn btn-ghost btn-sm" title="Voir les détails">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      @if (application.status === 'PENDING') {
                        <button
                          (click)="openReviewModal(application)"
                          class="btn btn-primary btn-sm">
                          Examiner
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (pageResponse && pageResponse.totalPages > 1) {
          <div class="flex items-center justify-between mt-8">
            <p class="text-sm" style="color: var(--ink-3);">
              {{ pageResponse.totalElements }} candidature{{ pageResponse.totalElements > 1 ? 's' : '' }}
            </p>
            <div class="flex gap-1">
              <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-ghost btn-sm">Précédent</button>
              <span class="flex items-center text-sm px-3" style="color: var(--ink-3);">
                {{ currentPage + 1 }} / {{ pageResponse.totalPages }}
              </span>
              <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage >= pageResponse.totalPages - 1" class="btn btn-ghost btn-sm">Suivant</button>
            </div>
          </div>
        }
      }
      </div>
    </div>

    <!-- Detail modal -->
    @if (selectedApplication) {
      <div class="fixed inset-0 flex items-center justify-center z-50 p-4"
           style="background: rgba(13,11,32,0.6);">
        <div class="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto"
             style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);">
          <div class="flex items-center justify-between px-6 py-5"
               style="border-bottom: 1px solid var(--border);">
            <div>
              <h3 class="text-base font-bold" style="color: var(--ink);">{{ selectedApplication.userFullName }}</h3>
              <p class="text-sm" style="color: var(--ink-3);">{{ selectedApplication.userEmail }}</p>
            </div>
            <button (click)="selectedApplication = null" class="btn btn-ghost btn-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-3);">Motivation</p>
              <p class="text-sm leading-relaxed" style="color: var(--ink-2);">{{ selectedApplication.motivation }}</p>
            </div>
            @if (selectedApplication.expertise) {
              <div>
                <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-3);">Expertise</p>
                <p class="text-sm" style="color: var(--ink-2);">{{ selectedApplication.expertise }}</p>
              </div>
            }
            @if (selectedApplication.linkedinUrl) {
              <div>
                <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-3);">LinkedIn</p>
                <a [href]="selectedApplication.linkedinUrl" target="_blank" class="link text-sm">{{ selectedApplication.linkedinUrl }}</a>
              </div>
            }
            @if (selectedApplication.portfolioUrl) {
              <div>
                <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-3);">Portfolio</p>
                <a [href]="selectedApplication.portfolioUrl" target="_blank" class="link text-sm">{{ selectedApplication.portfolioUrl }}</a>
              </div>
            }
            @if (selectedApplication.adminComment) {
              <div>
                <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--ink-3);">Commentaire admin</p>
                <p class="text-sm" style="color: var(--ink-2);">{{ selectedApplication.adminComment }}</p>
                <p class="text-xs mt-1" style="color: var(--ink-4);">Par {{ selectedApplication.reviewedByName }} — {{ selectedApplication.reviewedAt | date:'dd/MM/yyyy' }}</p>
              </div>
            }
            <div class="pt-4 flex items-center justify-between" style="border-top: 1px solid var(--border);">
              <span class="badge" [ngClass]="{
                'badge-warning': selectedApplication.status === 'PENDING',
                'badge-success': selectedApplication.status === 'APPROVED',
                'badge-error': selectedApplication.status === 'REJECTED'
              }">{{ getStatusLabel(selectedApplication.status) }}</span>
              @if (selectedApplication.status === 'PENDING') {
                <button (click)="openReviewModal(selectedApplication); selectedApplication = null"
                        class="btn btn-primary btn-sm">
                  Examiner
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ApplicationManagementComponent implements OnInit {
  private applicationService = inject(InstructorApplicationService);

  pageResponse: PageResponse<InstructorApplication> | null = null;
  isLoading = true;
  currentPage = 0;
  selectedStatus = 'PENDING';
  pendingCount = 0;

  reviewingApplication: InstructorApplication | null = null;
  selectedApplication: InstructorApplication | null = null;
  reviewComment = '';
  isReviewing = false;

  statusFilters = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvées', value: 'APPROVED' },
    { label: 'Rejetées', value: 'REJECTED' },
    { label: 'Toutes', value: '' }
  ];

  ngOnInit() {
    this.loadPendingCount();
    this.loadApplications();
  }

  loadPendingCount() {
    this.applicationService.getPendingCount().subscribe({
      next: (count) => this.pendingCount = count
    });
  }

  loadApplications() {
    this.isLoading = true;
    this.applicationService.getAllApplications(this.currentPage, 10, this.selectedStatus || undefined).subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onStatusFilter(status: string) {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadApplications();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadApplications();
  }

  viewDetails(application: InstructorApplication) {
    this.selectedApplication = application;
  }

  openReviewModal(application: InstructorApplication) {
    this.reviewingApplication = application;
    this.reviewComment = '';
  }

  closeReviewModal() {
    this.reviewingApplication = null;
    this.reviewComment = '';
  }

  submitReview(approved: boolean) {
    if (!this.reviewingApplication) return;
    this.isReviewing = true;

    this.applicationService.reviewApplication(this.reviewingApplication.id, {
      approved,
      comment: this.reviewComment || undefined
    }).subscribe({
      next: () => {
        this.isReviewing = false;
        this.closeReviewModal();
        this.loadPendingCount();
        this.loadApplications();
      },
      error: () => {
        this.isReviewing = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
      default: return status;
    }
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
