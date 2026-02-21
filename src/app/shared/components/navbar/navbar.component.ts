import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-[#E4E8EB] sticky top-0 z-50">
      <div class="container-app">
        <div class="flex items-center justify-between h-[70px]">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3">
            <div class="w-9 h-9 bg-[#5624D0] rounded flex items-center justify-center">
              <span class="text-white font-bold text-xl">S</span>
            </div>
            <span class="text-xl font-bold text-[#1C1D1F] hidden sm:block">SenCours</span>
          </a>

          <!-- Search (desktop) -->
          <div class="hidden lg:flex flex-1 max-w-[600px] mx-8">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des cours..."
                class="w-full h-12 pl-12 pr-4 bg-[#F7F9FA] border border-[#E4E8EB] rounded-full text-sm focus:outline-none focus:border-[#5624D0] focus:bg-white transition-colors">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex items-center gap-2">

            <!-- Liens desktop -->
            <div class="hidden md:flex items-center gap-1">
              @if (authService.isAuthenticated()) {

                <!-- ETUDIANT & INSTRUCTEUR: Mon apprentissage -->
                @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                  <a routerLink="/dashboard"
                     routerLinkActive="text-[#5624D0]"
                     [routerLinkActiveOptions]="{exact: true}"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Mon apprentissage
                  </a>
                }

                <!-- INSTRUCTEUR: Enseigner -->
                @if (authService.hasRole('INSTRUCTEUR')) {
                  <a routerLink="/dashboard/instructor"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Enseigner
                  </a>
                }

                <!-- ETUDIANT: Devenir instructeur -->
                @if (authService.hasRole('ETUDIANT')) {
                  <a routerLink="/become-instructor"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Enseigner sur SenCours
                  </a>
                }

                <!-- ADMIN: Administration -->
                @if (authService.hasRole('ADMIN')) {
                  <a routerLink="/admin"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Administration
                  </a>
                }

                <!-- SUPER_ADMIN -->
                @if (authService.hasRole('SUPER_ADMIN')) {
                  <a routerLink="/super-admin"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Super Admin
                  </a>
                }
              }
            </div>

            @if (authService.isAuthenticated()) {
              <!-- User menu -->
              <div class="relative ml-2">
                <button
                  (click)="userMenuOpen = !userMenuOpen"
                  class="w-10 h-10 rounded-full bg-[#1C1D1F] text-white flex items-center justify-center font-semibold text-sm hover:bg-[#5624D0] transition-colors">
                  {{ getInitials() }}
                </button>

                @if (userMenuOpen) {
                  <div class="absolute right-0 mt-2 w-80 bg-white border border-[#E4E8EB] rounded shadow-lg overflow-hidden">
                    <!-- Header -->
                    <div class="px-5 py-4 bg-[#F7F9FA] border-b border-[#E4E8EB]">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-[#1C1D1F] text-white flex items-center justify-center font-bold flex-shrink-0">
                          {{ getInitials() }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-semibold text-[#1C1D1F] truncate">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                          <p class="text-sm text-[#6A6F73] truncate">{{ currentUser?.email }}</p>
                        </div>
                      </div>
                      <span class="inline-block mt-3 badge" [ngClass]="getRoleBadgeClass()">
                        {{ getRoleLabel() }}
                      </span>
                    </div>

                    <!-- Links selon le rôle -->
                    <div class="py-2">
                      @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                        <a routerLink="/dashboard" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                          <svg class="w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                          Mon apprentissage
                        </a>
                      }

                      @if (authService.hasRole('INSTRUCTEUR')) {
                        <a routerLink="/dashboard/instructor" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                          <svg class="w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                          Tableau de bord instructeur
                        </a>
                      }

                      @if (authService.hasRole('ETUDIANT')) {
                        <a routerLink="/become-instructor" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                          <svg class="w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                          Devenir instructeur
                        </a>
                      }

                      @if (authService.hasRole('ADMIN')) {
                        <div class="border-t border-[#E4E8EB] my-2"></div>
                        <a routerLink="/admin/users" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                          <svg class="w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                          </svg>
                          Gérer les utilisateurs
                        </a>
                        <a routerLink="/admin/applications" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                          <svg class="w-5 h-5 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          </svg>
                          Candidatures instructeurs
                        </a>
                      }

                      @if (authService.hasRole('SUPER_ADMIN')) {
                        <div class="border-t border-[#E4E8EB] my-2"></div>
                        <a routerLink="/super-admin" (click)="userMenuOpen = false"
                           class="flex items-center gap-3 px-5 py-3 text-sm text-[#C4302B] hover:bg-[#FEECEB] transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                          Panneau Super Admin
                        </a>
                      }
                    </div>

                    <!-- Logout -->
                    <div class="border-t border-[#E4E8EB]">
                      <button (click)="logout()"
                              class="w-full flex items-center gap-3 px-5 py-4 text-sm text-[#5624D0] hover:bg-[#F3EFFC] transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Guest buttons -->
              <a routerLink="/login" class="btn btn-ghost btn-sm">Se connecter</a>
              <a routerLink="/register" class="btn btn-primary btn-sm">S'inscrire</a>
            }

            <!-- Mobile menu button -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen"
                    class="md:hidden ml-1 p-2 text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden border-t border-[#E4E8EB] bg-white">
          <div class="container-app py-3 space-y-1">
            <a routerLink="/courses" (click)="mobileMenuOpen = false"
               class="block py-3 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] border-b border-[#E4E8EB]">
              Catalogue
            </a>
            @if (authService.isAuthenticated()) {
              @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                <a routerLink="/dashboard" (click)="mobileMenuOpen = false"
                   class="block py-3 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Mon apprentissage
                </a>
              }
              @if (authService.hasRole('INSTRUCTEUR')) {
                <a routerLink="/dashboard/instructor" (click)="mobileMenuOpen = false"
                   class="block py-3 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Enseigner
                </a>
              }
              @if (authService.hasRole('ETUDIANT')) {
                <a routerLink="/become-instructor" (click)="mobileMenuOpen = false"
                   class="block py-3 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Devenir instructeur
                </a>
              }
              @if (authService.hasRole('ADMIN')) {
                <a routerLink="/admin" (click)="mobileMenuOpen = false"
                   class="block py-3 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Administration
                </a>
              }
              @if (authService.hasRole('SUPER_ADMIN')) {
                <a routerLink="/super-admin" (click)="mobileMenuOpen = false"
                   class="block py-3 text-sm font-medium text-[#C4302B]">
                  Super Admin
                </a>
              }
              <button (click)="logout()"
                      class="block w-full text-left py-3 text-sm font-medium text-[#5624D0] border-t border-[#E4E8EB]">
                Déconnexion
              </button>
            } @else {
              <a routerLink="/login" (click)="mobileMenuOpen = false"
                 class="block py-3 text-sm font-medium text-[#1C1D1F]">Se connecter</a>
              <a routerLink="/register" (click)="mobileMenuOpen = false"
                 class="block py-3 text-sm font-medium text-[#5624D0]">S'inscrire</a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  userMenuOpen = false;
  mobileMenuOpen = false;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.userMenuOpen = false;
    }
  }

  getInitials(): string {
    const user = this.currentUser;
    if (!user) return '';
    return (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  }

  getRoleLabel(): string {
    switch (this.currentUser?.role) {
      case 'SUPER_ADMIN': return 'Super Administrateur';
      case 'ADMIN': return 'Administrateur';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'ETUDIANT': return 'Étudiant';
      default: return '';
    }
  }

  getRoleBadgeClass(): string {
    switch (this.currentUser?.role) {
      case 'SUPER_ADMIN': return 'badge-error';
      case 'ADMIN': return 'badge-warning';
      case 'INSTRUCTEUR': return 'badge-primary';
      case 'ETUDIANT': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }

  logout() {
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    this.authService.logout();
  }
}
