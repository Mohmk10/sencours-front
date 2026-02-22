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
    <div class="min-h-screen flex">

      <!-- Left: Form panel -->
      <div class="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div class="w-full max-w-[420px] py-6">

          <!-- Logo -->
          <a routerLink="/" class="inline-flex items-center gap-2.5 mb-8">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="url(#reg-logo-g)"/>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
                fill="white" fill-opacity="0.95"/>
              <defs>
                <linearGradient id="reg-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#5B21B6"/>
                  <stop offset="0.65" stop-color="#7C3AED"/>
                  <stop offset="1" stop-color="#D97706" stop-opacity="0.85"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="text-xl leading-none">
              <span style="color:var(--ink-3);font-weight:500">Sen</span><span style="color:var(--violet);font-weight:800">Cours</span>
            </span>
          </a>

          <h1 class="text-2xl font-bold mb-1" style="color: var(--ink);">Créer un compte</h1>
          <p class="text-sm mb-6" style="color: var(--ink-3);">
            Déjà inscrit ?
            <a routerLink="/login" class="link font-semibold">Se connecter</a>
          </p>

          @if (errorMessage) {
            <div class="alert alert-error mb-5">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">Prénom</label>
                <input type="text" formControlName="firstName" class="input" placeholder="Prénom">
                @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                  <p class="mt-1 text-xs" style="color: #EF4444;">Requis</p>
                }
              </div>
              <div>
                <label class="label">Nom</label>
                <input type="text" formControlName="lastName" class="input" placeholder="Nom">
                @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                  <p class="mt-1 text-xs" style="color: #EF4444;">Requis</p>
                }
              </div>
            </div>

            <div>
              <label class="label">Adresse email</label>
              <input
                type="email"
                formControlName="email"
                class="input"
                [class.input-error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="nom@exemple.com">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-xs" style="color: #EF4444;">Veuillez entrer un email valide</p>
              }
            </div>

            <div>
              <label class="label">Mot de passe</label>
              <input
                type="password"
                formControlName="password"
                class="input"
                [class.input-error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="Minimum 8 caractères">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-xs" style="color: #EF4444;">Le mot de passe doit contenir au moins 8 caractères</p>
              }
            </div>

            <div>
              <label class="label">Confirmer le mot de passe</label>
              <input
                type="password"
                formControlName="confirmPassword"
                class="input"
                [class.input-error]="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched"
                placeholder="Répétez votre mot de passe">
              @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
                <p class="mt-1 text-xs" style="color: #EF4444;">Les mots de passe ne correspondent pas</p>
              }
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="registerForm.invalid || isLoading"
                class="btn btn-primary w-full"
                style="padding: 12px 24px; font-size: 15px;">
                @if (isLoading) { Inscription en cours... } @else { Créer mon compte }
              </button>
            </div>
          </form>

          <p class="mt-5 text-xs text-center" style="color: var(--ink-4); line-height: 1.6;">
            En vous inscrivant, vous acceptez nos
            <a href="#" class="link">Conditions d'utilisation</a> et notre
            <a href="#" class="link">Politique de confidentialité</a>.
          </p>
        </div>
      </div>

      <!-- Right: Brand panel (hidden on mobile) -->
      <div class="hidden md:flex w-[42%] flex-shrink-0 flex-col items-center justify-center p-12 relative overflow-hidden"
           style="background: var(--gradient-dark);">

        <!-- Decorative blobs -->
        <div class="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
             style="background: rgba(124,58,237,0.12); filter: blur(60px);"></div>
        <div class="absolute bottom-[-60px] right-[-80px] w-56 h-56 rounded-full pointer-events-none"
             style="background: rgba(217,119,6,0.10); filter: blur(50px);"></div>

        <!-- Logo large -->
        <svg width="52" height="52" viewBox="0 0 36 36" fill="none" class="mb-8">
          <rect width="36" height="36" rx="9" fill="url(#reg-side-logo-g)"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
            fill="white" fill-opacity="0.95"/>
          <defs>
            <linearGradient id="reg-side-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stop-color="#5B21B6"/>
              <stop offset="0.65" stop-color="#7C3AED"/>
              <stop offset="1" stop-color="#D97706" stop-opacity="0.85"/>
            </linearGradient>
          </defs>
        </svg>

        <h2 class="text-2xl font-bold text-white text-center mb-8 leading-snug">
          Rejoignez 10 000+<br>apprenants
        </h2>

        <!-- Advantages -->
        <div class="space-y-4 w-full max-w-[280px] mb-10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.25);">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-sm text-white opacity-90">Accès illimité à 500+ cours</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.25);">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-sm text-white opacity-90">Certificats reconnus</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.25);">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span class="text-sm text-white opacity-90">Experts sénégalais de haut niveau</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.25);">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="text-sm text-white opacity-90">Apprenez à votre propre rythme</span>
          </div>
        </div>

        <p class="text-xs text-center opacity-40 text-white">
          Inscription gratuite · Annulez à tout moment
        </p>
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
    if (this.registerForm.invalid) return;

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
