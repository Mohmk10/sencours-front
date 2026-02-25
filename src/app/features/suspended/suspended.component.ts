import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SuspensionAppealService } from '../../core/services/suspension-appeal.service';

@Component({
  selector: 'app-suspended',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4">
      <div class="max-w-lg w-full">
        <!-- Card principale -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Header avec icône -->
          <div class="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-center">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-white">Compte Suspendu</h1>
            <p class="text-white/80 mt-2">Votre accès à SenCours a été temporairement restreint</p>
          </div>

          <!-- Contenu -->
          <div class="p-8">
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 class="font-semibold text-orange-800 mb-2">Pourquoi mon compte est suspendu ?</h3>
              <p class="text-sm text-orange-700">
                Votre compte peut être suspendu pour diverses raisons, notamment :
              </p>
              <ul class="text-sm text-orange-700 mt-2 space-y-1">
                <li>• Non-respect des conditions d'utilisation</li>
                <li>• Activité suspecte détectée</li>
                <li>• Signalements d'autres utilisateurs</li>
                <li>• Contenu inapproprié</li>
              </ul>
            </div>

            <!-- Formulaire de contestation -->
            @if (!hasSubmittedAppeal) {
              <div class="border-t border-[#E4E8EB] pt-6">
                <h3 class="font-semibold text-[#1C1D1F] mb-4">Contester cette décision</h3>
                <p class="text-sm text-[#6A6F73] mb-4">
                  Si vous pensez que cette suspension est une erreur, vous pouvez soumettre une contestation.
                  Notre équipe examinera votre demande dans les 48 heures.
                </p>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-[#1C1D1F] mb-2">
                      Expliquez pourquoi vous contestez cette suspension *
                    </label>
                    <textarea
                      [(ngModel)]="appealReason"
                      rows="4"
                      class="input w-full resize-none"
                      placeholder="Décrivez votre situation et pourquoi vous pensez que cette suspension n'est pas justifiée..."
                      maxlength="1000"></textarea>
                    <p class="text-xs text-[#6A6F73] mt-1">{{ appealReason.length }}/1000 caractères</p>
                  </div>

                  <button
                    (click)="submitAppeal()"
                    [disabled]="appealReason.length < 20 || isSubmitting"
                    class="btn btn-primary w-full">
                    @if (isSubmitting) {
                      <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    } @else {
                      Soumettre ma contestation
                    }
                  </button>
                  @if (appealError) {
                    <div class="alert alert-error mt-3">{{ appealError }}</div>
                  }
                </div>
              </div>
            } @else {
              <!-- Contestation déjà soumise -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <h4 class="font-semibold text-blue-800">Contestation en cours d'examen</h4>
                    <p class="text-sm text-blue-700 mt-1">
                      Votre contestation a été soumise le {{ lastAppealDate | date:'dd/MM/yyyy à HH:mm' }}.
                      Notre équipe l'examine actuellement. Vous recevrez une réponse sous 48 heures.
                    </p>
                  </div>
                </div>
              </div>
            }

            <!-- Contact support -->
            <div class="mt-6 text-center">
              <p class="text-sm text-[#6A6F73]">
                Besoin d'aide ? Contactez-nous à
                <a href="mailto:support@sencours.sn" class="text-[#5624D0] hover:underline">support&#64;sencours.sn</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-[#F7F9FA] px-8 py-4 border-t border-[#E4E8EB]">
            <button (click)="logout()" class="text-sm text-[#6A6F73] hover:text-[#1C1D1F] transition-colors">
              ← Se déconnecter et revenir à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuspendedComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private appealService = inject(SuspensionAppealService);

  appealReason = '';
  appealError = '';
  isSubmitting = false;
  hasSubmittedAppeal = false;
  lastAppealDate: Date | null = null;

  ngOnInit() {
    this.checkPendingAppeal();
  }

  checkPendingAppeal() {
    this.appealService.getMyAppeals().subscribe({
      next: (appeals) => {
        const pendingAppeal = appeals.find(a => a.status === 'PENDING');
        if (pendingAppeal) {
          this.hasSubmittedAppeal = true;
          this.lastAppealDate = new Date(pendingAppeal.createdAt);
        }
      }
    });
  }

  submitAppeal() {
    if (this.appealReason.length < 20) return;

    this.appealError = '';
    this.isSubmitting = true;
    this.appealService.submitAppeal(this.appealReason).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.hasSubmittedAppeal = true;
        this.lastAppealDate = new Date();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.appealError = err.error?.message || 'Erreur lors de l\'envoi';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
