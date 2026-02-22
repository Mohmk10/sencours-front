import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header gradient -->
      <div class="page-header-brand">
        <div class="container-app">
          <p class="text-xs font-bold mb-2 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Projet de mémoire</p>
          <h1 class="text-3xl font-bold text-white mb-2">À propos de SenCours</h1>
          <p class="text-sm" style="color: rgba(255,255,255,0.55);">La première plateforme d'apprentissage en ligne sénégalaise</p>

          <!-- Institutions badges -->
          <div class="flex items-center gap-4 mt-6 flex-wrap">
            <div class="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
                 style="background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);">
              <img src="assets/images/orange-digital-center.png" alt="Orange Digital Center"
                   style="height: 32px; object-fit: contain;">
            </div>
            <div class="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
                 style="background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);">
              <img src="assets/images/sonatel-academy.png" alt="Sonatel Academy"
                   style="height: 32px; object-fit: contain;">
            </div>
          </div>
        </div>
      </div>

      <div class="container-app py-14">
        <div class="max-w-3xl mx-auto space-y-8">

          <!-- Vision -->
          <div class="card p-8">
            <div class="flex items-start gap-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style="background: var(--violet-tint);">
                <svg class="w-6 h-6" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold mb-2" style="color: var(--ink);">Notre vision</h2>
                <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                  SenCours est né d'un constat simple : le Sénégal regorge de talents et d'experts dans de nombreux domaines,
                  mais il manquait une plateforme locale dédiée à la valorisation et au partage de ces savoirs.
                  Notre mission est de démocratiser l'accès à une formation de qualité, en wolof, en français et en anglais,
                  en connectant les apprenants sénégalais aux meilleurs formateurs locaux.
                </p>
              </div>
            </div>
          </div>

          <!-- Projet académique -->
          <div class="card p-8">
            <div class="flex items-start gap-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style="background: var(--amber-tint);">
                <svg class="w-6 h-6" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold mb-2" style="color: var(--ink);">Contexte académique</h2>
                <p class="text-sm leading-relaxed mb-4" style="color: var(--ink-3);">
                  SenCours est développé en tant que projet de mémoire de fin de formation à la
                  <strong style="color: var(--ink-2);">Sonatel Academy</strong>, école de formation aux métiers du numérique
                  de l'<strong style="color: var(--ink-2);">Orange Digital Center</strong> au Sénégal.
                  Il illustre les compétences acquises en développement Full Stack — Angular 18 côté frontend
                  et Spring Boot côté backend.
                </p>
                <!-- ODC / Sonatel mini-cards -->
                <div class="flex flex-wrap gap-3">
                  <div class="flex items-center px-4 py-3 rounded-xl"
                       style="background: #FFF3E8; border: 1.5px solid #FFB366;">
                    <img src="assets/images/orange-digital-center.png" alt="Orange Digital Center"
                         style="height: 40px; object-fit: contain;">
                  </div>
                  <div class="flex items-center px-4 py-3 rounded-xl"
                       style="background: #E8F7F6; border: 1.5px solid #7ECAC4;">
                    <img src="assets/images/sonatel-academy.png" alt="Sonatel Academy"
                         style="height: 40px; object-fit: contain;">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stack technique -->
          <div class="card p-8">
            <div class="flex items-start gap-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   style="background: var(--green-tint);">
                <svg class="w-6 h-6" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">Stack technique</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--ink-3);">Frontend</p>
                    <ul class="space-y-1.5">
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--violet);"></span>
                        Angular 18 (Standalone)
                      </li>
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--violet);"></span>
                        Tailwind CSS v3
                      </li>
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--violet);"></span>
                        TypeScript
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: var(--ink-3);">Backend</p>
                    <ul class="space-y-1.5">
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--green);"></span>
                        Spring Boot 3
                      </li>
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--green);"></span>
                        Java 17
                      </li>
                      <li class="flex items-center gap-2 text-sm" style="color: var(--ink-2);">
                        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: var(--green);"></span>
                        REST API / JWT
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fonctionnalités -->
          <div class="card p-8">
            <h2 class="text-lg font-bold mb-5" style="color: var(--ink);">Fonctionnalités principales</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--violet-tint);">
                  <svg class="w-4 h-4" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Catalogue de cours</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">Filtres par catégorie, recherche, pagination</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--violet-tint);">
                  <svg class="w-4 h-4" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Tableau de bord apprenant</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">Suivi des inscriptions et progressions</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--amber-tint);">
                  <svg class="w-4 h-4" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Espace instructeur</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">Création et gestion de cours, candidature</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--green-tint);">
                  <svg class="w-4 h-4" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Panneau d'administration</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">Gestion utilisateurs, candidatures, catégories</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--violet-tint);">
                  <svg class="w-4 h-4" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Authentification sécurisée</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">JWT, rôles ETUDIANT / INSTRUCTEUR / ADMIN</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--amber-tint);">
                  <svg class="w-4 h-4" style="color: var(--amber);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold" style="color: var(--ink);">Super Admin</p>
                  <p class="text-xs mt-0.5" style="color: var(--ink-3);">Gestion des administrateurs de la plateforme</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA contact -->
          <div class="flex items-center justify-between">
            <a routerLink="/contact" class="link text-sm font-semibold">Contacter le développeur</a>
            <a href="https://github.com/Mohmk10/sencours-front" target="_blank" rel="noopener noreferrer" class="link text-sm font-semibold">
              Voir le code source
            </a>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
