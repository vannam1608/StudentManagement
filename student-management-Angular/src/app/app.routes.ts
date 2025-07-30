import { Routes, provideRouter } from '@angular/router';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin',
    children: adminRoutes,
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./teacher/teacher.routes').then(m => m.teacherRoutes),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.routes').then(m => m.studentRoutes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
