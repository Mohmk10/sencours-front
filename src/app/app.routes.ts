import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public
  { path: '', redirectTo: 'courses', pathMatch: 'full' },

  // Auth (guests only)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // Courses (public)
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'courses/new',
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
    canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN', 'SUPER_ADMIN'])]
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
    canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN', 'SUPER_ADMIN'])]
  },

  // Student Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [authGuard, roleGuard(['ETUDIANT', 'INSTRUCTEUR'])]
  },

  // Instructor Dashboard
  {
    path: 'dashboard/instructor',
    loadComponent: () => import('./features/dashboard/instructor-dashboard/instructor-dashboard.component').then(m => m.InstructorDashboardComponent),
    canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN', 'SUPER_ADMIN'])]
  },

  // Become Instructor (students only)
  {
    path: 'become-instructor',
    loadComponent: () => import('./features/become-instructor/become-instructor.component').then(m => m.BecomeInstructorComponent),
    canActivate: [authGuard, roleGuard(['ETUDIANT'])]
  },

  // Admin
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard(['ADMIN', 'SUPER_ADMIN'])],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./features/admin/course-management/course-management.component').then(m => m.CourseManagementComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/admin/application-management/application-management.component').then(m => m.ApplicationManagementComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/category-management/category-management.component').then(m => m.CategoryManagementComponent)
      }
    ]
  },

  // Super Admin
  {
    path: 'super-admin',
    loadComponent: () => import('./features/super-admin/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent),
    canActivate: [authGuard, roleGuard(['SUPER_ADMIN'])]
  },

  // Catch-all
  { path: '**', redirectTo: 'courses' }
];
