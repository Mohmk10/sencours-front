import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, SearchParams } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { Course, Category } from '../../../core/models';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Header -->
      <div class="bg-white" style="border-bottom: 1px solid var(--border);">
        <div class="container-app py-6">
          <h1 class="text-2xl font-bold" style="color: var(--ink);">
            @if (searchQuery) {
              Resultats pour "{{ searchQuery }}"
            } @else {
              Tous les cours
            }
          </h1>
          <p class="text-sm mt-1" style="color: var(--ink-3);">{{ totalResults }} cours trouve{{ totalResults > 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div class="container-app py-8">
        <div class="flex gap-8">

          <!-- Sidebar Filters -->
          <aside class="w-60 flex-shrink-0 hidden lg:block">
            <div class="card p-5 sticky top-[73px]">
              <h2 class="font-bold text-sm mb-4" style="color: var(--ink);">Filtres</h2>

              <!-- Categories -->
              <div class="mb-5">
                <h3 class="font-medium text-xs uppercase tracking-wider mb-2.5" style="color: var(--ink-3);">Categorie</h3>
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="category" [checked]="!selectedCategoryId"
                           (change)="filterByCategory(null)" class="accent-violet">
                    <span class="text-sm" style="color: var(--ink-2);">Toutes</span>
                  </label>
                  @for (cat of categories; track cat.id) {
                    <label class="flex items-center gap-2 cursor-pointer py-1">
                      <input type="radio" name="category" [checked]="selectedCategoryId === cat.id"
                             (change)="filterByCategory(cat.id)" class="accent-violet">
                      <span class="text-sm" style="color: var(--ink-2);">{{ cat.name }}</span>
                    </label>
                  }
                </div>
              </div>

              <!-- Price -->
              <div class="mb-5">
                <h3 class="font-medium text-xs uppercase tracking-wider mb-2.5" style="color: var(--ink-3);">Prix</h3>
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="price" [checked]="priceFilter === 'all'"
                           (change)="filterByPrice('all')" class="accent-violet">
                    <span class="text-sm" style="color: var(--ink-2);">Tous les prix</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="price" [checked]="priceFilter === 'free'"
                           (change)="filterByPrice('free')" class="accent-violet">
                    <span class="text-sm" style="color: var(--ink-2);">Gratuit</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer py-1">
                    <input type="radio" name="price" [checked]="priceFilter === 'paid'"
                           (change)="filterByPrice('paid')" class="accent-violet">
                    <span class="text-sm" style="color: var(--ink-2);">Payant</span>
                  </label>
                </div>
              </div>

              <button (click)="resetFilters()"
                      class="w-full py-2 text-sm font-medium rounded transition-colors"
                      style="color: var(--violet); border-radius: var(--r-md);"
                      onmouseenter="this.style.background='var(--violet-xlight)'"
                      onmouseleave="this.style.background='transparent'">
                Reinitialiser les filtres
              </button>
            </div>
          </aside>

          <!-- Results -->
          <main class="flex-1 min-w-0">

            <!-- Sort -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <span class="text-xs" style="color: var(--ink-4);">Trier par :</span>
                <select [(ngModel)]="sortBy" (ngModelChange)="onSortChange()"
                        class="input px-3 py-1.5 text-sm"
                        style="width: auto; border-radius: var(--r-md);">
                  <option value="newest">Plus recents</option>
                  <option value="title">Titre (A-Z)</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix decroissant</option>
                </select>
              </div>
            </div>

            @if (isLoading) {
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="card overflow-hidden">
                    <div class="skeleton h-36 rounded-none"></div>
                    <div class="p-4 space-y-2.5">
                      <div class="skeleton h-4 w-3/4"></div>
                      <div class="skeleton h-3 w-1/2"></div>
                      <div class="skeleton h-3 w-1/3 mt-3"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (courses.length === 0) {
              <!-- Empty state -->
              <div class="card py-20 text-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                     style="background: var(--violet-tint);">
                  <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold mb-2" style="color: var(--ink);">Aucun cours trouve</h3>
                <p class="text-sm mb-6" style="color: var(--ink-3);">Essayez avec d'autres mots-cles ou filtres</p>
                <button (click)="resetFilters()" class="btn btn-primary">Voir tous les cours</button>
              </div>
            } @else {
              <!-- Course grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (course of courses; track course.id) {
                  <a [routerLink]="['/courses', course.id]" class="card overflow-hidden course-card group">
                    <!-- Thumbnail -->
                    <div class="relative h-36 overflow-hidden" style="background: var(--ink);">
                      @if (course.thumbnailUrl) {
                        <img [src]="course.thumbnailUrl" [alt]="course.title"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, #EDE9FE, #DDD6FE);">
                          <svg class="w-10 h-10 opacity-30" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                        </div>
                      }
                      <span class="absolute top-2.5 left-2.5 badge badge-primary text-[10px]">{{ course.categoryName }}</span>
                    </div>

                    <!-- Info -->
                    <div class="p-4">
                      <h3 class="font-semibold text-sm line-clamp-2 leading-snug mb-1 group-hover:text-[var(--violet)] transition-colors" style="color: var(--ink);">
                        {{ course.title }}
                      </h3>
                      <p class="text-xs mb-2" style="color: var(--ink-3);">{{ course.instructorName }}</p>

                      <!-- Rating -->
                      <div class="flex items-center gap-1.5 mb-2.5">
                        <span class="text-xs font-bold" style="color: var(--amber);">{{ course.averageRating | number:'1.1-1' }}</span>
                        <div class="flex gap-px">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="w-3 h-3" [style.color]="star <= (course.averageRating || 0) ? 'var(--amber)' : 'var(--border-2)'"
                                 fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          }
                        </div>
                        <span class="text-[10px]" style="color: var(--ink-4);">({{ course.reviewCount || 0 }})</span>
                      </div>

                      <!-- Price -->
                      <div class="flex items-center justify-between">
                        @if (course.price === 0) {
                          <span class="text-sm font-bold" style="color: var(--green);">Gratuit</span>
                        } @else {
                          <span class="text-sm font-bold" style="color: var(--ink);">{{ course.price | number }} FCFA</span>
                        }
                        <span class="text-[10px]" style="color: var(--ink-4);">{{ course.enrollmentCount || 0 }} inscrit{{ (course.enrollmentCount || 0) > 1 ? 's' : '' }}</span>
                      </div>
                    </div>
                  </a>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages > 1) {
                <div class="flex justify-center mt-10 gap-1.5">
                  <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
                          class="btn btn-ghost btn-sm" [style.opacity]="currentPage === 0 ? '0.4' : '1'">
                    Precedent
                  </button>

                  @for (page of getVisiblePages(); track page) {
                    <button (click)="goToPage(page)"
                            class="w-9 h-9 text-sm font-medium rounded-lg transition-colors"
                            [style.background]="page === currentPage ? 'var(--violet)' : 'transparent'"
                            [style.color]="page === currentPage ? 'white' : 'var(--ink-2)'"
                            onmouseenter="if(this.style.background!=='var(--violet)')this.style.background='var(--canvas)'"
                            onmouseleave="if(this.style.background!=='var(--violet)')this.style.background='transparent'">
                      {{ page + 1 }}
                    </button>
                  }

                  <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
                          class="btn btn-ghost btn-sm" [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'">
                    Suivant
                  </button>
                </div>
              }
            }
          </main>
        </div>
      </div>

      <style>
        .course-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .course-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .accent-violet {
          accent-color: var(--violet);
        }
      </style>
    </div>
  `
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);

  courses: Course[] = [];
  categories: Category[] = [];

  searchQuery = '';
  selectedCategoryId: number | null = null;
  priceFilter: 'all' | 'free' | 'paid' = 'all';
  sortBy = 'newest';

  isLoading = true;
  totalResults = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 12;

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats
    });

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategoryId = params['categoryId'] ? +params['categoryId'] : null;
      this.currentPage = params['page'] ? +params['page'] : 0;
      this.loadResults();
    });
  }

  loadResults() {
    this.isLoading = true;

    const params: SearchParams = {
      q: this.searchQuery || undefined,
      categoryId: this.selectedCategoryId || undefined,
      free: this.priceFilter === 'free' ? true : (this.priceFilter === 'paid' ? false : undefined),
      sortBy: this.sortBy === 'price-asc' || this.sortBy === 'price-desc' ? 'price' :
              this.sortBy === 'title' ? 'title' : 'newest',
      sortDirection: this.sortBy === 'price-asc' ? 'asc' : 'desc',
      page: this.currentPage,
      size: this.pageSize
    };

    this.courseService.search(params).subscribe({
      next: (response) => {
        this.courses = response.content;
        this.totalResults = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.courses = [];
        this.totalResults = 0;
        this.isLoading = false;
      }
    });
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.currentPage = 0;
    this.updateUrl();
    this.loadResults();
  }

  filterByPrice(filter: 'all' | 'free' | 'paid') {
    this.priceFilter = filter;
    this.currentPage = 0;
    this.loadResults();
  }

  onSortChange() {
    this.currentPage = 0;
    this.loadResults();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.priceFilter = 'all';
    this.sortBy = 'newest';
    this.currentPage = 0;
    this.updateUrl();
    this.loadResults();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.updateUrl();
    this.loadResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  private updateUrl() {
    const queryParams: any = {};
    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.selectedCategoryId) queryParams.categoryId = this.selectedCategoryId;
    if (this.currentPage > 0) queryParams.page = this.currentPage;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }
}
