import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white flex">
      <!-- Left - Form -->
      <div class="flex-1 flex items-center justify-center px-8 py-12">
        <div class="w-full max-w-md">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 mb-8">
            <div class="w-8 h-8 bg-[#5624D0] rounded flex items-center justify-center">
              <span class="text-white font-bold text-base">S</span>
            </div>
            <span class="text-lg font-bold text-[#1C1D1F]">SenCours</span>
          </a>

          <h1 class="text-2xl font-bold text-[#1C1D1F] mb-1">Créez votre compte</h1>
          <p class="text-sm text-[#6A6F73] mb-8">
            Déjà un compte ?
            <a routerLink="/login" class="text-[#5624D0] font-semibold hover:underline">Se connecter</a>
          </p>

          @if (errorMessage) {
            <div class="mb-5 p-3.5 bg-red-50 border-l-4 border-[#EF4444] text-sm text-red-700">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Prénom</label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                  placeholder="Prénom">
                @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                  <p class="mt-1 text-xs text-[#EF4444]">Prénom requis</p>
                }
              </div>
              <div>
                <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Nom</label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                  placeholder="Nom">
                @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                  <p class="mt-1 text-xs text-[#EF4444]">Nom requis</p>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                placeholder="votre@email.com">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-xs text-[#EF4444]">Veuillez entrer un email valide</p>
              }
            </div>

            <div>
              <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Mot de passe</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                placeholder="Minimum 8 caractères">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-xs text-[#EF4444]">Le mot de passe doit contenir au moins 8 caractères</p>
              }
            </div>

            <div>
              <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                formControlName="confirmPassword"
                class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                placeholder="Répétez votre mot de passe">
              @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
                <p class="mt-1 text-xs text-[#EF4444]">Les mots de passe ne correspondent pas</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="btn-primary w-full py-3 text-base">
              @if (isLoading) { Inscription en cours... }
              @else { S'inscrire }
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-[#D1D7DC] text-center">
            <p class="text-xs text-[#6A6F73]">
              En vous inscrivant, vous acceptez nos
              <a href="#" class="text-[#5624D0] hover:underline">Conditions d'utilisation</a>
              et notre
              <a href="#" class="text-[#5624D0] hover:underline">Politique de confidentialité</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Right - Branding -->
      <div class="hidden lg:flex flex-1 bg-[#1C1D1F] items-center justify-center">
        <div class="text-center text-white px-12 max-w-md">
          <h2 class="text-3xl font-bold mb-4">Rejoignez SenCours</h2>
          <p class="text-base text-gray-400 leading-relaxed mb-8">
            Apprenez auprès des meilleurs instructeurs sénégalais. Démarrez votre parcours d'apprentissage dès aujourd'hui.
          </p>
          <div class="space-y-4 text-left">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#5624D0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">Accès illimité</p>
                <p class="text-xs text-gray-400 mt-0.5">Apprenez à votre propre rythme, quand vous voulez</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#5624D0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">Certificats reconnus</p>
                <p class="text-xs text-gray-400 mt-0.5">Obtenez des certificats valorisés par les employeurs</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#5624D0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">Instructeurs experts</p>
                <p class="text-xs text-gray-400 mt-0.5">Des professionnels du secteur comme formateurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { confirmPassword, ...registerData } = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
        }
      });
    }
  }
}
