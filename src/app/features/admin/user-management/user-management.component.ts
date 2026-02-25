import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, PageResponse } from '../../../core/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="px-8 py-5" style="border-bottom: 1px solid var(--border);">
        <h1 class="text-base font-semibold" style="color: var(--ink);">Gestion des utilisateurs</h1>
      </div>
      <div class="p-8">

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="flex-1 min-w-[200px] relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--ink-4);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            class="input pl-9"
            placeholder="Rechercher par nom ou email...">
        </div>
        <select [(ngModel)]="roleFilter" (change)="loadUsers()" class="input w-44">
          <option value="">Tous les rôles</option>
          <option value="ETUDIANT">Étudiants</option>
          <option value="INSTRUCTEUR">Instructeurs</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      @if (isLoading) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="flex items-center gap-4 p-3">
              <div class="skeleton w-9 h-9 rounded-full flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-1/3"></div>
                <div class="skeleton h-3 w-1/4"></div>
              </div>
              <div class="skeleton h-5 w-16 rounded-full"></div>
            </div>
          }
        </div>
      } @else if (!pageResponse?.content?.length) {
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <h3 class="empty-state-title">Aucun utilisateur trouvé</h3>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscrit le</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of pageResponse?.content; track user.id) {
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                           [style.background-color]="getAvatarColor(user.role)">
                        {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                      </div>
                      <span class="font-medium" style="color: var(--ink);">{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                  </td>
                  <td style="color: var(--ink-3);">{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-neutral': user.role === 'ETUDIANT',
                      'badge-primary': user.role === 'INSTRUCTEUR',
                      'badge-warning': user.role === 'ADMIN',
                      'badge-error': user.role === 'SUPER_ADMIN'
                    }">{{ getRoleLabel(user.role) }}</span>
                  </td>
                  <td>
                    @if (user.isActive) {
                      <span class="inline-flex items-center gap-1.5 text-sm font-medium" style="color: var(--green);">
                        <span class="w-1.5 h-1.5 rounded-full" style="background: var(--green);"></span>
                        Actif
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1.5 text-sm" style="color: var(--ink-3);">
                        <span class="w-1.5 h-1.5 rounded-full" style="background: var(--ink-4);"></span>
                        Inactif
                      </span>
                    }
                  </td>
                  <td class="text-sm" style="color: var(--ink-3);">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <div class="flex justify-end">
                      <button
                        (click)="deleteUser(user)"
                        [disabled]="user.role === 'SUPER_ADMIN'"
                        class="btn btn-ghost btn-sm"
                        [style.color]="user.role === 'SUPER_ADMIN' ? 'var(--ink-4)' : '#EF4444'"
                        [title]="user.role === 'SUPER_ADMIN' ? 'Impossible de supprimer un Super Admin' : 'Supprimer'">
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

        <!-- Pagination -->
        @if (pageResponse && pageResponse.totalPages > 1) {
          <div class="flex justify-center mt-8">
            <div class="flex items-center gap-1">
              <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-ghost btn-sm">
                Précédent
              </button>
              <span class="px-4 text-sm" style="color: var(--ink-3);">
                Page {{ currentPage + 1 }} sur {{ pageResponse.totalPages }}
              </span>
              <button (click)="changePage(currentPage + 1)" [disabled]="currentPage >= pageResponse.totalPages - 1" class="btn btn-ghost btn-sm">
                Suivant
              </button>
            </div>
          </div>
        }
      }
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);

  pageResponse: PageResponse<User> | null = null;
  isLoading = true;
  searchQuery = '';
  roleFilter = '';
  currentPage = 0;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;

    let observable;
    if (this.searchQuery) {
      observable = this.userService.searchUsers(this.searchQuery, this.currentPage, 20);
    } else if (this.roleFilter) {
      observable = this.userService.getUsersByRole(this.roleFilter, this.currentPage, 20);
    } else {
      observable = this.userService.getAllUsers(this.currentPage, 20);
    }

    observable.subscribe({
      next: (res) => {
        this.pageResponse = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  search() {
    this.currentPage = 0;
    this.loadUsers();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  deleteUser(user: User) {
    if (user.role === 'SUPER_ADMIN') return;
    if (!confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} (${user.email}) ?`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert(err.error?.message || 'Impossible de supprimer cet utilisateur')
    });
  }

  getAvatarColor(role: string): string {
    switch (role) {
      case 'ETUDIANT': return '#5B21B6';
      case 'INSTRUCTEUR': return '#064E3B';
      case 'ADMIN': return '#92400E';
      case 'SUPER_ADMIN': return '#7F1D1D';
      default: return '#7C7892';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Admin';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'ETUDIANT': return 'Étudiant';
      default: return role;
    }
  }
}
