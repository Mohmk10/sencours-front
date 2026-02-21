import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstructorApplicationService, InstructorApplication } from '../../core/services/instructor-application.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-become-instructor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#1C1D1F] py-12">
        <div class="container-app">
          <h1 class="text-3xl font-bold text-white">Devenir instructeur</h1>
          <p class="mt-2 text-[#A1A1A1]">Partagez votre expertise avec des milliers d'apprenants</p>
        </div>
      </div>

      <div class="container-app py-12">
        <div class="max-w-2xl mx-auto">

          <!-- Existing application states -->
          @if (isCheckingStatus) {
            <div class="card p-8">
              <div class="space-y-4">
                <div class="skeleton h-6 w-1/2"></div>
                <div class="skeleton h-4 w-3/4"></div>
                <div class="skeleton h-4 w-1/2"></div>
              </div>
            </div>
          } @else if (existingApplication) {

            @if (existingApplication.status === 'PENDING') {
              <div class="card p-8 text-center">
                <div class="w-16 h-16 bg-[#FFF7E6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-[#B4690E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-[#1C1D1F] mb-2">Candidature en cours d'examen</h2>
                <p class="text-[#6A6F73] mb-6">
                  Votre candidature a bien été reçue et est en cours de traitement par notre équipe.
                  Vous recevrez une réponse sous 48-72 heures.
                </p>
                <div class="bg-[#F7F9FA] rounded border border-[#E4E8EB] p-4 text-left">
                  <p class="text-xs text-[#6A6F73] mb-1">Soumise le</p>
                  <p class="text-sm font-medium text-[#1C1D1F]">{{ existingApplication.createdAt | date:'dd MMMM yyyy' }}</p>
                </div>
                <span class="badge badge-warning mt-4 inline-block">En attente</span>
              </div>
            }

            @if (existingApplication.status === 'APPROVED') {
              <div class="card p-8 text-center">
                <div class="w-16 h-16 bg-[#E6F4F1] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-[#1E6B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-[#1C1D1F] mb-2">Candidature approuvée !</h2>
                <p class="text-[#6A6F73] mb-6">
                  Félicitations ! Votre candidature a été approuvée. Vous êtes maintenant instructeur sur SenCours.
                </p>
                @if (existingApplication.adminComment) {
                  <div class="bg-[#F0FDF9] border border-[#1E6B55] border-opacity-20 rounded p-4 text-left mb-6">
                    <p class="text-xs text-[#6A6F73] mb-1">Message de l'équipe</p>
                    <p class="text-sm text-[#1C1D1F]">{{ existingApplication.adminComment }}</p>
                  </div>
                }
                <a routerLink="/dashboard/instructor" class="btn btn-primary">
                  Accéder à mon espace instructeur
                </a>
              </div>
            }

            @if (existingApplication.status === 'REJECTED') {
              <div class="card p-8 text-center">
                <div class="w-16 h-16 bg-[#FEECEB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-[#C4302B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-[#1C1D1F] mb-2">Candidature non retenue</h2>
                <p class="text-[#6A6F73] mb-6">
                  Votre candidature n'a pas été retenue cette fois-ci. Vous pouvez soumettre une nouvelle candidature.
                </p>
                @if (existingApplication.adminComment) {
                  <div class="bg-[#FFF5F5] border border-[#C4302B] border-opacity-20 rounded p-4 text-left mb-6">
                    <p class="text-xs text-[#6A6F73] mb-1">Commentaire</p>
                    <p class="text-sm text-[#1C1D1F]">{{ existingApplication.adminComment }}</p>
                  </div>
                }
                <button (click)="existingApplication = null" class="btn btn-primary">
                  Soumettre une nouvelle candidature
                </button>
              </div>
            }

          } @else {

            <!-- Benefits section -->
            <div class="card p-8 mb-8">
              <h2 class="text-xl font-bold text-[#1C1D1F] mb-6">Pourquoi devenir instructeur ?</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="w-12 h-12 bg-[#F3EFFC] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-[#1C1D1F] text-sm">Revenus réguliers</h3>
                  <p class="text-xs text-[#6A6F73] mt-1">Gagnez de l'argent à chaque inscription</p>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 bg-[#F3EFFC] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-[#1C1D1F] text-sm">Large audience</h3>
                  <p class="text-xs text-[#6A6F73] mt-1">Atteignez des milliers d'apprenants</p>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 bg-[#F3EFFC] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                  </div>
                  <h3 class="font-semibold text-[#1C1D1F] text-sm">Reconnaissance</h3>
                  <p class="text-xs text-[#6A6F73] mt-1">Badge instructeur certifié</p>
                </div>
              </div>
            </div>

            <!-- Application form -->
            <div class="card p-8">
              <h2 class="text-xl font-bold text-[#1C1D1F] mb-2">Soumettre ma candidature</h2>
              <p class="text-[#6A6F73] text-sm mb-8">Remplissez ce formulaire pour postuler en tant qu'instructeur. Notre équipe examinera votre demande sous 48-72 heures.</p>

              @if (successMessage) {
                <div class="alert alert-success mb-6">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ successMessage }}</span>
                </div>
              }

              @if (errorMessage) {
                <div class="alert alert-error mb-6">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ errorMessage }}</span>
                </div>
              }

              <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <div>
                  <label class="label">Motivation <span class="text-[#C4302B]">*</span></label>
                  <textarea
                    formControlName="motivation"
                    rows="5"
                    class="input resize-none"
                    [class.input-error]="applicationForm.get('motivation')?.invalid && applicationForm.get('motivation')?.touched"
                    placeholder="Pourquoi souhaitez-vous devenir instructeur ? Quelles sont vos motivations et objectifs ?"></textarea>
                  <div class="flex justify-between mt-1">
                    @if (applicationForm.get('motivation')?.invalid && applicationForm.get('motivation')?.touched) {
                      <p class="text-sm text-[#C4302B]">La motivation est requise (minimum 100 caractères)</p>
                    } @else {
                      <span></span>
                    }
                    <span class="text-xs text-[#6A6F73]">{{ applicationForm.get('motivation')?.value?.length || 0 }}/1000</span>
                  </div>
                </div>

                <div>
                  <label class="label">Domaine d'expertise</label>
                  <input
                    type="text"
                    formControlName="expertise"
                    class="input"
                    placeholder="Ex: Développement web, Design graphique, Marketing digital...">
                  <p class="mt-1 text-xs text-[#6A6F73]">Listez vos domaines de compétences principaux</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label class="label">Profil LinkedIn</label>
                    <input
                      type="url"
                      formControlName="linkedinUrl"
                      class="input"
                      placeholder="https://linkedin.com/in/...">
                  </div>
                  <div>
                    <label class="label">Portfolio / Site web</label>
                    <input
                      type="url"
                      formControlName="portfolioUrl"
                      class="input"
                      placeholder="https://...">
                  </div>
                </div>

                <div class="pt-4 border-t border-[#E4E8EB]">
                  <button
                    type="submit"
                    [disabled]="applicationForm.invalid || isSubmitting"
                    class="btn btn-primary btn-lg w-full">
                    @if (isSubmitting) {
                      Envoi en cours...
                    } @else {
                      Soumettre ma candidature
                    }
                  </button>
                </div>
              </form>
            </div>

          }
        </div>
      </div>
    </div>
  `
})
export class BecomeInstructorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private applicationService = inject(InstructorApplicationService);
  private authService = inject(AuthService);

  applicationForm: FormGroup;
  existingApplication: InstructorApplication | null = null;
  isCheckingStatus = true;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.applicationForm = this.fb.group({
      motivation: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(1000)]],
      expertise: [''],
      linkedinUrl: [''],
      portfolioUrl: ['']
    });
  }

  ngOnInit() {
    this.checkExistingApplication();
  }

  checkExistingApplication() {
    this.applicationService.getMyApplication().subscribe({
      next: (application) => {
        this.existingApplication = application;
        this.isCheckingStatus = false;
      },
      error: () => {
        this.existingApplication = null;
        this.isCheckingStatus = false;
      }
    });
  }

  onSubmit() {
    if (this.applicationForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const { motivation, expertise, linkedinUrl, portfolioUrl } = this.applicationForm.value;
    const request = {
      motivation,
      ...(expertise && { expertise }),
      ...(linkedinUrl && { linkedinUrl }),
      ...(portfolioUrl && { portfolioUrl })
    };

    this.applicationService.createApplication(request).subscribe({
      next: (application) => {
        this.existingApplication = application;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}
