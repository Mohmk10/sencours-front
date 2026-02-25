import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Discrete red restriction ribbon -->
      <div class="py-2.5 px-4 text-sm font-medium flex items-center gap-2.5"
           style="background: var(--red-tint); border-bottom: 1px solid rgba(127,29,29,0.15);">
        <svg class="w-4 h-4 flex-shrink-0" style="color: var(--red);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span style="color: var(--red);">Zone restreinte — Accès Super Administrateur uniquement</span>
        <span class="ml-auto badge badge-error">Zone sensible</span>
      </div>

      <!-- Gradient header -->
      <div class="page-header-brand">
        <div class="container-app">
          <p class="text-xs font-bold mb-1.5 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Zone restreinte</p>
          <h1 class="text-2xl font-bold text-white">Panneau Super Admin</h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">Gestion des comptes administrateurs et instructeurs</p>
        </div>
      </div>

      <div class="container-app py-14">

        <!-- Two form cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <!-- Create Admin -->
          <div class="card">
            <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
              <h2 class="font-semibold" style="color: var(--ink);">Créer un administrateur</h2>
              <p class="text-sm mt-0.5" style="color: var(--ink-3);">Les admins peuvent gérer les candidatures instructeurs</p>
            </div>
            <form [formGroup]="adminForm" (ngSubmit)="createAdmin()" class="p-6 space-y-4">
              @if (adminSuccess) {
                <div class="alert alert-success">Administrateur créé avec succès !</div>
              }
              @if (adminError) {
                <div class="alert alert-error">{{ adminError }}</div>
              }
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Prénom</label>
                  <input type="text" formControlName="firstName" class="input" placeholder="Prénom">
                </div>
                <div>
                  <label class="label">Nom</label>
                  <input type="text" formControlName="lastName" class="input" placeholder="Nom">
                </div>
              </div>
              <div>
                <label class="label">Email</label>
                <input type="email" formControlName="email" class="input" placeholder="admin@sencours.sn">
              </div>
              <div>
                <label class="label">Mot de passe</label>
                <input type="password" formControlName="password" class="input" placeholder="Minimum 8 caractères">
              </div>
              <button type="submit" [disabled]="adminForm.invalid || isCreatingAdmin" class="btn btn-primary w-full">
                @if (isCreatingAdmin) { Création... } @else { Créer l'administrateur }
              </button>
            </form>
          </div>

          <!-- Create Instructor -->
          <div class="card">
            <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
              <h2 class="font-semibold" style="color: var(--ink);">Créer un instructeur</h2>
              <p class="text-sm mt-0.5" style="color: var(--ink-3);">Création directe sans passer par une candidature</p>
            </div>
            <form [formGroup]="instructorForm" (ngSubmit)="createInstructor()" class="p-6 space-y-4">
              @if (instructorSuccess) {
                <div class="alert alert-success">Instructeur créé avec succès !</div>
              }
              @if (instructorError) {
                <div class="alert alert-error">{{ instructorError }}</div>
              }
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Prénom</label>
                  <input type="text" formControlName="firstName" class="input" placeholder="Prénom">
                </div>
                <div>
                  <label class="label">Nom</label>
                  <input type="text" formControlName="lastName" class="input" placeholder="Nom">
                </div>
              </div>
              <div>
                <label class="label">Email</label>
                <input type="email" formControlName="email" class="input" placeholder="instructeur@sencours.sn">
              </div>
              <div>
                <label class="label">Mot de passe</label>
                <input type="password" formControlName="password" class="input" placeholder="Minimum 8 caractères">
              </div>
              <button type="submit" [disabled]="instructorForm.invalid || isCreatingInstructor" class="btn btn-primary w-full">
                @if (isCreatingInstructor) { Création... } @else { Créer l'instructeur }
              </button>
            </form>
          </div>
        </div>

        <!-- Admins list -->
        <div class="card">
          <div class="px-6 py-5 flex items-center justify-between" style="border-bottom: 1px solid var(--border);">
            <h2 class="font-semibold" style="color: var(--ink);">Administrateurs existants</h2>
            <button (click)="loadAdmins()" class="btn btn-ghost btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Actualiser
            </button>
          </div>

          @if (isLoadingAdmins) {
            <div class="p-6 space-y-3">
              @for (i of [1,2,3]; track i) {
                <div class="flex items-center gap-3">
                  <div class="skeleton w-10 h-10 rounded-full"></div>
                  <div class="skeleton h-4 w-48"></div>
                </div>
              }
            </div>
          } @else if (admins.length === 0) {
            <div class="p-10 text-center text-sm" style="color: var(--ink-3);">
              Aucun administrateur trouvé
            </div>
          } @else {
            <div>
              @for (admin of admins; track admin.id) {
                <div class="px-6 py-4 flex items-center justify-between"
                     style="border-bottom: 1px solid var(--border);" class="last:border-b-0">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                         style="background: var(--amber);">
                      {{ admin.firstName?.charAt(0) }}{{ admin.lastName?.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium" style="color: var(--ink);">{{ admin.firstName }} {{ admin.lastName }}</p>
                      <p class="text-sm" style="color: var(--ink-3);">{{ admin.email }}</p>
                    </div>
                  </div>
                  <button (click)="deleteAdmin(admin)" class="btn btn-ghost btn-sm" style="color: #EF4444;">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Warning -->
        <div class="mt-8 p-6 flex items-start gap-4"
             style="background: var(--red-tint); border: 1px solid rgba(127,29,29,0.2); border-radius: var(--r-lg);">
          <svg class="w-6 h-6 flex-shrink-0 mt-0.5" style="color: var(--red);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <p class="font-semibold" style="color: var(--red);">Zone sensible</p>
            <p class="text-sm mt-1" style="color: var(--red); opacity: 0.85;">
              Les actions effectuées ici sont critiques et peuvent affecter le fonctionnement de la plateforme.
              Le compte Super Admin ne peut être modifié que directement en base de données.
            </p>
          </div>
        </div>

        <!-- Reset Database Section -->
        <div class="card mt-8 border-2 border-[#C4302B]">
          <div class="p-6 border-b border-[#E4E8EB] bg-[#FEECEB]">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-[#C4302B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <h2 class="font-bold text-[#C4302B]">Réinitialisation complète</h2>
                <p class="text-sm text-[#C4302B]">Cette action supprimera TOUTES les données sauf votre compte SuperAdmin</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <p class="text-sm text-[#6A6F73] mb-4">
              Pour confirmer, tapez <strong>RESET</strong> dans le champ ci-dessous :
            </p>

            <div class="flex gap-4">
              <input
                type="text"
                [(ngModel)]="resetConfirmation"
                class="input flex-1"
                placeholder="Tapez RESET pour confirmer"
                [class.border-[#C4302B]]="resetConfirmation && resetConfirmation !== 'RESET'">

              <button
                (click)="resetDatabase()"
                [disabled]="resetConfirmation !== 'RESET' || isResetting"
                class="btn bg-[#C4302B] text-white hover:bg-[#A32820] disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isResetting) {
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Réinitialisation...
                } @else {
                  Réinitialiser la base de données
                }
              </button>
            </div>

            @if (resetSuccess) {
              <div class="alert alert-success mt-4">
                Base de données réinitialisée avec succès !
              </div>
            }

            @if (resetError) {
              <div class="alert alert-error mt-4">
                {{ resetError }}
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class SuperAdminDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private superAdminService = inject(SuperAdminService);

  adminForm: FormGroup;
  instructorForm: FormGroup;
  admins: User[] = [];

  isCreatingAdmin = false;
  isCreatingInstructor = false;
  isLoadingAdmins = true;

  adminSuccess = false;
  adminError = '';
  instructorSuccess = false;
  instructorError = '';

  resetConfirmation = '';
  isResetting = false;
  resetSuccess = false;
  resetError = '';

  constructor() {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.instructorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoadingAdmins = true;
    this.superAdminService.getAllAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
        this.isLoadingAdmins = false;
      },
      error: () => this.isLoadingAdmins = false
    });
  }

  createAdmin() {
    if (this.adminForm.invalid) return;

    this.isCreatingAdmin = true;
    this.adminSuccess = false;
    this.adminError = '';

    this.superAdminService.createAdmin(this.adminForm.value).subscribe({
      next: () => {
        this.isCreatingAdmin = false;
        this.adminSuccess = true;
        this.adminForm.reset();
        this.loadAdmins();
        setTimeout(() => this.adminSuccess = false, 3000);
      },
      error: (err) => {
        this.isCreatingAdmin = false;
        this.adminError = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  createInstructor() {
    if (this.instructorForm.invalid) return;

    this.isCreatingInstructor = true;
    this.instructorSuccess = false;
    this.instructorError = '';

    this.superAdminService.createInstructor(this.instructorForm.value).subscribe({
      next: () => {
        this.isCreatingInstructor = false;
        this.instructorSuccess = true;
        this.instructorForm.reset();
        setTimeout(() => this.instructorSuccess = false, 3000);
      },
      error: (err) => {
        this.isCreatingInstructor = false;
        this.instructorError = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  deleteAdmin(admin: User) {
    if (!confirm(`Supprimer l'administrateur ${admin.firstName} ${admin.lastName} ?`)) return;

    this.superAdminService.deleteAdmin(admin.id).subscribe({
      next: () => this.loadAdmins(),
      error: (err) => alert(err.error?.message || 'Erreur lors de la suppression')
    });
  }

  resetDatabase() {
    if (this.resetConfirmation !== 'RESET') return;

    if (!confirm('⚠️ ATTENTION ⚠️\n\nCette action va SUPPRIMER DÉFINITIVEMENT :\n- Tous les utilisateurs (sauf vous)\n- Toutes les catégories\n- Tous les cours\n- Toutes les sections et leçons\n- Toutes les inscriptions\n- Toutes les reviews\n\nÊtes-vous ABSOLUMENT sûr ?')) {
      return;
    }

    this.isResetting = true;
    this.resetSuccess = false;
    this.resetError = '';

    this.superAdminService.resetDatabase(this.resetConfirmation).subscribe({
      next: (response) => {
        this.isResetting = false;
        this.resetSuccess = true;
        this.resetConfirmation = '';
        this.loadAdmins();
      },
      error: (err) => {
        this.isResetting = false;
        this.resetError = err.error?.message || 'Erreur lors de la réinitialisation';
      }
    });
  }
}
