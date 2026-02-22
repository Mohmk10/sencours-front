import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confidentialite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="page-header-brand-sm">
        <div class="container-app">
          <p class="text-xs font-bold mb-1.5 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Légal</p>
          <h1 class="text-2xl font-bold text-white">Politique de confidentialité</h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">Dernière mise à jour : février 2025</p>
        </div>
      </div>

      <!-- Content -->
      <div class="container-app py-14">
        <div class="max-w-3xl mx-auto">

          <div class="card p-8 space-y-8">

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">1. Données collectées</h2>
              <p class="text-sm leading-relaxed mb-3" style="color: var(--ink-3);">
                Dans le cadre de l'utilisation de SenCours, nous collectons les données suivantes :
              </p>
              <ul class="text-sm space-y-2 pl-4" style="color: var(--ink-3);">
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Données d'identification :</strong> prénom, nom, adresse email.</li>
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Données de navigation :</strong> cours consultés, inscriptions, progression.</li>
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation.</li>
              </ul>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">2. Finalités du traitement</h2>
              <p class="text-sm leading-relaxed mb-3" style="color: var(--ink-3);">
                Vos données sont utilisées pour :
              </p>
              <ul class="text-sm space-y-2 pl-4" style="color: var(--ink-3);">
                <li style="list-style: disc inside;">Créer et gérer votre compte utilisateur.</li>
                <li style="list-style: disc inside;">Vous permettre d'accéder aux cours et de suivre votre progression.</li>
                <li style="list-style: disc inside;">Améliorer les fonctionnalités de la plateforme.</li>
                <li style="list-style: disc inside;">Assurer la sécurité et prévenir les utilisations abusives.</li>
              </ul>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">3. Conservation des données</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Vos données sont conservées pendant la durée de votre inscription sur la plateforme.
                En cas de suppression de compte, vos données personnelles sont effacées dans un délai de 30 jours,
                à l'exception des données nécessaires au respect des obligations légales.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">4. Partage des données</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                SenCours ne vend ni ne loue vos données personnelles à des tiers.
                Vos données peuvent être partagées uniquement dans les cas suivants :
              </p>
              <ul class="text-sm space-y-2 pl-4 mt-3" style="color: var(--ink-3);">
                <li style="list-style: disc inside;">Avec les instructeurs des cours auxquels vous êtes inscrit (nom, email).</li>
                <li style="list-style: disc inside;">En cas d'obligation légale ou judiciaire.</li>
              </ul>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">5. Vos droits</h2>
              <p class="text-sm leading-relaxed mb-3" style="color: var(--ink-3);">
                Conformément à la loi sénégalaise sur la protection des données personnelles (Loi n°2008-12),
                vous disposez des droits suivants :
              </p>
              <ul class="text-sm space-y-2 pl-4" style="color: var(--ink-3);">
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Droit d'accès :</strong> consulter les données que nous détenons sur vous.</li>
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Droit de rectification :</strong> corriger des informations inexactes.</li>
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Droit à l'effacement :</strong> demander la suppression de vos données.</li>
                <li style="list-style: disc inside;"><strong style="color: var(--ink-2);">Droit d'opposition :</strong> vous opposer au traitement de vos données.</li>
              </ul>
              <p class="text-sm mt-3" style="color: var(--ink-3);">
                Pour exercer ces droits, contactez-nous via la <a routerLink="/contact" class="link">page de contact</a>.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">6. Sécurité</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
                contre tout accès non autorisé, perte ou divulgation. Les mots de passe sont stockés de manière chiffrée
                et les communications sont sécurisées via HTTPS.
              </p>
            </section>

            <div class="divider" style="margin: 0;"></div>

            <section>
              <h2 class="text-lg font-bold mb-3" style="color: var(--ink);">7. Contact</h2>
              <p class="text-sm leading-relaxed" style="color: var(--ink-3);">
                Pour toute question relative à cette politique, contactez le responsable du traitement :
                <strong style="color: var(--ink-2);">Mohamed Makan KOUYATÉ</strong> —
                <a href="mailto:kouyatemakan100@gmail.com" class="link">kouyatemakan100@gmail.com</a>
              </p>
            </section>

          </div>

          <!-- Nav links -->
          <div class="mt-8 flex items-center justify-between text-sm">
            <a routerLink="/conditions" class="link">Conditions d'utilisation</a>
            <a routerLink="/contact" class="link">Nous contacter</a>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ConfidentialiteComponent {}
