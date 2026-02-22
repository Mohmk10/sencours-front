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
    <div class="min-h-screen flex">

      <!-- Left: Form panel -->
      <div class="flex-1 flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-[400px]">

          <!-- Logo -->
          <a routerLink="/" class="inline-flex items-center gap-2.5 mb-10">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="url(#login-logo-g)"/>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
                fill="white" fill-opacity="0.95"/>
              <defs>
                <linearGradient id="login-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
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

          <h1 class="text-2xl font-bold mb-1" style="color: var(--ink);">Connexion</h1>
          <p class="text-sm mb-7" style="color: var(--ink-3);">
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
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="input"
                  style="padding-right: 44px;"
                  [class.input-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  placeholder="Entrez votre mot de passe">
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                  style="color: var(--ink-4); background: none; border: none; cursor: pointer; padding: 2px; display: flex; align-items: center;">
                  @if (showPassword) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
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
      </div>

      <!-- Right: Brand panel (hidden on mobile) -->
      <div class="hidden md:flex w-[45%] flex-shrink-0 flex-col items-center justify-center p-14 relative overflow-hidden"
           style="background: var(--gradient-dark);">

        <!-- Decorative blobs -->
        <div class="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
             style="background: rgba(124,58,237,0.18); filter: blur(80px);"></div>
        <div class="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full pointer-events-none"
             style="background: rgba(217,119,6,0.15); filter: blur(70px);"></div>

        <!-- Logo large -->
        <svg width="120" height="120" viewBox="0 0 36 36" fill="none" class="mb-10">
          <rect width="36" height="36" rx="9" fill="url(#login-side-logo-g)"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M18 7C18 7 11 13 11 20a7 7 0 0014 0c0-7-7-13-7-13zm0 17a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"
            fill="white" fill-opacity="0.95"/>
          <defs>
            <linearGradient id="login-side-logo-g" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stop-color="#5B21B6"/>
              <stop offset="0.65" stop-color="#7C3AED"/>
              <stop offset="1" stop-color="#D97706" stop-opacity="0.85"/>
            </linearGradient>
          </defs>
        </svg>

        <h2 class="font-bold text-white text-center mb-10 leading-tight"
            style="font-size: 2.6rem;">
          Apprenez avec<br>les meilleurs
        </h2>

        <!-- Features -->
        <div class="space-y-6 w-full mb-12">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.32);">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span class="text-xl font-medium text-white" style="opacity: 0.93;">Cours créés par des experts locaux</span>
          </div>
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.32);">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xl font-medium text-white" style="opacity: 0.93;">Certificats reconnus par les entreprises</span>
          </div>
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style="background: rgba(124,58,237,0.32);">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="text-xl font-medium text-white" style="opacity: 0.93;">Apprenez à votre rythme, partout</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-12">
          <div class="text-center">
            <p class="font-bold leading-none" style="color: var(--amber-mid); font-size: 3.5rem;">500+</p>
            <p class="text-base text-white mt-2" style="opacity: 0.5;">Cours</p>
          </div>
          <div class="w-px h-14 opacity-15 bg-white"></div>
          <div class="text-center">
            <p class="font-bold leading-none" style="color: var(--amber-mid); font-size: 3.5rem;">10K+</p>
            <p class="text-base text-white mt-2" style="opacity: 0.5;">Étudiants</p>
          </div>
        </div>
      </div>

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
  showPassword = false;

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
