import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { Course, Category, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-[#F7F9FA] min-h-screen">

      <!-- Page header -->
      <div class="bg-[#1C1D1F] text-white">
        <div class="container-custom py-10">
          <h1 class="text-3xl font-bold text-white">Tous les cours</h1>
          <p class="mt-1 text-sm text-gray-400">{{ pageResponse?.totalElements || 0 }} résultats</p>
        </div>
      </div>

      <div class="container-custom py-8">
        <!-- Search bar -->
        <div class="flex gap-3 mb-6">
          <div class="relative flex-1 max-w-xl">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Rechercher un cours..."
              class="w-full pl-10 pr-4 py-2.5 border border-[#D1D7DC] bg-white text-sm text-[#1C1D1F] placeholder-[#6A6F73] focus:outline-none focus:ring-2 focus:ring-[#5624D0] focus:border-[#5624D0]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6F73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <button (click)="onSearch()" class="btn-primary">Rechercher</button>
          @if (searchQuery || selectedCategoryId) {
            <button (click)="clearFilters()"
                    class="px-4 py-2.5 border border-[#D1D7DC] bg-white text-sm text-[#6A6F73] hover:bg-[#F7F9FA] transition-colors">
              Effacer
            </button>
          }
        </div>

        <div class="flex gap-8">
          <!-- Sidebar filters -->
          <aside class="w-56 flex-shrink-0 hidden lg:block">
            <div class="sticky top-24">
              <h3 class="font-bold text-[#1C1D1F] text-sm mb-4 uppercase tracking-wide">Filtrer par</h3>

              <!-- Category filter -->
              <div class="border-t border-[#D1D7DC] py-4">
                <button
                  (click)="categoryFilterOpen = !categoryFilterOpen"
                  class="flex items-center justify-between w-full font-bold text-[#1C1D1F] text-sm">
                  Catégorie
                  <svg class="w-4 h-4 transition-transform" [class.rotate-180]="categoryFilterOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                @if (categoryFilterOpen) {
                  <div class="mt-3 space-y-2">
                    <label class="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="category" [value]="null"
                             [(ngModel)]="selectedCategoryId" (change)="onCategoryChange()"
                             class="w-4 h-4 accent-[#5624D0]">
                      <span class="text-sm text-[#1C1D1F] group-hover:text-[#5624D0]">Toutes les catégories</span>
                    </label>
                    @for (category of categories; track category.id) {
                      <label class="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="category" [value]="category.id"
                               [(ngModel)]="selectedCategoryId" (change)="onCategoryChange()"
                               class="w-4 h-4 accent-[#5624D0]">
                        <span class="text-sm text-[#1C1D1F] group-hover:text-[#5624D0]">{{ category.name }}</span>
                      </label>
                    }
                  </div>
                }
              </div>

              <!-- Price filter -->
              <div class="border-t border-[#D1D7DC] py-4">
                <button class="flex items-center justify-between w-full font-bold text-[#1C1D1F] text-sm">
                  Prix
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>

              <!-- Level filter -->
              <div class="border-t border-[#D1D7DC] py-4">
                <button class="flex items-center justify-between w-full font-bold text-[#1C1D1F] text-sm">
                  Niveau
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main content -->
          <main class="flex-1 min-w-0">
            <!-- Sort bar -->
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[#D1D7DC]">
              <div class="flex items-center gap-3">
                <!-- Mobile filter button -->
                <button class="flex items-center gap-2 px-3 py-2 border border-[#1C1D1F] text-sm font-bold lg:hidden hover:bg-gray-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  Filtrer
                </button>
                <select class="border border-[#D1D7DC] bg-white text-sm text-[#1C1D1F] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5624D0]">
                  <option>Trier par: Plus populaires</option>
                  <option>Les mieux notés</option>
                  <option>Les plus récents</option>
                </select>
              </div>
              <span class="text-sm text-[#6A6F73]">{{ pageResponse?.totalElements || 0 }} résultats</span>
            </div>

            <!-- Loading skeleton -->
            @if (isLoading) {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div>
                    <div class="skeleton aspect-video w-full"></div>
                    <div class="mt-2.5 space-y-2">
                      <div class="skeleton h-4 w-4/5"></div>
                      <div class="skeleton h-3 w-2/5"></div>
                      <div class="skeleton h-3 w-1/3"></div>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Empty state -->
            @if (!isLoading && pageResponse?.content?.length === 0) {
              <div class="py-20 text-center">
                <div class="w-16 h-16 bg-[#EDE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-[#5624D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-[#1C1D1F] mb-1">Aucun cours trouvé</h3>
                <p class="text-sm text-[#6A6F73] mb-4">Essayez de modifier vos critères de recherche.</p>
                <button (click)="clearFilters()" class="btn-outline">Voir tous les cours</button>
              </div>
            }

            <!-- Course grid -->
            @if (!isLoading && (pageResponse?.content?.length ?? 0) > 0) {
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                @for (course of pageResponse?.content; track course.id) {
                  <div class="group cursor-pointer" [routerLink]="['/courses', course.id]">
                    <!-- Thumbnail -->
                    <div class="aspect-video bg-gray-100 border border-[#D1D7DC] overflow-hidden">
                      @if (course.thumbnailUrl) {
                        <img [src]="course.thumbnailUrl" [alt]="course.title"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center bg-[#EDE9FE]">
                          <svg class="w-10 h-10 text-[#5624D0] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                        </div>
                      }
                    </div>

                    <!-- Info -->
                    <div class="pt-2.5">
                      <h3 class="font-bold text-[#1C1D1F] text-sm leading-snug line-clamp-2 group-hover:text-[#5624D0] transition-colors">
                        {{ course.title }}
                      </h3>
                      <p class="text-xs text-[#6A6F73] mt-1">{{ course.instructorName }}</p>

                      <!-- Rating -->
                      <div class="flex items-center gap-1 mt-1">
                        <span class="font-bold text-xs text-[#B4690E]">{{ (course.averageRating || 0) | number:'1.1-1' }}</span>
                        <div class="flex gap-0.5">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="w-3 h-3"
                                 [style.color]="star <= (course.averageRating || 0) ? '#E59819' : '#D1D7DC'"
                                 fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          }
                        </div>
                        <span class="text-xs text-[#6A6F73]">({{ course.totalEnrollments || 0 }})</span>
                      </div>

                      <!-- Price -->
                      <div class="mt-1">
                        @if (course.price === 0) {
                          <span class="font-bold text-[#1C1D1F] text-sm">Gratuit</span>
                        } @else {
                          <span class="font-bold text-[#1C1D1F] text-sm">{{ course.price | number:'1.0-0' }} FCFA</span>
                        }
                      </div>

                      @if ((course.totalEnrollments || 0) > 50) {
                        <span class="badge badge-bestseller mt-1.5">Bestseller</span>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Pagination -->
              @if (pageResponse && pageResponse.totalPages > 1) {
                <div class="flex justify-center mt-12">
                  <div class="flex items-center gap-1">
                    <button
                      (click)="onPageChange(currentPage - 1)"
                      [disabled]="currentPage === 0"
                      class="w-9 h-9 flex items-center justify-center border border-[#D1D7DC] bg-white hover:bg-[#F7F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>

                    @for (p of getVisiblePages(); track p) {
                      <button
                        (click)="onPageChange(p)"
                        [class.bg-[#1C1D1F]]="p === currentPage"
                        [class.text-white]="p === currentPage"
                        [class.bg-white]="p !== currentPage"
                        class="w-9 h-9 text-sm font-medium border border-[#D1D7DC] hover:bg-[#F7F9FA] transition-colors">
                        {{ p + 1 }}
                      </button>
                    }

                    <button
                      (click)="onPageChange(currentPage + 1)"
                      [disabled]="pageResponse.last"
                      class="w-9 h-9 flex items-center justify-center border border-[#D1D7DC] bg-white hover:bg-[#F7F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  pageResponse: PageResponse<Course> | null = null;
  categories: Category[] = [];
  isLoading = false;
  categoryFilterOpen = true;

  searchQuery = '';
  selectedCategoryId: number | null = null;
  currentPage = 0;
  pageSize = 12;

  ngOnInit() {
    this.loadCategories();
    this.loadCourses();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadCourses() {
    this.isLoading = true;

    let request$;

    if (this.searchQuery.trim()) {
      request$ = this.courseService.searchPublishedCourses(this.searchQuery, this.currentPage, this.pageSize);
    } else if (this.selectedCategoryId) {
      request$ = this.courseService.getCoursesByCategory(this.selectedCategoryId, this.currentPage, this.pageSize);
    } else {
      request$ = this.courseService.getPublishedCourses(this.currentPage, this.pageSize);
    }

    request$.subscribe({
      next: (response) => {
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.selectedCategoryId = null;
    this.loadCourses();
  }

  onCategoryChange() {
    this.currentPage = 0;
    this.searchQuery = '';
    this.loadCourses();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCourses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.currentPage = 0;
    this.loadCourses();
  }

  getVisiblePages(): number[] {
    const total = this.pageResponse?.totalPages ?? 0;
    const current = this.currentPage;
    const delta = 2;
    const pages: number[] = [];

    for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }
}
