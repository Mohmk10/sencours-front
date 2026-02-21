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
      <!-- Left: Form -->
      <div class="flex-1 flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-[400px]">

          <a routerLink="/" class="flex items-center gap-2 mb-8 lg:hidden">
            <div class="w-8 h-8 bg-[#5624D0] rounded flex items-center justify-center">
              <span class="text-white font-bold">S</span>
            </div>
            <span class="text-xl font-bold text-[#1C1D1F]">SenCours</span>
          </a>

          <h1 class="text-[28px] font-bold text-[#1C1D1F] leading-tight">
            Créez votre compte
          </h1>
          <p class="mt-2 text-[#6A6F73]">
            Déjà inscrit ?
            <a routerLink="/login" class="link">Se connecter</a>
          </p>

          @if (errorMessage) {
            <div class="alert alert-error mt-6">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Prénom</label>
                <input type="text" formControlName="firstName" class="input" placeholder="Prénom">
                @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                  <p class="mt-1 text-sm text-[#C4302B]">Requis</p>
                }
              </div>
              <div>
                <label class="label">Nom</label>
                <input type="text" formControlName="lastName" class="input" placeholder="Nom">
                @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                  <p class="mt-1 text-sm text-[#C4302B]">Requis</p>
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
                <p class="mt-1 text-sm text-[#C4302B]">Veuillez entrer un email valide</p>
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
                <p class="mt-1 text-sm text-[#C4302B]">Le mot de passe doit contenir au moins 8 caractères</p>
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
                <p class="mt-1 text-sm text-[#C4302B]">Les mots de passe ne correspondent pas</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="btn btn-primary w-full btn-lg mt-6">
              @if (isLoading) { Inscription en cours... } @else { S'inscrire }
            </button>
          </form>

          <p class="mt-6 text-xs text-[#6A6F73] text-center leading-relaxed">
            En vous inscrivant, vous acceptez nos
            <a href="#" class="link">Conditions d'utilisation</a> et notre
            <a href="#" class="link">Politique de confidentialité</a>.
          </p>
        </div>
      </div>

      <!-- Right: Branding -->
      <div class="hidden lg:flex flex-1 bg-[#5624D0] items-center justify-center p-12">
        <div class="max-w-md">
          <h2 class="text-3xl font-bold text-white mb-6">
            Rejoignez la communauté SenCours
          </h2>
          <ul class="space-y-5">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Accès illimité</p>
                <p class="text-white text-opacity-70 text-sm mt-0.5">Apprenez à votre rythme, quand vous voulez</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Certificats reconnus</p>
                <p class="text-white text-opacity-70 text-sm mt-0.5">Obtenez des certificats valorisés par les employeurs</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Instructeurs experts</p>
                <p class="text-white text-opacity-70 text-sm mt-0.5">Des professionnels du secteur comme formateurs</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">Communauté active</p>
                <p class="text-white text-opacity-70 text-sm mt-0.5">Échangez avec d'autres apprenants du Sénégal</p>
              </div>
            </li>
          </ul>
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
