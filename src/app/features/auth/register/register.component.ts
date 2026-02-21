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
    <div class="min-h-screen flex items-center justify-center p-4 auth-bg">

      <!-- Centered card -->
      <div class="w-full max-w-[440px]">

        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-0">
            <span class="text-2xl font-medium" style="color: var(--ink-3);">Sen</span>
            <span class="text-2xl font-bold" style="color: var(--ink);">Cours</span>
          </a>
        </div>

        <!-- Card -->
        <div class="bg-white p-8"
             style="border-radius: var(--r-xl); border: 1px solid var(--border); box-shadow: var(--shadow-lg);">

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

        <!-- Benefits strip -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2.5 p-3 bg-white rounded-lg"
               style="border: 1px solid var(--border);">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                 style="background: var(--violet-tint);">
              <svg class="w-3.5 h-3.5" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-xs font-medium" style="color: var(--ink-2);">Accès illimité</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 bg-white rounded-lg"
               style="border: 1px solid var(--border);">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                 style="background: var(--amber-tint);">
              <svg class="w-3.5 h-3.5" style="color: var(--amber-mid);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium" style="color: var(--ink-2);">Certificats reconnus</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 bg-white rounded-lg"
               style="border: 1px solid var(--border);">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                 style="background: var(--green-tint);">
              <svg class="w-3.5 h-3.5" style="color: var(--green);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium" style="color: var(--ink-2);">Experts locaux</span>
          </div>
          <div class="flex items-center gap-2.5 p-3 bg-white rounded-lg"
               style="border: 1px solid var(--border);">
            <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                 style="background: var(--violet-tint);">
              <svg class="w-3.5 h-3.5" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="text-xs font-medium" style="color: var(--ink-2);">Apprenez à votre rythme</span>
          </div>
        </div>
      </div>

      <style>
        .auth-bg {
          background-color: var(--canvas);
          background-image: radial-gradient(circle at 20% 20%, rgba(91,33,182,0.04) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(217,119,6,0.04) 0%, transparent 50%);
        }
      </style>
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
