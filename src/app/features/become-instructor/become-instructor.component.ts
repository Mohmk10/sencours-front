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
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- White hero -->
      <div class="bg-white" style="border-bottom: 1px solid var(--border);">
        <div class="container-app py-12">
          <h1 class="text-4xl font-bold leading-tight" style="color: var(--ink);">
            Devenez <span style="text-decoration: underline; text-decoration-color: var(--amber-mid); text-underline-offset: 6px;">instructeur</span>
          </h1>
          <p class="mt-3 text-lg" style="color: var(--ink-3);">
            Partagez votre expertise avec des milliers d'apprenants à travers le Sénégal
          </p>

          <!-- Benefits row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                   style="background: var(--amber-tint);">
                <svg class="w-6 h-6" style="color: var(--amber-mid);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold" style="color: var(--ink);">Revenus réguliers</h3>
                <p class="text-sm mt-1" style="color: var(--ink-3);">Gagnez de l'argent à chaque inscription à vos cours</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                   style="background: var(--violet-tint);">
                <svg class="w-6 h-6" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold" style="color: var(--ink);">Large audience</h3>
                <p class="text-sm mt-1" style="color: var(--ink-3);">Atteignez des milliers d'apprenants motivés</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                   style="background: var(--green-tint);">
                <svg class="w-6 h-6" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold" style="color: var(--ink);">Badge certifié</h3>
                <p class="text-sm mt-1" style="color: var(--ink-3);">Obtenez la reconnaissance d'instructeur expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-app py-12">
        <div class="max-w-2xl mx-auto">

          <!-- States -->
          @if (isCheckingStatus) {
            <div class="card p-8 space-y-4">
              <div class="skeleton h-5 w-1/2"></div>
              <div class="skeleton h-4 w-3/4"></div>
              <div class="skeleton h-4 w-1/2"></div>
            </div>
          } @else if (existingApplication) {

            <!-- PENDING -->
            @if (existingApplication.status === 'PENDING') {
              <div class="card p-10 text-center">
                <!-- Geometric illustration -->
                <div class="w-20 h-20 mx-auto mb-6 relative">
                  <div class="absolute inset-0 rounded-full" style="background: var(--amber-tint);"></div>
                  <div class="absolute inset-3 rounded-full" style="background: var(--amber-tint); opacity: 0.6;"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-9 h-9" style="color: var(--amber-mid);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <h2 class="text-xl font-bold mb-3" style="color: var(--ink);">Candidature en cours d'examen</h2>
                <p class="mb-6 leading-relaxed" style="color: var(--ink-3);">
                  Votre candidature a bien été reçue et est en cours de traitement par notre équipe.
                  Vous recevrez une réponse sous 48–72 heures.
                </p>
                <div class="p-4 text-left mb-5" style="background: var(--canvas); border: 1px solid var(--border); border-radius: var(--r-md);">
                  <p class="text-xs mb-1" style="color: var(--ink-3);">Soumise le</p>
                  <p class="text-sm font-semibold" style="color: var(--ink);">{{ existingApplication.createdAt | date:'dd MMMM yyyy' }}</p>
                </div>
                <span class="badge badge-warning" style="font-size: 12px; padding: 5px 12px;">En attente de validation</span>
              </div>
            }

            <!-- APPROVED -->
            @if (existingApplication.status === 'APPROVED') {
              <div class="card p-10 text-center">
                <div class="w-20 h-20 mx-auto mb-6 relative">
                  <div class="absolute inset-0 rounded-full" style="background: var(--green-tint);"></div>
                  <div class="absolute inset-3 rounded-full" style="background: var(--green-tint); opacity: 0.6;"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-9 h-9" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
                <h2 class="text-xl font-bold mb-3" style="color: var(--ink);">Candidature approuvée !</h2>
                <p class="mb-6 leading-relaxed" style="color: var(--ink-3);">
                  Félicitations ! Vous êtes maintenant instructeur sur SenCours.
                </p>
                @if (existingApplication.adminComment) {
                  <div class="p-4 text-left mb-6" style="background: var(--green-tint); border-radius: var(--r-md);">
                    <p class="text-xs font-semibold mb-1" style="color: var(--green);">Message de l'équipe</p>
                    <p class="text-sm" style="color: var(--green);">{{ existingApplication.adminComment }}</p>
                  </div>
                }
                <a routerLink="/dashboard/instructor" class="btn btn-primary">
                  Accéder à mon espace instructeur
                </a>
              </div>
            }

            <!-- REJECTED -->
            @if (existingApplication.status === 'REJECTED') {
              <div class="card p-10 text-center">
                <div class="w-20 h-20 mx-auto mb-6 relative">
                  <div class="absolute inset-0 rounded-full" style="background: var(--red-tint);"></div>
                  <div class="absolute inset-3 rounded-full" style="background: var(--red-tint); opacity: 0.6;"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-9 h-9" style="color: var(--red);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                </div>
                <h2 class="text-xl font-bold mb-3" style="color: var(--ink);">Candidature non retenue</h2>
                <p class="mb-6 leading-relaxed" style="color: var(--ink-3);">
                  Votre candidature n'a pas été retenue cette fois-ci. Vous pouvez soumettre une nouvelle candidature.
                </p>
                @if (existingApplication.adminComment) {
                  <div class="p-4 text-left mb-6" style="background: var(--red-tint); border-radius: var(--r-md);">
                    <p class="text-xs font-semibold mb-1" style="color: var(--red);">Commentaire</p>
                    <p class="text-sm" style="color: var(--red);">{{ existingApplication.adminComment }}</p>
                  </div>
                }
                <button (click)="existingApplication = null" class="btn btn-primary">
                  Soumettre une nouvelle candidature
                </button>
              </div>
            }

          } @else {

            <!-- Application form card -->
            <div class="card p-8">
              <h2 class="text-xl font-bold mb-1" style="color: var(--ink);">Soumettre ma candidature</h2>
              <p class="text-sm mb-8" style="color: var(--ink-3);">
                Remplissez ce formulaire pour postuler en tant qu'instructeur. Notre équipe examinera votre demande sous 48–72 heures.
              </p>

              @if (successMessage) {
                <div class="alert alert-success mb-6">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ successMessage }}</span>
                </div>
              }

              @if (errorMessage) {
                <div class="alert alert-error mb-6">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ errorMessage }}</span>
                </div>
              }

              <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <div>
                  <label class="label">Motivation <span style="color: #EF4444;">*</span></label>
                  <textarea
                    formControlName="motivation"
                    rows="5"
                    class="input resize-none"
                    [class.input-error]="applicationForm.get('motivation')?.invalid && applicationForm.get('motivation')?.touched"
                    placeholder="Pourquoi souhaitez-vous devenir instructeur ? Quelles sont vos motivations et objectifs ?"></textarea>
                  <div class="flex justify-between mt-1">
                    @if (applicationForm.get('motivation')?.invalid && applicationForm.get('motivation')?.touched) {
                      <p class="text-xs" style="color: #EF4444;">La motivation est requise (minimum 100 caractères)</p>
                    } @else {
                      <span></span>
                    }
                    <span class="text-xs" style="color: var(--ink-4);">
                      {{ applicationForm.get('motivation')?.value?.length || 0 }}/1000
                    </span>
                  </div>
                </div>

                <div>
                  <label class="label">Domaine d'expertise</label>
                  <input
                    type="text"
                    formControlName="expertise"
                    class="input"
                    placeholder="Ex: Développement web, Design graphique, Marketing digital...">
                  <p class="mt-1 text-xs" style="color: var(--ink-4);">Listez vos domaines de compétences principaux</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="label">Profil LinkedIn</label>
                    <input type="url" formControlName="linkedinUrl" class="input" placeholder="https://linkedin.com/in/...">
                  </div>
                  <div>
                    <label class="label">Portfolio / Site web</label>
                    <input type="url" formControlName="portfolioUrl" class="input" placeholder="https://...">
                  </div>
                </div>

                <div class="pt-4" style="border-top: 1px solid var(--border);">
                  <button
                    type="submit"
                    [disabled]="applicationForm.invalid || isSubmitting"
                    class="btn btn-primary w-full"
                    style="padding: 14px 24px; font-size: 15px;">
                    @if (isSubmitting) { Envoi en cours... } @else { Soumettre ma candidature }
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
