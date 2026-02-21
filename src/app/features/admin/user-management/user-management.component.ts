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
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-[#1C1D1F]">Gestion des utilisateurs</h1>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            class="input"
            placeholder="Rechercher par nom ou email...">
        </div>
        <select [(ngModel)]="roleFilter" (change)="loadUsers()" class="input w-48">
          <option value="">Tous les rôles</option>
          <option value="ETUDIANT">Étudiants</option>
          <option value="INSTRUCTEUR">Instructeurs</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      @if (isLoading) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="flex items-center gap-4 p-4">
              <div class="skeleton w-10 h-10 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-1/3"></div>
                <div class="skeleton h-3 w-1/4"></div>
              </div>
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
              </tr>
            </thead>
            <tbody>
              @for (user of pageResponse?.content; track user.id) {
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white"
                           [style.background-color]="getAvatarColor(user.role)">
                        {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
                      </div>
                      <span class="font-medium text-[#1C1D1F]">{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                  </td>
                  <td class="text-[#6A6F73]">{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-neutral': user.role === 'ETUDIANT',
                      'badge-primary': user.role === 'INSTRUCTEUR',
                      'badge-warning': user.role === 'ADMIN',
                      'badge-error': user.role === 'SUPER_ADMIN'
                    }">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>
                    @if (user.isActive) {
                      <span class="inline-flex items-center gap-1 text-sm text-[#1E6B55]">
                        <span class="w-2 h-2 bg-[#1E6B55] rounded-full"></span>
                        Actif
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-sm text-[#6A6F73]">
                        <span class="w-2 h-2 bg-[#6A6F73] rounded-full"></span>
                        Inactif
                      </span>
                    }
                  </td>
                  <td class="text-[#6A6F73] text-sm">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (pageResponse && pageResponse.totalPages > 1) {
          <div class="flex justify-center mt-6">
            <div class="flex items-center gap-1">
              <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-ghost btn-sm">
                Précédent
              </button>
              <span class="px-4 text-sm text-[#6A6F73]">
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

  getAvatarColor(role: string): string {
    switch (role) {
      case 'ETUDIANT': return '#5624D0';
      case 'INSTRUCTEUR': return '#1E6B55';
      case 'ADMIN': return '#B4690E';
      case 'SUPER_ADMIN': return '#C4302B';
      default: return '#6A6F73';
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
