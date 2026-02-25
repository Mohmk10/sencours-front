import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalType = 'info' | 'warning' | 'danger' | 'success';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
             (click)="onCancel()"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-modal-in">

            <!-- Icône en haut -->
            <div class="pt-8 pb-4 text-center">
              <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                   [ngClass]="{
                     'bg-red-100': type === 'danger',
                     'bg-orange-100': type === 'warning',
                     'bg-green-100': type === 'success',
                     'bg-blue-100': type === 'info'
                   }">
                @if (type === 'danger') {
                  <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                }
                @if (type === 'warning') {
                  <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                }
                @if (type === 'success') {
                  <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                }
                @if (type === 'info') {
                  <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
              </div>
            </div>

            <!-- Contenu -->
            <div class="px-8 pb-6 text-center">
              <h3 class="text-xl font-bold text-[#1C1D1F] mb-2">{{ title }}</h3>
              <p class="text-[#6A6F73] whitespace-pre-line">{{ message }}</p>
            </div>

            <!-- Boutons -->
            <div class="flex gap-3 p-6 bg-[#F7F9FA] rounded-b-2xl">
              @if (showCancel) {
                <button
                  (click)="onCancel()"
                  class="flex-1 px-4 py-3 rounded-lg border border-[#E4E8EB] bg-white text-[#1C1D1F] font-semibold hover:bg-[#F7F9FA] transition-colors">
                  {{ cancelText }}
                </button>
              }
              <button
                (click)="onConfirm()"
                class="flex-1 px-4 py-3 rounded-lg font-semibold transition-colors"
                [ngClass]="{
                  'bg-red-500 hover:bg-red-600 text-white': type === 'danger',
                  'bg-orange-500 hover:bg-orange-600 text-white': type === 'warning',
                  'bg-green-500 hover:bg-green-600 text-white': type === 'success',
                  'bg-[#5624D0] hover:bg-[#401B9C] text-white': type === 'info'
                }">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes modal-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animate-modal-in {
      animation: modal-in 0.2s ease-out;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Input() type: ModalType = 'info';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() showCancel = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
