import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header gradient -->
      <div class="page-header-brand">
        <div class="container-app">
          <a [routerLink]="isEditMode ? ['/courses', courseId, 'edit'] : '/dashboard/instructor'"
             class="inline-flex items-center gap-1.5 text-xs mb-4 transition-opacity hover:opacity-100"
             style="color: rgba(255,255,255,0.5);">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            {{ isEditMode ? 'Retour à l\\'éditeur' : 'Tableau de bord instructeur' }}
          </a>
          <p class="text-xs font-bold mb-2 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">
            Espace instructeur
          </p>
          <h1 class="text-2xl font-bold text-white">
            {{ isEditMode ? 'Modifier le cours' : 'Créer un cours' }}
          </h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">
            {{ isEditMode ? 'Mettez à jour les informations de votre cours' : 'Renseignez les informations de votre nouveau cours' }}
          </p>
        </div>
      </div>

      <div class="container-app py-12">
        <div class="max-w-2xl mx-auto">

          @if (errorMessage) {
            <div class="alert alert-error mb-6">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
            <div class="card p-8 space-y-6">

              <!-- Titre -->
              <div>
                <label class="label">
                  Titre du cours <span style="color: #EF4444;">*</span>
                </label>
                <input
                  type="text"
                  formControlName="title"
                  class="input"
                  [class.input-error]="courseForm.get('title')?.invalid && courseForm.get('title')?.touched"
                  placeholder="Ex: Introduction au développement web avec Angular">
                @if (courseForm.get('title')?.invalid && courseForm.get('title')?.touched) {
                  <p class="mt-1 text-xs" style="color: #EF4444;">Le titre doit contenir entre 5 et 100 caractères</p>
                }
              </div>

              <!-- Description -->
              <div>
                <label class="label">
                  Description <span style="color: #EF4444;">*</span>
                </label>
                <textarea
                  formControlName="description"
                  rows="5"
                  class="input resize-none"
                  [class.input-error]="courseForm.get('description')?.invalid && courseForm.get('description')?.touched"
                  placeholder="Décrivez votre cours en détail : ce que les apprenants vont acquérir, le niveau requis, les thèmes abordés..."></textarea>
                @if (courseForm.get('description')?.invalid && courseForm.get('description')?.touched) {
                  <p class="mt-1 text-xs" style="color: #EF4444;">La description doit contenir au moins 20 caractères</p>
                }
              </div>

              <!-- Prix + Catégorie -->
              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="label">
                    Prix (FCFA) <span style="color: #EF4444;">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="price"
                    min="0"
                    class="input"
                    [class.input-error]="courseForm.get('price')?.invalid && courseForm.get('price')?.touched"
                    placeholder="0 pour gratuit">
                  @if (courseForm.get('price')?.invalid && courseForm.get('price')?.touched) {
                    <p class="mt-1 text-xs" style="color: #EF4444;">Le prix doit être positif ou nul</p>
                  }
                </div>

                <div>
                  <label class="label">
                    Catégorie <span style="color: #EF4444;">*</span>
                  </label>
                  @if (categoriesLoading) {
                    <div class="input flex items-center gap-2" style="color: var(--ink-3);">
                      <svg class="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Chargement...
                    </div>
                  } @else if (categories.length === 0) {
                    <div class="flex items-start gap-2.5 p-3 text-xs"
                         style="background: var(--amber-tint); color: var(--amber); border-radius: var(--r-md); border: 1px solid rgba(217,119,6,0.25);">
                      <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      <span>Aucune catégorie disponible. Un administrateur doit d'abord créer les catégories via <strong>Admin → Catégories → Initialiser les catégories</strong>.</span>
                    </div>
                  } @else {
                    <select
                      formControlName="categoryId"
                      class="input"
                      [class.input-error]="courseForm.get('categoryId')?.invalid && courseForm.get('categoryId')?.touched">
                      <option [ngValue]="null" disabled>Sélectionnez une catégorie</option>
                      @for (category of categories; track category.id) {
                        <option [ngValue]="category.id">{{ category.name }}</option>
                      }
                    </select>
                    @if (courseForm.get('categoryId')?.invalid && courseForm.get('categoryId')?.touched) {
                      <p class="mt-1 text-xs" style="color: #EF4444;">Veuillez sélectionner une catégorie</p>
                    }
                  }
                </div>
              </div>

              <!-- URL vignette -->
              <div>
                <label class="label">URL de la vignette <span class="font-normal" style="color: var(--ink-4);">(optionnel)</span></label>
                <input
                  type="url"
                  formControlName="thumbnailUrl"
                  class="input"
                  placeholder="https://exemple.com/image.jpg">
                <p class="mt-1 text-xs" style="color: var(--ink-4);">
                  Image de couverture affichée sur la carte du cours. Recommandé : 1280×720px.
                </p>
              </div>

              <!-- Statut (mode édition uniquement) -->
              @if (isEditMode) {
                <div>
                  <label class="label">Statut de publication</label>
                  <select formControlName="status" class="input">
                    <option value="DRAFT">Brouillon — visible uniquement par vous</option>
                    <option value="PUBLISHED">Publié — visible dans le catalogue</option>
                    <option value="ARCHIVED">Archivé — retiré du catalogue</option>
                  </select>
                </div>
              }

              <!-- Actions -->
              <div class="flex gap-4 pt-4" style="border-top: 1px solid var(--border);">
                <a [routerLink]="isEditMode ? ['/courses', courseId, 'edit'] : '/dashboard/instructor'"
                   class="btn btn-secondary flex-1 text-center">
                  Annuler
                </a>
                <button
                  type="submit"
                  [disabled]="courseForm.invalid || isLoading || categoriesLoading"
                  class="btn btn-primary flex-1">
                  @if (isLoading) {
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  } @else {
                    {{ isEditMode ? 'Mettre à jour le cours' : 'Créer le cours' }}
                  }
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  `
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseForm: FormGroup;
  categories: Category[] = [];
  categoriesLoading = true;
  isLoading = false;
  isEditMode = false;
  courseId: number | null = null;
  errorMessage = '';

  constructor() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      thumbnailUrl: [''],
      status: ['DRAFT']
    });
  }

  ngOnInit() {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = Number(id);
      this.loadCourse(this.courseId);
    }
  }

  loadCategories() {
    this.categoriesLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.categoriesLoading = false;
      }
    });
  }

  loadCourse(id: number) {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          categoryId: course.categoryId,
          thumbnailUrl: course.thumbnailUrl || '',
          status: course.status
        });
      },
      error: (err) => {
        console.error('Error loading course', err);
        this.errorMessage = 'Impossible de charger le cours';
      }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.courseForm.value;

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, formData).subscribe({
        next: () => {
          this.router.navigate(['/courses', this.courseId, 'edit']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        }
      });
    } else {
      const createRequest = {
        ...formData,
        instructorId: currentUser.id,
        thumbnailUrl: formData.thumbnailUrl?.trim() || undefined
      };
      this.courseService.createCourse(createRequest).subscribe({
        next: (course) => {
          this.router.navigate(['/courses', course.id, 'edit']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }
}
