import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InstructorApplicationService } from '../../core/services/instructor-application.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-[#F7F9FA]">
      <!-- Header -->
      <div class="bg-[#1C1D1F] py-6">
        <div class="container-app">
          <h1 class="text-xl font-bold text-white">Administration</h1>
        </div>
      </div>

      <div class="container-app py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Sidebar -->
          <aside class="lg:w-56 flex-shrink-0">
            <nav class="card p-2 space-y-1 sticky top-24">
              <a routerLink="/admin/users" routerLinkActive="bg-[#F3EFFC] text-[#5624D0]"
                 class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Utilisateurs
              </a>
              <a routerLink="/admin/courses" routerLinkActive="bg-[#F3EFFC] text-[#5624D0]"
                 class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Cours
              </a>
              <a routerLink="/admin/applications" routerLinkActive="bg-[#F3EFFC] text-[#5624D0]"
                 class="flex items-center justify-between px-4 py-3 rounded text-sm font-medium text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Candidatures
                </span>
                @if (pendingCount > 0) {
                  <span class="bg-[#C4302B] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {{ pendingCount }}
                  </span>
                }
              </a>
              <a routerLink="/admin/categories" routerLinkActive="bg-[#F3EFFC] text-[#5624D0]"
                 class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-[#1C1D1F] hover:bg-[#F7F9FA] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                Catégories
              </a>
            </nav>
          </aside>

          <!-- Content -->
          <main class="flex-1 card overflow-hidden">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  private applicationService = inject(InstructorApplicationService);
  pendingCount = 0;

  ngOnInit() {
    this.applicationService.getPendingCount().subscribe({
      next: (count) => this.pendingCount = count
    });
  }
}
