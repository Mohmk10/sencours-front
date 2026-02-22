import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InstructorApplicationService } from '../../core/services/instructor-application.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen" style="background: var(--canvas);">

      <!-- Gradient header -->
      <div class="page-header-brand-sm">
        <div class="container-app">
          <p class="text-xs font-bold mb-1.5 uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Administration</p>
          <h1 class="text-2xl font-bold text-white">Tableau de bord</h1>
          <p class="text-sm mt-1.5" style="color: rgba(255,255,255,0.55);">Gérez la plateforme SenCours</p>
        </div>
      </div>

      <div class="container-app py-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar nav -->
          <aside class="lg:w-56 flex-shrink-0">
            <nav class="bg-white sticky top-24"
                 style="border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden;">
              <!-- Brand accent bar -->
              <div style="height: 4px; background: var(--gradient-brand);"></div>

              <div class="p-2">
                <p class="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest" style="color: var(--ink-4);">NAVIGATION</p>
                <a routerLink="/admin/users"
                   routerLinkActive="admin-nav-active"
                   class="admin-nav-item">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Utilisateurs
                </a>
                <a routerLink="/admin/courses"
                   routerLinkActive="admin-nav-active"
                   class="admin-nav-item">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Cours
                </a>

                <p class="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest" style="color: var(--ink-4);">GESTION</p>
                <a routerLink="/admin/applications"
                   routerLinkActive="admin-nav-active"
                   class="admin-nav-item">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="flex-1">Candidatures</span>
                  @if (pendingCount > 0) {
                    <span class="text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                          style="background: #EF4444; font-size: 10px; min-width: 18px; text-align: center;">
                      {{ pendingCount }}
                    </span>
                  }
                </a>
                <a routerLink="/admin/categories"
                   routerLinkActive="admin-nav-active"
                   class="admin-nav-item">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  Catégories
                </a>
              </div>
            </nav>
          </aside>

          <!-- Main content -->
          <main class="flex-1 bg-white overflow-hidden"
                style="border: 1px solid var(--border); border-radius: var(--r-lg);">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>

      <style>
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-2);
          border-radius: var(--r-md);
          transition: background 0.15s ease, color 0.15s ease;
          text-decoration: none;
          margin-bottom: 2px;
        }
        .admin-nav-item:hover {
          background: var(--canvas);
          color: var(--ink);
        }
        .admin-nav-item.admin-nav-active {
          background: var(--violet) !important;
          color: white !important;
        }
      </style>
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
