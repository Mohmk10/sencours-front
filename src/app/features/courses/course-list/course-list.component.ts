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
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Hero section -->
      <div class="hero-gradient" style="border-bottom: 1px solid var(--border);">
        <!-- Decorative blobs -->
        <div class="absolute top-[-40px] right-[-60px] w-64 h-64 rounded-full pointer-events-none"
             style="background: rgba(91,33,182,0.07); filter: blur(50px);"></div>
        <div class="absolute bottom-[-30px] left-[10%] w-48 h-48 rounded-full pointer-events-none"
             style="background: rgba(217,119,6,0.06); filter: blur(40px);"></div>

        <div class="container-app py-20 relative">
          <h1 class="text-4xl font-bold leading-tight" style="color: var(--ink);">
            Explorer les <span style="text-decoration: underline; text-decoration-color: var(--amber-mid); text-underline-offset: 6px;">cours</span>
          </h1>

          <!-- Stats row -->
          <div class="flex items-center gap-4 mt-3 mb-6">
            <span class="text-sm font-medium px-3 py-1.5"
                  style="background: rgba(91,33,182,0.08); color: var(--violet); border-radius: var(--r-full);">
              {{ pageResponse?.totalElements || 0 }} cours
            </span>
            <span class="text-sm font-medium px-3 py-1.5"
                  style="background: rgba(217,119,6,0.08); color: var(--amber); border-radius: var(--r-full);">
              {{ categories.length }} catégories
            </span>
          </div>

          <!-- Search bar -->
          <div class="max-w-xl relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Rechercher un cours..."
              class="w-full h-12 pl-12 pr-32 text-sm border bg-white"
              style="border-radius: var(--r-full); border-color: var(--border-2); color: var(--ink);"
              (focus)="$any($event.target).style.borderColor='var(--violet)'; $any($event.target).style.boxShadow='var(--shadow-focus)'"
              (blur)="$any($event.target).style.borderColor=''; $any($event.target).style.boxShadow=''">
            <button (click)="onSearch()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-white sticky top-[73px] z-40" style="border-bottom: 1px solid var(--border);">
        <div class="container-app">
          <div class="flex items-center gap-2 py-5 overflow-x-auto scrollbar-hide">
            <!-- Category pills -->
            <button
              (click)="selectedCategoryId = null; onFilterChange()"
              class="filter-pill"
              [class.filter-pill-active]="!selectedCategoryId">
              Tous
            </button>
            @for (category of categories; track category.id) {
              <button
                (click)="selectedCategoryId = category.id; onFilterChange()"
                class="filter-pill"
                [class.filter-pill-active]="selectedCategoryId === category.id">
                {{ category.name }}
              </button>
            }

            <!-- Separator -->
            <div class="w-px h-5 flex-shrink-0" style="background: var(--border-2); margin: 0 4px;"></div>

            <!-- Price pills -->
            <button (click)="priceFilter = 'all'; onFilterChange()"
                    class="filter-pill" [class.filter-pill-active]="priceFilter === 'all'">Tous les prix</button>
            <button (click)="priceFilter = 'free'; onFilterChange()"
                    class="filter-pill" [class.filter-pill-active]="priceFilter === 'free'">Gratuit</button>
            <button (click)="priceFilter = 'paid'; onFilterChange()"
                    class="filter-pill" [class.filter-pill-active]="priceFilter === 'paid'">Payant</button>

            @if (searchQuery || selectedCategoryId || priceFilter !== 'all') {
              <div class="w-px h-5 flex-shrink-0" style="background: var(--border-2); margin: 0 4px;"></div>
              <button (click)="resetFilters()" class="filter-pill text-red-500 border-red-200">
                Réinitialiser
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Course grid -->
      <div class="container-app py-12">
        @if (isLoading) {
          <!-- Skeleton grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            @for (i of [1,2,3,4,5,6,8]; track i) {
              <div class="bg-white rounded-[14px] overflow-hidden" style="border: 1px solid var(--border);">
                <div class="skeleton aspect-video"></div>
                <div class="p-4 space-y-3">
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-3/4"></div>
                  <div class="skeleton h-3 w-1/2"></div>
                  <div class="skeleton h-3 w-1/3 mt-2"></div>
                </div>
              </div>
            }
          </div>
        } @else if (filteredCourses.length === 0) {
          <!-- Empty state -->
          <div class="card py-20 text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                 style="background: var(--violet-tint);">
              <svg class="w-8 h-8" style="color: var(--violet);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2" style="color: var(--ink);">Aucun cours trouvé</h3>
            <p class="text-sm mb-6" style="color: var(--ink-3);">Essayez de modifier vos filtres de recherche</p>
            <button (click)="resetFilters()" class="btn btn-primary">Voir tous les cours</button>
          </div>
        } @else {
          <!-- Course cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            @for (course of filteredCourses; track course.id; let idx = $index) {
              <a [routerLink]="['/courses', course.id]"
                 class="course-card bg-white overflow-hidden"
                 style="border: 1px solid var(--border); border-radius: var(--r-lg);">

                <!-- Thumbnail -->
                <div class="relative aspect-video overflow-hidden" style="background: var(--surface-raised);">
                  @if (course.thumbnailUrl) {
                    <img [src]="course.thumbnailUrl" [alt]="course.title"
                         class="w-full h-full object-cover transition-transform duration-300 course-card-img">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center"
                         [style.background]="getCardGradient(idx)">
                      <svg class="w-10 h-10 opacity-30" style="color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                  }
                  <!-- Category pill overlay -->
                  @if (course.categoryName) {
                    <div class="absolute bottom-2.5 left-2.5">
                      <span class="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                            style="background: rgba(13,11,32,0.65); backdrop-filter: blur(4px);">
                        {{ course.categoryName }}
                      </span>
                    </div>
                  }
                  @if (course.price === 0) {
                    <span class="absolute top-2.5 right-2.5 badge badge-success">Gratuit</span>
                  }
                </div>

                <!-- Content -->
                <div class="p-5">
                  <h3 class="font-semibold text-sm line-clamp-2 leading-snug mb-2"
                      style="color: var(--ink);">
                    {{ course.title }}
                  </h3>

                  <!-- Instructor -->
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                         style="background: var(--violet); font-size: 9px;">
                      {{ (course.instructorName || course.instructorFirstName || '?').charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-xs truncate" style="color: var(--ink-3);">{{ course.instructorName || ((course.instructorFirstName || '') + ' ' + (course.instructorLastName || '')).trim() || 'Instructeur' }}</span>
                  </div>

                  <!-- Rating -->
                  <div class="flex items-center gap-1.5 mb-4">
                    <span class="font-bold text-xs" style="color: var(--amber-mid);">
                      {{ (course.averageRating || 0) | number:'1.1-1' }}
                    </span>
                    <div class="flex gap-0.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-3 h-3" [style.color]="star <= (course.averageRating || 0) ? 'var(--amber-mid)' : 'var(--border-2)'"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-xs" style="color: var(--ink-4);">({{ course.totalEnrollments || 0 }})</span>
                  </div>

                  <!-- Price -->
                  <div style="border-top: 1px solid var(--border); padding-top: 14px;">
                    @if (course.price === 0) {
                      <span class="font-bold text-sm" style="color: var(--green);">Gratuit</span>
                    } @else {
                      <span class="font-bold text-base" style="color: var(--amber);">
                        {{ course.price | number:'1.0-0' }} FCFA
                      </span>
                    }
                  </div>
                </div>
              </a>
            }
          </div>

          <!-- Pagination -->
          @if (pageResponse && pageResponse.totalPages > 1) {
            <div class="flex justify-center mt-12">
              <div class="flex items-center gap-1">
                <button
                  (click)="onPageChange(currentPage - 1)"
                  [disabled]="currentPage === 0"
                  class="w-9 h-9 flex items-center justify-center rounded disabled:opacity-30 transition-colors"
                  style="color: var(--ink-3);"
                  onmouseenter="this.style.background='var(--canvas)'"
                  onmouseleave="this.style.background='transparent'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>

                @for (page of getVisiblePages(); track page) {
                  @if (page === -1) {
                    <span class="w-9 h-9 flex items-center justify-center text-sm" style="color: var(--ink-3);">…</span>
                  } @else {
                    <button
                      (click)="onPageChange(page)"
                      class="w-9 h-9 text-sm font-medium rounded transition-colors"
                      [style.background]="page === currentPage ? 'var(--violet)' : 'transparent'"
                      [style.color]="page === currentPage ? 'white' : 'var(--ink-2)'"
                      onmouseenter="if(!this.style.background || this.style.background==='transparent') { this.style.background='var(--canvas)'; }"
                      onmouseleave="if(this.style.color==='var(--ink-2)') { this.style.background='transparent'; }">
                      {{ page + 1 }}
                    </button>
                  }
                }

                <button
                  (click)="onPageChange(currentPage + 1)"
                  [disabled]="currentPage >= (pageResponse?.totalPages || 1) - 1"
                  class="w-9 h-9 flex items-center justify-center rounded disabled:opacity-30 transition-colors"
                  style="color: var(--ink-3);"
                  onmouseenter="this.style.background='var(--canvas)'"
                  onmouseleave="this.style.background='transparent'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>

    <style>
      .filter-pill {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        padding: 5px 14px;
        font-size: 13px;
        font-weight: 500;
        border-radius: var(--r-full);
        border: 1px solid var(--border-2);
        color: var(--ink-2);
        background: white;
        cursor: pointer;
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .filter-pill:hover {
        border-color: var(--violet);
        color: var(--violet);
      }
      .filter-pill-active {
        background: var(--violet) !important;
        border-color: var(--violet) !important;
        color: white !important;
      }
      .course-card {
        display: block;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
      }
      .course-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }
      .course-card:hover .course-card-img {
        transform: scale(1.04);
      }
    </style>
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

  get filteredCourses() {
    const courses = this.pageResponse?.content || [];
    if (this.priceFilter === 'free') return courses.filter(c => c.price === 0);
    if (this.priceFilter === 'paid') return courses.filter(c => c.price > 0);
    return courses;
  }

  getCardGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
      'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
      'linear-gradient(135deg, #5B21B6, #7C3AED)',
      'linear-gradient(135deg, #92400E, #D97706)',
    ];
    return gradients[index % gradients.length];
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
