import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { Course, Category, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#1C1D1F] py-12">
        <div class="container-app">
          <h1 class="text-3xl font-bold text-white">Explorer les cours</h1>
          <p class="mt-2 text-[#A1A1A1]">
            {{ pageResponse?.totalElements || 0 }} cours disponibles
          </p>
        </div>
      </div>

      <div class="container-app py-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar Filters -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="card p-5 sticky top-24">
              <h3 class="font-semibold text-[#1C1D1F] mb-4">Filtres</h3>

              <!-- Search -->
              <div class="mb-6">
                <label class="label">Recherche</label>
                <div class="relative">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (keyup.enter)="onSearch()"
                    class="input pr-10"
                    placeholder="Titre du cours...">
                  <button (click)="onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6F73] hover:text-[#5624D0]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Category Filter -->
              <div class="mb-6">
                <label class="label">Catégorie</label>
                <select [(ngModel)]="selectedCategoryId" (change)="onFilterChange()" class="input">
                  <option [ngValue]="null">Toutes les catégories</option>
                  @for (category of categories; track category.id) {
                    <option [ngValue]="category.id">{{ category.name }}</option>
                  }
                </select>
              </div>

              <!-- Price Filter -->
              <div>
                <label class="label">Prix</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" value="all" [(ngModel)]="priceFilter" (change)="onFilterChange()" class="w-4 h-4 accent-[#5624D0]">
                    <span class="text-sm">Tous les prix</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" value="free" [(ngModel)]="priceFilter" (change)="onFilterChange()" class="w-4 h-4 accent-[#5624D0]">
                    <span class="text-sm">Gratuit</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" value="paid" [(ngModel)]="priceFilter" (change)="onFilterChange()" class="w-4 h-4 accent-[#5624D0]">
                    <span class="text-sm">Payant</span>
                  </label>
                </div>
              </div>

              @if (searchQuery || selectedCategoryId || priceFilter !== 'all') {
                <button (click)="resetFilters()" class="btn btn-ghost w-full mt-6 text-sm">
                  Réinitialiser les filtres
                </button>
              }
            </div>
          </aside>

          <!-- Course Grid -->
          <main class="flex-1">
            @if (isLoading) {
              <!-- Skeleton -->
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="card overflow-hidden">
                    <div class="skeleton aspect-video"></div>
                    <div class="p-4 space-y-3">
                      <div class="skeleton h-4 w-3/4"></div>
                      <div class="skeleton h-3 w-1/2"></div>
                      <div class="skeleton h-3 w-1/4"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (pageResponse?.content?.length === 0) {
              <!-- Empty state -->
              <div class="card">
                <div class="empty-state">
                  <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h3 class="empty-state-title">Aucun cours trouvé</h3>
                  <p class="empty-state-description">Essayez de modifier vos filtres de recherche</p>
                  <button (click)="resetFilters()" class="btn btn-primary">Voir tous les cours</button>
                </div>
              </div>
            } @else {
              <!-- Course cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (course of pageResponse?.content; track course.id) {
                  <a [routerLink]="['/courses', course.id]" class="card overflow-hidden group hover:shadow-md transition-shadow">
                    <!-- Thumbnail -->
                    <div class="relative aspect-video bg-[#F7F9FA] overflow-hidden">
                      @if (course.thumbnailUrl) {
                        <img [src]="course.thumbnailUrl" [alt]="course.title"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center bg-[#F3EFFC]">
                          <svg class="w-12 h-12 text-[#5624D0] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                        </div>
                      }
                      @if (course.price === 0) {
                        <span class="absolute top-3 left-3 badge badge-success">Gratuit</span>
                      }
                    </div>

                    <!-- Content -->
                    <div class="p-4">
                      <h3 class="font-semibold text-[#1C1D1F] line-clamp-2 group-hover:text-[#5624D0] transition-colors">
                        {{ course.title }}
                      </h3>
                      <p class="text-sm text-[#6A6F73] mt-1">{{ course.instructorName }}</p>

                      <!-- Rating -->
                      <div class="flex items-center gap-1.5 mt-2">
                        <span class="font-bold text-sm text-[#B4690E]">{{ (course.averageRating || 0) | number:'1.1-1' }}</span>
                        <div class="flex">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="w-3.5 h-3.5"
                                 [class.text-[#E59819]]="star <= (course.averageRating || 0)"
                                 [class.text-[#D1D5DB]]="star > (course.averageRating || 0)"
                                 fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          }
                        </div>
                        <span class="text-xs text-[#6A6F73]">({{ course.totalEnrollments || 0 }})</span>
                      </div>

                      <!-- Price -->
                      <div class="mt-3">
                        @if (course.price === 0) {
                          <span class="font-bold text-[#1C1D1F]">Gratuit</span>
                        } @else {
                          <span class="font-bold text-[#1C1D1F]">{{ course.price | number:'1.0-0' }} FCFA</span>
                        }
                      </div>
                    </div>
                  </a>
                }
              </div>

              <!-- Pagination -->
              @if (pageResponse && pageResponse.totalPages > 1) {
                <div class="flex justify-center mt-10">
                  <div class="flex items-center gap-1">
                    <button
                      (click)="onPageChange(currentPage - 1)"
                      [disabled]="currentPage === 0"
                      class="btn btn-ghost btn-sm">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>

                    @for (page of getVisiblePages(); track page) {
                      @if (page === -1) {
                        <span class="px-2 text-[#6A6F73]">...</span>
                      } @else {
                        <button
                          (click)="onPageChange(page)"
                          [class.bg-[#1C1D1F]]="page === currentPage"
                          [class.text-white]="page === currentPage"
                          class="w-10 h-10 text-sm font-medium rounded hover:bg-[#F7F9FA] transition-colors">
                          {{ page + 1 }}
                        </button>
                      }
                    }

                    <button
                      (click)="onPageChange(currentPage + 1)"
                      [disabled]="currentPage >= (pageResponse?.totalPages || 1) - 1"
                      class="btn btn-ghost btn-sm">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            }
          </main>
        </div>
      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pageResponse: PageResponse<Course> | null = null;
  categories: Category[] = [];
  isLoading = true;

  searchQuery = '';
  selectedCategoryId: number | null = null;
  priceFilter = 'all';
  currentPage = 0;
  pageSize = 12;

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategoryId = params['category'] ? +params['category'] : null;
      this.currentPage = params['page'] ? +params['page'] : 0;
      this.loadCourses();
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories
    });
  }

  loadCourses() {
    this.isLoading = true;

    let observable;
    if (this.searchQuery) {
      observable = this.courseService.searchPublishedCourses(this.searchQuery, this.currentPage, this.pageSize);
    } else if (this.selectedCategoryId) {
      observable = this.courseService.getCoursesByCategory(this.selectedCategoryId, this.currentPage, this.pageSize);
    } else {
      observable = this.courseService.getPublishedCourses(this.currentPage, this.pageSize);
    }

    observable.subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.updateUrl();
  }

  onFilterChange() {
    this.currentPage = 0;
    this.updateUrl();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.priceFilter = 'all';
    this.currentPage = 0;
    this.updateUrl();
  }

  updateUrl() {
    const queryParams: Record<string, string | number> = {};
    if (this.searchQuery) queryParams['q'] = this.searchQuery;
    if (this.selectedCategoryId) queryParams['category'] = this.selectedCategoryId;
    if (this.currentPage > 0) queryParams['page'] = this.currentPage;

    this.router.navigate([], { queryParams });
    this.loadCourses();
  }

  getVisiblePages(): number[] {
    if (!this.pageResponse) return [];
    const total = this.pageResponse.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      pages.push(0);
      if (current > 3) pages.push(-1);

      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 4) pages.push(-1);
      pages.push(total - 1);
    }

    return pages;
  }
}
