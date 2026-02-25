import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 transition-opacity"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
               [class.max-w-lg]="size === 'lg'"
               [class.max-w-xl]="size === 'xl'"
               (click)="$event.stopPropagation()">

            <!-- Header -->
            @if (title) {
              <div class="flex items-center justify-between p-6 border-b border-[#E4E8EB]">
                <div class="flex items-center gap-3">
                  @if (type === 'warning') {
                    <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                  }
                  @if (type === 'danger') {
                    <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </div>
                  }
                  @if (type === 'success') {
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  }
                  @if (type === 'info') {
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  }
                  <h3 class="text-lg font-bold text-[#1C1D1F]">{{ title }}</h3>
                </div>
                <button (click)="close()" class="text-[#6A6F73] hover:text-[#1C1D1F] transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }

            <!-- Body -->
            <div class="p-6">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="flex justify-end gap-3 p-6 border-t border-[#E4E8EB] bg-[#F7F9FA] rounded-b-xl">
                @if (showCancel) {
                  <button (click)="close()" class="btn btn-secondary">
                    {{ cancelText }}
                  </button>
                }
                @if (showConfirm) {
                  <button
                    (click)="onConfirm()"
                    [disabled]="confirmDisabled"
                    class="btn"
                    [ngClass]="{
                      'bg-red-500 hover:bg-red-600 text-white': type === 'danger',
                      'bg-orange-500 hover:bg-orange-600 text-white': type === 'warning',
                      'bg-green-500 hover:bg-green-600 text-white': type === 'success',
                      'btn-primary': type === 'info' || !type
                    }">
                    {{ confirmText }}
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() type: 'info' | 'warning' | 'danger' | 'success' = 'info';
  @Input() size: 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Input() showCancel = true;
  @Input() showConfirm = true;
  @Input() cancelText = 'Annuler';
  @Input() confirmText = 'Confirmer';
  @Input() confirmDisabled = false;
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  onConfirm() {
    this.confirmed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }
}
