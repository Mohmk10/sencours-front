import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-conditions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="page-header-brand-sm">
        <div class="container-app">
          <p class="text-xs font-bold mb-1.5 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Légal</p>
          <h1 class="text-2xl font-bold text-white">Conditions d'utilisation</h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">Dernière mise à jour : février 2025</p>
        </div>
      </div>

      <!-- Content -->
      <div class="container-app py-14">
        <div class="max-w-3xl mx-auto">

          <div class="card p-8 space-y-8">

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">1. Présentation de la plateforme</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                SenCours est une plateforme d'apprentissage en ligne développée dans le cadre d'un projet de mémoire universitaire.
                Elle met en relation des apprenants et des instructeurs sénégalais autour de contenus pédagogiques de qualité.
                L'accès à la plateforme implique l'acceptation pleine et entière des présentes conditions d'utilisation.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">2. Inscription et compte utilisateur</h2>
              <p class="text-sm leading-relaxed mb-3" style="color: var(--ink-3);">
                Pour accéder aux fonctionnalités de la plateforme, vous devez créer un compte en fournissant des informations exactes et complètes.
                Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte.
              </p>
              <ul class="text-sm space-y-2 pl-4" style="color: var(--ink-3);">
                <li style="list-style: disc inside;">L'inscription est gratuite et ouverte à toute personne physique.</li>
                <li style="list-style: disc inside;">Un compte ne peut être partagé entre plusieurs personnes.</li>
                <li style="list-style: disc inside;">Tout compte frauduleux ou abusif peut être supprimé sans préavis.</li>
              </ul>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">3. Utilisation acceptable</h2>
              <p class="text-sm leading-relaxed mb-3" style="color: var(--ink-3);">
                En utilisant SenCours, vous vous engagez à ne pas :
              </p>
              <ul class="text-sm space-y-2 pl-4" style="color: var(--ink-3);">
                <li style="list-style: disc inside;">Reproduire, distribuer ou vendre les contenus sans autorisation.</li>
                <li style="list-style: disc inside;">Usurper l'identité d'un autre utilisateur ou d'un tiers.</li>
                <li style="list-style: disc inside;">Perturber le fonctionnement de la plateforme ou de ses serveurs.</li>
                <li style="list-style: disc inside;">Publier des contenus illégaux, offensants ou contraires aux bonnes mœurs.</li>
              </ul>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">4. Propriété intellectuelle</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Les contenus publiés par les instructeurs restent leur propriété intellectuelle. En les publiant sur SenCours,
                ils accordent à la plateforme une licence d'utilisation non-exclusive pour les diffuser aux apprenants inscrits.
                Le code source de la plateforme est protégé. Toute reproduction est interdite sans autorisation préalable.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">5. Limitation de responsabilité</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                SenCours est un projet académique fourni "en l'état". Nous ne garantissons pas la disponibilité permanente
                de la plateforme ni l'exactitude de tous les contenus pédagogiques. Nous déclinons toute responsabilité
                pour les dommages indirects liés à l'utilisation de la plateforme.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">6. Modification des conditions</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Ces conditions peuvent être modifiées à tout moment. Les utilisateurs seront informés des changements
                importants. La poursuite de l'utilisation de la plateforme après modification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">7. Contact</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Pour toute question relative à ces conditions, vous pouvez nous contacter via la
                <a routerLink="/contact" class="link">page de contact</a>.
              </p>
            </section>

          </div>

          <!-- Nav links -->
          <div class="mt-8 flex items-center justify-between text-sm">
            <a routerLink="/confidentialite" class="link">Politique de confidentialité</a>
            <a routerLink="/contact" class="link">Nous contacter</a>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ConditionsComponent {}
