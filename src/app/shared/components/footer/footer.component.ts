import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer style="background: var(--ink); color: white;">
      <div class="container-app py-14">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">

          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="flex items-center gap-2 mb-5">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
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
            <p class="text-sm leading-relaxed" style="color: rgba(255,255,255,0.45);">
              La première plateforme d'apprentissage en ligne du Sénégal. Formez-vous avec des experts locaux.
            </p>
          </div>

          <!-- Explorer -->
          <div>
            <h4 class="font-semibold text-sm mb-4 text-white">Explorer</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/courses" class="footer-link">Tous les cours</a></li>
              <li><a routerLink="/become-instructor" class="footer-link">Devenir instructeur</a></li>
            </ul>
          </div>

          <!-- Entreprise -->
          <div>
            <h4 class="font-semibold text-sm mb-4 text-white">Entreprise</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#" class="footer-link">À propos</a></li>
              <li><a href="#" class="footer-link">Carrières</a></li>
              <li><a href="#" class="footer-link">Blog</a></li>
            </ul>
          </div>

          <!-- Légal -->
          <div>
            <h4 class="font-semibold text-sm mb-4 text-white">Légal</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#" class="footer-link">Conditions d'utilisation</a></li>
              <li><a href="#" class="footer-link">Confidentialité</a></li>
              <li><a href="#" class="footer-link">Contact</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
             style="border-top: 1px solid rgba(255,255,255,0.08);">
          <p class="text-sm" style="color: rgba(255,255,255,0.35);">
            © {{ currentYear }} SenCours. Tous droits réservés.
          </p>
          <div class="flex items-center gap-5">
            <a href="#" class="footer-icon">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="footer-icon">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" class="footer-icon">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <style>
        .footer-link {
          color: rgba(255,255,255,0.45);
          transition: color 0.15s ease;
          text-decoration: none;
        }
        .footer-link:hover { color: rgba(255,255,255,0.85); }
        .footer-icon {
          color: rgba(255,255,255,0.35);
          transition: color 0.15s ease;
        }
        .footer-icon:hover { color: rgba(255,255,255,0.75); }
      </style>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
