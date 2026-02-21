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
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#1C1D1F] py-10">
        <div class="container-app">
          <h1 class="text-2xl font-bold text-white">Candidatures instructeurs</h1>
          <p class="mt-1 text-[#A1A1A1]">Gérez les demandes de devenir instructeur</p>
        </div>
      </div>

      <div class="container-app py-8">
        <!-- Filters -->
        <div class="card p-4 mb-6">
          <div class="flex flex-wrap gap-2">
            @for (filter of statusFilters; track filter.value) {
              <button
                (click)="onStatusFilter(filter.value)"
                [class.bg-[#1C1D1F]]="selectedStatus === filter.value"
                [class.text-white]="selectedStatus === filter.value"
                class="px-4 py-2 text-sm font-medium rounded border border-[#E4E8EB] hover:border-[#1C1D1F] transition-colors">
                {{ filter.label }}
                @if (filter.value === 'PENDING' && pendingCount > 0) {
                  <span class="ml-1.5 badge badge-error text-xs">{{ pendingCount }}</span>
                }
              </button>
            }
          </div>
        </div>

        <!-- Review modal -->
        @if (reviewingApplication) {
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded shadow-xl max-w-lg w-full p-6">
              <h3 class="text-lg font-bold text-[#1C1D1F] mb-1">Examiner la candidature</h3>
              <p class="text-sm text-[#6A6F73] mb-6">{{ reviewingApplication.userFullName }}</p>

              <div class="mb-6">
                <label class="label">Commentaire (optionnel)</label>
                <textarea
                  [(ngModel)]="reviewComment"
                  rows="3"
                  class="input resize-none"
                  placeholder="Message pour le candidat..."></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  (click)="submitReview(true)"
                  [disabled]="isReviewing"
                  class="btn flex-1 bg-[#1E6B55] hover:bg-[#1a5e4a] text-white font-semibold py-2.5 px-4 rounded transition-colors">
                  Approuver
                </button>
                <button
                  (click)="submitReview(false)"
                  [disabled]="isReviewing"
                  class="btn flex-1 bg-[#C4302B] hover:bg-[#a82824] text-white font-semibold py-2.5 px-4 rounded transition-colors">
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

        <!-- Table -->
        <div class="card overflow-hidden">
          @if (isLoading) {
            <div class="p-6 space-y-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="flex items-center gap-4">
                  <div class="skeleton w-10 h-10 rounded-full flex-shrink-0"></div>
                  <div class="flex-1 space-y-2">
                    <div class="skeleton h-4 w-1/3"></div>
                    <div class="skeleton h-3 w-1/4"></div>
                  </div>
                  <div class="skeleton h-6 w-20"></div>
                  <div class="skeleton h-8 w-24"></div>
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
                @if (selectedStatus) {
                  Aucune candidature avec le statut sélectionné
                } @else {
                  Aucune candidature reçue pour le moment
                }
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
                          <div class="w-9 h-9 rounded-full bg-[#F3EFFC] flex items-center justify-center flex-shrink-0">
                            <span class="text-sm font-semibold text-[#5624D0]">
                              {{ getInitials(application.userFullName) }}
                            </span>
                          </div>
                          <div class="min-w-0">
                            <p class="font-medium text-[#1C1D1F] truncate">{{ application.userFullName }}</p>
                            <p class="text-xs text-[#6A6F73] truncate">{{ application.userEmail }}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p class="text-sm text-[#1C1D1F] truncate max-w-[200px]">
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
                        <span class="text-sm text-[#6A6F73]">{{ application.createdAt | date:'dd/MM/yyyy' }}</span>
                      </td>
                      <td>
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="viewDetails(application)"
                            class="btn btn-ghost btn-sm"
                            title="Voir les détails">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          @if (application.status === 'PENDING') {
                            <button
                              (click)="openReviewModal(application)"
                              class="btn btn-sm bg-[#5624D0] text-white hover:bg-[#4a1fb8] transition-colors px-3 py-1.5 rounded text-xs font-medium">
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
              <div class="flex items-center justify-between px-6 py-4 border-t border-[#E4E8EB]">
                <p class="text-sm text-[#6A6F73]">
                  {{ pageResponse.totalElements }} candidature{{ pageResponse.totalElements > 1 ? 's' : '' }}
                </p>
                <div class="flex gap-2">
                  <button
                    (click)="onPageChange(currentPage - 1)"
                    [disabled]="currentPage === 0"
                    class="btn btn-ghost btn-sm">
                    Précédent
                  </button>
                  <span class="flex items-center text-sm text-[#6A6F73] px-2">
                    Page {{ currentPage + 1 }} / {{ pageResponse.totalPages }}
                  </span>
                  <button
                    (click)="onPageChange(currentPage + 1)"
                    [disabled]="currentPage >= pageResponse.totalPages - 1"
                    class="btn btn-ghost btn-sm">
                    Suivant
                  </button>
                </div>
              </div>
            }
          }
        </div>

        <!-- Detail modal -->
        @if (selectedApplication) {
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div class="flex items-center justify-between p-6 border-b border-[#E4E8EB]">
                <div>
                  <h3 class="text-lg font-bold text-[#1C1D1F]">{{ selectedApplication.userFullName }}</h3>
                  <p class="text-sm text-[#6A6F73]">{{ selectedApplication.userEmail }}</p>
                </div>
                <button (click)="selectedApplication = null" class="btn btn-ghost btn-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="p-6 space-y-5">
                <div>
                  <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Motivation</p>
                  <p class="text-sm text-[#1C1D1F] leading-relaxed">{{ selectedApplication.motivation }}</p>
                </div>
                @if (selectedApplication.expertise) {
                  <div>
                    <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Expertise</p>
                    <p class="text-sm text-[#1C1D1F]">{{ selectedApplication.expertise }}</p>
                  </div>
                }
                @if (selectedApplication.linkedinUrl) {
                  <div>
                    <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">LinkedIn</p>
                    <a [href]="selectedApplication.linkedinUrl" target="_blank" class="link text-sm">{{ selectedApplication.linkedinUrl }}</a>
                  </div>
                }
                @if (selectedApplication.portfolioUrl) {
                  <div>
                    <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Portfolio</p>
                    <a [href]="selectedApplication.portfolioUrl" target="_blank" class="link text-sm">{{ selectedApplication.portfolioUrl }}</a>
                  </div>
                }
                @if (selectedApplication.adminComment) {
                  <div>
                    <p class="text-xs font-semibold text-[#6A6F73] uppercase tracking-wide mb-2">Commentaire admin</p>
                    <p class="text-sm text-[#1C1D1F]">{{ selectedApplication.adminComment }}</p>
                    <p class="text-xs text-[#6A6F73] mt-1">Par {{ selectedApplication.reviewedByName }} — {{ selectedApplication.reviewedAt | date:'dd/MM/yyyy' }}</p>
                  </div>
                }

                <div class="pt-4 border-t border-[#E4E8EB] flex items-center justify-between">
                  <span class="badge" [ngClass]="{
                    'badge-warning': selectedApplication.status === 'PENDING',
                    'badge-success': selectedApplication.status === 'APPROVED',
                    'badge-error': selectedApplication.status === 'REJECTED'
                  }">{{ getStatusLabel(selectedApplication.status) }}</span>
                  @if (selectedApplication.status === 'PENDING') {
                    <button
                      (click)="openReviewModal(selectedApplication); selectedApplication = null"
                      class="btn btn-primary btn-sm">
                      Examiner cette candidature
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
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
