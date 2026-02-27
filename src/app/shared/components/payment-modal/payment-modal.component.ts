import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { PaymentResponse } from '../../../core/models';

type PaymentMethod = 'ORANGE_MONEY' | 'WAVE' | 'YAS' | 'CARD';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  logo?: string;
  icon?: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 backdrop-blur-sm" style="background: rgba(13,11,32,0.6);" (click)="close()"></div>

        <!-- Modal -->
        <div class="relative bg-white w-full max-w-md overflow-hidden"
             style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg); animation: scaleIn 0.2s ease-out;">

          <!-- Header -->
          <div class="p-6 text-white" style="background: var(--gradient-brand);">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold">Paiement sécurisé</h2>
                <p class="text-sm mt-1" style="color: rgba(255,255,255,0.7);">{{ courseTitle }}</p>
              </div>
              <button (click)="close()" class="p-2 rounded-full transition-colors" style="background: rgba(255,255,255,0.1);"
                      onmouseenter="this.style.background='rgba(255,255,255,0.2)'"
                      onmouseleave="this.style.background='rgba(255,255,255,0.1)'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="mt-4 p-4 rounded-xl" style="background: rgba(255,255,255,0.12);">
              <p class="text-xs" style="color: rgba(255,255,255,0.6);">Montant à payer</p>
              <p class="text-3xl font-bold" style="color: var(--amber-mid);">{{ price | number }} FCFA</p>
            </div>
          </div>

          @switch (step) {
            <!-- ===== ÉTAPE 1 : Sélection du mode ===== -->
            @case ('select') {
              <div class="p-6">
                <h3 class="font-semibold mb-4" style="color: var(--ink);">Choisissez votre mode de paiement</h3>

                <div class="space-y-3">
                  @for (method of paymentMethods; track method.id) {
                    <button
                      (click)="selectMethod(method.id)"
                      class="w-full flex items-center gap-4 p-4 transition-all text-left"
                      [style.border]="selectedMethod === method.id ? '2px solid var(--violet)' : '1px solid var(--border)'"
                      [style.background]="selectedMethod === method.id ? 'var(--violet-xlight)' : 'white'"
                      style="border-radius: var(--r-lg);">
                      <div class="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                           [style.background]="method.logo ? 'white' : method.color + '18'"
                           [style.border]="method.logo ? '1px solid var(--border)' : 'none'">
                        @if (method.logo) {
                          <img [src]="method.logo" [alt]="method.name" class="w-9 h-9 object-contain">
                        } @else {
                          <span class="text-2xl">{{ method.icon }}</span>
                        }
                      </div>
                      <div class="flex-1">
                        <p class="font-semibold" style="color: var(--ink);">{{ method.name }}</p>
                        <p class="text-xs" style="color: var(--ink-3);">{{ method.description }}</p>
                      </div>
                      @if (selectedMethod === method.id) {
                        <svg class="w-5 h-5 flex-shrink-0" style="color: var(--violet);" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      }
                    </button>
                  }
                </div>

                <button
                  (click)="goToConfirm()"
                  [disabled]="!selectedMethod"
                  class="btn btn-primary w-full mt-6">
                  Continuer
                </button>
              </div>
            }

            <!-- ===== ÉTAPE 2 : Confirmation ===== -->
            @case ('confirm') {
              <div class="p-6">
                <button (click)="step = 'select'" class="flex items-center gap-1.5 text-sm mb-4 transition-colors"
                        style="color: var(--violet);"
                        onmouseenter="this.style.textDecoration='underline'"
                        onmouseleave="this.style.textDecoration='none'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Retour
                </button>

                <div class="flex items-center gap-4 p-4 mb-6" style="background: var(--canvas); border-radius: var(--r-lg);">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                       [style.background]="getSelectedMethodLogo() ? 'white' : getSelectedMethodColor() + '18'"
                       [style.border]="getSelectedMethodLogo() ? '1px solid var(--border)' : 'none'">
                    @if (getSelectedMethodLogo()) {
                      <img [src]="getSelectedMethodLogo()" [alt]="getSelectedMethodName()" class="w-9 h-9 object-contain">
                    } @else {
                      <span class="text-2xl">{{ getSelectedMethodIcon() }}</span>
                    }
                  </div>
                  <div>
                    <p class="font-semibold" style="color: var(--ink);">{{ getSelectedMethodName() }}</p>
                    <p class="text-sm" style="color: var(--ink-3);">{{ price | number }} FCFA</p>
                  </div>
                </div>

                @if (selectedMethod !== 'CARD') {
                  <div class="mb-6">
                    <label class="label">Numéro de téléphone</label>
                    <div class="flex">
                      <span class="inline-flex items-center px-4 text-sm"
                            style="background: var(--canvas); border: 1px solid var(--border); border-right: none; border-radius: var(--r-sm) 0 0 var(--r-sm); color: var(--ink-3);">
                        +221
                      </span>
                      <input
                        type="tel"
                        [(ngModel)]="phoneNumber"
                        placeholder="77 123 45 67"
                        class="input flex-1"
                        style="border-radius: 0 var(--r-sm) var(--r-sm) 0;"
                        maxlength="12">
                    </div>
                    <p class="text-xs mt-1.5" style="color: var(--ink-4);">
                      Vous recevrez une demande de confirmation sur ce numéro
                    </p>
                  </div>
                }

                <button
                  (click)="processPayment()"
                  [disabled]="isProcessing || (selectedMethod !== 'CARD' && !phoneNumber)"
                  class="btn btn-primary w-full">
                  @if (isProcessing) {
                    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  } @else {
                    Payer {{ price | number }} FCFA
                  }
                </button>
              </div>
            }

            <!-- ===== ÉTAPE 3 : Traitement ===== -->
            @case ('processing') {
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 relative">
                  <div class="absolute inset-0 rounded-full" style="border: 4px solid var(--border);"></div>
                  <div class="absolute inset-0 rounded-full animate-spin" style="border: 4px solid var(--violet); border-top-color: transparent;"></div>
                  <div class="absolute inset-2 rounded-full flex items-center justify-center overflow-hidden" style="background: var(--violet-xlight);">
                    @if (getSelectedMethodLogo()) {
                      <img [src]="getSelectedMethodLogo()" [alt]="getSelectedMethodName()" class="w-8 h-8 object-contain">
                    } @else {
                      <span class="text-2xl">{{ getSelectedMethodIcon() }}</span>
                    }
                  </div>
                </div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--ink);">Paiement en cours</h3>
                <p style="color: var(--ink-3);">
                  @if (selectedMethod === 'CARD') {
                    Vérification de votre carte...
                  } @else {
                    Veuillez confirmer le paiement sur votre téléphone
                  }
                </p>
                <div class="mt-6 flex justify-center gap-1">
                  <div class="w-2 h-2 rounded-full animate-bounce" style="background: var(--violet); animation-delay: 0ms"></div>
                  <div class="w-2 h-2 rounded-full animate-bounce" style="background: var(--violet); animation-delay: 150ms"></div>
                  <div class="w-2 h-2 rounded-full animate-bounce" style="background: var(--violet); animation-delay: 300ms"></div>
                </div>
              </div>
            }

            <!-- ===== ÉTAPE 4 : Succès ===== -->
            @case ('success') {
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background: var(--green-tint);">
                  <svg class="w-10 h-10" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--ink);">Paiement réussi !</h3>
                <p class="mb-2" style="color: var(--ink-3);">Vous êtes maintenant inscrit au cours</p>
                <p class="text-sm mb-6" style="color: var(--ink-4);">
                  Référence : <span class="font-mono font-semibold" style="color: var(--ink);">{{ paymentReference }}</span>
                </p>
                <button (click)="onSuccess()" class="btn btn-primary w-full">
                  Commencer le cours
                </button>
              </div>
            }

            <!-- ===== ÉTAPE 5 : Erreur ===== -->
            @case ('error') {
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style="background: rgba(239,68,68,0.1);">
                  <svg class="w-10 h-10" style="color: #EF4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--ink);">Échec du paiement</h3>
                <p class="mb-6" style="color: var(--ink-3);">{{ errorMessage }}</p>
                <div class="space-y-3">
                  <button (click)="step = 'select'" class="btn btn-primary w-full">Réessayer</button>
                  <button (click)="close()" class="btn btn-secondary w-full">Annuler</button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class PaymentModalComponent {
  @Input() isOpen = false;
  @Input() courseId!: number;
  @Input() courseTitle = '';
  @Input() price = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() enrolled = new EventEmitter<string>();

  private enrollmentService = inject(EnrollmentService);

  step: 'select' | 'confirm' | 'processing' | 'success' | 'error' = 'select';
  selectedMethod: PaymentMethod | null = null;
  phoneNumber = '';
  isProcessing = false;
  paymentReference = '';
  errorMessage = '';

  paymentMethods: PaymentMethodOption[] = [
    { id: 'ORANGE_MONEY', name: 'Orange Money', logo: 'assets/images/orange-money.png', color: '#FF6600', description: 'Paiement via votre compte Orange Money' },
    { id: 'WAVE', name: 'Wave', logo: 'assets/images/wave.jpg', color: '#1DC2FF', description: 'Paiement instantane avec Wave' },
    { id: 'YAS', name: 'Yas (ex Free Money)', logo: 'assets/images/yas.jpg', color: '#00A651', description: 'Paiement via Yas' },
    { id: 'CARD', name: 'Carte bancaire', icon: '💳', color: '#1A1F71', description: 'Visa, Mastercard, etc.' }
  ];

  selectMethod(method: PaymentMethod) {
    this.selectedMethod = method;
  }

  goToConfirm() {
    if (this.selectedMethod) this.step = 'confirm';
  }

  getSelectedMethodName(): string {
    return this.paymentMethods.find(m => m.id === this.selectedMethod)?.name || '';
  }

  getSelectedMethodIcon(): string {
    return this.paymentMethods.find(m => m.id === this.selectedMethod)?.icon || '';
  }

  getSelectedMethodLogo(): string | undefined {
    return this.paymentMethods.find(m => m.id === this.selectedMethod)?.logo;
  }

  getSelectedMethodColor(): string {
    return this.paymentMethods.find(m => m.id === this.selectedMethod)?.color || '#5B21B6';
  }

  processPayment() {
    if (!this.selectedMethod) return;
    this.isProcessing = true;
    this.step = 'processing';

    setTimeout(() => {
      this.enrollmentService.initiatePayment(this.courseId, {
        paymentMethod: this.selectedMethod!,
        paymentPhone: this.phoneNumber
      }).subscribe({
        next: (response: PaymentResponse) => {
          if (response.status === 'SUCCESS') {
            this.paymentReference = response.reference;
            this.completeEnrollment(response.reference);
          } else {
            this.errorMessage = response.message || 'Le paiement a échoué';
            this.step = 'error';
            this.isProcessing = false;
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Une erreur est survenue';
          this.step = 'error';
          this.isProcessing = false;
        }
      });
    }, 2000);
  }

  private completeEnrollment(reference: string) {
    this.enrollmentService.completeEnrollment(this.courseId, reference).subscribe({
      next: () => {
        this.step = 'success';
        this.isProcessing = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
        this.step = 'error';
        this.isProcessing = false;
      }
    });
  }

  onSuccess() {
    this.enrolled.emit(this.paymentReference);
    this.close();
  }

  close() {
    this.step = 'select';
    this.selectedMethod = null;
    this.phoneNumber = '';
    this.isProcessing = false;
    this.closed.emit();
  }
}
