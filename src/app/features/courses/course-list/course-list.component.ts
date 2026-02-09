import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { CategoryService } from '../../../core/services/category.service';
import { Course, Category, PageResponse } from '../../../core/models';
import { PaginationComponent, StarRatingComponent } from '../../../shared/components';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent, StarRatingComponent, TruncatePipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Découvrez nos cours</h1>
        <p class="text-gray-600">Apprenez de nouvelles compétences avec nos instructeurs experts</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Rechercher un cours..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <!-- Category filter -->
          <div class="md:w-64">
            <select
              [(ngModel)]="selectedCategoryId"
              (change)="onCategoryChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option [ngValue]="null">Toutes les catégories</option>
              @for (category of categories; track category.id) {
                <option [ngValue]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <!-- Search button -->
          <button
            (click)="onSearch()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Rechercher
          </button>

          @if (searchQuery || selectedCategoryId) {
            <button
              (click)="clearFilters()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Effacer
            </button>
          }
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      <!-- Course Grid -->
      @if (!isLoading && pageResponse) {
        @if (pageResponse.content.length === 0) {
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun cours trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (course of pageResponse.content; track course.id) {
              <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                   [routerLink]="['/courses', course.id]">
                <!-- Thumbnail -->
                <div class="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  @if (course.thumbnailUrl) {
                    <img [src]="course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover">
                  } @else {
                    <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  }
                </div>

                <!-- Content -->
                <div class="p-4">
                  <div class="text-xs text-blue-600 font-semibold mb-1">{{ course.categoryName }}</div>
                  <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ course.title }}</h3>
                  <p class="text-sm text-gray-500 mb-2">{{ course.instructorName }}</p>

                  <!-- Rating -->
                  <div class="flex items-center mb-2">
                    <app-star-rating [rating]="course.averageRating || 0" [showValue]="true" />
                    @if (course.totalEnrollments) {
                      <span class="text-xs text-gray-500 ml-2">({{ course.totalEnrollments }} étudiants)</span>
                    }
                  </div>

                  <!-- Price -->
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-gray-900">
                      @if (course.price === 0) {
                        Gratuit
                      } @else {
                        {{ course.price | number:'1.0-0' }} FCFA
                      }
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          <app-pagination
            [pageData]="pageResponse"
            (pageChange)="onPageChange($event)" />
        }
      }
    </div>
  `
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private categoryService = inject(CategoryService);

  pageResponse: PageResponse<Course> | null = null;
  categories: Category[] = [];
  isLoading = false;

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
}
