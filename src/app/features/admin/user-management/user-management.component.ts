import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, PageResponse } from '../../../core/models';
import { PaginationComponent } from '../../../shared/components';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des utilisateurs</h1>

      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="Rechercher par nom ou email..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="md:w-48">
            <select [(ngModel)]="selectedRole" (change)="onRoleChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les rôles</option>
              <option value="ETUDIANT">Étudiants</option>
              <option value="INSTRUCTEUR">Instructeurs</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
          </div>
          <button (click)="onSearch()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Rechercher</button>
        </div>
      </div>

      @if (isLoading) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!isLoading && pageResponse) {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (user of pageResponse.content; track user.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                      </div>
                      <span class="font-medium">{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
                  <td class="px-6 py-4"><span [class]="getRoleClass(user.role)">{{ getRoleLabel(user.role) }}</span></td>
                  <td class="px-6 py-4"><span [class]="user.isActive ? 'text-green-600' : 'text-red-600'">{{ user.isActive ? 'Actif' : 'Inactif' }}</span></td>
                  <td class="px-6 py-4 text-gray-500">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <app-pagination [pageData]="pageResponse" (pageChange)="onPageChange($event)" />
      }
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);

  pageResponse: PageResponse<User> | null = null;
  isLoading = true;
  searchQuery = '';
  selectedRole = '';
  currentPage = 0;

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.isLoading = true;
    let request$ = this.searchQuery.trim()
      ? this.userService.searchUsers(this.searchQuery, this.currentPage)
      : this.selectedRole
        ? this.userService.getUsersByRole(this.selectedRole, this.currentPage)
        : this.userService.getAllUsers(this.currentPage);

    request$.subscribe({
      next: (response) => { this.pageResponse = response; this.isLoading = false; },
      error: (err) => { console.error('Error loading users', err); this.isLoading = false; }
    });
  }

  onSearch() { this.currentPage = 0; this.selectedRole = ''; this.loadUsers(); }
  onRoleChange() { this.currentPage = 0; this.searchQuery = ''; this.loadUsers(); }
  onPageChange(page: number) { this.currentPage = page; this.loadUsers(); }

  getRoleClass(role: string): string {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (role) {
      case 'ADMIN': return `${base} bg-red-100 text-red-800`;
      case 'INSTRUCTEUR': return `${base} bg-purple-100 text-purple-800`;
      case 'ETUDIANT': return `${base} bg-blue-100 text-blue-800`;
      default: return base;
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'ETUDIANT': return 'Étudiant';
      default: return role;
    }
  }
}
