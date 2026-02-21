import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-[#1C1D1F] text-white mt-auto">
      <div class="container-custom py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-[#5624D0] rounded flex items-center justify-center">
                <span class="text-white font-bold text-base">S</span>
              </div>
              <span class="text-lg font-bold text-white">SenCours</span>
            </a>
            <p class="text-sm text-gray-400 leading-relaxed">
              La plateforme d'apprentissage en ligne du Sénégal. Apprenez auprès des meilleurs experts locaux.
            </p>
          </div>

          <!-- Apprendre -->
          <div>
            <h4 class="text-sm font-bold text-white mb-4 uppercase tracking-wide">Apprendre</h4>
            <ul class="space-y-2.5">
              <li><a routerLink="/courses" class="text-sm text-gray-400 hover:text-white transition-colors">Tous les cours</a></li>
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Catégories</a></li>
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Cours gratuits</a></li>
            </ul>
          </div>

          <!-- Enseigner -->
          <div>
            <h4 class="text-sm font-bold text-white mb-4 uppercase tracking-wide">Enseigner</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Devenir instructeur</a></li>
              <li><a routerLink="/dashboard/instructor" class="text-sm text-gray-400 hover:text-white transition-colors">Espace instructeur</a></li>
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Ressources</a></li>
            </ul>
          </div>

          <!-- À propos -->
          <div>
            <h4 class="text-sm font-bold text-white mb-4 uppercase tracking-wide">À propos</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Notre histoire</a></li>
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-500">
            &copy; 2025 SenCours — Projet ODC Sonatel Academy. Tous droits réservés.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Confidentialité</a>
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Conditions</a>
            <a href="#" class="text-xs text-gray-500 hover:text-white transition-colors">Accessibilité</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
