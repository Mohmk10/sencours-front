import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div>
      <div class="px-8 py-5 flex items-center justify-between" style="border-bottom: 1px solid var(--border);">
        <h1 class="text-base font-semibold" style="color: var(--ink);">Gestion des catégories</h1>
        <div class="flex items-center gap-2">
          @if (categories.length === 0 && !isLoading) {
            <button (click)="seedDefaultCategories()" [disabled]="isSeeding" class="btn btn-secondary btn-sm">
              @if (isSeeding) {
                <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Initialisation...
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Initialiser les catégories
              }
            </button>
          }
          <button (click)="openModal()" class="btn btn-primary btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouvelle catégorie
          </button>
        </div>
      </div>
      <div class="p-8">

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
                      <button (click)="openDeleteCategoryModal(category)" class="btn btn-ghost btn-sm" style="color: #EF4444;">
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

    <!-- Modal Initialisation -->
    <app-confirm-modal
      [isOpen]="showSeedModal"
      title="Initialiser les catégories"
      message="Initialiser les 12 catégories par défaut de la plateforme ?"
      type="info"
      confirmText="Initialiser"
      (confirmed)="confirmSeed()"
      (cancelled)="showSeedModal = false">
    </app-confirm-modal>

    <!-- Modal Suppression Catégorie -->
    <app-confirm-modal
      [isOpen]="showDeleteCategoryModal"
      [title]="'Supprimer la catégorie'"
      [message]="'Supprimer la catégorie &quot;' + selectedCategory?.name + '&quot; ?'"
      type="danger"
      confirmText="Supprimer"
      (confirmed)="confirmDeleteCategory()"
      (cancelled)="showDeleteCategoryModal = false; selectedCategory = null">
    </app-confirm-modal>

    <!-- Modal Erreur -->
    <app-confirm-modal
      [isOpen]="showErrorModal"
      title="Erreur"
      [message]="errorModalMessage"
      type="danger"
      confirmText="Fermer"
      [showCancel]="false"
      (confirmed)="showErrorModal = false"
      (cancelled)="showErrorModal = false">
    </app-confirm-modal>
  `
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = true;
  isSeeding = false;
  showModal = false;
  editingCategory: Category | null = null;
  formData = { name: '', description: '' };
  isSaving = false;
  showSeedModal = false;
  showDeleteCategoryModal = false;
  showErrorModal = false;
  errorModalMessage = '';
  selectedCategory: Category | null = null;

  private readonly DEFAULT_CATEGORIES = [
    { name: 'Développement Web & Mobile', description: 'HTML, CSS, JavaScript, Angular, React, Flutter, développement d\'applications' },
    { name: 'Data Science & Intelligence Artificielle', description: 'Python, Machine Learning, Deep Learning, analyse de données, modèles prédictifs' },
    { name: 'Design Graphique & UX/UI', description: 'Figma, Adobe XD, Photoshop, Illustrator, conception d\'interfaces utilisateur' },
    { name: 'Marketing Digital', description: 'Réseaux sociaux, SEO, publicité en ligne, email marketing, stratégie de contenu' },
    { name: 'Finance & Comptabilité', description: 'Comptabilité, gestion financière, fiscalité, audit, finance d\'entreprise' },
    { name: 'Langues', description: 'Français, Anglais, Wolof, Arabe, Mandarin, apprentissage des langues' },
    { name: 'Entrepreneuriat & Business', description: 'Création d\'entreprise, business plan, leadership, management, stratégie' },
    { name: 'Réseaux & Cybersécurité', description: 'Administration réseau, sécurité informatique, Linux, Cisco, ethical hacking' },
    { name: 'Bureautique & Productivité', description: 'Word, Excel, PowerPoint, Google Workspace, outils de productivité' },
    { name: 'Agriculture & Agribusiness', description: 'Techniques agricoles, agro-alimentaire, gestion d\'exploitation, agriculture durable' },
    { name: 'Droit & Sciences Juridiques', description: 'Droit des affaires, droit civil, droit du travail, procédures juridiques' },
    { name: 'Santé & Bien-être', description: 'Nutrition, premiers secours, santé communautaire, bien-être mental' }
  ];

  ngOnInit() {
    this.loadCategories();
  }

  seedDefaultCategories() {
    this.showSeedModal = true;
  }

  confirmSeed() {
    this.showSeedModal = false;
    this.isSeeding = true;
    let completed = 0;
    const total = this.DEFAULT_CATEGORIES.length;

    for (const cat of this.DEFAULT_CATEGORIES) {
      this.categoryService.createCategory(cat).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.isSeeding = false;
            this.loadCategories();
          }
        },
        error: () => {
          completed++;
          if (completed === total) {
            this.isSeeding = false;
            this.loadCategories();
          }
        }
      });
    }
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

  openDeleteCategoryModal(category: Category) {
    this.selectedCategory = category;
    this.showDeleteCategoryModal = true;
  }

  confirmDeleteCategory() {
    if (!this.selectedCategory) return;
    this.showDeleteCategoryModal = false;
    this.categoryService.deleteCategory(this.selectedCategory.id).subscribe({
      next: () => { this.selectedCategory = null; this.loadCategories(); },
      error: (err) => {
        this.selectedCategory = null;
        this.errorModalMessage = err.error?.message || 'Impossible de supprimer cette catégorie';
        this.showErrorModal = true;
      }
    });
  }
}
