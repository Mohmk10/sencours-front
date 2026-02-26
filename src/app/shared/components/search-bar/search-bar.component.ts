import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onQueryChange($event)"
          (keydown.enter)="executeSearch()"
          (focus)="showSuggestions = true"
          placeholder="Rechercher un cours..."
          class="w-full h-10 pl-12 pr-10 text-sm border rounded-full transition-all"
          style="background: var(--canvas); border-color: var(--border-2); color: var(--ink);"
          (focusin)="onInputFocus($event)"
          (focusout)="onInputBlur($event)">

        @if (searchQuery) {
          <button
            (mousedown)="clearSearch(); $event.preventDefault()"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
            style="color: var(--ink-4);"
            onmouseenter="this.style.background='var(--border)'"
            onmouseleave="this.style.background='transparent'">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>

      <!-- Suggestions dropdown -->
      @if (showSuggestions && (suggestions.length > 0 || (recentSearches.length > 0 && !searchQuery))) {
        <div class="absolute top-full left-0 right-0 mt-1.5 bg-white overflow-hidden z-50"
             style="border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--shadow-lg);">

          <!-- Recent searches -->
          @if (recentSearches.length > 0 && !searchQuery) {
            <div class="px-3 pt-3 pb-1" style="border-bottom: 1px solid var(--border);">
              <p class="text-[10px] font-medium uppercase tracking-wider mb-2" style="color: var(--ink-4);">Recherches recentes</p>
              @for (recent of recentSearches; track recent) {
                <button
                  (mousedown)="selectSuggestion(recent); $event.preventDefault()"
                  class="flex items-center gap-2.5 w-full px-2 py-2 text-left text-sm rounded transition-colors"
                  style="color: var(--ink);"
                  onmouseenter="this.style.background='var(--canvas)'"
                  onmouseleave="this.style.background='transparent'">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ recent }}
                </button>
              }
            </div>
          }

          <!-- Suggestions -->
          @if (suggestions.length > 0) {
            <div class="p-1.5">
              @for (suggestion of suggestions; track suggestion) {
                <button
                  (mousedown)="selectSuggestion(suggestion); $event.preventDefault()"
                  class="flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm rounded transition-colors"
                  style="color: var(--ink);"
                  onmouseenter="this.style.background='var(--canvas)'"
                  onmouseleave="this.style.background='transparent'">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <span [innerHTML]="highlightMatch(suggestion)"></span>
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private courseService = inject(CourseService);

  searchQuery = '';
  suggestions: string[] = [];
  recentSearches: string[] = [];
  showSuggestions = false;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try { this.recentSearches = JSON.parse(saved).slice(0, 5); } catch { /* ignore */ }
    }

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => query.length < 2 ? of([]) : this.courseService.getSuggestions(query))
    ).subscribe({
      next: (suggestions) => this.suggestions = suggestions,
      error: () => this.suggestions = []
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onQueryChange(query: string) {
    this.searchSubject.next(query);
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-search-bar')) {
      this.showSuggestions = false;
    }
  }

  onInputFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.borderColor = 'var(--violet)';
    input.style.boxShadow = 'var(--shadow-focus)';
    input.style.background = 'white';
  }

  onInputBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.borderColor = '';
    input.style.boxShadow = '';
    input.style.background = '';
    setTimeout(() => this.showSuggestions = false, 200);
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.executeSearch();
  }

  executeSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.saveRecentSearch(q);
    this.showSuggestions = false;
    this.router.navigate(['/courses/search'], { queryParams: { q } });
    this.searchQuery = '';
  }

  clearSearch() {
    this.searchQuery = '';
    this.suggestions = [];
  }

  highlightMatch(text: string): string {
    if (!this.searchQuery) return text;
    const escaped = this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--violet);">$1</strong>');
  }

  private saveRecentSearch(query: string) {
    this.recentSearches = this.recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase());
    this.recentSearches.unshift(query);
    this.recentSearches = this.recentSearches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }
}
