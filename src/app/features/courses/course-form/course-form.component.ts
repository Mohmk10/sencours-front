import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">
          {{ isEditMode ? 'Modifier le cours' : 'Créer un nouveau cours' }}
        </h1>

        @if (errorMessage) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>
        }

        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              formControlName="title"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Introduction à Python">
            @if (courseForm.get('title')?.invalid && courseForm.get('title')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le titre doit contenir entre 5 et 100 caractères</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              formControlName="description"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez votre cours en détail..."></textarea>
            @if (courseForm.get('description')?.invalid && courseForm.get('description')?.touched) {
              <p class="mt-1 text-sm text-red-600">La description doit contenir au moins 20 caractères</p>
            }
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                formControlName="price"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0 pour gratuit">
              @if (courseForm.get('price')?.invalid && courseForm.get('price')?.touched) {
                <p class="mt-1 text-sm text-red-600">Le prix doit être positif ou nul</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                formControlName="categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option [ngValue]="null" disabled>Sélectionnez une catégorie</option>
                @for (category of categories; track category.id) {
                  <option [ngValue]="category.id">{{ category.name }}</option>
                }
              </select>
              @if (courseForm.get('categoryId')?.invalid && courseForm.get('categoryId')?.touched) {
                <p class="mt-1 text-sm text-red-600">Veuillez sélectionner une catégorie</p>
              }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
            <input
              type="url"
              formControlName="thumbnailUrl"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg">
          </div>

          @if (isEditMode) {
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                formControlName="status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>
          }

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              [disabled]="courseForm.invalid || isLoading"
              class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              @if (isLoading) {
                Enregistrement...
              } @else {
                {{ isEditMode ? 'Mettre à jour' : 'Créer le cours' }}
              }
            </button>
            <a
              routerLink="/dashboard/instructor"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-center">
              Annuler
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseForm: FormGroup;
  categories: Category[] = [];
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
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error loading categories', err)
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

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.courseForm.value;

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/instructor']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        }
      });
    } else {
      this.courseService.createCourse(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/instructor']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }
}
