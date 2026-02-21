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
      <!-- Left: Form -->
      <div class="flex-1 flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-[400px]">

          <!-- Logo mobile -->
          <a routerLink="/" class="flex items-center gap-2 mb-8 lg:hidden">
            <div class="w-8 h-8 bg-[#5624D0] rounded flex items-center justify-center">
              <span class="text-white font-bold">S</span>
            </div>
            <span class="text-xl font-bold text-[#1C1D1F]">SenCours</span>
          </a>

          <h1 class="text-[28px] font-bold text-[#1C1D1F] leading-tight">
            Connectez-vous à votre compte
          </h1>
          <p class="mt-2 text-[#6A6F73]">
            Pas encore inscrit ?
            <a routerLink="/register" class="link">Créer un compte</a>
          </p>

          @if (errorMessage) {
            <div class="alert alert-error mt-6">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
            <div>
              <label class="label">Adresse email</label>
              <input
                type="email"
                formControlName="email"
                class="input"
                [class.input-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="nom@exemple.com">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-[#C4302B]">Veuillez entrer une adresse email valide</p>
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

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="btn btn-primary w-full btn-lg mt-6">
              @if (isLoading) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              } @else {
                Se connecter
              }
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-[#6A6F73]">
            <a href="#" class="link">Mot de passe oublié ?</a>
          </p>
        </div>
      </div>

      <!-- Right: Branding -->
      <div class="hidden lg:flex flex-1 bg-[#1C1D1F] items-center justify-center p-12">
        <div class="max-w-md text-center">
          <div class="w-16 h-16 bg-[#5624D0] rounded-lg flex items-center justify-center mx-auto mb-8">
            <span class="text-white font-bold text-3xl">S</span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-4">
            Bienvenue sur SenCours
          </h2>
          <p class="text-[#A1A1A1] text-lg leading-relaxed">
            La première plateforme d'apprentissage en ligne du Sénégal.
            Accédez à des centaines de cours créés par des experts locaux.
          </p>
          <div class="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <p class="text-3xl font-bold text-white">500+</p>
              <p class="text-sm text-[#A1A1A1] mt-1">Cours</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">10K+</p>
              <p class="text-sm text-[#A1A1A1] mt-1">Étudiants</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-white">50+</p>
              <p class="text-sm text-[#A1A1A1] mt-1">Instructeurs</p>
            </div>
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
