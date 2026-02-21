import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#C4302B] py-10">
        <div class="container-app">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div>
              <h1 class="text-2xl font-bold text-white">Panneau Super Admin</h1>
              <p class="text-red-200 text-sm">Accès restreint - Actions sensibles</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container-app py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- Create Admin Form -->
          <div class="card">
            <div class="p-6 border-b border-[#E4E8EB]">
              <h2 class="font-semibold text-[#1C1D1F]">Créer un administrateur</h2>
              <p class="text-sm text-[#6A6F73] mt-1">Les admins peuvent gérer les candidatures instructeurs</p>
            </div>

            <form [formGroup]="adminForm" (ngSubmit)="createAdmin()" class="p-6 space-y-4">
              @if (adminSuccess) {
                <div class="alert alert-success">Administrateur créé avec succès !</div>
              }
              @if (adminError) {
                <div class="alert alert-error">{{ adminError }}</div>
              }

              <div class="grid grid-cols-2 gap-4">
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

          <!-- Create Instructor Form -->
          <div class="card">
            <div class="p-6 border-b border-[#E4E8EB]">
              <h2 class="font-semibold text-[#1C1D1F]">Créer un instructeur</h2>
              <p class="text-sm text-[#6A6F73] mt-1">Création directe sans passer par une candidature</p>
            </div>

            <form [formGroup]="instructorForm" (ngSubmit)="createInstructor()" class="p-6 space-y-4">
              @if (instructorSuccess) {
                <div class="alert alert-success">Instructeur créé avec succès !</div>
              }
              @if (instructorError) {
                <div class="alert alert-error">{{ instructorError }}</div>
              }

              <div class="grid grid-cols-2 gap-4">
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

        <!-- Admin List -->
        <div class="card mt-8">
          <div class="p-6 border-b border-[#E4E8EB] flex items-center justify-between">
            <h2 class="font-semibold text-[#1C1D1F]">Administrateurs existants</h2>
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
            <div class="p-12 text-center text-[#6A6F73]">
              Aucun administrateur trouvé
            </div>
          } @else {
            <div class="divide-y divide-[#E4E8EB]">
              @for (admin of admins; track admin.id) {
                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#B4690E] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {{ admin.firstName?.charAt(0) }}{{ admin.lastName?.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium text-[#1C1D1F]">{{ admin.firstName }} {{ admin.lastName }}</p>
                      <p class="text-sm text-[#6A6F73]">{{ admin.email }}</p>
                    </div>
                  </div>
                  <button (click)="deleteAdmin(admin)" class="btn btn-ghost btn-sm text-[#C4302B]">
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
        <div class="mt-8 p-4 bg-[#FEECEB] border border-[#C4302B] rounded">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-[#C4302B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="font-semibold text-[#C4302B]">Zone sensible</p>
              <p class="text-sm text-[#C4302B] mt-1">
                Les actions effectuées ici sont critiques et peuvent affecter le fonctionnement de la plateforme.
                Le compte Super Admin ne peut être modifié que directement en base de données.
              </p>
            </div>
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
}
