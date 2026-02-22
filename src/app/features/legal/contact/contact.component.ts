import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="page-header-brand-sm">
        <div class="container-app">
          <p class="text-xs font-bold mb-1.5 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">SenCours</p>
          <h1 class="text-2xl font-bold text-white">Contact</h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">Projet de mémoire — UCAD / ESP</p>
        </div>
      </div>

      <!-- Content -->
      <div class="container-app py-14">
        <div class="max-w-2xl mx-auto">

          <!-- Author card -->
          <div class="card p-8 mb-6">
            <div class="flex items-start gap-6">

              <!-- Avatar initials -->
              <div class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
                   style="background: var(--gradient-brand);">
                MK
              </div>

              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-bold mb-0.5" style="color: var(--ink);">Mohamed Makan KOUYATÉ</h2>
                <p class="text-sm mb-4" style="color: var(--ink-3);">Développeur — Projet de mémoire SenCours</p>

                <!-- Contact info -->
                <div class="space-y-3">

                  <a href="mailto:kouyatemakan100@gmail.com"
                     class="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                     style="color: var(--ink-2);">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                         style="background: var(--violet-tint);">
                      <svg class="w-4 h-4" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    kouyatemakan100@gmail.com
                  </a>

                  <a href="tel:+221781975048"
                     class="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                     style="color: var(--ink-2);">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                         style="background: var(--green-tint);">
                      <svg class="w-4 h-4" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    +221 78 197 50 48
                  </a>

                </div>
              </div>
            </div>
          </div>

          <!-- Social / GitHub links -->
          <div class="card p-6 mb-6">
            <h3 class="text-sm font-semibold mb-4" style="color: var(--ink-2);">Réseaux et projets</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <a href="https://github.com/Mohmk10"
                 target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80"
                 style="background: var(--canvas); border: 1px solid var(--border);">
                <svg class="w-5 h-5 flex-shrink-0" style="color: var(--ink);" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <div>
                  <p class="text-xs font-semibold" style="color: var(--ink);">GitHub</p>
                  <p class="text-xs" style="color: var(--ink-3);">Mohmk10</p>
                </div>
              </a>

              <a href="https://x.com/ElHadjMakan"
                 target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80"
                 style="background: var(--canvas); border: 1px solid var(--border);">
                <svg class="w-5 h-5 flex-shrink-0" style="color: var(--ink);" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <div>
                  <p class="text-xs font-semibold" style="color: var(--ink);">X (Twitter)</p>
                  <p class="text-xs" style="color: var(--ink-3);">ElHadjMakan</p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/mohamed-makan-kouyaté-925414262/"
                 target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80"
                 style="background: var(--canvas); border: 1px solid var(--border);">
                <svg class="w-5 h-5 flex-shrink-0" style="color: #0A66C2;" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <div>
                  <p class="text-xs font-semibold" style="color: var(--ink);">LinkedIn</p>
                  <p class="text-xs" style="color: var(--ink-3);">Mohamed Makan</p>
                </div>
              </a>

            </div>
          </div>

          <!-- Repos -->
          <div class="card p-6">
            <h3 class="text-sm font-semibold mb-4" style="color: var(--ink-2);">Code source du projet</h3>
            <div class="space-y-3">

              <a href="https://github.com/Mohmk10/sencours-front"
                 target="_blank" rel="noopener noreferrer"
                 class="flex items-center justify-between p-4 rounded-lg transition-colors group"
                 style="background: var(--canvas); border: 1px solid var(--border);">
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium" style="color: var(--ink);">sencours-front</p>
                    <p class="text-xs" style="color: var(--ink-3);">Frontend Angular 18</p>
                  </div>
                </div>
                <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>

              <a href="https://github.com/Mohmk10/sencours-back"
                 target="_blank" rel="noopener noreferrer"
                 class="flex items-center justify-between p-4 rounded-lg transition-colors group"
                 style="background: var(--canvas); border: 1px solid var(--border);">
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 flex-shrink-0" style="color: var(--ink-3);" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium" style="color: var(--ink);">sencours-back</p>
                    <p class="text-xs" style="color: var(--ink-3);">Backend Spring Boot</p>
                  </div>
                </div>
                <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ContactComponent {}
