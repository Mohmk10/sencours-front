import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer style="background: var(--ink); color: white;">

      <!-- CTA strip -->
      <div style="border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div class="container-app py-12">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 class="text-xl font-bold text-white mb-1">Prêt à commencer à apprendre ?</h3>
              <p class="text-sm" style="color: rgba(255,255,255,0.5);">Rejoignez plus de 10 000 apprenants sur SenCours.</p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <a routerLink="/courses" class="btn btn-secondary btn-sm">Parcourir les cours</a>
              @if (!isAuthenticated()) {
                <a routerLink="/register" class="btn btn-amber btn-sm">Commencer gratuitement</a>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Main grid -->
      <div class="container-app py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">

          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="inline-flex items-center gap-2.5 mb-6">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="9" fill="url(#footer-logo-g)"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
                  fill="white" fill-opacity="0.95"/>
                <defs>
                  <linearGradient id="footer-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#5B21B6"/>
                    <stop offset="0.65" stop-color="#7C3AED"/>
                    <stop offset="1" stop-color="#D97706" stop-opacity="0.85"/>
                  </linearGradient>
                </defs>
              </svg>
              <span class="text-lg leading-none">
                <span style="color:rgba(255,255,255,0.55);font-weight:500">Sen</span><span style="color:white;font-weight:800">Cours</span>
              </span>
            </a>
            <p class="text-sm leading-relaxed mb-6" style="color: rgba(255,255,255,0.4); max-width: 240px;">
              La première plateforme d'apprentissage en ligne du Sénégal. Formez-vous avec des experts locaux.
            </p>
            <div class="flex items-center gap-4">
              <!-- GitHub -->
              <a href="https://github.com/Mohmk10" target="_blank" rel="noopener noreferrer" class="footer-icon">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <!-- X (Twitter) -->
              <a href="https://x.com/ElHadjMakan" target="_blank" rel="noopener noreferrer" class="footer-icon">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <!-- LinkedIn -->
              <a href="https://www.linkedin.com/in/mohamed-makan-kouyaté-925414262/" target="_blank" rel="noopener noreferrer" class="footer-icon">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Explorer -->
          <div>
            <h4 class="font-semibold text-sm mb-5 text-white tracking-wide">Explorer</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/courses" class="footer-link">Tous les cours</a></li>
              @if (isAuthenticated() && hasRole('ETUDIANT')) {
                <li><a routerLink="/become-instructor" class="footer-link">Devenir instructeur</a></li>
              }
              @if (!isAuthenticated()) {
                <li><a routerLink="/login" class="footer-link">Se connecter</a></li>
                <li><a routerLink="/register" class="footer-link">S'inscrire</a></li>
              }
            </ul>
          </div>

          <!-- Projet -->
          <div>
            <h4 class="font-semibold text-sm mb-5 text-white tracking-wide">Projet</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/about" class="footer-link">À propos</a></li>
              <li>
                <a href="https://github.com/Mohmk10/sencours-front" target="_blank" rel="noopener noreferrer" class="footer-link">
                  Code source
                </a>
              </li>
            </ul>
          </div>

          <!-- Légal -->
          <div>
            <h4 class="font-semibold text-sm mb-5 text-white tracking-wide">Légal</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/conditions" class="footer-link">Conditions d'utilisation</a></li>
              <li><a routerLink="/confidentialite" class="footer-link">Confidentialité</a></li>
              <li><a routerLink="/contact" class="footer-link">Contact</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
             style="border-top: 1px solid rgba(255,255,255,0.07);">
          <p class="text-xs" style="color: rgba(255,255,255,0.3);">
            © {{ currentYear }} SenCours. Tous droits réservés.
          </p>
          <p class="text-xs" style="color: rgba(255,255,255,0.2);">
            Fait avec soin au Sénégal
          </p>
        </div>
      </div>

      <style>
        .footer-link {
          color: rgba(255,255,255,0.45);
          transition: color 0.15s ease;
          text-decoration: none;
          display: inline-block;
        }
        .footer-link:hover { color: rgba(255,255,255,0.88); }
        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.06);
          transition: color 0.15s ease, background 0.15s ease;
        }
        .footer-icon:hover {
          color: white;
          background: rgba(255,255,255,0.12);
        }
      </style>
    </footer>
  `
})
export class FooterComponent {
  private authService = inject(AuthService);
  currentYear = new Date().getFullYear();

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  hasRole(role: string) {
    return this.authService.hasRole(role);
  }
}
