import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-[#D1D7DC] sticky top-0 z-50">
      <div class="container-custom">
        <div class="flex items-center justify-between h-16 gap-4">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 flex-shrink-0">
            <div class="w-8 h-8 bg-[#5624D0] rounded flex items-center justify-center">
              <span class="text-white font-bold text-base leading-none">S</span>
            </div>
            <span class="text-lg font-bold text-[#1C1D1F] hidden sm:block">SenCours</span>
          </a>

          <!-- Search bar -->
          <div class="hidden md:flex flex-1 max-w-2xl">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des cours"
                class="w-full pl-11 pr-4 py-2.5 border border-[#1C1D1F] rounded-full bg-white text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0]">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex items-center gap-1 flex-shrink-0">
            @if (authService.isAuthenticated()) {

              <!-- Navigation Links (desktop) -->
              <div class="hidden md:flex items-center gap-1">

                <!-- ETUDIANT + INSTRUCTEUR : Mon apprentissage -->
                @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                  <a routerLink="/dashboard"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Mon apprentissage
                  </a>
                }

                <!-- INSTRUCTEUR uniquement : Enseigner -->
                @if (authService.hasRole('INSTRUCTEUR')) {
                  <a routerLink="/dashboard/instructor"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Enseigner
                  </a>
                }

                <!-- ETUDIANT uniquement : Devenir instructeur -->
                @if (authService.hasRole('ETUDIANT')) {
                  <a routerLink="/become-instructor"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Devenir instructeur
                  </a>
                }

                <!-- ADMIN uniquement : Administration -->
                @if (authService.hasRole('ADMIN')) {
                  <a routerLink="/admin"
                     routerLinkActive="text-[#5624D0]"
                     class="px-4 py-2 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0] transition-colors">
                    Administration
                  </a>
                }
              </div>

              <!-- User avatar menu -->
              <div class="relative ml-1">
                <button
                  (click)="toggleUserMenu($event)"
                  class="w-9 h-9 rounded-full bg-[#1C1D1F] text-white flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-[#5624D0] transition-all">
                  {{ getInitials() }}
                </button>

                @if (userMenuOpen) {
                  <div class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                    <!-- Header avec nom, email et badge rôle -->
                    <div class="px-4 py-3 border-b border-gray-100">
                      <p class="font-semibold text-[#1C1D1F] text-sm">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                      <p class="text-xs text-[#6A6F73] mt-0.5">{{ currentUser?.email }}</p>
                      <span class="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded"
                            [class.bg-blue-100]="currentUser?.role === 'ETUDIANT'"
                            [class.text-blue-800]="currentUser?.role === 'ETUDIANT'"
                            [class.bg-purple-100]="currentUser?.role === 'INSTRUCTEUR'"
                            [class.text-purple-800]="currentUser?.role === 'INSTRUCTEUR'"
                            [class.bg-red-100]="currentUser?.role === 'ADMIN'"
                            [class.text-red-800]="currentUser?.role === 'ADMIN'">
                        {{ getRoleLabel(currentUser?.role) }}
                      </span>
                    </div>

                    <!-- Links selon le rôle -->
                    <div class="py-1">
                      @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                        <a routerLink="/dashboard" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Mon apprentissage
                        </a>
                      }

                      @if (authService.hasRole('INSTRUCTEUR')) {
                        <a routerLink="/dashboard/instructor" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Tableau de bord instructeur
                        </a>
                      }

                      @if (authService.hasRole('ETUDIANT')) {
                        <a routerLink="/become-instructor" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Devenir instructeur
                        </a>
                      }

                      @if (authService.hasRole('ADMIN')) {
                        <a routerLink="/admin/users" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Gérer les utilisateurs
                        </a>
                        <a routerLink="/admin/courses" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Gérer les cours
                        </a>
                        <a routerLink="/admin/applications" (click)="userMenuOpen = false"
                           class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                          Candidatures instructeurs
                        </a>
                      }
                    </div>

                    <!-- Settings & Logout -->
                    <div class="border-t border-gray-100 pt-1">
                      <a routerLink="/settings" (click)="userMenuOpen = false"
                         class="block px-4 py-2 text-sm text-[#1C1D1F] hover:bg-gray-50">
                        Paramètres du compte
                      </a>
                      <button (click)="logout()"
                              class="w-full text-left px-4 py-2 text-sm text-[#5624D0] hover:bg-gray-50 font-medium">
                        Déconnexion
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/login"
                 class="text-sm font-semibold text-[#1C1D1F] hover:text-[#5624D0] px-4 py-2 border border-[#1C1D1F] rounded transition-colors hidden sm:block">
                Se connecter
              </a>
              <a routerLink="/register" class="btn-primary text-sm">
                S'inscrire
              </a>
            }

            <!-- Mobile menu button -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen"
                    class="md:hidden ml-2 p-2 text-[#1C1D1F] hover:text-[#5624D0]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile search -->
        <div class="md:hidden pb-3">
          <div class="relative">
            <input
              type="text"
              placeholder="Rechercher des cours"
              class="w-full pl-10 pr-4 py-2 border border-[#D1D7DC] rounded-full bg-[#F7F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#5624D0]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden border-t border-[#D1D7DC] bg-white py-2">
          <div class="container-custom space-y-1">
            <a routerLink="/courses" (click)="mobileMenuOpen = false"
               class="block py-2.5 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
              Catalogue
            </a>
            @if (authService.isAuthenticated()) {
              @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                <a routerLink="/dashboard" (click)="mobileMenuOpen = false"
                   class="block py-2.5 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Mon apprentissage
                </a>
              }
              @if (authService.hasRole('INSTRUCTEUR')) {
                <a routerLink="/dashboard/instructor" (click)="mobileMenuOpen = false"
                   class="block py-2.5 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Enseigner
                </a>
              }
              @if (authService.hasRole('ETUDIANT')) {
                <a routerLink="/become-instructor" (click)="mobileMenuOpen = false"
                   class="block py-2.5 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Devenir instructeur
                </a>
              }
              @if (authService.hasRole('ADMIN')) {
                <a routerLink="/admin" (click)="mobileMenuOpen = false"
                   class="block py-2.5 text-sm font-medium text-[#1C1D1F] hover:text-[#5624D0]">
                  Administration
                </a>
              }
              <button (click)="logout()"
                      class="block w-full text-left py-2.5 text-sm font-medium text-[#5624D0]">
                Déconnexion
              </button>
            } @else {
              <a routerLink="/login" (click)="mobileMenuOpen = false"
                 class="block py-2.5 text-sm font-medium text-[#1C1D1F]">Se connecter</a>
              <a routerLink="/register" (click)="mobileMenuOpen = false"
                 class="block py-2.5 text-sm font-medium text-[#5624D0]">S'inscrire</a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;
  userMenuOpen = false;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  getInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '?';
    return `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  getRoleLabel(role: string | undefined): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'ETUDIANT': return 'Étudiant';
      default: return '';
    }
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.userMenuOpen = false;
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
  }
}
