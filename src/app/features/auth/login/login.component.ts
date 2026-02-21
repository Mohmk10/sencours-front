import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 auth-bg">

      <!-- Centered card -->
      <div class="w-full max-w-[420px]">

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

          <h1 class="text-2xl font-bold mb-1" style="color: var(--ink);">Connexion</h1>
          <p class="text-sm mb-6" style="color: var(--ink-3);">
            Pas encore inscrit ?
            <a routerLink="/register" class="link font-semibold">Créer un compte</a>
          </p>

          @if (errorMessage) {
            <div class="alert alert-error mb-5">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="label">Adresse email</label>
              <input
                type="email"
                formControlName="email"
                class="input"
                [class.input-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="nom@exemple.com">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-xs" style="color: #EF4444;">Veuillez entrer une adresse email valide</p>
              }
            </div>

            <div>
              <label class="label">Mot de passe</label>
              <input
                type="password"
                formControlName="password"
                class="input"
                [class.input-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Entrez votre mot de passe">
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="btn btn-primary w-full"
                style="padding: 12px 24px; font-size: 15px;">
                @if (isLoading) {
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                } @else {
                  Se connecter
                }
              </button>
            </div>
          </form>

          <div class="mt-5 pt-5 text-center" style="border-top: 1px solid var(--border);">
            <a href="#" class="text-sm link">Mot de passe oublié ?</a>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="font-bold text-lg" style="color: var(--ink);">500+</p>
            <p class="text-xs" style="color: var(--ink-3);">Cours</p>
          </div>
          <div>
            <p class="font-bold text-lg" style="color: var(--ink);">10K+</p>
            <p class="text-xs" style="color: var(--ink-3);">Étudiants</p>
          </div>
          <div>
            <p class="font-bold text-lg" style="color: var(--ink);">50+</p>
            <p class="text-xs" style="color: var(--ink-3);">Instructeurs</p>
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user?.role === 'SUPER_ADMIN') {
          this.router.navigate(['/super-admin']);
        } else if (user?.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}
