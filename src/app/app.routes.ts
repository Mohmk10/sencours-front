import { Routes } from '@angular/router';
import { guestGuard } from './core/guards';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'courses', loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent) },
  { path: '**', redirectTo: '/courses' }
];
