import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold">SenCours</a>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-4">
            <a routerLink="/courses" routerLinkActive="bg-blue-700"
               class="px-3 py-2 rounded hover:bg-blue-700 transition">
              Cours
            </a>

            @if (authService.isAuthenticated()) {
              @if (authService.hasAnyRole(['ETUDIANT', 'INSTRUCTEUR', 'ADMIN'])) {
                <a routerLink="/dashboard" routerLinkActive="bg-blue-700"
                   class="px-3 py-2 rounded hover:bg-blue-700 transition">
                  Dashboard
                </a>
              }

              @if (authService.hasAnyRole(['INSTRUCTEUR', 'ADMIN'])) {
                <a routerLink="/dashboard/instructor" routerLinkActive="bg-blue-700"
                   class="px-3 py-2 rounded hover:bg-blue-700 transition">
                  Mes Cours
                </a>
              }

              @if (authService.hasRole('ADMIN')) {
                <a routerLink="/admin" routerLinkActive="bg-blue-700"
                   class="px-3 py-2 rounded hover:bg-blue-700 transition">
                  Admin
                </a>
              }

              <div class="flex items-center space-x-2 ml-4">
                <span class="text-sm">{{ currentUser?.firstName }}</span>
                <button (click)="logout()"
                        class="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">
                  Déconnexion
                </button>
              </div>
            } @else {
              <a routerLink="/login"
                 class="px-4 py-2 rounded border border-white hover:bg-white hover:text-blue-600 transition">
                Connexion
              </a>
              <a routerLink="/register"
                 class="px-4 py-2 rounded bg-white text-blue-600 hover:bg-gray-100 transition">
                Inscription
              </a>
            }
          </div>

          <!-- Mobile menu button -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen) {
          <div class="md:hidden pb-4">
            <a routerLink="/courses" class="block py-2 hover:bg-blue-700 px-2 rounded">Cours</a>
            @if (authService.isAuthenticated()) {
              <a routerLink="/dashboard" class="block py-2 hover:bg-blue-700 px-2 rounded">Dashboard</a>
              <button (click)="logout()" class="w-full text-left py-2 hover:bg-blue-700 px-2 rounded">
                Déconnexion
              </button>
            } @else {
              <a routerLink="/login" class="block py-2 hover:bg-blue-700 px-2 rounded">Connexion</a>
              <a routerLink="/register" class="block py-2 hover:bg-blue-700 px-2 rounded">Inscription</a>
            }
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }
}
