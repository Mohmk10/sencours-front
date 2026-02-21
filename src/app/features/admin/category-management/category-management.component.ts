import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-bold" style="color: var(--ink);">Gestion des catégories</h1>
        <button (click)="openModal()" class="btn btn-primary btn-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle catégorie
        </button>
      </div>

      @if (isLoading) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="flex items-center gap-4 p-3" style="border-bottom: 1px solid var(--border);">
              <div class="skeleton h-4 w-1/4"></div>
              <div class="skeleton h-3 w-1/2"></div>
            </div>
          }
        </div>
      } @else if (categories.length === 0) {
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <h3 class="empty-state-title">Aucune catégorie</h3>
          <p class="empty-state-description">Créez votre première catégorie</p>
          <button (click)="openModal()" class="btn btn-primary">Créer une catégorie</button>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Cours</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (category of categories; track category.id) {
                <tr>
                  <td class="font-medium" style="color: var(--ink);">{{ category.name }}</td>
                  <td class="max-w-xs truncate" style="color: var(--ink-3);">{{ category.description || '—' }}</td>
                  <td style="color: var(--ink-2);">{{ category.courseCount || 0 }}</td>
                  <td>
                    <div class="flex items-center justify-end gap-0.5">
                      <button (click)="editCategory(category)" class="btn btn-ghost btn-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button (click)="deleteCategory(category)" class="btn btn-ghost btn-sm" style="color: #EF4444;">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="fixed inset-0 flex items-center justify-center z-50 p-4"
           style="background: rgba(13,11,32,0.6);">
        <div class="bg-white w-full max-w-md"
             style="border-radius: var(--r-xl); box-shadow: var(--shadow-lg);">
          <div class="px-6 py-5" style="border-bottom: 1px solid var(--border);">
            <h3 class="text-base font-bold" style="color: var(--ink);">
              {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="label">Nom <span style="color: #EF4444;">*</span></label>
              <input type="text" [(ngModel)]="formData.name" class="input" placeholder="Ex: Développement Web">
            </div>
            <div>
              <label class="label">Description</label>
              <textarea [(ngModel)]="formData.description" rows="3" class="input resize-none"
                        placeholder="Description de la catégorie..."></textarea>
            </div>
          </div>
          <div class="px-6 pb-6 flex gap-3" style="border-top: 1px solid var(--border); padding-top: 20px;">
            <button (click)="closeModal()" class="btn btn-secondary flex-1">Annuler</button>
            <button (click)="saveCategory()" [disabled]="!formData.name || isSaving" class="btn btn-primary flex-1">
              @if (isSaving) { Enregistrement... } @else { Enregistrer }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = true;
  showModal = false;
  editingCategory: Category | null = null;
  formData = { name: '', description: '' };
  isSaving = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openModal() {
    this.editingCategory = null;
    this.formData = { name: '', description: '' };
    this.showModal = true;
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.formData = { name: category.name, description: category.description || '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
  }

  saveCategory() {
    if (!this.formData.name) return;

    this.isSaving = true;

    const observable = this.editingCategory
      ? this.categoryService.updateCategory(this.editingCategory.id, this.formData)
      : this.categoryService.createCategory(this.formData);

    observable.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadCategories();
      },
      error: () => this.isSaving = false
    });
  }

  deleteCategory(category: Category) {
    if (!confirm(`Supprimer la catégorie "${category.name}" ?`)) return;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => alert(err.error?.message || 'Impossible de supprimer cette catégorie')
    });
  }
}
