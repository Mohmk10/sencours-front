import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="bg-white sticky top-0 z-50 transition-shadow duration-200"
         [class.shadow-sm]="isScrolled"
         style="border-bottom: 1px solid var(--border);">
      <div class="container-app">
        <div class="flex items-center justify-between h-[72px]">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="url(#nav-logo-g)"/>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
                fill="white" fill-opacity="0.95"/>
              <defs>
                <linearGradient id="nav-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#5B21B6"/>
                  <stop offset="0.65" stop-color="#7C3AED"/>
                  <stop offset="1" stop-color="#D97706" stop-opacity="0.85"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="text-lg leading-none">
              <span style="color:var(--ink-3);font-weight:500">Sen</span><span style="color:var(--violet);font-weight:800">Cours</span>
            </span>
          </a>

          <!-- Search bar (desktop) -->
          <div class="hidden lg:flex flex-1 max-w-[520px] mx-8">
            <div class="relative w-full">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                [(ngModel)]="navSearchQuery"
                (keyup.enter)="onNavSearch()"
                placeholder="Rechercher un cours..."
                class="w-full h-10 pl-9 pr-4 text-sm border rounded-full transition-all"
                style="background: var(--canvas); border-color: var(--border-2); color: var(--ink);"
                (focus)="onSearchFocus($event)"
                (blur)="onSearchBlur($event)">
            </div>
          </div>

          <!-- Nav links + actions -->
          <div class="flex items-center gap-2">

            <!-- Desktop nav links -->
            <div class="hidden md:flex items-center">
              @if (authService.isAuthenticated()) {
                @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                  <a routerLink="/dashboard"
                     routerLinkActive="nav-active"
                     [routerLinkActiveOptions]="{exact: true}"
                     class="nav-link">Mon apprentissage</a>
                }
                @if (authService.hasRole('INSTRUCTEUR')) {
                  <a routerLink="/dashboard/instructor"
                     routerLinkActive="nav-active"
                     class="nav-link">Enseigner</a>
                }
                @if (authService.hasRole('ETUDIANT')) {
                  <a routerLink="/become-instructor"
                     routerLinkActive="nav-active"
                     class="nav-link font-semibold"
                     style="color: var(--amber-mid);">Enseigner sur SenCours</a>
                }
                @if (authService.hasRole('ADMIN')) {
                  <a routerLink="/admin"
                     routerLinkActive="nav-active"
                     class="nav-link">Administration</a>
                }
                @if (authService.hasRole('SUPER_ADMIN')) {
                  <a routerLink="/super-admin"
                     routerLinkActive="nav-active"
                     class="nav-link" style="color: #7F1D1D;">Super Admin</a>
                }
              }
            </div>

            @if (authService.isAuthenticated()) {
              <!-- Avatar + dropdown -->
              <div class="relative ml-2">
                <button
                  (click)="userMenuOpen = !userMenuOpen"
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white transition-colors"
                  style="background: var(--violet);"
                  [style.background]="userMenuOpen ? 'var(--violet-mid)' : 'var(--violet)'">
                  {{ getInitials() }}
                </button>

                @if (userMenuOpen) {
                  <div class="absolute right-0 mt-2 w-72 bg-white overflow-hidden"
                       style="border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--shadow-lg);">
                    <!-- User info -->
                    <div class="px-5 py-4" style="background: var(--canvas); border-bottom: 1px solid var(--border);">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                             style="background: var(--violet);">
                          {{ getInitials() }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-semibold text-sm truncate" style="color: var(--ink);">
                            {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                          </p>
                          <p class="text-xs truncate" style="color: var(--ink-3);">{{ currentUser?.email }}</p>
                        </div>
                      </div>
                      <span class="inline-block mt-3 badge" [ngClass]="getRoleBadgeClass()">
                        {{ getRoleLabel() }}
                      </span>
                    </div>

                    <!-- Menu links -->
                    <div class="py-1.5">
                      @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                        <a routerLink="/dashboard" (click)="userMenuOpen = false"
                           class="dropdown-item">
                          <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                          Mon apprentissage
                        </a>
                      }
                      @if (authService.hasRole('INSTRUCTEUR')) {
                        <a routerLink="/dashboard/instructor" (click)="userMenuOpen = false"
                           class="dropdown-item">
                          <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                          Tableau de bord instructeur
                        </a>
                      }
                      @if (authService.hasRole('ETUDIANT')) {
                        <a routerLink="/become-instructor" (click)="userMenuOpen = false"
                           class="dropdown-item">
                          <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                          Devenir instructeur
                        </a>
                      }
                      @if (authService.hasRole('ADMIN')) {
                        <div style="height: 1px; background: var(--border); margin: 4px 0;"></div>
                        <a routerLink="/admin/users" (click)="userMenuOpen = false" class="dropdown-item">
                          <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                          </svg>
                          Gérer les utilisateurs
                        </a>
                        <a routerLink="/admin/applications" (click)="userMenuOpen = false" class="dropdown-item">
                          <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          </svg>
                          Candidatures instructeurs
                        </a>
                      }
                      @if (authService.hasRole('SUPER_ADMIN')) {
                        <div style="height: 1px; background: var(--border); margin: 4px 0;"></div>
                        <a routerLink="/super-admin" (click)="userMenuOpen = false"
                           class="dropdown-item" style="color: var(--red);">
                          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                          Panneau Super Admin
                        </a>
                      }
                    </div>

                    <!-- Logout -->
                    <div style="border-top: 1px solid var(--border);">
                      <button (click)="logout()"
                              class="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors text-left"
                              style="color: var(--violet);"
                              onmouseenter="this.style.background='var(--violet-xlight)'"
                              onmouseleave="this.style.background='transparent'">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Guest CTA -->
              <a routerLink="/login" class="btn btn-ghost btn-sm hidden md:inline-flex">Se connecter</a>
              <a routerLink="/register" class="btn btn-primary btn-sm ml-1">S'inscrire</a>
            }

            <!-- Mobile menu button -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen"
                    class="md:hidden ml-2 p-2 transition-colors"
                    style="color: var(--ink-3); border-radius: var(--r-sm);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden bg-white" style="border-top: 1px solid var(--border);">
          <div class="container-app py-3 space-y-0.5">
            <a routerLink="/courses" (click)="mobileMenuOpen = false"
               class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
              Catalogue
            </a>
            @if (authService.isAuthenticated()) {
              @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR'])) {
                <a routerLink="/dashboard" (click)="mobileMenuOpen = false"
                   class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
                  Mon apprentissage
                </a>
              }
              @if (authService.hasRole('INSTRUCTEUR')) {
                <a routerLink="/dashboard/instructor" (click)="mobileMenuOpen = false"
                   class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
                  Enseigner
                </a>
              }
              @if (authService.hasRole('ETUDIANT')) {
                <a routerLink="/become-instructor" (click)="mobileMenuOpen = false"
                   class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
                  Devenir instructeur
                </a>
              }
              @if (authService.hasRole('ADMIN')) {
                <a routerLink="/admin" (click)="mobileMenuOpen = false"
                   class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
                  Administration
                </a>
              }
              @if (authService.hasRole('SUPER_ADMIN')) {
                <a routerLink="/super-admin" (click)="mobileMenuOpen = false"
                   class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--red);">
                  Super Admin
                </a>
              }
              <div style="height: 1px; background: var(--border); margin: 6px 0;"></div>
              <button (click)="logout()"
                      class="block w-full text-left px-3 py-2.5 text-sm font-medium rounded"
                      style="color: var(--violet);">
                Déconnexion
              </button>
            } @else {
              <a routerLink="/login" (click)="mobileMenuOpen = false"
                 class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--ink-2);">
                Se connecter
              </a>
              <a routerLink="/register" (click)="mobileMenuOpen = false"
                 class="block px-3 py-2.5 text-sm font-medium rounded" style="color: var(--violet);">
                S'inscrire
              </a>
            }
          </div>
        </div>
      }
    </nav>

    <style>
      .nav-link {
        padding: 6px 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--ink-2);
        border-radius: var(--r-sm);
        transition: color 0.15s ease, background 0.15s ease;
        white-space: nowrap;
      }
      .nav-link:hover {
        color: var(--ink);
        background: var(--canvas);
      }
      .nav-link.nav-active {
        color: var(--violet);
      }
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        font-size: 14px;
        color: var(--ink);
        transition: background 0.1s ease;
      }
      .dropdown-item:hover {
        background: var(--canvas);
      }
    </style>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  userMenuOpen = false;
  mobileMenuOpen = false;
  isScrolled = false;
  navSearchQuery = '';

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 4;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.userMenuOpen = false;
    }
  }

  onNavSearch() {
    const q = this.navSearchQuery.trim();
    if (q) {
      this.router.navigate(['/courses'], { queryParams: { q } });
      this.navSearchQuery = '';
    }
  }

  onSearchFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.borderColor = 'var(--violet)';
    input.style.boxShadow = 'var(--shadow-focus)';
    input.style.background = 'white';
  }

  onSearchBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.borderColor = '';
    input.style.boxShadow = '';
    input.style.background = '';
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
