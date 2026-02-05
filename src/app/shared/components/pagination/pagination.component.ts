import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageResponse } from '../../../core/models';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (pageData && pageData.totalPages > 1) {
      <div class="flex justify-center items-center space-x-2 mt-6">
        <button
          (click)="onPageChange(pageData.page - 1)"
          [disabled]="pageData.first"
          class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
          Précédent
        </button>

        @for (p of getVisiblePages(); track p) {
          <button
            (click)="onPageChange(p)"
            [class.bg-blue-600]="p === pageData.page"
            [class.text-white]="p === pageData.page"
            class="px-3 py-1 rounded border hover:bg-gray-100">
            {{ p + 1 }}
          </button>
        }

        <button
          (click)="onPageChange(pageData.page + 1)"
          [disabled]="pageData.last"
          class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
          Suivant
        </button>
      </div>

      <div class="text-center text-sm text-gray-500 mt-2">
        Page {{ pageData.page + 1 }} sur {{ pageData.totalPages }}
        ({{ pageData.totalElements }} éléments)
      </div>
    }
  `
})
export class PaginationComponent {
  @Input() pageData!: PageResponse<any>;
  @Output() pageChange = new EventEmitter<number>();

  getVisiblePages(): number[] {
    const total = this.pageData.totalPages;
    const current = this.pageData.page;
    const pages: number[] = [];

    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.pageData.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
