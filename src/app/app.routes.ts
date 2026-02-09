import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },

  // Auth
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },

  // Courses
  { path: 'courses', loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent) },
  { path: 'courses/new', loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN'])] },
  { path: 'courses/:id', loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: 'courses/:id/edit', loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN'])] },

  // Dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
      { path: 'instructor', loadComponent: () => import('./features/dashboard/instructor-dashboard/instructor-dashboard.component').then(m => m.InstructorDashboardComponent), canActivate: [roleGuard(['INSTRUCTEUR', 'ADMIN'])] }
    ]
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'courses', loadComponent: () => import('./features/admin/course-management/course-management.component').then(m => m.CourseManagementComponent) }
    ]
  },

  { path: '**', redirectTo: '/courses' }
];
