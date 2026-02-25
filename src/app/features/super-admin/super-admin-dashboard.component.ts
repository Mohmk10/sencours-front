import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
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

        <!-- Section Gestion des Utilisateurs -->
        <div class="card mt-8">
          <div class="p-6 border-b border-[#E4E8EB]">
            <h2 class="text-xl font-bold text-[#1C1D1F]">Gestion de tous les utilisateurs</h2>
            <p class="text-sm text-[#6A6F73] mt-1">Gérez les comptes de tous les utilisateurs de la plateforme</p>
          </div>

          <div class="p-6">
            <!-- Filtres -->
            <div class="flex flex-col md:flex-row gap-4 mb-6">
              <div class="flex-1">
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="filterUsers()"
                    placeholder="Rechercher par nom ou email..."
                    class="input pl-12 w-full">
                </div>
              </div>
              <select
                [(ngModel)]="roleFilter"
                (ngModelChange)="filterUsers()"
                class="input w-full md:w-48">
                <option value="">Tous les rôles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTEUR">Instructeur</option>
                <option value="ETUDIANT">Étudiant</option>
              </select>
            </div>

            @if (isLoadingUsers) {
              <div class="space-y-3">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="flex items-center gap-4 p-3">
                    <div class="skeleton w-10 h-10 rounded-full flex-shrink-0"></div>
                    <div class="flex-1 space-y-2">
                      <div class="skeleton h-4 w-1/3"></div>
                      <div class="skeleton h-3 w-1/4"></div>
                    </div>
                    <div class="skeleton h-5 w-16 rounded-full"></div>
                  </div>
                }
              </div>
            } @else {
              <!-- Tableau -->
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-[#E4E8EB]">
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Utilisateur</th>
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Email</th>
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Rôle</th>
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Statut</th>
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Inscrit le</th>
                      <th class="text-left py-3 px-4 text-xs font-semibold text-[#6A6F73] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of filteredUsers; track user.id) {
                      <tr class="border-b border-[#E4E8EB] hover:bg-[#F7F9FA] transition-colors">
                        <!-- Avatar + Nom -->
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                 [style.background-color]="getAvatarColor(user.role)">
                              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                            </div>
                            <span class="font-medium text-[#1C1D1F]">{{ user.firstName }} {{ user.lastName }}</span>
                          </div>
                        </td>

                        <!-- Email -->
                        <td class="py-4 px-4 text-[#6A6F73]">{{ user.email }}</td>

                        <!-- Rôle Badge -->
                        <td class="py-4 px-4">
                          <span class="px-2 py-1 rounded text-xs font-semibold"
                                [ngClass]="getRoleBadgeClass(user.role)">
                            {{ formatRole(user.role) }}
                          </span>
                        </td>

                        <!-- Statut -->
                        <td class="py-4 px-4">
                          <span class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full"
                                  [class.bg-green-500]="user.isActive"
                                  [class.bg-red-500]="!user.isActive"></span>
                            <span [class.text-green-600]="user.isActive"
                                  [class.text-red-600]="!user.isActive">
                              {{ user.isActive ? 'Actif' : 'Suspendu' }}
                            </span>
                          </span>
                        </td>

                        <!-- Date -->
                        <td class="py-4 px-4 text-[#6A6F73]">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>

                        <!-- Actions -->
                        <td class="py-4 px-4">
                          <div class="flex items-center gap-2">
                            @if (user.id !== currentUserId) {
                              <!-- Bouton Suspendre/Réactiver -->
                              <button
                                (click)="openSuspendModal(user)"
                                [title]="user.isActive ? 'Suspendre' : 'Réactiver'"
                                class="p-2 rounded-lg transition-colors"
                                [ngClass]="user.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'">
                                @if (user.isActive) {
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                  </svg>
                                } @else {
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                }
                              </button>

                              <!-- Bouton Supprimer -->
                              <button
                                (click)="openDeleteModal(user)"
                                title="Supprimer définitivement"
                                class="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            } @else {
                              <span class="text-xs text-[#6A6F73] italic">Vous</span>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              @if (filteredUsers.length === 0) {
                <div class="text-center py-8 text-[#6A6F73]">
                  Aucun utilisateur trouvé
                </div>
              }
            }
          </div>
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

      <!-- Modal Suspension -->
      <app-confirm-modal
        [isOpen]="showSuspendModal"
        [title]="selectedUserForAction?.isActive ? 'Suspendre l\\'utilisateur' : 'Réactiver l\\'utilisateur'"
        [message]="selectedUserForAction?.isActive
          ? 'Voulez-vous suspendre ' + selectedUserForAction?.firstName + ' ' + selectedUserForAction?.lastName + ' ?\\n\\nCet utilisateur ne pourra plus accéder à la plateforme.'
          : 'Voulez-vous réactiver ' + selectedUserForAction?.firstName + ' ' + selectedUserForAction?.lastName + ' ?\\n\\nCet utilisateur pourra de nouveau accéder à la plateforme.'"
        [type]="selectedUserForAction?.isActive ? 'warning' : 'success'"
        [confirmText]="selectedUserForAction?.isActive ? 'Suspendre' : 'Réactiver'"
        (confirmed)="confirmSuspend()"
        (cancelled)="closeSuspendModal()">
      </app-confirm-modal>

      <!-- Modal Suppression Utilisateur -->
      <app-confirm-modal
        [isOpen]="showDeleteModal"
        title="Supprimer définitivement"
        [message]="'Voulez-vous vraiment SUPPRIMER DÉFINITIVEMENT ' + selectedUserForAction?.firstName + ' ' + selectedUserForAction?.lastName + ' ?\n\nCette action supprimera également :\n• Tous ses cours\n• Toutes ses inscriptions\n• Toutes ses données\n\nCette action est IRRÉVERSIBLE.'"
        type="danger"
        confirmText="Supprimer définitivement"
        (confirmed)="confirmDeleteUser()"
        (cancelled)="closeDeleteModal()">
      </app-confirm-modal>

      <!-- Modal Suppression Admin -->
      <app-confirm-modal
        [isOpen]="showDeleteAdminModal"
        title="Supprimer l'administrateur"
        [message]="'Supprimer l\\'administrateur ' + selectedAdmin?.firstName + ' ' + selectedAdmin?.lastName + ' ?'"
        type="danger"
        confirmText="Supprimer"
        (confirmed)="confirmDeleteAdmin()"
        (cancelled)="closeDeleteAdminModal()">
      </app-confirm-modal>

      <!-- Modal Reset Database -->
      <app-confirm-modal
        [isOpen]="showResetModal"
        title="Réinitialisation de la base"
        message="Cette action va SUPPRIMER DÉFINITIVEMENT :&#10;• Tous les utilisateurs (sauf vous)&#10;• Toutes les catégories&#10;• Tous les cours&#10;• Toutes les sections et leçons&#10;• Toutes les inscriptions&#10;• Toutes les reviews&#10;&#10;Êtes-vous ABSOLUMENT sûr ?"
        type="danger"
        confirmText="Réinitialiser"
        (confirmed)="confirmResetDatabase()"
        (cancelled)="showResetModal = false">
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
export class SuperAdminDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private superAdminService = inject(SuperAdminService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

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

  // User table
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  roleFilter = '';
  currentUserId: number | null = null;
  isLoadingUsers = true;

  // Modal state
  showSuspendModal = false;
  showDeleteModal = false;
  showDeleteAdminModal = false;
  showResetModal = false;
  showErrorModal = false;
  errorModalMessage = '';
  selectedUserForAction: User | null = null;
  selectedAdmin: User | null = null;

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
    this.loadCurrentUser();
    this.loadAdmins();
    this.loadAllUsers();
  }

  loadCurrentUser() {
    const user = this.authService.getCurrentUser();
    if (user) this.currentUserId = user.id;
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

  loadAllUsers() {
    this.isLoadingUsers = true;
    this.userService.getAllUsers(0, 200).subscribe({
      next: (res) => {
        this.allUsers = res.content;
        this.filterUsers();
        this.isLoadingUsers = false;
      },
      error: () => this.isLoadingUsers = false
    });
  }

  filterUsers() {
    this.filteredUsers = this.allUsers.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.roleFilter || user.role === this.roleFilter;

      return matchesSearch && matchesRole;
    });
  }

  // --- Suspend / Reactivate ---

  openSuspendModal(user: User) {
    this.selectedUserForAction = user;
    this.showSuspendModal = true;
  }

  confirmSuspend() {
    if (!this.selectedUserForAction) return;
    const user = this.selectedUserForAction;
    this.showSuspendModal = false;

    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.allUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.allUsers[index] = updatedUser;
          this.filterUsers();
        }
        this.selectedUserForAction = null;
      },
      error: (err) => {
        this.errorModalMessage = err.error?.message || 'Erreur lors de la modification';
        this.showErrorModal = true;
        this.selectedUserForAction = null;
      }
    });
  }

  closeSuspendModal() {
    this.showSuspendModal = false;
    this.selectedUserForAction = null;
  }

  // --- Delete User ---

  openDeleteModal(user: User) {
    this.selectedUserForAction = user;
    this.showDeleteModal = true;
  }

  confirmDeleteUser() {
    if (!this.selectedUserForAction) return;
    const user = this.selectedUserForAction;
    this.showDeleteModal = false;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.allUsers = this.allUsers.filter(u => u.id !== user.id);
        this.filterUsers();
        this.selectedUserForAction = null;
      },
      error: (err) => {
        this.errorModalMessage = err.error?.message || 'Erreur lors de la suppression';
        this.showErrorModal = true;
        this.selectedUserForAction = null;
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUserForAction = null;
  }

  // --- Create Admin ---

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
        this.loadAllUsers();
        setTimeout(() => this.adminSuccess = false, 3000);
      },
      error: (err) => {
        this.isCreatingAdmin = false;
        this.adminError = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  // --- Create Instructor ---

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
        this.loadAllUsers();
        setTimeout(() => this.instructorSuccess = false, 3000);
      },
      error: (err) => {
        this.isCreatingInstructor = false;
        this.instructorError = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  // --- Delete Admin ---

  openDeleteAdminModal(admin: User) {
    this.selectedAdmin = admin;
    this.showDeleteAdminModal = true;
  }

  confirmDeleteAdmin() {
    if (!this.selectedAdmin) return;
    const admin = this.selectedAdmin;
    this.showDeleteAdminModal = false;

    this.superAdminService.deleteAdmin(admin.id).subscribe({
      next: () => {
        this.loadAdmins();
        this.selectedAdmin = null;
      },
      error: (err) => {
        this.errorModalMessage = err.error?.message || 'Erreur lors de la suppression';
        this.showErrorModal = true;
        this.selectedAdmin = null;
      }
    });
  }

  closeDeleteAdminModal() {
    this.showDeleteAdminModal = false;
    this.selectedAdmin = null;
  }

  // --- Reset Database ---

  resetDatabase() {
    if (this.resetConfirmation !== 'RESET') return;
    this.showResetModal = true;
  }

  confirmResetDatabase() {
    this.showResetModal = false;
    this.isResetting = true;
    this.resetSuccess = false;
    this.resetError = '';

    this.superAdminService.resetDatabase(this.resetConfirmation).subscribe({
      next: (response) => {
        this.isResetting = false;
        this.resetSuccess = true;
        this.resetConfirmation = '';
        this.loadAdmins();
        this.loadAllUsers();
      },
      error: (err) => {
        this.isResetting = false;
        this.resetError = err.error?.message || 'Erreur lors de la réinitialisation';
      }
    });
  }

  // --- Helpers ---

  getAvatarColor(role: string): string {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': '#1C1D1F',
      'ADMIN': '#5624D0',
      'INSTRUCTEUR': '#16A34A',
      'ETUDIANT': '#2563EB'
    };
    return colors[role] || '#6A6F73';
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      'SUPER_ADMIN': 'bg-[#1C1D1F] text-white',
      'ADMIN': 'bg-[#5624D0] text-white',
      'INSTRUCTEUR': 'bg-green-100 text-green-800',
      'ETUDIANT': 'bg-blue-100 text-blue-800'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  formatRole(role: string): string {
    const labels: Record<string, string> = {
      'SUPER_ADMIN': 'SUPER ADMIN',
      'ADMIN': 'ADMIN',
      'INSTRUCTEUR': 'INSTRUCTEUR',
      'ETUDIANT': 'ÉTUDIANT'
    };
    return labels[role] || role;
  }
}
