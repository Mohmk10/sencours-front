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

          <h1 class="text-2xl font-bold text-[#1C1D1F] mb-1">Connexion à votre compte</h1>
          <p class="text-sm text-[#6A6F73] mb-8">
            Pas encore de compte ?
            <a routerLink="/register" class="text-[#5624D0] font-semibold hover:underline">S'inscrire gratuitement</a>
          </p>

          @if (errorMessage) {
            <div class="mb-5 p-3.5 bg-red-50 border-l-4 border-[#EF4444] text-sm text-red-700">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-[#1C1D1F] mb-1.5">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                placeholder="votre@email.com">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-xs text-[#EF4444]">Veuillez entrer un email valide</p>
              }
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-bold text-[#1C1D1F]">Mot de passe</label>
                <a href="#" class="text-xs text-[#5624D0] hover:underline">Mot de passe oublié ?</a>
              </div>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border border-[#1C1D1F] text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0] transition-colors"
                placeholder="Votre mot de passe">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-xs text-[#EF4444]">Le mot de passe est requis</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="btn-primary w-full py-3 text-base">
              @if (isLoading) { Connexion en cours... }
              @else { Se connecter }
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-[#D1D7DC] text-center">
            <p class="text-xs text-[#6A6F73]">
              En vous connectant, vous acceptez nos
              <a href="#" class="text-[#5624D0] hover:underline">Conditions d'utilisation</a>
              et notre
              <a href="#" class="text-[#5624D0] hover:underline">Politique de confidentialité</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Right - Branding -->
      <div class="hidden lg:flex flex-1 bg-[#5624D0] items-center justify-center">
        <div class="text-center text-white px-12 max-w-md">
          <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold mb-4">Apprenez sans limites</h2>
          <p class="text-base text-white text-opacity-90 leading-relaxed">
            Accédez à des milliers de cours créés par des experts du Sénégal et d'ailleurs. Apprenez à votre rythme, où que vous soyez.
          </p>
          <div class="mt-8 flex justify-center gap-8 text-sm">
            <div class="text-center">
              <p class="text-2xl font-bold">500+</p>
              <p class="text-white text-opacity-75 mt-0.5">Cours</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">10k+</p>
              <p class="text-white text-opacity-75 mt-0.5">Étudiants</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">200+</p>
              <p class="text-white text-opacity-75 mt-0.5">Instructeurs</p>
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
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        }
      });
    }
  }
}
