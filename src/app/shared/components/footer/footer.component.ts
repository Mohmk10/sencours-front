import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">SenCours</h3>
            <p class="text-gray-400">
              La plateforme d'apprentissage en ligne du Sénégal.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Liens utiles</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">À propos</a></li>
              <li><a href="#" class="hover:text-white">Contact</a></li>
              <li><a href="#" class="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <p class="text-gray-400">Email: contact&#64;sencours.sn</p>
            <p class="text-gray-400">Dakar, Sénégal</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2025 SenCours - Projet ODC Sonatel Academy</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
