import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },

  // Auth
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
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },

  // Course form (protected - instructors only)
  {
    path: 'courses/new',
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
    canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN'])]
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
    canActivate: [authGuard, roleGuard(['INSTRUCTEUR', 'ADMIN'])]
  },

  // Dashboard routes will be added next

  { path: '**', redirectTo: '/courses' }
];
